import React from 'react';
import { withRouter } from 'react-router-dom';
import backBtn from '../../images/return.svg';

const Back = ({ history }) => {
  const goBack = () => {
    history.goBack()
  };
  return(
    <img data-test="back-icon" src= {backBtn} className="icon-img" alt="return"
     onClick={goBack} ></img>
  );
}
export default withRouter(Back);