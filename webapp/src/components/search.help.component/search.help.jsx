import React from 'react';
import withFocusBlur from '../focus.blur.hoc.component/focus.blur';
import './search.help.scss';
const SearchHelp = () => {
  return (
    <div className='search-help-container'>
      <header className='help-title font-roboto margin-top-10 margin-bottom-10'>
        How to Search?
      </header>
      <ul className='ul-default search-options'>
        <li className='search-item margin-bottom-10 font-roboto'>
          Search by Title (default) example: <strong><em>India's economic survery 2021</em></strong>
        </li>
        <li className='search-item margin-bottom-10 font-roboto'>
          Search by Tags example: <strong><em>#economy</em></strong>
        </li>
        <li className='search-item margin-bottom-10 font-roboto'>
          Search by Location example: <strong><em>$Delhi, India</em></strong>
        </li>
        <li className='search-item margin-bottom-10 font-roboto'>
          Search by Time example: <strong><em>05:11:2021-07:12:2021</em></strong>
        </li>
        <li className='search-item margin-bottom-10 font-roboto'>
          Search by AND example: <strong><em>#economy&05:11:2021-07:12:2021</em></strong>
        </li>
      </ul>
    </div>
  );
};

export default withFocusBlur(SearchHelp);