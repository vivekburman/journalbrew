import {Router, NextFunction, Response, Request} from 'express';
import passport from 'passport';
import { utils } from '../utils/jwtUtils';
import { encryptDecrypt } from '../utils/encrypt_decrypt';
import createHttpError from 'http-errors';
import { delRedis } from '../server/redis.server';
import { v4 as uuidv4, parse as uuidParse, stringify as uuidStringify } from 'uuid';
import { convertTime } from '../utils/general';
import { Buffer } from 'buffer';
import SQL_DB from '../../database';
import { UNDEF, UUID, STRATEGY_ID, EMAIL, STRATEGY_TYPE, FIRST_NAME, LAST_NAME, MIDDLE_NAME, PROFILE_PIC_URL, CREATED_AT } from '../../database/fields';
import { REFRESH_TOKEN } from '../../helpers/util';

const getName = (name:string) => {
   const name_ = name?.split(' ');
   return {firstName: name_[0], middleName: name_[2] ? name_[1] : UNDEF , lastName: name_[2] || name_[1] || UNDEF};
};

const registerRouter: Router = Router();
// auth with google
registerRouter.get('/google', passport.authenticate('google',{
   scope: ['profile', 'email'],
   session: false,
   accessType: 'offline',
   prompt: 'consent'
}));

registerRouter.get('/protected', utils.verifyAccessToken, (req, res) => {
   res.send('YOU ARE AUTHORIZED');
});

// auth google redirect
registerRouter.get('/google/redirect', passport.authenticate('google', {session: false}), async (req: any, res: Response, next:NextFunction) => { 
   const db = new SQL_DB();
   try {
      const {profile} = req.user;
      if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
         throw new createHttpError.BadRequest("Email not Found");
      } else {
         const {firstName, middleName, lastName} = getName(profile.displayName);
         const profilePicUrl = profile.photos[0]?.value || null;
         const email = profile.emails[0]?.value;
         await db.connect();
         let data = await db.selectWithValues(`SELECT ${UUID}, ${STRATEGY_ID} FROM user WHERE ${EMAIL}=?`, [profile.emails[0].value])
         if(data[0].length) {
            const strategyId = data[0][0].strategy_id;
            data = await encryptDecrypt.compare(profile.id, strategyId).then(res => res ? {id: uuidStringify(data[0][0].uuid)} : null);
         } else {
            // create a hash to encrypt strategy_id
            data = await encryptDecrypt.encrypt(profile.id);
         }
         if (typeof data == 'string') {
            const uuid = uuidv4();
            const time = convertTime();
            await db.insertWithValues("INSERT INTO `user` SET ?", {
               [STRATEGY_ID]: data,
               [STRATEGY_TYPE]: 'google',
               [FIRST_NAME]: firstName,
               [LAST_NAME]: lastName,
               [MIDDLE_NAME]: middleName,
               [PROFILE_PIC_URL]: profilePicUrl,
               [EMAIL]: email,
               [UUID]: Buffer.from(uuidParse(uuid)),
               [CREATED_AT]: time
            });
            data = uuid;
         } else if (data) {
            data =  data.id;
         } else {
            throw new createHttpError.Unauthorized('Invalid OAuth Credentials');
         }
         const tokenObj = {email: profile.emails[0].value, id:data};
         const userID = data;
         const accessTokenJWT = utils.issueAccessTokenJWT(tokenObj);
         data = await utils.issueRefreshTokenJWT(tokenObj);
         res.cookie(REFRESH_TOKEN, data.token, {
            httpOnly: true,
            maxAge: data.expiresInMs
         });
         res.status(200).json({success: true, access_token: accessTokenJWT.token, 
            expiresIn: accessTokenJWT.expires,
            username: firstName,
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            userId: userID,
            profilePicUrl: profilePicUrl
         });
      }  
   } catch(err) {
      console.log(err);
      next(err);
   }finally {
      db.close();
   }
});

registerRouter.post('/refresh-token', async (req:Request, res:Response, next:NextFunction) => {
   const refreshToken = req.cookies[REFRESH_TOKEN];
   const db = new SQL_DB();
   try {
      if (!refreshToken) {
         throw new createHttpError.Unauthorized("Refresh token not found");
      }
      const tokenObj = await utils.verifyRefreshToken(refreshToken);
      if (!tokenObj.id) throw new createHttpError.Unauthorized();
      await db.connect()
      let data = await db.selectWithValues(`SELECT ${EMAIL}, ${FIRST_NAME}, ${MIDDLE_NAME}, ${LAST_NAME}, ${PROFILE_PIC_URL} FROM user WHERE ${UUID}=?`, [Buffer.from(uuidParse(tokenObj.id))])
      if(!data[0].length) {
         throw new createHttpError.InternalServerError("Cannot find user");
      }
      data = {
         [FIRST_NAME]: data[0][0][FIRST_NAME], 
         [MIDDLE_NAME]: data[0][0][MIDDLE_NAME], 
         [LAST_NAME]:  data[0][0][LAST_NAME],
         [PROFILE_PIC_URL]: data[0][0][PROFILE_PIC_URL],
         [EMAIL]: data[0][0][EMAIL]
      };
      const token = {...tokenObj, email: data[EMAIL]};
      const accessTokenJWT = utils.issueAccessTokenJWT(token)
      const response = await utils.issueRefreshTokenJWT(token);
      res.cookie(REFRESH_TOKEN, response.token, {
         httpOnly: true,
         maxAge: response.expiresInMs
      });
      res.status(200).json({success: true, access_token: accessTokenJWT.token, 
         expiresIn: accessTokenJWT.expires,
         userId: tokenObj.id,
         firstName: data[FIRST_NAME],
         lastName: data[LAST_NAME],
         middleName: data[MIDDLE_NAME],
         profilePicUrl: data[PROFILE_PIC_URL] 
      });
      
   } catch(err) {
      next(err);
   } finally {
      db.close();
   }
});

registerRouter.delete('/logout', async (req, res, next) => {
   try{
      const refreshToken = req.cookies[REFRESH_TOKEN];
      if (!refreshToken) {
         throw new createHttpError.Unauthorized();
      }
      const response = await utils.verifyRefreshToken(refreshToken);
      await delRedis(response.id);
      res.sendStatus(204);
   }catch(err) {
      next(err);
   }
});

export default registerRouter;
