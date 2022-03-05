import path from 'path';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import createHttpError from 'http-errors';
import { setRedis, getRedis } from '../server/redis.server';
import ms from 'ms';
import { RequestWithPayload } from '.';


const pathToPrivateKeyAccessToken:string = path.join(__dirname, '../id_access_rsa_prv.pem');
const PRV_KEY_ACCESS_TOKEN:string = fs.readFileSync(pathToPrivateKeyAccessToken, 'utf-8');

const pathToPublicKeyAccessToken:string = path.join(__dirname, '../id_access_rsa_pub.pem');
const PUB_KEY_ACCESS_TOKEN:string = fs.readFileSync(pathToPublicKeyAccessToken, 'utf-8');

const pathToPrivateKeyRefreshToken:string = path.join(__dirname, '../id_refresh_rsa_prv.pem');
const PRV_KEY_REFRESH_TOKEN:string = fs.readFileSync(pathToPrivateKeyRefreshToken, 'utf-8');

const pathToPublicKeyRefreshToken:string = path.join(__dirname, '../id_refresh_rsa_pub.pem');
const PUB_KEY_REFRESH_TOKEN:string = fs.readFileSync(pathToPublicKeyRefreshToken, 'utf-8');

const issueAccessTokenJWT = (userID: {email:string, id:string}) => {
   const expiresIn = '1m';
   const payload = {
      email: userID.email,
      id:userID.id
   };
   const signedToken = jsonwebtoken.sign(payload, PRV_KEY_ACCESS_TOKEN, {
      expiresIn: expiresIn,
      algorithm: 'RS256',
      issuer: 'topshelfnews.com',
      audience: userID.email   
   });

   return {
      token: `Bearer ${signedToken}`,
      expires: expiresIn
   };
}

const issueRefreshTokenJWT = (userID: {email:string, id:string}) => {
   const expiresIn = '15m';
   const payload = {
      email: userID.email,
      id:userID.id
   };
   const signedToken = jsonwebtoken.sign(payload, PRV_KEY_REFRESH_TOKEN, {
      expiresIn: expiresIn,
      algorithm: 'RS512',
      issuer: 'topshelfnews.com',
      audience: JSON.stringify(userID) 
   });

   return setRedis(userID.id, signedToken)
   .then(() => {
      return {
         token: signedToken,
         expires: expiresIn,
         expiresInMs: ms(expiresIn)
      };
   });
}

const verifyAccessToken = (req_:Request, res:Response, next: NextFunction) => {
   const req = req_ as RequestWithPayload;
   if (!req.headers['authorization']) {
      return next(new createHttpError.Unauthorized('Unauthorized Error'));
   }
   const authHeader:string = req.headers['authorization'];
   const bearerToken = authHeader.split(' ')[1];
   jsonwebtoken.verify(bearerToken, PUB_KEY_ACCESS_TOKEN, (err, payload) => {
      if(err) {
         return err.name == 'JsonWebTokenError' ? next(new createHttpError.Unauthorized()) : next(new createHttpError.Unauthorized(err.message));
      }
      req['payload'] = payload;
      next();
   });
}

const verifyRefreshToken = (refreshToken: string): Promise<{id:string}> => {
   let user:{id:string}={id:''};
   return new Promise((resolve, reject) => {
      jsonwebtoken.verify(refreshToken, PUB_KEY_REFRESH_TOKEN, (err, payload:any) => {  
         if (err) {
            return reject(new createHttpError.Unauthorized());
         }
         user = JSON.parse(payload.aud);
         getRedis(user.id)
         .then((res) => {
            if (res === refreshToken) {
               return resolve(user);
            }
            return reject(new createHttpError.Unauthorized());
         })
      });
   });
}

export const utils = Object.assign({}, {
   issueAccessTokenJWT: issueAccessTokenJWT,
   issueRefreshTokenJWT: issueRefreshTokenJWT,
   verifyAccessToken: verifyAccessToken,
   verifyRefreshToken: verifyRefreshToken,
});
