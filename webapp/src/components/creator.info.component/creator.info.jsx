import React from 'react';
import Moment from 'react-moment';
import './creator.info.component.scss';

const CreatorInfo = ({ username, time }) => {
  return (
  <div className="creator">
    <h2 className="creator-name">{ username }</h2>
    <Moment fromNow date={time} />
  </div>
  );
}
export default CreatorInfo;