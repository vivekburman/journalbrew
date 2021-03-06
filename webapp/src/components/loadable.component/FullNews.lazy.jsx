import loadable from 'react-loadable';

export default loadable({
  loader: () => import("./loadableFullNews"),
  loading: () => null
});
