import React from 'react';
import bell from '../../images/bell.svg';
import user from '../../images/user.svg';
import Notification from '../notification.component/notification.card';
import { showNotification, hideNotification } from '../../reducers/click/notification.action';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';

const ProfileComponent = ({ showNotification, isOpen, hideNotification }) => {
	return (
		<ul>
			<Switch>
				<Route exact path={["/full-story", "/user-profile", "/"]}>
					<li style={{ position: 'relative', outline: 'none' }} onBlur={hideNotification}
						tabIndex={0}>
						<img src={ bell } alt="notifications" className="icon-img" 
						onClick={() => isOpen ? hideNotification() : showNotification()} />
						<Notification />
					</li>
				</Route>
			</Switch>
			<li>
				<Link to='/user-profile'>
					<img src={ user } alt="user" className="icon-img" />
				</Link>
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