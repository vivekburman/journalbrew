import React from 'react';
import bell from '../../images/bell.svg';
import user from '../../images/user.svg';
const ProfileComponent = () => {
	return (
		<ul>
			<li>
				<img src={ bell } alt="notifications" className="icon-img" />
			</li>
			<li>
				<img src={ user } alt="notifications" className="icon-img" />
			</li>
		</ul>
	);
}
export default ProfileComponent;