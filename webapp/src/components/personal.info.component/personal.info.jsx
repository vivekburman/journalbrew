import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import calendar from '../../images/calendar.svg';
import './personal.info.component.scss';
import {UserAvatar} from '../avatar.component/avatar'; 
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';

const PersonalInfo = (props) => {
  const { profileID, username='Vivek Burman', doj='Jan 15, 2019', typeOfID, windowSize } = props;
  let size;
  if (windowSize < 768) {
    size = 100;
  } else {
    size = 150;
  }
  return (
    <div className="personal-info-container">
      <div className="personal-info-details">
        { username ? <h1 className="username">{username}</h1> : 
         <div style={{ maxWidth: '150px' }}>
           <Skeleton height={20}/>
         </div> }
        { doj ? <div className="flex flex-row-nowrap align-items-center">
          <img src={calendar} className="icon-img calendar-img" alt="calendar"/>
          <time className="time">{doj || 'Jan 15, 2019'}</time>
        </div> : 
        <div style={{ lineHeight: 1.5 }}>
          <Skeleton width={65} />
        </div> }
      </div>
      { (profileID && typeOfID) ? <UserAvatar id={profileID} type={typeOfID} size={size}/> 
      : <Skeleton circle={true} height={size} width={size} /> }
    </div>
  );
}
const mapStateToProps = ({ window }) => ({
  windowSize: window.windowSize
});
export default connect(mapStateToProps)(PersonalInfo);