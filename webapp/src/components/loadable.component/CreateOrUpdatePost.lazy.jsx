import loadable from 'react-loadable';

export default loadable({
  loader: () => import("./loadableCreateOrUpdatePost"),
  loading: () => null
});
