const OPEN_REPORT_DIALOG = 'OPEN_REPORT_DIALOG';
const CLOSE_REPORT_DIALOG = 'CLOSE_REPORT_DIALOG';

const openReportDialog = (payload) => ({
  type: OPEN_REPORT_DIALOG,
  payload: {
    activeLocation: payload,
    isOpen: true
  }
});

const closeReportDialog = (payload) => ({
  type: CLOSE_REPORT_DIALOG,
  payload: {
    ...payload,
    isOpen: false
  }
});

export {
  OPEN_REPORT_DIALOG,
  CLOSE_REPORT_DIALOG,
  openReportDialog,
  closeReportDialog
};