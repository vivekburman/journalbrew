import { axiosPost, axiosGet, axiosPatch } from '../helpers/httpReq';

const getPublishedPosts = (userID, start, end) => {
  return axiosPost(`api/user-info/published-posts/`, {
    userId: userID,
    filter: {
      rangeStart: start,
      rangeEnd: end
    }
  });
}

const getUnderReviewPosts = (userID, start, end, token) => {
  return axiosPost(`api/user-info/underreview-posts/`, {
    userId: userID,
    filter: {
      rangeStart: start,
      rangeEnd: end
    }
  }, {
    headers: {
      'Authorization': token
    }
  });
}

const getBookmarks = (userID, start, end, token) => {
  return axiosPost(`api/user-info/bookmarks/`, {
    userId: userID,
    filter: {
      rangeStart: start,
      rangeEnd: end
    }
  }, {
    headers: {
      'Authorization': token
    }
  });
}

const getDrafts = (userID, start, end, token) => {
  return axiosPost(`api/user-info/drafts/`, {
    userId: userID,
    filter: {
      rangeStart: start,
      rangeEnd: end
    }
  }, {
    headers: {
      'Authorization': token
    }
  });
}

const getDraftById = (postId, token) => {
  return axiosGet(`api/post/get-post?postId=${postId}`, {
    headers: {
      'Authorization': token
    }
  });
}

const updatePostById = (data, postId, token) => {
  return axiosPatch('api/post/update-post', {
    storypatchData: data,
    postId: postId
  },  {
    headers: {
      'Authorization': token
    }
  });
}

const createPostById = (data, token) => {
  return axiosPost('api/post/create-post', {
    postStory: data
  }, {
    headers: {
      'Authorization': token
    }
  });
}

export {
  getBookmarks,
  getPublishedPosts,
  getDrafts,
  getUnderReviewPosts,
  getDraftById,
  updatePostById,
  createPostById
}