const SHOW_PREVIEW = 'SHOW_PREVIEW';
const HIDE_PREVIEW = 'HIDE_PREVIEW';
const showPreview = () => ({
  type: SHOW_PREVIEW,
  payload: true
});
const hidePreview = () => ({
  type: HIDE_PREVIEW,
  payload: false
});

export {
  SHOW_PREVIEW,
  HIDE_PREVIEW,
  showPreview,
  hidePreview
};
