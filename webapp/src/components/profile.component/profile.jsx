import React from 'react';
import bell from '../../images/bell.svg';
import user from '../../images/user.svg';
import Notification from '../notification.component/notification.card';
const ProfileComponent = () => {
	return (
		<ul>
			<li style={{ position: 'relative' }}>
				<img src={ bell } alt="notifications" className="icon-img" />
				<Notification />
			</li>
			<li>
				<img src={ user } alt="notifications" className="icon-img" />
			</li>
		</ul>
	);
}
export default ProfileComponent;