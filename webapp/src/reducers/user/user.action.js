const USER = 'USER';
const USER_LOGIN = 'USER_LOGIN';
const USER_LOGOUT = "USER_LOGOUT";

const setCurrentUser = (payload) => ({
    type: USER,
    payload
});

const loginUser = (payload) => ({
  type: USER_LOGIN,
  payload
});

const logoutUser = () => ({
  type: USER_LOGOUT
});

export {
  USER,
  USER_LOGIN,
  USER_LOGOUT,
  setCurrentUser,
  loginUser,
  logoutUser
};