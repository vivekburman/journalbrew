import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import SQL_DB from "../../database";
import { stringify as uuidStringify } from 'uuid';
import { ID, CREATED_AT, TITLE, SUMMARY, THUMBNAIL, TYPE, AUTHOR_ID, PUBLISH_STATUS, TAGS, LOCATION, UUID, PROFILE_PIC_URL, FIRST_NAME, MIDDLE_NAME, LAST_NAME } from "../../database/fields";
import { escapeQuotes, getHTMLSafeString, isNullOrEmpty } from "../../helpers/util";

const searchRouter: Router = Router();
const QUERY_SIZE = 50;
const TYPES = {
    "DEFAULT": -1,
    "TITLE": 1,
    "TAG": 2,
    "PERSON": 3,
    "LOCATION": 4,
    "TIME": 5,
    "AND": 6
};

/**
 * Search service:
 * 1. Default time frame last 24hrs, Search is always in and, each entity only supports one item example : cannot have array of tags, person. Search is andable, search is time rangeable, search is never text exact match.
 * 2. Search in general → title → Example(Apple Iphone 12)
 * 3. Search in tags → tags → Example(#apple)
 * 4. Search a person → person → Example(@abc)
 * 5. Search in location → location → Example($location)
 * 6. Search in time → time → DD:MM:YYYY-DD:MM:YYYY → first starting time - second ending time
 * 7. AND operation → Apple Iphone 12&#apple&@mnop&DD:MM:YYYY-DD:MM:YYYY
 */


/**
 * Validate Syntax
 * create search query
 * return results in paginated
 */

function isValidTitle(str: string): Boolean {
    return /(?![<>])/g.test(str);
}
function isValidTag(str: string): Boolean {
    return str.startsWith("#") && str.indexOf('#', 1) == -1;
}
// function isValidPerson(str: string): Boolean {
//     return str.startsWith("@") && str.indexOf('@', 1) == -1;
// }
function isValidLocation(str: string): Boolean {
    return str.startsWith("$") && str.indexOf('$', 1) == -1;
}

function isValidTime(str: string): Boolean {
    return /[0-9][0-9]:[0-9][0-9]:[0-9][0-9][0-9][0-9]-[0-9][0-9]:[0-9][0-9]:[0-9][0-9][0-9][0-9]/g.test(str);
}

function isValidAND(str: string): Boolean {
    const arr = str.split("&");
    if (arr.length == 0) return false;
    for(let i = 0; i < arr.length; i++) {
        const val = arr[i];
        if (!isValidTag(val) && 
        !isValidLocation(val) && !isValidTime(val) && !isValidTitle(val)) return false;
    }
    return true;
}

function isValidSyntax(str: string, type: number | undefined): Boolean {
    if (isNullOrEmpty(type)) return false;
    switch(type) {
        case TYPES.DEFAULT:
            return true;
        case TYPES.TITLE:
            return isValidTitle(str);
        case TYPES.TAG:
            return isValidTag(str);
        case TYPES.LOCATION:
            return isValidLocation(str);
        case TYPES.TIME:
            return isValidTime(str);
        case TYPES.AND:
            return isValidAND(str);
    }
    return false;
}
function findType(str:string, checkAND =false) {
    if (isValidTag(str)) return TYPES.TAG;
    if (isValidLocation(str)) return TYPES.LOCATION;
    if (isValidTime(str)) return TYPES.TIME;
    if (isValidTitle(str)) return TYPES.TITLE;
    if (checkAND && isValidAND(str)) return TYPES.AND;
    return;
}
function formatTimeForSQL(time:string) {
    const times = time.split(":");
    return `${times[2]}-${times[1]}-${times[0]}`;
}
function getTimeStampQuery(timeStart:string, timeEnd: string) {
    const result = {
        query: "",
        values: [] as Array<string>
    }
    if (isNullOrEmpty(timeStart) || isNullOrEmpty(timeEnd)) {
        return null;
    } else {
        result.query = `${CREATED_AT} BETWEEN ? AND ?`;
        result.values.push(`${formatTimeForSQL(timeStart)}`);
        result.values.push(`${formatTimeForSQL(timeEnd)}`);
    }
    return result;
}

function searchByDefault() {
    return {
        query : "",
        values: []
    }
}

function searchByTitle(str: string) {
    if(isNullOrEmpty(str)) {
        return null;
    }
    const values = [`%${escapeQuotes(str)?.replace(/%/g, '')}%`];
    return {
        query : `${TITLE} LIKE ?`,
        values: values
    } 
}
function searchByTag(str: string) {
    if(isNullOrEmpty(str)) {
        return null;
    }
    const _str = getHTMLSafeString(str);
    const values = [`"${escapeQuotes(_str.slice(1)).replace(/@/g, '')}"`];

    return {
        query : `JSON_CONTAINS(${TAGS}, ?, '$')`,
        values: values
    } 
}

function searchByLocation(str: string) {
    if(isNullOrEmpty(str)) {
        return null;
    }
    const _str = getHTMLSafeString(str);
    const values = [`%${escapeQuotes(_str.slice(1)).replace(/%/g, '')}%`];
    
    return {
        query : `${LOCATION} LIKE ?`,
        values: values
    } 
}
function searchByTime(str: string) {
    const times = str.split("-");
    return getTimeStampQuery(times[0], times[1]);
}


