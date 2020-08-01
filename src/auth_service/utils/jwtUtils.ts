import path from 'path';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

const pathToPrivateKeyAccessToken:string = path.join(__dirname, '../id_access_rsa_prv.pem');
const PRV_KEY_ACCESS_TOKEN:string = fs.readFileSync(pathToPrivateKeyAccessToken, 'utf-8');

const pathToPublicKeyAccessToken:string = path.join(__dirname, '../id_access_rsa_pub.pem');
const PUB_KEY_ACCESS_TOKEN:string = fs.readFileSync(pathToPublicKeyAccessToken, 'utf-8');

const pathToPrivateKeyRefreshToken:string = path.join(__dirname, '../id_refresh_rsa_prv.pem');
const PRV_KEY_REFRESH_TOKEN:string = fs.readFileSync(pathToPrivateKeyRefreshToken, 'utf-8');

const pathToPublicKeyRefreshToken:string = path.join(__dirname, '../id_refresh_rsa_pub.pem');
const PUB_KEY_REFRESH_TOKEN:string = fs.readFileSync(pathToPublicKeyRefreshToken, 'utf-8');


const issueAccessTokenJWT = (userID: {id:string, email:string}) => {
   const expiresIn = '1h';
   const payload = {
      sub: userID.id,
      email: userID.email,
   };
   const signedToken = jsonwebtoken.sign(payload, PRV_KEY_ACCESS_TOKEN, {
      expiresIn: expiresIn,
      algorithm: 'RS256',
      issuer: 'topselfnews.com',
      audience: userID.email   
   });

   return {
      token: `Bearer ${signedToken}`,
      expires: expiresIn
   };
}

const issueRefreshTokenJWT = (userID: {id:string, email:string}) => {
   const expiresIn = '1y';
   const payload = {
      sub: userID.id,
      email: userID.email,
   };
   const signedToken = jsonwebtoken.sign(payload, PRV_KEY_REFRESH_TOKEN, {
      expiresIn: expiresIn,
      algorithm: 'RS512',
      issuer: 'topselfnews.com',
      audience: JSON.stringify(userID) 
   });

   return {
      token: `RefreshToken ${signedToken}`,
      expires: expiresIn
   };
}

const verifyAccessToken = (req:any, res:Response, next: NextFunction) => {
   if (!req.headers['authorization']) {
      return next(new createHttpError.Unauthorized('Unauthorized Error'));
   }
   const authHeader:string = req.headers['authorization'];
   const bearerToken = authHeader.split(' ')[1];
   jsonwebtoken.verify(bearerToken, PUB_KEY_ACCESS_TOKEN, (err, payload) => {
      console.log('error = ', err);
      if(err) {
         return err.name == 'JsonWebTokenError' ? next(new createHttpError.Unauthorized()) : next(new createHttpError.Unauthorized(err.message));
      }
      req.payload = payload;
      next();
   });
}

const verifyRefreshToken = (refreshToken: string): Promise<{id:string, email:string}> => {
   let user:{id:string, email:string}={id: '', email:''};
   return new Promise((resolve, reject) => {
      jsonwebtoken.verify(refreshToken, PUB_KEY_REFRESH_TOKEN, (err, payload:any) => {
         if (err) {
            return reject(new createHttpError.Unauthorized());
         }
         user = JSON.parse(payload.aud);
         resolve(user);
      });
   });
}

export const utils = Object.assign({}, {
   issueAccessTokenJWT: issueAccessTokenJWT,
   issueRefreshTokenJWT: issueRefreshTokenJWT,
   verifyAccessToken: verifyAccessToken,
   verifyRefreshToken: verifyRefreshToken,
});
