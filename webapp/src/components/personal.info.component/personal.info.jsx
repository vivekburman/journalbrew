import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import calendar from '../../images/calendar.svg';
import './personal.info.component.scss';
import {UserAvatar} from '../avatar.component/avatar'; 
import Skeleton from 'react-loading-skeleton';
export const PersonalInfo = (props) => {
  const { profileID, username, doj, rating, typeOfID } = props;
  return (
    <div className="personal-info-container">
      <div className="personal-info-details">
        { username ? <h1 className="user-name">{username}</h1> : 
         <div style={{ maxWidth: '150px' }}>
           <Skeleton height={20}/>
         </div> }
        { doj ? <div>
          <img src={calendar} className="icon-img calendar-img" alt="calendar"/>
          <time className="time">{doj || 'Jan 15, 2019'}</time>
        </div> : 
        <div style={{ lineHeight: 1.5 }}>
          <Skeleton width={65} />
        </div> }
        { rating ? <StarRatingComponent name={'userrating'} value={rating} editing={false}
          starColor='yellow' emptyStarColor='lightgrey'/> : 
          <Skeleton width={70} height={10}/>}
      </div>
      { (profileID && typeOfID) ? <UserAvatar id={profileID} type={typeOfID} /> 
      : <Skeleton circle={true} height={100} width={100} />}
    </div>
  );
}