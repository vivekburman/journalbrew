import React from 'react';
import { Link } from 'react-router-dom';
import './notification.component.scss';
const createCard = () => {

}
export const Notification = (props) => {
  const { showFull = false } = props;
  let temp;
  if (!showFull) {
    temp = <div className="text-align-center">
      <Link to="/user-profile" className="link">See all Notifications</Link>
    </div>
  }
  return (
    <div>
      <ul>
        { createCard() }
      </ul>
    </div>
  );
}