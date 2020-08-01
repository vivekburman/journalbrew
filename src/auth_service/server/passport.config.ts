import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as LinkedInStrategy} from 'passport-linkedin-oauth2';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import {Strategy as GoogleStartegy} from 'passport-google-oauth20';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import { Database } from '../../database';
import {config} from '../config/config';
import path from 'path';
import fs from 'fs';
import {encryptDecrypt} from '../utils/encrypt_decrypt';

/**
 * Setup the register API
 * Here user will be able to connect to Strategy and register an
 * account into the MYSQL Database
 */

const googleStartegyCallback = (type: string, accessToken: any, refreshToken: any, profile: any, done: Function) => {

   if(!profile.emails[0].value) {
      console.log('Cannot find Email, Please try with other account which has email');
      return done(null, false);
   }
   return done(null, profile);
};

const pathToPublicKey:string = path.join(__dirname, '../id_rsa_pub.pem');
const PUB_KEY:string = fs.readFileSync(pathToPublicKey, 'utf-8');


export function initPassport () {
   const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: PUB_KEY,
      algorithms: ['RS256'],
      ignoreExpiration: false,
      jsonWebTokenOptions: {
         maxAge: '2d'
      }
   };
   
   passport.use(new JwtStrategy(options, (payload: {sub: string, email:string, iat: Date}, done) => {
      console.log('comapreing it')
      const id = payload.sub;
      const email = payload.email;
      Database.getDBQueryHandler().selectWithValues('SELECT id, strategy_id FROM user where email=?', [email])
         .then((data: any) => {
            console.log('id=',id);
            console.log('strategy_id=',data[0][0].strategy_id);
            console.log("compare=", id === data[0][0].strategy_id);
            if (data[0].length && id === data[0][0].strategy_id) {
               done(null, data)
            } else {
               done(null, false);
            }
         })
         .catch((err: Error) => {
            done(err, null);
         })
   }));
   //  passport.use(new FacebookStrategy({
   //     ...config.authStrategyKeys[config.enums.FACEBOOK]
   //  }, (accessToken, refreshToken, profile, done) => StrategyCallback('facebook', accessToken, refreshToken, profile, done)));
   //  passport.use(new LinkedInStrategy({
   //     ...config.authStrategyKeys[config.enums.LINKEDIN]
   //  }, (accessToken, refreshToken, profile, done) => StrategyCallback('linkedin', accessToken, refreshToken, profile, done)));
   //  passport.use(new TwitterStrategy({
   //     ...config.authStrategyKeys[config.enums.TWITTER]
   //  }, (accessToken, refreshToken, profile, done) => StrategyCallback('twitter', accessToken, refreshToken, profile, done)));
    passport.use(new GoogleStartegy({
       ...config.authStrategyKeys[config.enums.GOOGLE]
    }, (accessToken, refreshToken, profile, done) => googleStartegyCallback('google', accessToken, refreshToken, profile, done)));
}