import { SHOW_PROFILE_DROPDOWN, HIDE_PROFILE_DROPDOWN } from "./profile.dropdown.action";

const handleProfileDropDown = (state={}, action) => {
  switch(action.type) {
    case SHOW_PROFILE_DROPDOWN:
    case HIDE_PROFILE_DROPDOWN:
      return {
        ...state,
        isOpen: action.payload
      };
    default:
      return state; 
  }
}
export default handleProfileDropDown;