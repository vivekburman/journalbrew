"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPassport = void 0;
var passport_1 = __importDefault(require("passport"));
// import {Strategy as FacebookStrategy} from 'passport-facebook';
// import {Strategy as LinkedInStrategy} from 'passport-linkedin-oauth2';
// import {Strategy as TwitterStrategy} from 'passport-twitter';
var passport_google_oauth20_1 = require("passport-google-oauth20");
var config_1 = require("../config/config");
/**
 * Setup the register API
 * Here user will be able to connect to Strategy and register an
 * account into the MYSQL Database
 */
var googleStartegyCallback = function (type, profile, done) {
    if (!profile.emails[0] || !profile.emails[0].value) {
        return done(null, false);
    }
    return done(null, { profile: profile });
};
function initPassport() {
    //  passport.use(new FacebookStrategy({
    //     ...config.authStrategyKeys[config.enums.FACEBOOK]
    //  }, (accessToken, refreshToken, profile, done) => StrategyCallback('facebook', accessToken, refreshToken, profile, done)));
    //  passport.use(new LinkedInStrategy({
    //     ...config.authStrategyKeys[config.enums.LINKEDIN]
    //  }, (accessToken, refreshToken, profile, done) => StrategyCallback('linkedin', accessToken, refreshToken, profile, done)));
    //  passport.use(new TwitterStrategy({
    //     ...config.authStrategyKeys[config.enums.TWITTER]
    //  }, (accessToken, refreshToken, profile, done) => StrategyCallback('twitter', accessToken, refreshToken, profile, done)));
    passport_1.default.use(new passport_google_oauth20_1.Strategy(__assign({}, config_1.config.authStrategyKeys[config_1.config.enums.GOOGLE]), function (accessToken, refreshToken, profile, done) {
        googleStartegyCallback('google', profile, done);
    }));
}
exports.initPassport = initPassport;
