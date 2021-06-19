import { axiosPost } from '../helpers/httpReq';

const  getPublishedPosts = (userID, start, end) => {
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


export {
  getBookmarks,
  getPublishedPosts,
  getDrafts,
  getUnderReviewPosts
}