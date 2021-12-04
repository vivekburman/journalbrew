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
  return axiosPost('api/user-info/follow-request', {
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
export {
  getFollows,
  requestFollow,
  requestUnFollow
}