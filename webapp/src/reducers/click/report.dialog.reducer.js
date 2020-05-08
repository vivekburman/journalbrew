import { OPEN_REPORT_DIALOG, CLOSE_REPORT_DIALOG } from "./report.dialog.action";

const handleReportDialogBox = (state={}, action) => {
  switch(action.type) {
    case OPEN_REPORT_DIALOG:
      console.log(action.payload);
      return {
        ...state,
        ...action.payload
      };
    case CLOSE_REPORT_DIALOG:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
export default handleReportDialogBox;