import loadable from '@loadable/component';

export default loadable(() => import(/* webpackChunkName: "NewsFeed" */ /* webpackMode: "lazy" */ "./loadableNewsFeed"));
