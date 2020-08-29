import React from 'react';
import close from '../../images/close.svg';
import payment from '../../images/payment.svg';
import insights from '../../images/insights.svg';
import logout from '../../images/logout.svg';
import { UserAvatar } from '../avatar.component/avatar';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { hideProfileDropDown } from '../../reducers/click/profile.dropdown.action';
import './profile.dropdown.component.scss';
import withFocusBlur from '../focus.blur.hoc.component/focus.blur';
import { logoutUser } from '../../reducers/user/user.action';

const ProfileDropDown = ({ windowSize, hideProfileDropDown, logoutUser, currentUser }) => {

  return (
  <ul className="profile-list-wrapper">
    {windowSize <= 768 && <li className="flex-row-nowrap align-items-center profile-header">
      <img onClick={hideProfileDropDown} src={close} alt="close" className="icon-img icon-img-close" />
      <h1 className="profile-heading">Menu</h1>
    </li>}
    <li className="profile-list-item-wrapper">
      <Link to="/user-profile" className="profile-item-link">
        <div className="profile-list-item">
          <UserAvatar size={50} url={ currentUser.profilePicUrl }/>
          <div className="flex flex-column-nowrap profile-list-info">
            <span>Vivek Burman</span>
            <span className="see-profile">See your Profile</span>
          </div>
        </div>
      </Link>
    </li>
    <li className="profile-list-item-wrapper">
      <Link to="/" className="profile-item-link">
        <div className="profile-list-item">
          <img src={payment} className="icon-img" alt="Payment Gateway" />
          <span className="profile-list-info">Payment Gateway</span>
        </div>
      </Link>
    </li>
    <li className="profile-list-item-wrapper">
      <Link to="/payment-history-&-insights" className="profile-item-link">
        <div className="profile-list-item">
          <img src={insights} className="icon-img" alt="Payment History & Insights" />
          <span className="profile-list-info">Payment History & Insights</span>	
        </div>				
      </Link>
    </li>
    <li className="profile-list-item-wrapper">
      <Link to="/" onClick={logoutUser} className="profile-item-link">
        <div className="profile-list-item">
          <img src={logout} className="icon-img" alt="LogOut" />
          <span className="profile-list-info">LogOut</span>	
        </div>				
      </Link>
    </li>
  </ul>
  );
}

const mapDispatchToProps = dispatch => ({
  hideProfileDropDown: () => dispatch(hideProfileDropDown()),
  logoutUser: () => dispatch(logoutUser())
});

const mapStateToProps = ({ window, profileDropDown, user }) => ({
  windowSize: window.windowSize,
  isOpen: profileDropDown.isOpen,
	currentUser: user.currentUser
});
export default connect(mapStateToProps, mapDispatchToProps)(withFocusBlur(ProfileDropDown));