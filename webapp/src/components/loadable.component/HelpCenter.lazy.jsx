import loadable from 'react-loadable';
export default loadable({
  loader: () => import("./loadableHelpCenter.jsx"),
  loading: () => null
});