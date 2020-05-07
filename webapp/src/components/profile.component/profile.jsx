import React from 'react';
import bell from '../../images/bell.svg';
import user from '../../images/user.svg';
import Notification from '../notification.component/notification.card';
import { showNotification, hideNotification } from '../../reducers/click/notification.action';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
const ProfileComponent = ({ showNotification, isOpen, hideNotification }) => {
	return (
		<ul>
			<Switch>
				<Route exact path="/full-story">
					<li style={{ position: 'relative' }}>
						<img src={ bell } alt="notifications" className="icon-img" 
						onClick={() => isOpen ? hideNotification() : showNotification()} 
						tabIndex="0" />
						<Notification />
					</li>
				</Route>
				<Route exact path="/user-profile">
					<li style={{ position: 'relative' }}>
						<img src={ bell } alt="notifications" className="icon-img" 
						onClick={() => isOpen ? hideNotification() : showNotification()} 
						tabIndex="0" />
						<Notification />
					</li>
				</Route>
				<Route exact path="/">
					<li style={{ position: 'relative' }}>
						<img src={ bell } alt="notifications" className="icon-img" 
						onClick={() => isOpen ? hideNotification() : showNotification()} 
						tabIndex="0" />
						<Notification />
					</li>
				</Route>
			</Switch>
			<li>
				<img src={ user } alt="notifications" className="icon-img" />
			</li>
		</ul>
	);
}
const mapDispatchStateToProps = (dispatch) => ({
	showNotification: () => dispatch(showNotification()),
	hideNotification: () => dispatch(hideNotification()),
});
const mapStateToProps = ({ notification }) => ({
	isOpen: notification.isOpen
})
export default connect(mapStateToProps, mapDispatchStateToProps)(ProfileComponent);