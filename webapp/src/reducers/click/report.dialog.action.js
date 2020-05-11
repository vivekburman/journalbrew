const SHOW_REPORT_DROPDOWN = 'SHOW_REPORT_DROPDOWN';
const HIDE_REPORT_DROPDOWN = 'HIDE_REPORT_DIALOG';

const showReportDropDown = (payload) => ({
  type: SHOW_REPORT_DROPDOWN,
  payload: {
    activeLocation: payload,
    isOpen: true
  }
});

const hideReportDropDown = (payload) => ({
  type: HIDE_REPORT_DROPDOWN,
  payload: {
    activeLocation: payload,
    isOpen: false
  }
});

export {
  SHOW_REPORT_DROPDOWN,
  HIDE_REPORT_DROPDOWN,
  showReportDropDown,
  hideReportDropDown
};