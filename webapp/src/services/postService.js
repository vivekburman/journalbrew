import { axiosPost, axiosGet, axiosPatch, axiosDelete } from '../helpers/httpReq';
import { getToken } from './tokenService';

const getPublishedPosts = (userID, start, end) => {
  return axiosPost(`api/user-info/published-posts/`, {
    userId: userID,
    filter: {
      rangeStart: start,
      rangeEnd: end
    }
  });
}

const getUnderReviewPosts = (userID, start, end) => {
  return axiosPost(`api/user-info/underreview-posts/`, {
    userId: userID,
    filter: {
      rangeStart: start,
      rangeEnd: end
    }
  }, {
    headers: {
      'Authorization': getToken()
    }
  });
}

const getBookmarks = (userID, start, end) => {
  return axiosPost(`api/user-info/bookmarks/`, {
    userId: userID,
    filter: {
      rangeStart: start,
      rangeEnd: end
    }
  }, {
    headers: {
      'Authorization': getToken()
    }
  });
}

const getDrafts = (userID, start, end) => {
  return axiosPost(`api/user-info/drafts/`, {
    userId: userID,
    filter: {
      rangeStart: start,
      rangeEnd: end
    }
  }, {
    headers: {
      'Authorization': getToken()
    }
  });
}

const getDraftById = (postId) => {
  return axiosGet(`api/post/get-post?postId=${postId}`, {
    headers: {
      'Authorization': getToken()
    }
  });
}

const getFullPost = (postId, authorId) => {
  const token = getToken();
  return token ? axiosPost(`api/post/view-post`, {
      userId: authorId,
      postId: postId
    }, {
      headers: {
        'Authorization': token
      }
  }) :
  axiosGet(`api/post/view-post?postId=${postId}`);
}

const updatePostById = (data, postId) => {
  return axiosPatch('api/post/update-post', {
    storypatchData: data,
    postId: postId
  },  {
    headers: {
      'Authorization': getToken()
    }
  });
}

const createPostById = (data) => {
  return axiosPost('api/post/create-post', {
    postStory: data
  }, {
    headers: {
      'Authorization': getToken()
    }
  });
}

const deleteDraft = (draftID, userID) => {
  return axiosDelete('api/user-info/draft/delete', {
    data: {
      userId: userID,
      draftId: draftID
    },
    headers: {
      'Authorization': getToken()
    }
  })
}
const publishPost = (data) => {
  return axiosPost('api/post/publish-post', data, {
    headers: {
      'Authorization': getToken(),
      'Content-Type': 'multipart/form-data'
    }
  })
}

export {
  getBookmarks,
  getPublishedPosts,
  getDrafts,
  getUnderReviewPosts,
  getDraftById,
  updatePostById,
  createPostById,
  deleteDraft,
  publishPost,
  getFullPost
}