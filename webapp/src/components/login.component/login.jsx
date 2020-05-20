import React from 'react';
import google from '../../images/login/google.svg';
import facebook from '../../images/login/facebook.svg';
import twitter from '../../images/login/twitter.svg';
import './login.component.scss';
import { useState } from 'react';
import { hideLogin } from '../../reducers/click/login.action';
import close from '../../images/close.svg';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useRef } from 'react';

const signInStr = (type, up=false) => {
  return `Sign ${up ? 'up' : 'in'} with ${type}`;
}

const Login = ({ hideLogin }) => {

  const [up, setUp] = useState(false);
  const ref = useRef();
  useEffect(() => {
    ref.current && ref.current.focus();
  })
  
  return (
    <div className="login-wrapper outline-none" onBlur={hideLogin} tabIndex={0}
    ref={ref}>
      <img src={close} alt="close" className="icon-img icon-img-close float-right" onClick={hideLogin}/>
      <h2 className="header">{ up ? 'Join Us' : 'Welcome Back' }</h2>
      <p className="login-phrase">
      {
        !up ? 
        
        'Sign in to share news, express your opinions and create awareness about things that matter the most to you.'
        :
        'Sign up to get notified on newly published articles of people you follow, interact with stories and many more.'
        
      }
      </p>
      <ul className="login-options-wrapper flex flex-column-nowrap">
        <li className="login-options-item flex flex-row-nowrap align-items-center">
          <img src={google} alt="google" className="login-logo"/>
          <div>{ signInStr('Google', up) }</div>
        </li>
        <li className="login-options-item flex flex-row-nowrap align-items-center">
          <img src={facebook} alt="facebook" className="login-logo" />
          <div>{ signInStr('Facebook', up) }</div>
        </li>
        <li className="login-options-item flex flex-row-nowrap align-items-center">
          <img src={twitter} alt="twitter" className="login-logo"/>
          <div>{ signInStr('Twitter', up) }</div>
        </li>
      </ul>
      <div className="footer">
        <span>{ !up ? "Don't have an account? " : "Already have an account? "}</span>
        <span className="create-one" onClick={() => setUp(!up)}>{ !up ? 'Create One' : 'Sign In'}</span>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  hideLogin: () => dispatch(hideLogin()),
})
export default connect(null, mapDispatchToProps)(Login);