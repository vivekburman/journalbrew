const SHOW_PROFILE_DROPDOWN = 'SHOW_PROFILE_DROPDOWN';
const HIDE_PROFILE_DROPDOWN = 'HIDE_PROFILE_DROPDOWN';

const showProfileDropDown = () => ({
  type: SHOW_PROFILE_DROPDOWN,
  payload: true
});
const hideProfileDropDown = () => ({
  type: HIDE_PROFILE_DROPDOWN,
  payload: false
});

export {
  SHOW_PROFILE_DROPDOWN,
  HIDE_PROFILE_DROPDOWN,
  showProfileDropDown,
  hideProfileDropDown
};