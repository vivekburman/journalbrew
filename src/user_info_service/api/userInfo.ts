import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { userInfo } from "os";
import { parse as uuidParse } from 'uuid';
import { RequestWithPayload } from "../../auth_service/utils";
import { utils } from "../../auth_service/utils/jwtUtils";
import SQL_DB from "../../database";

const userInfoRouter: Router = Router();

// 1.  get userinfo
// 2. get user published posts
// 3. get user unpublished posts
// 4. get user bookmarks
const EMAIL = "email",
    FIRST_NAME ="first_name",
    LAST_NAME = "last_name",
    MIDDLE_NAME = "middle_name",
    PROFILE_PIC = "profile_pic_url",
    JOINED_AT = "created_at",
    UUID = "uuid",
    AUTHOR_ID = 'author_id',
    USER_UUID = 'user_uuid',
    CREATED_AT = 'created_at',
    ID='id',
    TITLE= 'title',
    THUMBNAIL='thumbnail',
    TYPE='type',
    FULL_STORY_ID='full_story_id',
    FULL_STORY = 'full_story',
    PUBLISH_STATUS='publish_status',
    SUMMARY='summary',
    BOOKMARK_POST_ID='bookmark_post_id',
    QUERY_SIZE = 50;

type User = {email:string, id:string, iat:number|Date|string, exp:number|Date|string, aud:string, iss: string};

userInfoRouter.get('/personal-info/:userId', async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const userID = req_.params.userId || null;
        if (!userID || userID == "") {
            throw new createHttpError[404];
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.SELECT, `SELECT ${EMAIL}, ${FIRST_NAME}, ${MIDDLE_NAME}, ${LAST_NAME}, ${PROFILE_PIC}, ${JOINED_AT} FROM user WHERE ${UUID}=?`,
            [Buffer.from(uuidParse(userID))]);
            if (response?.[0]?.[0]?.[EMAIL]) {
                res.status(200).json({
                    personalInfo: {
                        email: response[0][0][EMAIL],
                        firstName: response[0][0][FIRST_NAME],
                        lastName: response[0][0][LAST_NAME],
                        middleName: response[0][0][MIDDLE_NAME],
                        profilePicUrl: response[0][0][PROFILE_PIC],
                        createdAt: response[0][0][JOINED_AT],
                    }
                });
            } else {
                throw new createHttpError[404];
            }
        } 
    }catch(err) {
        next(err);
    }
});

userInfoRouter.post('/published-posts', async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const userID = req.body.userId || null;
        const rangeStart = req.body.filter?.rangeStart;
        const rangeEnd = req.body.filter?.rangeEnd;

        if (!userID || userID == "") {
            throw new createHttpError.BadRequest("User ID not found in query param");
        } else if (!Number.isInteger(rangeStart) || rangeStart < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeStart not defined");
        } else if (!Number.isInteger(rangeEnd) || rangeEnd < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
        } else {
            const _rangeEnd = Math.min(rangeStart + QUERY_SIZE, rangeEnd);
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.CTE_SELECT, 
            `WITH CTE AS (SELECT ${ID}, 
            ROW_NUMBER() OVER(ORDER BY ${CREATED_AT} DESC) - 1 AS dataIndex, 
            COUNT(*) OVER() AS totalCount, 
            ${TITLE}, ${SUMMARY}, ${THUMBNAIL}, ${TYPE}, ${CREATED_AT} AS createdAt
            FROM post
            WHERE post.${AUTHOR_ID} = ?
            AND ${PUBLISH_STATUS} = 'published' 
            ORDER BY ${CREATED_AT} DESC)
            SELECT * FROM CTE WHERE dataIndex >= ? AND dataIndex < ?`,
            [Buffer.from(uuidParse(userID)), rangeStart, _rangeEnd]);
            res.status(200).json({
                postsList: response[0]
            });
        }
    }catch(error) {
        next(error);
    }
});

userInfoRouter.post('/underreview-posts', utils.verifyAccessToken,  async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const userID = req.body.userId || null;
        const rangeStart = req.body.filter?.rangeStart;
        const rangeEnd = req.body.filter?.rangeEnd;

        if (!userID || userID == "") {
            throw new createHttpError.BadRequest("User ID not found in query param");
        } else if (payload.id != userID) {
            throw new createHttpError[404];
        } else if (!Number.isInteger(rangeStart) || rangeStart < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeStart not defined");
        } else if (!Number.isInteger(rangeEnd) || rangeEnd < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
        } else {
            const _rangeEnd = Math.min(rangeStart + QUERY_SIZE, rangeEnd);
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.CTE_SELECT, 
                `WITH CTE AS (SELECT ${ID}, 
                ROW_NUMBER() OVER(ORDER BY ${CREATED_AT} DESC) - 1 AS dataIndex, 
                COUNT(*) OVER() AS totalCount, 
                ${TITLE}, ${SUMMARY}, ${THUMBNAIL}, ${TYPE}, ${CREATED_AT} AS createdAt
                FROM post
                WHERE post.${AUTHOR_ID} = ?
                AND ${PUBLISH_STATUS} = 'underReview' 
                ORDER BY ${CREATED_AT} DESC)
                SELECT * FROM CTE WHERE dataIndex >= ? AND dataIndex < ?`,
            [Buffer.from(uuidParse(userID)), rangeStart, _rangeEnd]);
            res.status(200).json({
                postsList: response[0]
            });
        }

    }catch(error) {
        next(error);
    }
});

