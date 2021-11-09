import React from 'react';
import bell from '../../images/bell.svg';
import user from '../../images/user.svg';
import Notification from '../notification.component/notification.card';
import {showNotification, hideNotification} from '../../reducers/click/notification.action';
import {connect} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import './profile.component.scss';
import ProfileDropDown from '../profile.dropdown.component/profile.dropdown';
import {showProfileDropDown, hideProfileDropDown} from '../../reducers/click/profile.dropdown.action';
import {showLogin, hideLogin} from '../../reducers/click/login.action';
import Login from '../login.component/login';
import { UserAvatar } from '../avatar.component/avatar';

const ProfileComponent = ({currentUser, isProfileDropDownOpen, showNotification, isNotificationDropDownOpen,
  hideNotification, hideProfileDropDown, showProfileDropDown, hideLogin, showLogin, isLoginPageOpen}) => {

	const toggleNotification = () => {
		isNotificationDropDownOpen ? hideNotification() : showNotification();
	}
	const toggleProfileDropDown = () => {
		isProfileDropDownOpen ? hideProfileDropDown() : showProfileDropDown();
	}
	const toggleSignIn = () => {
		isLoginPageOpen ? hideLogin() : showLogin(); 
	}
  return (
    <>
      { currentUser ?
			<ul className="flex-row-nowrap align-items-center">
			  <Switch>
			    <Route exact path={['/full-story', '/user-profile', '/opinions', '/', '/payment-history-&-insights']}>
			      <li className="notification-icon-wrapper outline-none">
			        <img src={ bell } alt="notifications" className="icon-img outline-none"
			          onClick={toggleNotification} />
			        <Notification hideFunc={hideNotification} isOpen={isNotificationDropDownOpen}/>
			      </li>
			    </Route>
			  </Switch>
			  <li className="profile-wrapper margin-left-8">
					<span tabIndex={0} onClick={toggleProfileDropDown} className="cursor-pointer">
				    <UserAvatar url={ currentUser.profilePicUrl } size={35}/>
					</span>
			    <ProfileDropDown hideFunc={hideProfileDropDown} hidePointer={true} isOpen={isProfileDropDownOpen} />
			  </li>
			</ul> :
			<div>
				 <span className="btn-primary sign-in-btn" onClick={toggleSignIn}>Sign in</span>
			  { isLoginPageOpen && <Login />}
			</div>
      }
    </>
  );
};
const mapDispatchStateToProps = (dispatch) => ({
  showNotification: () => dispatch(showNotification()),
  hideNotification: () => dispatch(hideNotification()),
  showProfileDropDown: () => dispatch(showProfileDropDown()),
  hideProfileDropDown: () => dispatch(hideProfileDropDown()),
  showLogin: () => dispatch(showLogin()),
  hideLogin: () => dispatch(hideLogin()),
});
const mapStateToProps = ({notification, profileDropDown, loginModal, user}) => ({
  isNotificationDropDownOpen: notification.isOpen,
  isProfileDropDownOpen: profileDropDown.isOpen,
	isLoginPageOpen: loginModal.isOpen,
	currentUser: user.currentUser
});
export default connect(mapStateToProps, mapDispatchStateToProps)(ProfileComponent);
