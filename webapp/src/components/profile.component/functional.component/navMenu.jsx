import React from 'react';
import { connect } from 'react-redux'; 
import bell from '../../../images/bell.svg';
import user from '../../../images/user.svg';
const NavMenuComponent = ({flexDirection}) => {
    const flexClass = flexDirection === 'column' ? 'showNavMenu' : ''; 
    return (
        <ul className={flexClass}>
            <li>
                <img src={ bell } alt="notifications" className="icon-img" />
            </li>
            <li>
                <img src={user} alt="notifications" className="icon-img" />
            </li>
        </ul>
    );
}
const mapStateToProps = ({ notification }) => ({
    notification: notification
});
export default connect(mapStateToProps)(NavMenuComponent);