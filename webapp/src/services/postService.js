import { axiosPost } from '../helpers/httpReq';

const  getPublishedPosts = (userID, start, end) => {
  return axiosPost(`api/user-info/published-posts/${userID}`, {
    filter: {
      rangeStart: start,
      rangeEnd: end
    }
  });
}

const getUnpublishedPosts = () => {

}

const getBookmarks = () => {

}

export {
  getBookmarks,
  getPublishedPosts,
  getUnpublishedPosts
}