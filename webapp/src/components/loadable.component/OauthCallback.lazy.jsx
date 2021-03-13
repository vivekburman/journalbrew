import loadable from 'react-loadable';

export default loadable({
  loader: () => import("./loadableOauthCallback"),
  loading: () => null
});
