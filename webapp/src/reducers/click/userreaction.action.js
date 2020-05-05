const LIKED = 'LIKED';
const DISLIKED = 'DISLIKED';

const userLiked = () => ({  
  type: LIKED,
  payload: true
});
const userDisliked = () => ({
  type: DISLIKED,
  payload: false
});
export {
  LIKED,
  DISLIKED,
  userDisliked,
  userLiked
};