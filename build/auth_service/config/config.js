"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var enums = {
    FACEBOOK: 'facebook',
    GOOGLE: 'google',
    TWITTER: 'twitter',
    LINKEDIN: 'linkedIn'
};
var authStrategyKeys = (_a = {},
    _a[enums.GOOGLE] = {
        clientID: process.env.GOOGLE_clientID,
        clientSecret: process.env.GOOGLE_clientSecret,
        callbackURL: process.env.NODE_ENV == 'development' ? 'http://localhost:9000/oauth_callback' : '/oauth_callback'
    },
    _a[enums.FACEBOOK] = {
        clientID: '',
        clientSecret: '',
        callbackURL: '/auth/facebook/redirect'
    },
    _a[enums.LINKEDIN] = {
        clientID: '',
        clientSecret: '',
        callbackURL: '/auth/linkedIn/redirect'
    },
    _a[enums.TWITTER] = {
        clientID: '',
        clientSecret: '',
        callbackURL: '/auth/twitter/redirect'
    },
    _a);
var serverSettings = {
    port: process.env.AUTH_SERVICE_PORT
};
exports.config = Object.assign({}, { serverSettings: serverSettings, authStrategyKeys: authStrategyKeys, enums: enums });
