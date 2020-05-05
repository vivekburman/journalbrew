import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import calendar from '../../images/calendar.svg';
import './personal.info.component.scss';
import {UserAvatar} from '../avatar.component/avatar'; 

export const PersonalInfo = (props) => {
  const { profileID, username, doj, rating, typeOfID } = props;
  return (
    <div className="personal-info-container">
      <div className="personal-info-details">
        <h1 className="user-name">{username || 'DummyName'}</h1>
        <div>
          <img src={calendar} className="icon-img calendar-img" alt="calendar"/>
          <time className="time">{doj || 'Jan 15, 2019'}</time>
        </div>
        <StarRatingComponent name={'userrating'}value={rating||2} editing={false} starColor='yellow' emptyStarColor='lightgrey'/>
      </div>
      <UserAvatar id={profileID} type={typeOfID} />
    </div>
  );
}