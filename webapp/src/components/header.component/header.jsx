import React, { Component } from 'react';
import AccordianIconComponent from './functional.component/accordianIcon';
import SearchNLogoComponent from './functional.component/search.logo';
import ProfileComponent from './functional.component/profile';
import './header.component.scss'; 
class Header extends Component {
    constructor() {
        super();
        this.state = {
            windowWidth: 0,
            hasWindowResized: 0       
        }
        this.updateWindowSize = this.updateWindowSize.bind(this);
    }
    componentDidMount() {
        this.updateWindowSize();
        window.addEventListener('resize', this.updateWindowSize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowSize);
    }
    updateWindowSize() {
        if (this.state.windowWidth !== window.innerWidth) {
            this.setState({ windowWidth: window.innerWidth, hasWindowResized: this.state.hasWindowResized + 1 });
        }
    }
    render () {
        const { windowWidth, hasWindowResized } = this.state;
        return (
            <header className="header-component">
                <AccordianIconComponent showIcon= {windowWidth < 768 ? true : false}/>
                <SearchNLogoComponent 
                    windowWidth={windowWidth}
                    hasWindowResized={hasWindowResized} />
                <ProfileComponent hasWindowResized={hasWindowResized}/>
            </header>
        );
    }
}
export default Header;