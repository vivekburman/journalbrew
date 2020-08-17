const { USER, USER_LOGIN, USER_LOGOUT } = require("./user.action");

const handleSetCurrentUser = (state={}, action) => {
  switch(action.type) {
    case USER:
      return {
        ...state,
        currentUser: action.payload
      };
    case USER_LOGOUT: 
      return {
        ...state,
        currentUser: null,
      };
    default:
      return state;
  }
};

export default handleSetCurrentUser;