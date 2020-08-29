import {Router, NextFunction, Response, Request} from 'express';
import passport from 'passport';
import { Database } from '../../database';
import { utils } from '../utils/jwtUtils';
import { encryptDecrypt } from '../utils/encrypt_decrypt';
import createHttpError from 'http-errors';
import { delRedis, setRedis } from '../server/redis.server';

const UNDEF = undefined,
   ID = 'id',
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

   
type userName = {
   [FIRST_NAME]:string, 
   [MIDDLE_NAME]:string, 
   [LAST_NAME]:string
}

const convertTime = (time?: number|Date|undefined) => {
   return time ? new Date(time).toISOString().slice(0, 19).replace('T', ' ') 
   : new Date().toISOString().slice(0, 19).replace('T', ' ') 
};

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
})

// auth google redirect
registerRouter.get('/google/redirect', passport.authenticate('google', {session: false}), (req: any, res: Response, next:NextFunction) => { 
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
            .then((data): Promise<string|boolean> => {            
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
               } else if (data) {
                  return;
               }
               throw new createHttpError.BadRequest('Invalid OAuth Credentials');
            })
            .then(() => {
               const tokenObj = {email: profile.emails[0].value};
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
            })  
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
      const db = Database.getDBQueryHandler();
      db.selectWithValues(`SELECT ${FIRST_NAME}, ${MIDDLE_NAME}, ${LAST_NAME}, ${PROFILE_PIC_URL} FROM user WHERE ${EMAIL}=?`, [tokenObj.email])
         .then((data: any) => {
            if(!data[0].length) {
               throw new createHttpError.Unauthorized();
            }
            return {
               [FIRST_NAME]: data[0][0][FIRST_NAME], 
               [MIDDLE_NAME]: data[0][0][MIDDLE_NAME], 
               [LAST_NAME]:  data[0][0][LAST_NAME],
               [PROFILE_PIC_URL]: data[0][0][PROFILE_PIC_URL]
            };
         }).then((data: userName & {[PROFILE_PIC_URL]: string}) => {
            const accessTokenJWT = utils.issueAccessTokenJWT(tokenObj);
            const refreshTokenJWT = utils.issueRefreshTokenJWT(tokenObj);
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
   }

});

registerRouter.delete('/logout', async (req, res, next) => {
   try{
      const refreshToken = req.cookies['refresh_token'];
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
