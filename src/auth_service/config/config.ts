type serverType = {
    port: string | number | undefined
};

const enums = {
    FACEBOOK: 'facebook',
    GOOGLE: 'google',
    TWITTER: 'twitter',
    LINKEDIN: 'linkedIn'
}

const authStrategyKeys: object = {
    [enums.GOOGLE]: {
        clientID: process.env.GOOGLE_clientID,
        clientSecret: process.env.GOOGLE_clientSecret,
        callbackURL: process.env.NODE_ENV == 'development' ? 'http://localhost:9000/oauth_callback' : `${process.env.PUBLIC_BASE_URL}/oauth_callback`
    }, [enums.FACEBOOK]: {
        clientID: '',
        clientSecret: '',
        callbackURL: '/auth/facebook/redirect'
    },[enums.LINKEDIN]: {
        clientID: '',
        clientSecret: '',
        callbackURL: '/auth/linkedIn/redirect'
    },[enums.TWITTER]: {
        clientID: '',
        clientSecret: '',
        callbackURL: '/auth/twitter/redirect'
    },
}
const serverSettings: serverType = {
    port: process.env.AUTH_SERVICE_PORT
};
export const config: any = Object.assign({}, {serverSettings, authStrategyKeys, enums});