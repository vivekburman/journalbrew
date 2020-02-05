import React, { Component } from 'react';
import AccordianIconComponent from './functional.component/accordianIcon';
import SearchNLogoComponent from '../search.logo.component/search.logo';
import ProfileComponent from '../profile.component/profile';
import './header.component.scss'; 
class Header extends Component {
    render () {
        return (
            <header className="header-component">
                <AccordianIconComponent />
                <SearchNLogoComponent />
                <ProfileComponent />
            </header>
        );
    }
}
export default Header;