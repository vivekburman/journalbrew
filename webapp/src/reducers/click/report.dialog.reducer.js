import { HIDE_REPORT_DROPDOWN, SHOW_REPORT_DROPDOWN } from "./report.dialog.action";

const handleReportDropDown = (state={}, action) => {
  switch(action.type) {
    case SHOW_REPORT_DROPDOWN:
      return {
        ...state,
        ...action.payload
      };
    case HIDE_REPORT_DROPDOWN:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
export default handleReportDropDown;