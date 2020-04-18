import React from 'react';
import AccordianIconComponent from './functional.component/accordianIcon';
import SearchNLogoComponent from '../search.logo.component/search.logo';
import ProfileComponent from '../profile.component/profile';
import './header.component.scss'; 
import { Switch, Route } from 'react-router-dom';
import PublishPreview  from '../publish.preview.component/publish.preview';
export const Header = () => {
  return (
    <header className="header-component">
      <AccordianIconComponent />
      <SearchNLogoComponent />
      <nav className="m-right-12-27sm top-nav">
        <Switch>
          <Route exact path="/new-story">
            <PublishPreview />
          </Route>
        </Switch>
        <ProfileComponent />
      </nav>
    </header>
  );
}
export default Header;