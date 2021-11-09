import React from 'react';
import calendar from '../../images/calendar.svg';
import './personal.info.component.scss';
import {UserAvatar} from '../avatar.component/avatar'; 
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';
import { getDisplayName, getDateOfJoining } from '../../helpers/util';

const PersonalInfo = (props) => {
  const {personalInfo, windowSize, loading } = props;
  let size;
  if (windowSize < 768) {
    size = 100;
  } else {
    size = 150;
  }
  return (
    <div className="personal-info-container">
      <div className="personal-info-details">
        {
          loading ? 
          <div className="flex-row-nowrap justify-content-between">
            <div className="flex-grow-1 margin-top-15">
              <div style={{ maxWidth: '200px' }}>
                <Skeleton height={20}/>
              </div>
              <div style={{ lineHeight: 1.5 }}>
                <Skeleton width={65} />
              </div>
            </div>
            <div>
              <Skeleton width={size} height={size} circle={true} />
            </div>
          </div>
          :
          <div className="flex flex-row-nowrap justify-content-between">
            <div>
              <h1 className="username">{getDisplayName(personalInfo.firstName, personalInfo.middleName, personalInfo.lastName)}</h1>
              <div className="flex flex-row-nowrap align-items-center">
                <img src={calendar} className="icon-img calendar-img cursor-default" alt="calendar"/>
                <time className="time">Joined {getDateOfJoining(personalInfo.createdAt)}</time>
              </div>
            </div>
            <UserAvatar url={personalInfo.profilePicUrl} size={size}/> 
          </div>
        }
      </div>
    </div>
  );
}
const mapStateToProps = ({ window }) => ({
  windowSize: window.windowSize
});
export default connect(mapStateToProps)(PersonalInfo);