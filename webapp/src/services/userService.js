import { axiosPost, axiosPut, axiosDelete } from '../helpers/httpReq';
import { getToken } from './tokenService';
const getFollows = ({ followerId, followingId }) => {
  return axiosPost('api/user-info/following', {
    followerId: followerId,
    followingId: followingId
  }, {
    headers: {
      'Authorization': getToken(),
    }
  })
}
const requestFollow = ({ followerId, followingId }) => {
  return axiosPut('api/user-info/follow-request', {
    followerId: followerId,
    followingId: followingId
  }, {
    headers: {
      'Authorization': getToken(),
    }
  })
}
const requestUnFollow = ({ followerId, followingId }) => {
  return axiosDelete('api/user-info/unfollow-request', {
    data: {
      followerId: followerId,
      followingId: followingId
    },
    headers: {
      'Authorization': getToken()
    }
  })
}
const isBookmarked = ({ userID, postID }) => {
  return axiosPost('api/user-info/bookmarked', {
    userId: userID,
    postId: postID
  }, {
    headers: {
      'Authorization': getToken()
    }
  })
}
const setBookmark = ({ userID, postID }) => {
  return axiosPut('api/user-info/add-bookmark', {
    userId: userID,
    postId: postID
  }, {
    headers: {
      'Authorization': getToken()
    }
  })
}
const unsetBookmark = ({ userID, postID }) => {
  return axiosDelete('api/user-info/delete-bookmark', {
    data: {
      userId: userID,
      postId: postID
    },
    headers: {
      'Authorization': getToken()
    }
  })
}
export {
  getFollows,
  requestFollow,
  requestUnFollow,
  unsetBookmark,
  setBookmark,
  isBookmarked
}