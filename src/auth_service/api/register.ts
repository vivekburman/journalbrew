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

const UNDEF = undefined,
   STRATEGY_ID = 'strategy_id',
   // USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo',
   // REFRESH_TOKEN_URL = 'https://oauth2.googleapis.com/token',
   STRATEGY_TYPE = 'strategy_type',
   FIRST_NAME = 'first_name', 
   MIDDLE_NAME = 'middle_name', 
   LAST_NAME = 'last_name',
   PROFILE_PIC_URL = 'profile_pic_url', 
   EMAIL = 'email', 
   CREATED_AT = 'created_at', 
   LAST_LOGGED_AT = 'last_logged_at',
   UUID = 'uuid';

   
type userName = {
   [FIRST_NAME]:string, 
   [MIDDLE_NAME]:string, 
   [LAST_NAME]:string
}

const getName = (name:string) => {
   const name_ = name?.split(' ');
   return {firstName: name_[0], middleName: name_[2] ? name_[1] : UNDEF , lastName: name_[2] || name_[1] || UNDEF};
};

const getConsolidatedName = (name: userName) => {
   let name_ = name[FIRST_NAME];
   if (name[MIDDLE_NAME]) {
      name_ += ` ${name[MIDDLE_NAME]}`;
   }
   if (name[LAST_NAME]) {
      name_ += ` ${name[LAST_NAME]}`;
   }
   return name;
}

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
         db.selectWithValues(`SELECT ${UUID}, ${STRATEGY_ID} FROM user WHERE ${EMAIL}=?`, [profile.emails[0].value])
         .then((data): Promise<string|{id:string}|null> => {            
            if(data[0].length) {
               const strategyId = data[0][0].strategy_id;
               return encryptDecrypt.compare(profile.id, strategyId).then(res => res ? {id: uuidStringify(data[0][0].uuid)} : null);
            } else {
               // create a hash to encrypt strategy_id
               return encryptDecrypt.encrypt(profile.id);
            }
         })
         .then(async (data: string | {id:string} | null) => {
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
               return uuid;
            } else if (data) {
               return data.id;
            }
            throw new createHttpError.BadRequest('Invalid OAuth Credentials');
         })
         .then((data: string) => {
            const tokenObj = {email: profile.emails[0].value, id:data};
            const accessTokenJWT = utils.issueAccessTokenJWT(tokenObj);
            const refreshTokenJWT = utils.issueRefreshTokenJWT(tokenObj);
            refreshTokenJWT.then((response) => {
               res.cookie('refresh_token', response.token, {
                  httpOnly: true,
                  maxAge: response.expiresInMs
               });
               res.status(200).json({success: true, access_token: accessTokenJWT.token, 
                  expiresIn: accessTokenJWT.expires,
                  username: profile.displayName,
                  profilePicUrl: profilePicUrl
               });
            });
         }).catch((err: Error) => {
            next(err);
         });  
      }  
   } catch(err) {
      next(err);
   }finally{
      db.close();
   }
});

registerRouter.post('/refresh-token', async (req:Request, res:Response, next:NextFunction) => {
   const refreshToken = req.cookies['refresh_token'];
   const db = new SQL_DB();
   try {
      if (!refreshToken) {
         throw new createHttpError.BadRequest();
      }
      const tokenObj = await utils.verifyRefreshToken(refreshToken);
      if (!tokenObj.id) throw new createHttpError.BadRequest();
      await db.connect();
      db.selectWithValues(`SELECT ${EMAIL}, ${FIRST_NAME}, ${MIDDLE_NAME}, ${LAST_NAME}, ${PROFILE_PIC_URL} FROM user WHERE ${UUID}=?`, [Buffer.from(uuidParse(tokenObj.id))])
         .then((data: any) => {
            if(!data[0].length) {
               throw new createHttpError.Unauthorized();
            }
            return {
               [FIRST_NAME]: data[0][0][FIRST_NAME], 
               [MIDDLE_NAME]: data[0][0][MIDDLE_NAME], 
               [LAST_NAME]:  data[0][0][LAST_NAME],
               [PROFILE_PIC_URL]: data[0][0][PROFILE_PIC_URL],
               [EMAIL]: data[0][0][EMAIL]
            };
         }).then((data: userName & {[PROFILE_PIC_URL]: string, [EMAIL]:string}) => {
            const token = {...tokenObj, email: data[EMAIL]};
            const accessTokenJWT = utils.issueAccessTokenJWT(token)
            const refreshTokenJWT = utils.issueRefreshTokenJWT(token);
            refreshTokenJWT.then((response) => {
               res.cookie('refresh_token', response.token, {
                  httpOnly: true,
                  maxAge: response.expiresInMs
               });
               res.status(200).json({success: true, access_token: accessTokenJWT.token, 
                  expiresIn: accessTokenJWT.expires,
                  username: getConsolidatedName(data),
                  profilePicUrl: data[PROFILE_PIC_URL] 
               });
            });
         }).catch((err: Error) => {
            next(err);
         });
   } catch(err) {
      next(err);
   }finally{
      db.close();
   }
});

registerRouter.delete('/logout', async (req, res, next) => {
   try{
      const refreshToken = req.cookies['refresh_token'];
      if (!refreshToken) {
         throw new createHttpError.BadRequest();
      }
      const response = await utils.verifyRefreshToken(refreshToken);
      await delRedis(response.id);
      res.sendStatus(204);
   }catch(err) {
      next(err);
   }
});

export default registerRouter;
