import { connect } from "react-redux";
import React from 'react';
import Login from '../login.component/login';

const withAuth = (WrappedComponent) => {
  const mapStateToProps = ({user}) => ({
    currentUser: user.currentUser
  });
  return connect(mapStateToProps)((props) => {
    return (
      <>
      {props.currentUser === undefined ? <Login allowToClose={false} /> : 
      props.currentUser === false ? <></> : <WrappedComponent currentUser={props.currentUser} {...props} />}
      </>
    )
  });
};

export default withAuth;