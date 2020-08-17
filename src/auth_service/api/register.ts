import {Router, NextFunction, Response, Request} from 'express';
import passport from 'passport';
import { Database } from '../../database';
import { utils } from '../utils/jwtUtils';
import { encryptDecrypt } from '../utils/encrypt_decrypt';
import createHttpError from 'http-errors';
import { delRedis } from '../server/redis.server';
import axios from 'axios';
import {config} from '../config/config';
import querystring from 'querystring';

const UNDEF = undefined,
   ID = 'id',
   USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo',
   REFRESH_TOKEN_URL = 'https://oauth2.googleapis.com/token',
   STRATEGY_ID = 'strategy_id',
   STRATEGY_TYPE = 'strategy_type',
   STRATEGY_ACCESS_TOKEN = 'strategy_access_token',
   STRATEGY_REFRESH_TOKEN = 'strategy_refresh_token',
   FIRST_NAME = 'first_name', 
   MIDDLE_NAME = 'middle_name', 
   LAST_NAME = 'last_name',
   PROFILE_PIC_URL = 'profile_pic_url', 
   EMAIL = 'email', 
   CREATED_AT = 'created_at', 
   LAST_LOGGED_AT = 'last_logged_at';

const convertTime = (time?: number|Date|undefined) => {
   return time ? new Date(time).toISOString().slice(0, 19).replace('T', ' ') 
   : new Date().toISOString().slice(0, 19).replace('T', ' ') 
};

const getName = (name:string) => {
   const name_ = name?.split(' ');
   return {firstName: name_[0], middleName: name_[2] ? name_[1] : UNDEF , lastName: name_[2] || name_[1] || UNDEF};
};

const getUserInfo = (strategyAccessToken: string) => {
   return axios.get(USER_INFO_URL, {
      headers: {
         Authorization: `Bearer ${strategyAccessToken}`
      }
   });
};

const updateUserInfo = (data:any, db:any) => {
   
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
})

