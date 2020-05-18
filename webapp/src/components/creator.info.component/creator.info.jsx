import React from 'react';
import './creator.info.component.scss';

const CreatorInfo = ({ username, time }) => {
  return (
  <div className="creator">
    <h2 className="creator-name">{ username || 'Mr. TalkBox' }</h2>
    <time className="creation-time">{ time || '10:00AM' }</time>
  </div>
  );
}
export default CreatorInfo;