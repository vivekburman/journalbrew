import loadable from 'react-loadable';

export default loadable({
  loader: () => import("./loadableNewsFeed"),
  loading: () => null
});