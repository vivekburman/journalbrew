import React from 'react';
import bell from '../../images/bell.svg';
import user from '../../images/user.svg';
import Notification from '../notification.component/notification.card';
import { showNotification } from '../../reducers/click/notification.action';
import { connect } from 'react-redux';
const ProfileComponent = ({ showNotification }) => {
	return (
		<ul>
			<li style={{ position: 'relative' }}>
				<img src={ bell } alt="notifications" className="icon-img" onClick={showNotification}/>
				<Notification />
			</li>
			<li>
				<img src={ user } alt="notifications" className="icon-img" />
			</li>
		</ul>
	);
}
const mapDispatchStateToProps = (dispatch) => ({
	showNotification: () => dispatch(showNotification())
})
export default connect(null, mapDispatchStateToProps)(ProfileComponent);