import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import calendar from '../../images/calendar.svg';
import './personal.info.component.scss';
import ReactAvatar from 'react-avatar';

const createAvatar = (id, type) => {
  const colorArray = ['red', 'blue', 'green'];
  const colorID = Math.floor(Math.random() * (colorArray.length - 1));
  switch(type) {
    case 'twitter':
      return <ReactAvatar className="avatar" twitterHandle={id} round color={colorArray[colorID]} />
    case 'facebook':
      return <ReactAvatar className="avatar" facebookId={id} round color={colorArray[colorID]} />;
    case 'google':
      return <ReactAvatar className="avatar" googleId={id} round color={colorArray[colorID]} />;
    default:
      return <ReactAvatar className="avatar" name="ABC" round color={colorArray[colorID]} />
  }
}
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
      { createAvatar(profileID, typeOfID) }
    </div>
  );
}