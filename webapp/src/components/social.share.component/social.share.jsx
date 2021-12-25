import React from 'react';
import facebook from '../../images/facebook.svg';
import twitter from '../../images/twitter.svg';
import threeDots from '../../images/threeDots.svg';
import linkedIn from '../../images/linkedIn.svg';
import { Link } from 'react-router-dom';
import ReportDropDown from '../report.dropdown.component/report.dropdown';
import { useState } from 'react';

const SocialShare = (props) => {
  const [isReportDropDownOpen, setReportDropDown] = useState(false);

  const toggleDD = () => {
    setReportDropDown(!isReportDropDownOpen);
  }
  const hideReportDropDown = () => {
    setReportDropDown(false);
  }
  return(
    <div className="flex flex-row-nowrap">
      {/* <Link to=''>
        <img src={twitter} alt="twitter" className="icon-img"/>
      </Link>
      <Link to=''>
        <img src={facebook} alt="facebook" className="icon-img"/>
      </Link>
      <Link to=''>
        <img src={linkedIn} alt="linkedIn" className="icon-img"/>
      </Link> */}
      <div className="position-relative">
        <img src={threeDots} alt="report" className="icon-img" 
        onClick= {toggleDD}  />
        <ReportDropDown 
          noFullScreen={true}
          isOpen = {isReportDropDownOpen} 
          hideFunc={hideReportDropDown}
          {...props}/>
      </div>
    </div>
  );
}
export default SocialShare;