import React from 'react';

const EventOfDay = ({ event, isSticky }) => {
  return (
    <div className={isSticky && 'sticky'}>EventOfDay</div>
  );
}
export default EventOfDay;