import React from 'react';
import './event.of.day.component.scss';
import eventofDay from '../../images/eventOfDay.jpg';
import { Link } from 'react-router-dom';

const EventOfDay = ({ event, isSticky, source, title }) => {
  return (
    <div className={`event-of-day-container ${isSticky && 'sticky'}`}>
      <h2 className="event-header">Historical Event</h2>
      <Link to={`full-story?${'history'}`} className="link">
        <div className="historical-event-img-container">
          <img src={source || eventofDay} alt="historical event" className="historical-event-img"/>
        </div>
        <p className="event-title">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum repudiandae ipsam, soluta qui, aliquid eligendi unde officia veniam quidem numquam reprehenderit perspiciatis molestias quod amet. Quos sapiente cum error nemo?</p>
      </Link>
    </div>
  );
}
export default EventOfDay;