import React from 'react';
import withFocusBlur from '../focus.blur.hoc.component/focus.blur';
import './report.dropdown.component.scss';

const ReportDropDown = (props) => {

  const { hideFunc } = props;

  const _toggleDD = () => {
    hideFunc();
  }  
  return (
      <>
        <ul 
          className="report-list-wrapper"
          onClick={_toggleDD}>
          <li className="report-list-item">Report this news</li>
          <li className="report-list-item">Mute this Author</li>
          <li className="report-list-item">Unfollow this Author</li>
        </ul>
      </>
    );
}

export default withFocusBlur(ReportDropDown);