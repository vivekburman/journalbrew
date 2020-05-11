import React from 'react';
import withFocusBlur from '../focus.blur.hoc.component/focus.blur';
import './report.dropdown.component.scss';
import { connect } from 'react-redux';
import { hideReportDropDown } from '../../reducers/click/report.dialog.action';

const ReportDropDown = (props) => {
const {hideReportDropDown, location } = props;
  return (
    <>
      <ul 
        className="report-list-wrapper"
        onClick={() => hideReportDropDown(location)}>
        <li className="report-list-item">Report this news</li>
        <li className="report-list-item">Mute this Author</li>
        <li className="report-list-item">Unfollow this Author</li>
      </ul>
    </>
  );
}
const mapStateToProps = ({ reportDropDown }) => ({
  isReportDropDownOpen: reportDropDown.isOpen,
  activeLocation: reportDropDown.activeLocation
});
const mapDispatchToProps = dispatch => ({
  hideReportDropDown: (location) => dispatch(hideReportDropDown(location)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withFocusBlur(ReportDropDown));