function searchByAND(str:string) {
 /**
  * 2. split by &, and identify each component
  * 3. return result
  */
 if (isNullOrEmpty(str)) return null;
 const arr = str.split('&');
 if (arr.length == 0) return null;
 const map = {
    [TYPES.TAG]: false,
    [TYPES.LOCATION]: false,
    [TYPES.TIME]: false,
    [TYPES.TITLE]: false
 };
 const result: string[] = [];
 const values = [];
 for(let i = 0; i < arr.length; i++) {
    const val = arr[i];
    const type = findType(val);
    if (!type) return null;
    if (map[type]) return null;
    map[type] = true;
    let searchObj: {query:string, values: string[]} | null = null;
    switch(type) {
        case TYPES.TAG:
            searchObj = searchByTag(str);
            break;
        case TYPES.LOCATION:
            searchObj = searchByLocation(str);
            break;
        case TYPES.TIME:
            searchObj = searchByTime(str);
            break;
        case TYPES.TITLE:
            searchObj = searchByTitle(str);
            break;
    }
    if (!searchObj) return null;
    result.push(searchObj.query);
    values.push(...searchObj.values);
 }
 return {
     values,
     query: result.reduce((acc, val) => `${acc} AND ${val}`)
 };
}



searchRouter.post('/', async (req:Request, res: Response, next:NextFunction) => {
    /**
     * get the payload
     * generate the search string
     * return results in paginated mode
     */
    try {
        const searchFilter:{ type?:number, query:string, rangeStart:number, rangeEnd: number } = req.body.filter;
        if (isNullOrEmpty(searchFilter)) {
            throw new createHttpError.BadRequest("Search Filter is Empty");
        }
        if (isNullOrEmpty(searchFilter.query)) {
            throw new createHttpError.BadRequest("Search Query is Empty");
        }
        if (!isNullOrEmpty(searchFilter.type) && !isValidSyntax(searchFilter.query, searchFilter.type)) {
            throw new createHttpError.BadRequest("Not valid Search Payload");
        }
        if (isNullOrEmpty(searchFilter.rangeStart) || !Number.isInteger(searchFilter.rangeStart) || searchFilter.rangeStart < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeStart not defined");
        }
        if (isNullOrEmpty(searchFilter.rangeStart) || !Number.isInteger(searchFilter.rangeEnd) || searchFilter.rangeEnd < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
        } 
        if (isNullOrEmpty(searchFilter.type)) {
            const type = findType(searchFilter.query, true);
            if (isNullOrEmpty(type)) {
                throw new createHttpError.BadRequest("Cannot identify type");
            } else {
                searchFilter.type = type;
            }
        }
        let searchQuery: {
            query: string,
            values: Object[]
        } | null;
        switch(searchFilter.type) {
            case TYPES.DEFAULT:
                searchQuery = searchByDefault();
                if (isNullOrEmpty(searchQuery)) {
                    throw new createHttpError.InternalServerError("Cannot create SQL Query");
                }
                break;
            case TYPES.TITLE:
                searchQuery = searchByTitle(searchFilter.query);
                if (isNullOrEmpty(searchQuery)) {
                    throw new createHttpError.InternalServerError("Cannot create SQL Query");
                }
                break;
            case TYPES.TAG:
                searchQuery = searchByTag(searchFilter.query);
                if (isNullOrEmpty(searchQuery)) {
                    throw new createHttpError.InternalServerError("Cannot create SQL Query");
                }
                break;
            case TYPES.LOCATION:
                searchQuery = searchByLocation(searchFilter.query);
                if (isNullOrEmpty(searchQuery)) {
                    throw new createHttpError.InternalServerError("Cannot create SQL Query");
                }
                break;
            case TYPES.TIME:
                searchQuery = searchByTime(searchFilter.query);
                if (isNullOrEmpty(searchQuery)) {
                    throw new createHttpError.InternalServerError("Cannot create SQL Query");
                }
                break;
            case TYPES.AND:
                searchQuery = searchByAND(searchFilter.query);
                if (isNullOrEmpty(searchQuery)) {
                    throw new createHttpError.InternalServerError("Cannot create SQL Query");
                }
                break;
            default:
                searchQuery = null;
        }
        if (isNullOrEmpty(searchQuery)) {
            throw new createHttpError.InternalServerError("Search Query is Empty");
        }
        const _rangeEnd = Math.min(searchFilter.rangeStart + QUERY_SIZE, searchFilter.rangeEnd);
        const db = new SQL_DB();
        const query = `WITH CTE AS (SELECT ${ID} as postID, 
            ROW_NUMBER() OVER(ORDER BY ${CREATED_AT} DESC) - 1 AS dataIndex, 
            COUNT(*) OVER() AS totalCount, 
            ${TITLE}, ${SUMMARY}, ${TYPE}, ${CREATED_AT} AS createdAt, post.${AUTHOR_ID} AS authorID
            FROM post
            WHERE ${PUBLISH_STATUS} = 'published'
            ${searchQuery?.query ? ` AND ${searchQuery.query}` : ''}
            ORDER BY ${CREATED_AT} DESC)
            SELECT postID, dataIndex, totalCount, createdAt, authorID, 
            ${TITLE}, ${SUMMARY}, ${TYPE}, ${PROFILE_PIC_URL} as profilePicUrl, 
            ${FIRST_NAME} as firstName, ${MIDDLE_NAME} as middleName, ${LAST_NAME} as lastName
            FROM CTE LEFT JOIN user ON authorID = ${UUID} 
            WHERE dataIndex >= ? AND dataIndex < ?`;
        const response = await db.exec(db.TYPES.CTE_SELECT, query,
        searchQuery?.values ? [...searchQuery.values, searchFilter.rangeStart, _rangeEnd] : [searchFilter.rangeStart, _rangeEnd]);
        if (response?.[0]?.length) {
            res.status(200).json({
                postsList: response[0].map((i: any) => {
                    i.authorID = uuidStringify(i.authorID);
                    return i;
                })
            });
        } else {
            res.status(200).json({
                postsList: response[0]
            });    
        }
    } catch(err) {
        next(err);
    }
});

export default searchRouter;