userInfoRouter.post('/bookmarks', utils.verifyAccessToken, async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const userID = req.body.userId || null;
        const rangeStart = req.body.filter?.rangeStart;
        const rangeEnd = req.body.filter?.rangeEnd;

        if (!userID || userID == "") {
            throw new createHttpError.BadRequest("User ID not found in query param");
        } else if (payload.id != userID) {
            throw new createHttpError[404];
        } else if (!Number.isInteger(rangeStart) || rangeStart < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeStart not defined");
        } else if (!Number.isInteger(rangeEnd) || rangeEnd < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
        } else {
            const _rangeEnd = Math.min(rangeStart + QUERY_SIZE, rangeEnd);
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.CTE_SELECT, 
                `WITH CTE AS (SELECT bookmark.${ID}, 
                ROW_NUMBER() OVER(ORDER BY bookmark.${CREATED_AT} DESC) - 1 AS dataIndex, 
                COUNT(*) OVER() AS totalCount, 
                ${TITLE}, ${SUMMARY}, ${THUMBNAIL}, ${TYPE}, post.${CREATED_AT} AS createdAt
                FROM bookmark INNER JOIN post
                ON bookmark.${BOOKMARK_POST_ID} = post.${ID}
                WHERE ${USER_UUID} = ?
                ORDER BY bookmark.${CREATED_AT} DESC)
                SELECT * FROM CTE WHERE dataIndex >= ? AND dataIndex < ?`,
            [Buffer.from(uuidParse(userID)), rangeStart, _rangeEnd]);
            res.status(200).json({
                postsList: response[0]
            });
        }

    }catch(error) {
        next(error);
    }
});

userInfoRouter.post('/drafts', utils.verifyAccessToken, async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const userID = req.body.userId || null;
        const rangeStart = req.body.filter?.rangeStart;
        const rangeEnd = req.body.filter?.rangeEnd;

        if (!userID || userID == "") {
            throw new createHttpError.BadRequest("User ID not found in query param");
        } else if (payload.id != userID) {
            throw new createHttpError[404];
        } else if (!Number.isInteger(rangeStart) || rangeStart < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeStart not defined");
        } else if (!Number.isInteger(rangeEnd) || rangeEnd < 0) {
            throw new createHttpError.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
        } else {
            const _rangeEnd = Math.min(rangeStart + QUERY_SIZE, rangeEnd);
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.CTE_SELECT, 
                `WITH CTE AS (SELECT ${ID}, 
                ROW_NUMBER() OVER(ORDER BY ${CREATED_AT} DESC) - 1 AS dataIndex, 
                COUNT(*) OVER() AS totalCount, ${FULL_STORY} AS fullStory, ${CREATED_AT} AS createdAt
                FROM user_to_post 
                WHERE ${AUTHOR_ID} = ?
                ORDER BY ${CREATED_AT} DESC)
                SELECT * FROM CTE WHERE dataIndex >= ? AND dataIndex < ?`,
            [Buffer.from(uuidParse(userID)), rangeStart, _rangeEnd]);
            
            let result: { title: string; summary: string; created_at: string }[] = [];

            if (response[0].length) {
                result = Array.from(response[0]).map((i: any) => {
                    const blocks = i.fullStory.blocks || [];
                    let title = "", summary = "";
                    for (let i = 0; i < blocks.length; i++) {
                        if (blocks[i].type === "header" || blocks[i].type === "paragraph") {
                            const data = blocks[i].data || {};
                            if (data.hasOwnProperty("text")) {
                                title.length ? (summary = data.text) : (title = data.text);
                                break;
                            }
                        }  
                    }
                    if (!title) {
                        title = "Empty Title !!!!";
                    }
                    if (!summary) {
                        summary = "Empty Summary !!!!";
                    }
                    return {
                        title,
                        totalCount: i.totalCount,
                        summary,
                        [CREATED_AT]: i["createdAt"],
                        dataIndex: i.dataIndex,
                        id: i.id
                    };
                });
            }       
            res.status(200).json({
                postsList: result
            });
        }

    }catch(error) {
        next(error);
    }
});

userInfoRouter.delete('/draft/delete', utils.verifyAccessToken, async(req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const userID = req.body.userId || null;
        const draftID = req.body.draftId || null;
        if (!userID || userID == "") {
            throw new createHttpError.BadRequest("User ID not found in query param");
        } else if (!draftID && !Number.isInteger(draftID)) {
            throw new createHttpError[404];
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.DELETE, 
                `DELETE FROM user_to_post 
                WHERE ${ID}=?
                AND ${AUTHOR_ID}=?`,
            [draftID, Buffer.from(uuidParse(userID))]);
            if (response[0] && response[0].affectedRows == 1) {
                res.status(200).json({
                    success: true
                });
            } else {
                res.status(500).json({
                    success: false
                });
            }
        }

    }catch(error) {
        next(error);
    }
});

userInfoRouter.delete('/bookmark/delete', utils.verifyAccessToken, async(req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const userID = req.body.userId || null;
        const bookmarkID = req.body.bookmarkId || null;
        if (!userID || userID == "") {
            throw new createHttpError.BadRequest("User ID not found in query param");
        } else if (!bookmarkID && !Number.isInteger(bookmarkID)) {
            throw new createHttpError[404];
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.DELETE, 
                `DELETE FROM bookmark 
                WHERE ${ID}=?
                AND ${USER_UUID}=?`,
            [bookmarkID, Buffer.from(uuidParse(userID))]);
            if (response.affectedRows == 1) {
                res.status(200).json({
                    success: true
                });
            } else {
                res.status(500).json({
                    success: false
                });
            }
        }

    }catch(error) {
        next(error);
    } 
});

export default userInfoRouter;
