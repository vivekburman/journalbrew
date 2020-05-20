import { SHOW_LOGIN, HIDE_LOGIN } from "./login.action";

const handleLoginModal = (state={}, action) => {
  switch(action.type) {
    case SHOW_LOGIN:
    case HIDE_LOGIN:
      return {
        ...state,
        isOpen: action.payload
      };
    default:
      return state;
  }
}
export default handleLoginModal;