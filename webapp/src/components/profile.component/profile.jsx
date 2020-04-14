import React from 'react';
import bell from '../../images/bell.svg';
import user from '../../images/user.svg';
const ProfileComponent = () => {
	return (
		<nav className="profile">
			<ul>
				<li>
					<img src={ bell } alt="notifications" className="icon-img" />
				</li>
				<li>
					<img src={user} alt="notifications" className="icon-img" />
				</li>
        </ul>
		</nav>
	);
}
export default ProfileComponent;