const SAVE_DATA ='SAVE_DATA';
const handleEditorData = (data) => ({
  type: SAVE_DATA,
  payload: data
});
export {
  handleEditorData,
  SAVE_DATA
};