import React from 'react';
import { withRouter } from 'react-router-dom';
import backBtn from '../../images/return.svg';

const Back = ({ history }) => {
  return(
    <img src= {backBtn} className="icon-img" alt="return"
     onClick={() => history.goBack()} ></img>
  );
}
export default withRouter(Back);