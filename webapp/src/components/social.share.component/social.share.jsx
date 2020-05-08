import React from 'react';
import facebook from '../../images/facebook.svg';
import twitter from '../../images/twitter.svg';
import linkedIn from '../../images/linkedIn.svg';
import threeDots from '../../images/threeDots.svg';
import { Link } from 'react-router-dom';
import './social.share.scss';
import { connect } from 'react-redux';
import { closeReportDialog, openReportDialog } from '../../reducers/click/report.dialog.action';

const SocialShare = ({ isOpen, closeReportDialog, openReportDialog, location, activeLocation }) => {
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
      <div className="report-news-wrapper" 
        onClick={() => isOpen ? closeReportDialog(location) : openReportDialog(location)}
        onBlur={() => closeReportDialog(location)}
        tabIndex={0}>
        <img src={threeDots} alt="report" className="icon-img report-icon" />
       { activeLocation === location && isOpen && <ul className="report-list-wrapper">
          <li className="report-list-item">Report this news</li>
          <li className="report-list-item">Mute this Author</li>
          <li className="report-list-item">Unfollow this Author</li>
        </ul>}
      </div>
    </div>
  );
}

const mapStateToProps = ({ reportDialog }) => ({
  isOpen: reportDialog.isOpen,
  activeLocation: reportDialog.activeLocation
});
const mapDispatchToProps = dispatch => ({
  openReportDialog: (location) => dispatch(openReportDialog(location)),
  closeReportDialog: (location) => dispatch(closeReportDialog(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(SocialShare);