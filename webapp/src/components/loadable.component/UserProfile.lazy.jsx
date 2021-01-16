import loadable from '@loadable/component';

export default loadable(() => import(/* webpackChunkName: "UserProfile" */ /* webpackMode: "lazy" */ "./loadableUserProfile"));