// auth google redirect
registerRouter.get('/google/redirect', passport.authenticate('google', {session: false}), (req: any, res: any, next:Function) => { 
   try {
      const {profile, accessToken: strategyAccessToken, refreshToken: strategyRefreshToken} = req.user;

      if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
         throw new createHttpError.BadRequest("Email not Found");
      } else if (!strategyRefreshToken || !strategyAccessToken) {
         throw new createHttpError.Unauthorized();
      } else {
         const {firstName, middleName, lastName} = getName(profile.displayName);
         const profilePicUrl = profile.photos[0]?.value || null;
         const email = profile.emails[0]?.value;
         const db = Database.getDBQueryHandler();

         db.selectWithValues(`SELECT ${ID}, ${STRATEGY_ID} FROM user WHERE ${EMAIL}=?`, [profile.emails[0].value])
            .then((data: any) => {            
               if(data[0].length) {
                  const strategyId = data[0][0].strategy_id;
                  return encryptDecrypt.compare(profile.id, strategyId);
               } else {
                  // create a hash to encrypt strategy_id
                  return encryptDecrypt.encrypt(profile.id);
               }
            })
            .then((data: string | boolean) => {
               const time = convertTime();
               if (typeof data == 'string') {
                  db.insertWithValues(
                     `INSERT INTO user (${STRATEGY_ID}, ${STRATEGY_TYPE}, ${STRATEGY_ACCESS_TOKEN}, ${STRATEGY_REFRESH_TOKEN}, ${FIRST_NAME}, 
                        ${MIDDLE_NAME}, ${LAST_NAME}, ${PROFILE_PIC_URL}, ${EMAIL}, ${CREATED_AT}, ${LAST_LOGGED_AT}) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                           data,
                           'google',
                           strategyAccessToken,
                           strategyRefreshToken,
                           firstName,
                           middleName,
                           lastName,
                           profilePicUrl,
                           email,
                           time,
                           UNDEF
                  ]);
                  return data; // return bcrypt string will be used to create JWT
               } else if (data) {
                  return encryptDecrypt.encrypt(profile.id); // if user exists create the hash for JWT and return it
               }
               throw new createHttpError.BadRequest('Invalid OAuth Credentials');
            })
            .then((data: string) => {
               const tokenObj = {id: data, email: profile.emails[0].value};
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
            })
            .catch((err: Error) => {
               next(err);
            });  
      }  
   } catch(err) {
      next(err);
   }
});

registerRouter.post('/refresh-token', async (req:Request, res:Response, next:NextFunction) => {
   const refreshToken = req.cookies['refresh_token'];
   try {
      if (!refreshToken) {
         throw new createHttpError.BadRequest();
      }
      const tokenObj = await utils.verifyRefreshToken(refreshToken);
      if (!tokenObj.email) throw new createHttpError.BadRequest()
      /**
       * 1. https://www.googleapis.com/auth/userinfo.profile - get user latest profile
       * 2. save to DB
       * 3. get new tokens
       * 4. return
       */
      const db = Database.getDBQueryHandler();
      let strategyAccessToken:string, strategyRefreshToken:string;
      db.selectWithValues(`SELECT ${STRATEGY_ACCESS_TOKEN}, ${STRATEGY_REFRESH_TOKEN} FROM user WHERE ${EMAIL}=?`, [tokenObj.email])
         .then((data: any) => {
            if(!data[0].length) {
               throw new createHttpError.Unauthorized();
            }
            strategyAccessToken = data[0][0].strategy_access_token;
            strategyRefreshToken = data[0][0].strategy_refresh_token;
            if (!strategyAccessToken || !strategyRefreshToken) {
               throw new createHttpError.Unauthorized();
            }
            return getUserInfo(strategyAccessToken);
         }).then((res:any) => {
            const {data} = res;
            const { firstName, middleName, lastName } = getName(data.name);
            db.updateWithValues(`UPDATE user ${PROFILE_PIC_URL}=?, ${FIRST_NAME}=?, ${MIDDLE_NAME}=?, ${LAST_NAME}=? WHERE ${EMAIL}=?`,
               [data.picture, firstName, middleName, lastName, data.email]);
            return data;  
         }, async () => {
               try {
                  const {data} = await axios.post(REFRESH_TOKEN_URL, 
                     querystring.stringify({
                     client_id: config.authStrategyKeys[config.enums.GOOGLE].clientID,
                     client_secret: config.authStrategyKeys[config.enums.GOOGLE].clientSecret,
                     refresh_token: strategyRefreshToken,
                     grant_type: 'refresh_token'
                     }), {
                        headers: {
                           'Content-Type': 'application/x-www-form-urlencoded',
                        }
                     });
                  const info = await getUserInfo(data.access_token);
                  const { firstName, middleName, lastName } = getName(info.data.name);
                  db.updateWithValues(`UPDATE user ${STRATEGY_ACCESS_TOKEN}=?, ${PROFILE_PIC_URL}=?, ${FIRST_NAME}=?, ${MIDDLE_NAME}=?, ${LAST_NAME}=? WHERE ${EMAIL}=?`,
                     [info.data.access_token, info.data.picture, firstName, middleName, lastName, info.data.email]);
                  return data;
               } catch(err) {
                  throw new createHttpError.Unauthorized();
               }
         }).then((data:any) => {
            const accessTokenJWT = utils.issueAccessTokenJWT(tokenObj);
            const refreshTokenJWT = utils.issueRefreshTokenJWT(tokenObj);
            refreshTokenJWT.then((response) => {
               res.cookie('refresh_token', response.token, {
                  httpOnly: true,
                  maxAge: response.expiresInMs
               });
               res.status(200).json({success: true, access_token: accessTokenJWT.token, 
                  expiresIn: accessTokenJWT.expires,
                  username: data.name,
                  profilePicUrl: data.picture 
               });
            });
         });
   } catch(err) {
      next(err);
   }

});

registerRouter.delete('/logout', async (req, res, next) => {
   try{
      const { refreshToken } = req.cookies['refresh_token'];
      if (!refreshToken) {
         throw new createHttpError.BadRequest();
      }
      const response = await utils.verifyRefreshToken(refreshToken);
      await delRedis(response.email);
      res.sendStatus(204);
   }catch(err) {
      next(err);
   }
});

export default registerRouter;
