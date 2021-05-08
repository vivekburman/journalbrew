import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { parse as uuidParse } from 'uuid';
import { RequestWithPayload } from "../../auth_service/utils";
import { convertTime } from "../../auth_service/utils/general";
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
    UUID = "uuid";

userInfoRouter.get('/personal-info/:userId', async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const userID = req_.params.userId || null;
        if (!userID || userID == "") {
            throw new createHttpError[404];
        } else {
            const db = new SQL_DB();
            const response = await db.exec(db.TYPES.SELECT, `SELECT ${EMAIL}, ${FIRST_NAME}, 
                ${MIDDLE_NAME}, ${LAST_NAME}, ${PROFILE_PIC}, ${JOINED_AT} FROM user WHERE ${UUID}=?`,
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

userInfoRouter.get('/published-posts/:userId', (req_: Request, res: Response, next:NextFunction) => {

});

userInfoRouter.get('/unpublished-posts/:userId', utils.verifyAccessToken,  (req_: Request, res: Response, next:NextFunction) => {

});

userInfoRouter.get('/bookmarks/:userId', utils.verifyAccessToken, (req_: Request, res: Response, next:NextFunction) => {

});



export default userInfoRouter;
