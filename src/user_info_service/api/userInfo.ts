import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { userInfo } from "os";
import { parse as uuidParse } from 'uuid';
import { RequestWithPayload } from "../../auth_service/utils";
import { convertTime } from "../../auth_service/utils/general";
import { utils } from "../../auth_service/utils/jwtUtils";
import SQL_DB from "../../database";
import { EMAIL, FIRST_NAME, MIDDLE_NAME, LAST_NAME, PROFILE_PIC_URL, JOINED_AT, UUID, ID, CREATED_AT, TITLE, SUMMARY, THUMBNAIL, TYPE, AUTHOR_ID, PUBLISH_STATUS, BOOKMARK_POST_ID, USER_UUID, FULL_STORY, POST_ID, FOLLOWER_ID, FOLLOWEE_ID } from "../../database/fields";

const userInfoRouter: Router = Router();

// 1.  get userinfo
// 2. get user published posts
// 3. get user unpublished posts
// 4. get user bookmarks
const QUERY_SIZE = 50;

type User = {email:string, id:string, iat:number|Date|string, exp:number|Date|string, aud:string, iss: string};

userInfoRouter.get('/personal-info/:userId', async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const userID = req_.params.userId || null;
        if (!userID || userID == "") {
            throw new createHttpError[404];
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.SELECT, `SELECT ${EMAIL}, ${FIRST_NAME}, ${MIDDLE_NAME}, ${LAST_NAME}, ${PROFILE_PIC_URL}, ${JOINED_AT} FROM user WHERE ${UUID}=?`,
            [Buffer.from(uuidParse(userID))]);
            if (response?.[0]?.[0]?.[EMAIL]) {
                res.status(200).json({
                    personalInfo: {
                        email: response[0][0][EMAIL],
                        firstName: response[0][0][FIRST_NAME],
                        lastName: response[0][0][LAST_NAME],
                        middleName: response[0][0][MIDDLE_NAME],
                        profilePicUrl: response[0][0][PROFILE_PIC_URL],
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
            ${TITLE}, ${SUMMARY}, ${TYPE}, ${CREATED_AT} AS createdAt
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
                ${TITLE}, ${SUMMARY}, ${TYPE}, ${CREATED_AT} AS createdAt
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
                ${TITLE}, ${SUMMARY}, ${TYPE}, post.${CREATED_AT} AS createdAt, post.${AUTHOR_ID} AS authorID
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
                AND ${POST_ID} IS NULL
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

userInfoRouter.post('/bookmarked', utils.verifyAccessToken, async(req_: Request, res: Response, next: NextFunction) => {
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
            const response = await db.exec(db.TYPES.SELECT, 
                `SELECT ${ID} FROM bookmark WHERE ${BOOKMARK_POST_ID}=? AND ${USER_UUID} = ?`, 
                [bookmarkID, Buffer.from(uuidParse(userID))]
            );
            if (response[0] && response[0].affectedRows === 1) {
                res.status(200).json({
                    success: true
                });
            } else {
                res.status(200).json({
                    success: false
                });
            }
        }

    }catch(error) {
        next(error);
    } 
});
userInfoRouter.put('/bookmark', utils.verifyAccessToken, async(req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const userID = req.body.userId || null;
        const postID = req.body.postId || null;
        if (!userID || userID == "") {
            throw new createHttpError.BadRequest("User ID not found in query param");
        } else if (!postID && !Number.isInteger(postID)) {
            throw new createHttpError[404];
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.INSERT, "INSERT INTO `bookmark` SET ?", {
                [USER_UUID]: Buffer.from(uuidParse(userID)),
                [BOOKMARK_POST_ID]: postID,
                [CREATED_AT]: convertTime()
            });
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

userInfoRouter.delete('/delete-bookmark', utils.verifyAccessToken, async(req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const userID = req.body.userId || null;
        const postID = req.body.postId || null;
        if (!userID || userID == "") {
            throw new createHttpError.BadRequest("User ID not found in query param");
        } else if (!postID && !Number.isInteger(postID)) {
            throw new createHttpError[404];
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.DELETE, 
                `DELETE FROM bookmark 
                WHERE ${BOOKMARK_POST_ID}=?
                AND ${USER_UUID}=?`,
            [postID, Buffer.from(uuidParse(userID))]);
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

userInfoRouter.post('/following', utils.verifyAccessToken, async(req_: Request, res: Response, next: NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const followerID = req.body.followerId || null;
        const followingID = req.body.followingId || null;
        if (!followerID || !followingID) {
            throw new createHttpError.BadRequest("Follower or followee Id is defined");
        } else if(followerID === followingID) {
            throw new createHttpError.BadRequest("Follower or followee Id is same");
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.SELECT, 
                `SELECT ${ID} FROM follow WHERE ${FOLLOWER_ID}=? AND ${FOLLOWEE_ID} = ?`, 
                [Buffer.from(uuidParse(followerID)), Buffer.from(uuidParse(followingID))]
            );
            if (response[0] && response[0].affectedRows === 1) {
                res.status(200).json({
                    success: true
                });
            } else {
                res.status(200).json({
                    success: false
                });
            }
        }

    }catch(error) {
        next(error);
    } 
});

userInfoRouter.put('/follow-request', utils.verifyAccessToken, async(req_: Request, res: Response, next: NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const followerID = req.body.followerId || null;
        const followingID = req.body.followingId || null;
        if (!followerID || !followingID) {
            throw new createHttpError.BadRequest("Follower or followee Id is defined");
        } else if(followerID === followingID) {
            throw new createHttpError.BadRequest("Follower or followee Id is same");
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.INSERT, 
                "INSERT INTO `follow` SET ?", {
                    [FOLLOWEE_ID]: Buffer.from(uuidParse(followingID)),
                    [FOLLOWER_ID]: Buffer.from(uuidParse(followerID)),
                } 
            );
            if (response[0] && response[0].affectedRows === 1) {
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

userInfoRouter.delete('/unfollow-request', utils.verifyAccessToken, async(req_: Request, res: Response, next: NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const followerID = req.body.followerId || null;
        const followingID = req.body.followingId || null;
        if (!followerID || !followingID) {
            throw new createHttpError.BadRequest("Follower or followee Id is defined");
        } else if(followerID === followingID) {
            throw new createHttpError.BadRequest("Follower or followee Id is same");
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.DELETE, 
                `DELETE FROM follow WHERE ${FOLLOWER_ID}=? AND ${FOLLOWEE_ID}=?`, [
                    Buffer.from(uuidParse(followerID)),
                    Buffer.from(uuidParse(followingID))
                ] 
            );
            if (response[0] && response[0].affectedRows === 1) {
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
