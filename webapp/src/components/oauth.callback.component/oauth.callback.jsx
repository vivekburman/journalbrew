import React, { useEffect } from 'react';
import axios from 'axios';
import { setCurrentUser } from '../../reducers/user/user.action';
import { connect } from 'react-redux';
import { TSNEnum } from '../../helpers/tsnenum';
import { withRouter } from 'react-router-dom';
const OauthCallback = ({ setCurrentUser, history }) => {
  useEffect(() => {
    axios.get(`/api/auth/google/redirect${location.search}`)
    .then(({status, data}) => {
      if (status == 200 && data.success) {
        setCurrentUser({
          name: data.username,
          profilePicUrl: data.profilePicUrl,
          token: data.access_token,
          userId: data.userId
        });
        const lastVisitedPage = localStorage.getItem(TSNEnum.LAST_VISITED_PAGE_BEFORE_LOGIN);
        lastVisitedPage && history.push(lastVisitedPage);
      } else {
        // TODO: What to do if not able to login USER
        setCurrentUser(undefined);
      }
    }).catch(err => {
      console.error(err);
    });
  }, []);
  return (
    <div>Please Wait.....</div>
  );
};
const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (payload) => dispatch(setCurrentUser(payload))
});
export default connect(null, mapDispatchToProps)(withRouter(OauthCallback));