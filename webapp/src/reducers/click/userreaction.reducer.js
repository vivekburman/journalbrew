import { LIKED, DISLIKED } from "./userreaction.action";

export const handleUserReaction = (state={}, action) => {
  switch (action.type) {
    case LIKED:
      return {
        ...state,
        hasUserLiked: action.payload
      };      
    case DISLIKED: 
      return {
        ...state,
        hasUserLiked: action.payload
      };
    default:
      return state;
  }
};
