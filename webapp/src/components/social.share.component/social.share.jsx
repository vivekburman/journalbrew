import React from 'react';
import facebook from '../../images/facebook.svg';
import twitter from '../../images/twitter.svg';
import linkedIn from '../../images/linkedIn.svg';
import { Link } from 'react-router-dom';

export const SocialShare = () => {
  return(
    <div className="flex flex-row-nowrap">
      <Link to=''>
        <img src={twitter} alt="twitter" className="icon-img"/>
      </Link>
      <Link to=''>
        <img src={facebook} alt="facebook" className="icon-img"/>
      </Link>
      <Link to=''>
        <img src={linkedIn} alt="linkedIn" className="icon-img"/>
      </Link>
    </div>
  );
}