import {Router} from 'express';
import passport from 'passport';
import { Database } from '../../database';
import { utils } from '../utils/jwtUtils';
import { encryptDecrypt } from '../utils/encrypt_decrypt';

const UNDEF = undefined;

const registerRouter: Router = Router();
// auth with google
registerRouter.get('/google', passport.authenticate('google',{
   scope: ['profile', 'email'],
   session: false
}));

registerRouter.get('/protected', passport.authenticate('jwt', {session: false}, ), (req, res) => {
   res.send('YOU ARE AUTHORIZED');
})

// auth google redirect
registerRouter.get('/google/redirect', passport.authenticate('google', {session: false}), (req, res:any, next:Function) => { 
   if (res.req.user) {
      const profile = res.req.user;
      if (!profile.emails[0].value) {
         next(new Error('Email not found!!!!'));
      } else {
         const name = profile.displayName.split(' ');
         const db = Database.getDBQueryHandler();

         db.selectWithValues('SELECT id, strategy_id FROM user WHERE email=?', [profile.emails[0].value])
            .then((data: any) => {            
               if(data[0].length) {
                  const strategyId = data[0][0].strategy_id;
                  return profile.id === strategyId;
                  // return encryptDecrypt.compare(profile.id, strategyId);
               } else {
                  // create a hash to encrypt strategy_id
                  // return encryptDecrypt.encrypt(profile.id);
                  return profile.id;
               }
            })
            .then((data: string | boolean) => {
               if (typeof data == 'string') {
                  db.insertWithValues(
                     `INSERT INTO user (strategy_id, strategy_type, first_name, middle_name, last_name,
                        profile_pic_url, email, created_at, last_logged_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                           data,
                           'google',
                           name[0],
                           (name[2] ? (name[1] || UNDEF) : UNDEF),
                           (name[2] || name[1] || UNDEF),
                           (profile.photos[0]?.value || null),
                           (profile.emails[0]?.value),
                           new Date().toISOString().slice(0, 19).replace('T', ' '),
                           UNDEF
                  ]);
                  return data; // return bcrypt string will be used to create JWT
               } else if (data) {
                  return profile.id;
                  // return encryptDecrypt.encrypt(profile.id); // if user exists create the hash for JWT and return it
               }
               return UNDEF;
            })
            .then((data: string) => {
               if (data) {
                  const jwt = utils.issueJWT({id: data, email: profile.emails[0].value});
                  res.status(200).json({success: true, token: jwt.token, expiresIn: jwt.expires});
               } else {
                  res.status(401).json({success: false});
               }
            })
            .catch((err: Error) => {
               console.log('Database Error either User is not found or insertion has failed!', err);
               next(err);
            });  
      }  
   }
});

export default registerRouter;
