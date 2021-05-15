import React from 'react';
import facebook from '../../images/facebook.svg';
import twitter from '../../images/twitter.svg';
import threeDots from '../../images/threeDots.svg';
import linkedIn from '../../images/linkedIn.svg';
import { Link } from 'react-router-dom';
import ReportDropDown from '../report.dropdown.component/report.dropdown';
import { connect } from 'react-redux';
import { showReportDropDown, hideReportDropDown } from '../../reducers/click/report.dialog.action';

const SocialShare = (props) => {
  const checkCondition = () => {
    return props.activeLocation === props.location;
  }
  const toggleDD = () => {
    props.isReportDropDownOpen ? props.hideReportDropDown(props.location) : props.showReportDropDown(props.location);
  }
  return(
    <div className="flex flex-row-nowrap">
      <Link to=''>
        <img src={twitter} alt="twitter" className="icon-img"/>
      </Link>
      <Link to=''>
        <img src={facebook} alt="facebook" className="icon-img"/>
      </Link>
      <Link to=''>
        <img src={linkedIn} alt="linkedIn" className="icon-img"/>
      </Link>
      <div className="position-relative">
        <img src={threeDots} alt="report" className="icon-img" 
        onClick= {toggleDD}  />
        <ReportDropDown isOpen= {props.isReportDropDownOpen} 
          hideFunc={props.hideReportDropDown}
          checkCondition = {checkCondition}
          {...props}/>
      </div>
    </div>
  );
}
const mapStateToProps = ({ reportDropDown }) => ({
  isReportDropDownOpen: reportDropDown.isOpen,
  activeLocation: reportDropDown.activeLocation,
});
const mapDispatchToProps = dispatch => ({
  showReportDropDown: (location) => dispatch(showReportDropDown(location)),
  hideReportDropDown: (location) => dispatch(hideReportDropDown(location))
});
export default connect(mapStateToProps, mapDispatchToProps)(SocialShare);