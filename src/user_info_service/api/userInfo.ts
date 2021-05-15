import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
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
    CREATED_AT = 'created_at',
    ID='id',
    TITLE= 'title',
    THUMBNAIL='thumbnail',
    TYPE='type',
    FULL_STORY_ID='full_story_id',
    PUBLISH_STATUS='publish_status',
    SUMMARY='summary',
    QUERY_SIZE = 50;

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

userInfoRouter.post('/published-posts/:userId', async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const userID = req.params.userId || null;
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
            `WITH CTE AS (SELECT post.${ID}, 
            ROW_NUMBER() OVER(ORDER BY post.${CREATED_AT} DESC) - 1 AS dataIndex, 
            COUNT(*) OVER() AS totalCount, 
            ${TITLE}, ${SUMMARY}, ${THUMBNAIL}, ${TYPE}, post.${CREATED_AT} 
            FROM post INNER JOIN user_to_post
            ON user_to_post.${ID} = post.${FULL_STORY_ID} 
            WHERE user_to_post.${AUTHOR_ID} = ?
            AND ${PUBLISH_STATUS} = 'published' 
            ORDER BY post.${CREATED_AT} DESC)
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

userInfoRouter.get('/unpublished-posts/:userId', utils.verifyAccessToken,  (req_: Request, res: Response, next:NextFunction) => {

});

userInfoRouter.get('/bookmarks/:userId', utils.verifyAccessToken, (req_: Request, res: Response, next:NextFunction) => {

});



export default userInfoRouter;
