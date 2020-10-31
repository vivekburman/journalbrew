import { json, NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { v4 as uuidv4, parse as uuidParse, stringify as uuidStringify } from 'uuid';
import { RequestWithPayload } from "../../auth_service/utils";
import { convertTime } from "../../auth_service/utils/general";
import { utils } from "../../auth_service/utils/jwtUtils";
import { Database } from "../../database";

const postRouter: Router = Router();

const AUTHOR_ID = 'author_id',
    FULL_STORY = 'full_story',
    CREATED_AT = 'created_at',
    UUID = 'uuid',
    ID='id';

type User = {email:string, id:string, iat:number|Date|string, exp:number|Date|string, aud:string, iss: string}

postRouter.post('/create-post', utils.verifyAccessToken, async (req_:Request, res: Response, next:NextFunction) => {
    // 1. if user is invalid / null  return
    // 2. create new entry in db
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const db = Database.getDBQueryHandler();
        const dbRes = await db.insertWithValues(
            "INSERT INTO `user_to_post` SET ?", {
                [AUTHOR_ID]: Buffer.from(uuidParse(payload['id'])),
                [FULL_STORY]: JSON.stringify(req.body.postStory),
                [CREATED_AT]: convertTime()
            } 
        );
        res.status(200).json({
            success: true,
            post_id: dbRes[0]['insertId']
        });
    } catch(e) {
        next(e);
    }
    // 3. return sucess
});

function generateSQLStatements(jsonPatch:any[]) {
            // 1. get pointer to that object
        // 2. parse the jsonPatch to 3 buckets add, delete, replace
        // 3. fill each bucket of the form array [$'path', 'value']
        // 4. if value is of form object or array replace 'value' -> CAST('value') as JSON 
    const map = [] as Array<string>;
    const parsePath = (path: string) => {
        let result:string = "$";
        const arr = path.split('/').slice(1);
        // if its not a number then we are going to add into JSON Object, else add into JSON Array
        arr.forEach((item) => {
            result += Number.isNaN(+item) ? `.${item}` : `[${item}]`;
        });
        return result;
    }
    jsonPatch.forEach((item: {'op': string, 'path': string, value: any}, index) => {
        const jsonPath = parsePath(item.path);
        switch(item.op) {
            case 'add':
                map.push(`JSON_SET(${FULL_STORY}, '${jsonPath}', ${Array.isArray(item.value) ? `CAST('[${item.value.toString()}]' AS JSON)`
                :   typeof item.value == 'object' ? `CAST('${JSON.stringify(item.value)}' AS JSON)` : `${Number.isNaN(+item.value) ? `"${item.value}"` : item.value}`})`);
                break;
            case 'replace':
                map.push(`JSON_REPLACE(${FULL_STORY}, '${jsonPath}', ${Array.isArray(item.value) ? `CAST('[${item.value.toString()}]' AS JSON)`
                :   typeof item.value == 'object' ? `CAST('${JSON.stringify(item.value)}' AS JSON)` : `${Number.isNaN(+item.value) ? `"${item.value}"` : item.value}`})`);
                break;
            case 'delete':
                map.push(`JSON_REMOVE(${FULL_STORY}, '${jsonPath}')`);
                break;
            default:
                return;
        }
    });
    return map;
}


postRouter.patch('/update-post', utils.verifyAccessToken, async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const db = Database.getDBQueryHandler();
        const jsonPatch:{storypatchData: any, postId: number} = req.body;
        const sqlQuery = {
            query: 'UPDATE user_to_post SET ',
            values: [] as Array<any>
        };
        const authorID = Buffer.from(uuidParse(payload['id']));
        generateSQLStatements(jsonPatch.storypatchData).forEach(item => {
            sqlQuery.query += `${FULL_STORY}=${item},`;
        });
        sqlQuery.query = `${sqlQuery.query.slice(0, -1)} WHERE ${AUTHOR_ID}=? AND ${ID}=?`;
        sqlQuery.values.push(authorID, jsonPatch.postId);
        console.log(sqlQuery.query);
        await db.updateJSONValues(sqlQuery.query, sqlQuery.values);
        res.status(200).json({
            success: true
        });
    } catch(err) {
        next(err);
    } 
});

postRouter.get('/publish-post', () => {

});

postRouter.get('/view-post', () => {

});
postRouter.delete('/delete-post', () => {

});
export default postRouter;
