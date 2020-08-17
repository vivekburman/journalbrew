import React from 'react';
import ReactAvatar from 'react-avatar';
export const UserAvatar = ({ url, size=100}) => {
  const colorArray = ['red', 'blue', 'green'];
  const colorID = Math.floor(Math.random() * (colorArray.length - 1));
  return url ? <ReactAvatar size={size} className="avatar" src={url} round color={colorArray[colorID]} />
    : <ReactAvatar size={size} className="avatar" name="ABC" round color={colorArray[colorID]} />
};