import loadable from 'react-loadable';
export default loadable({
  loader: () => import("./loadableUserProfile"),
  loading: () => null
});