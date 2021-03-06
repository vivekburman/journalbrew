import loadable from 'react-loadable';
export default loadable({
  loader: () => import("./loadablePaymentInsights"),
  loading: () => null
});