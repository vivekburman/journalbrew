import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from './notification.action';
export const handleNotificationVisibility = (state={}, action) => {
  switch(action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        isOpen: true
      }
    case HIDE_NOTIFICATION:
      return {
        ...state,
        isOpen: false
      }
    default:
      return state;
  }
}
