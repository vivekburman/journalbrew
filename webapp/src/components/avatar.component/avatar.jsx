import React from 'react';
import ReactAvatar from 'react-avatar';
export const UserAvatar = ({ id, type, size=100}) => {
  const colorArray = ['red', 'blue', 'green'];
  const colorID = Math.floor(Math.random() * (colorArray.length - 1));
  switch(type) {
    case 'twitter':
      return <ReactAvatar size={size} className="avatar" twitterHandle={id} round color={colorArray[colorID]} />
    case 'facebook':
      return <ReactAvatar size={size} className="avatar" facebookId={id} round color={colorArray[colorID]} />;
    case 'google':
      return <ReactAvatar size={size} className="avatar" googleId={id} round color={colorArray[colorID]} />;
    default:
      return <ReactAvatar size={size} className="avatar" name="ABC" round color={colorArray[colorID]} />
  }
};