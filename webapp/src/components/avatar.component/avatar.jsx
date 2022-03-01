import React from 'react';
import './avatar.component.scss';
import user from '../../images/user.svg';

export const UserAvatar = ({ url, size=100, userName="ABC"}) => {
  const colorArray = ['red', 'blue', 'green'];
  const colorID = Math.floor(Math.random() * (colorArray.length - 1));
  const onError = (e) => {
    e.target.src = user;
  }
  return (
    <div className="user-avatar-wrapper">
      {
        url ? <img className="user-avatar-image" src={url} width={`${size}px`} height={`${size}px`} onError={onError}/>
        :
        <div className="user-avatar-text" style={{backgoundColor: `${colorArray[colorID]}`, width: `${size}px`, height: `${size}px`}}>
          { userName }
        </div>
      }
    </div>
  );
};