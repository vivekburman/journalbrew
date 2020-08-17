import React from 'react';
import google from '../../images/login/google.svg';
import facebook from '../../images/login/facebook.svg';
import twitter from '../../images/login/twitter.svg';
import './login.component.scss';
import { hideLogin } from '../../reducers/click/login.action';
import { useLocation } from 'react-router';
import close from '../../images/close.svg';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useRef } from 'react';
import { TSNEnum } from '../../helpers/tsnenum';

const Login = ({ hideLogin }) => {
  const ref = useRef();
  const location = useLocation();

  useEffect(() => {
    ref.current && ref.current.focus();
  });
  const saveLastVisitedRoute = () => {
    localStorage.setItem(TSNEnum.LAST_VISITED_PAGE_BEFORE_LOGIN, location.pathname);
  };
  return (
    <div className="login-wrapper outline-none" onBlur={hideLogin} tabIndex={-1}>
      <img src={close} alt="close" className="icon-img icon-img-close float-right" onClick={hideLogin}/>
      <h2 className="header">Join Us</h2>

      <p className="login-phrase">
        Sign in to share news, express your opinions and create awareness about things that matter the most to you.
      </p>
      <div ref={ref} className="login-options-wrapper flex flex-column-nowrap">
        <a href="/api/auth/google" onClick={saveLastVisitedRoute} className="link login-options-item flex flex-row-nowrap align-items-center">
          <img src={google} alt="google" className="login-logo"/>
          <div>Continue with Google</div>
        </a>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  hideLogin: () => dispatch(hideLogin()),
})
export default connect(null, mapDispatchToProps)(Login);