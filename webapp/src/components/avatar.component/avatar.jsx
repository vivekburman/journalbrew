import React from 'react';
import './avatar.component.scss';
export const UserAvatar = ({ url, size=100, userName="ABC"}) => {
  const colorArray = ['red', 'blue', 'green'];
  const colorID = Math.floor(Math.random() * (colorArray.length - 1));
  return (
    <div className="user-avatar-wrapper">
      {
        url ? <img className="user-avatar-image" src={url} width={`${size}px`} height={`${size}px`}/>
        :
        <div className="user-avatar-text" style={`backgound-color: ${colorArray[colorID]}; width: ${size}px; height: ${size}px`}>
          { userName }
        </div>
      }
    </div>
  );
};