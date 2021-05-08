import axios from 'axios';
const silentRefresh = (setCurrentUser) => {
  return new Promise((resolve, reject) => {
    if (!setCurrentUser || typeof setCurrentUser != 'function') {
      return reject();
    }
    axios.post("/api/auth/refresh-token")
    .then(({status, data}) => {
        if(status == 200 && data.success) {
          setCurrentUser({
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            userId: data.userId,
            profilePicUrl: data.profilePicUrl,
            token: data.access_token
          });
          resolve();
        } else {
            setCurrentUser(undefined)
            reject();
        }
    }).catch(err => {
        setCurrentUser(undefined);
        console.error(err);
        reject();
    });
  }); 
}

export default silentRefresh;