import Axios from 'axios';
import { setCurrentUser } from '../reducers/user/user.action';
import store from '../store';
import { getToken } from './tokenService';

const silentRefresh = () => {
  return new Promise((resolve, reject) => {
    if (!setCurrentUser || typeof setCurrentUser != 'function') {
      return reject();
    }
    Axios.post("/api/auth/refresh-token")
    .then(({status, data}) => {
        if(status == 200 && data.success) {
          store.dispatch(setCurrentUser({
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            userId: data.userId,
            profilePicUrl: data.profilePicUrl,
            token: data.access_token
          })); 
          resolve();
        } else {
          store.dispatch(setCurrentUser(undefined));
          reject();
        }
    })
    .catch(e => {
      store.dispatch(setCurrentUser(undefined));
      return reject();
    });
  }); 
}

export const createAxiosInterceptor = async () => {
  let _retry = false;
  Axios.interceptors.response.use((response) => { 
    _retry = false;
    return response;
  }, async (error) => {
    if (error.response.status !== 401) {
      _retry = false;
      return Promise.reject(error);
    }
    if (_retry) {
      _retry = false;
      return Promise.reject(error);
    }
    // else its unauthorized try to do refresh token
    _retry = true;
    try {
      await silentRefresh();
    }catch(e) {
      _retry = false;
      return Promise.reject(error);
    }
    //update token header if its there
    if (error.config.headers.Authorization) {
      error.config.headers.Authorization = getToken();
    }
    const response = await Axios.request(error.config);
    return {
      data: response.data,
      status: response.status
    };
  });
  _retry = true;
  try {
    await silentRefresh();
  }catch(e) {
    _retry = false;
    return Promise.reject(e);
  }
}
