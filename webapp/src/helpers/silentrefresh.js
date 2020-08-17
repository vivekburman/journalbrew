import axios from "axios"
import { setCurrentUser } from '../../reducers/user/user.action';


const silentRefresh = () => {
  axios.post("/api/auth/refresh-token")
  .then(({status, data}) => {
      if(status == 200 && data.success) {
        setCurrentUser({
          name: data.username,
          profilePicUrl: data.profilePicUrl,
          token: data.access_token
        });
      }
  }).catch(err => {
    console.error(err);
  });
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (payload) => dispatch(setCurrentUser(payload))
});
export default connect(null, mapDispatchToProps)(silentRefresh);