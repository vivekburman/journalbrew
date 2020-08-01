import path from 'path';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';

const pathToPrivateKey:string = path.join(__dirname, '../id_rsa_prv.pem');
const PRV_KEY:string = fs.readFileSync(pathToPrivateKey, 'utf-8');

const issueJWT = (userID: {id:string, email:string}) => {
   const expiresIn = '2d';
   const payload = {
      sub: userID.id,
      email: userID.email,
      iat: Date.now()
   };
   const signedToken = jsonwebtoken.sign(payload, PRV_KEY, {expiresIn: expiresIn, algorithm: 'RS256'});

   return {
      token: `Bearer ${signedToken}`,
      expires: expiresIn
   };
}

export const utils = Object.assign({}, {
   issueJWT: issueJWT
});
