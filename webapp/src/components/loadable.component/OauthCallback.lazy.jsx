import loadable from '@loadable/component';

export default loadable(() => import(/* webpackChunkName: "OauthCallback" */ /* webpackMode: "lazy" */ "./loadableOauthCallback"));
