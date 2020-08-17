import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as LinkedInStrategy} from 'passport-linkedin-oauth2';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import {Strategy as GoogleStartegy} from 'passport-google-oauth20';
import {config} from '../config/config';

/**
 * Setup the register API
 * Here user will be able to connect to Strategy and register an
 * account into the MYSQL Database
 */

const googleStartegyCallback = (type: string, accessToken: string, refreshToken: string, profile:any, done: Function) => {
   if(!profile.emails[0] || !profile.emails[0].value) {
      return done(null, false);
   }
   return done(null, {profile, accessToken, refreshToken});
};


export function initPassport () {
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
    }, function (accessToken:string, refreshToken:string, profile:any, done:Function) {
      googleStartegyCallback('google', accessToken, refreshToken, profile, done); 
    })); 
}