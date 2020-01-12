import React, { Component } from 'react';
import NavMenuComponent from './functional.component/navMenu';
import navMenuIcon from '../../images/nav-menu.svg';
class ProfileComponent extends Component {
    constructor (props) {
        super();
        this.handleNavMenuClick = this.handleNavMenuClick.bind(this);
        this.state = {
            navMenuClicked: false,
            hasResized: -1
        };
    }
    handleNavMenuClick (e) {
        this.setState({ hasResized: this.props.hasWindowResized, navMenuClicked: !this.state.navMenuClicked });
    }
    render () {
        const { navMenuClicked, hasResized } = this.state;
        let navMenuDirection = navMenuClicked ? 'column': 'row',
            { hasWindowResized } = this.props;
        if (hasWindowResized !== hasResized) {
            navMenuDirection = ''
        }
        return (
            <nav className="profile">
                <img src={ navMenuIcon } alt="navMenu" className="icon-img navMenu" onClick={this.handleNavMenuClick}/>
                <NavMenuComponent flexDirection={navMenuDirection}/>
            </nav>
        );
    }
}
export default ProfileComponent;