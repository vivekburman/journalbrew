import loadable from '@loadable/component';

export default loadable(() => import(/* webpackChunkName: "FullNews" */  /* webpackMode: "lazy" */ "./loadableFullNews"));
