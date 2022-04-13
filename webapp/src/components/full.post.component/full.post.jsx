import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import './full.post.scss';
import bookmark from '../../images/bookmark.svg';
import bookmarked from '../../images/bookmarked.svg';
// import PostReaction from '../user.reaction.component/user.reaction';
import { parseHTMLToReact } from '../../helpers/jsontohtml';
import { UserAvatar } from '../avatar.component/avatar';
// import SocialShare from '../social.share.component/social.share';
import { Tags } from '../tags.component/tags';
import Skeleton from 'react-loading-skeleton';
import { months } from '../../helpers/timeformatter';
import { renderTemplate } from '../news.template.component/news.template';
import { getFullPost } from '../../services/postService';
import Error from '../error.component/error';
import { useParams } from 'react-router';
import { getDisplayName } from '../../helpers/util';
import { TSNEnum } from '../../helpers/tsnenum';
import { useHistory } from 'react-router';
import { getFollows, setBookmark, unsetBookmark, requestFollow, requestUnFollow } from '../../services/userService';

const timeFormatter = (time) => {
  const _time = new Date(time);
  return `${months[_time.getMonth()]} ${_time.getDate()}`;
}
const showArticle = ({ blocks=[] }) => {
  return(
    <>
      { renderTemplate(blocks) }
    </>
  );
}

const displayName = (authorInfo) => getDisplayName(authorInfo.firstName, authorInfo.middleName, authorInfo.lastName);

const FullPost = (props) => {
  const [fullPostInfo, setFullPostInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {userId: userID, postId: postID} = useParams();
  const [follows, setFollows] = useState(TSNEnum.FOLLOW.UNSPECIFIED);
  const [isBookmarked, setBookmarked] = useState(false);
  const [showLoadingFollows, setLoadingFollows] = useState();
  const history = useHistory();
  
  const navigateToUserPage = () => {
    history.push(`/user-profile/${fullPostInfo.authorInfo.authorId}`);
  }

  const isUserLoggedIn = !!props.currentUser?.userId;

  // 1. Fires first time to get data
  useEffect(() => {
    getFullPost(postID, userID)
      .then(({ data }) => {
        setFullPostInfo(data);
        setError(false);
        isUserLoggedIn && setBookmarked(data.isBookmarked);
      })
      .catch((e) => {
        setFullPostInfo();
        setError(true);
      })
      .finally(() =>{
        setLoading(false);
      }); 
  }, []);
  // 2. get Other infos dependent on Basic Info #1
  useEffect(() => {
    if(!isUserLoggedIn) return;
    const getFollowInfo = () => {
      // get Follows
      getFollows({
        followerId: props.currentUser.userId,
        followingId: fullPostInfo.authorInfo.authorId
      })
      .then(({ data }) => {
        if (data.success) {
          setFollows(TSNEnum.FOLLOW.FOLLOWS);
        } else {
          setFollows(TSNEnum.FOLLOW.NOT_FOLLOWS);
        }
      })
      .catch(() => {
        setFollows(TSNEnum.FOLLOW.UNSPECIFIED);
      }).finally(() => {
        setLoadingFollows(false);
      });
    }
    if (!props.currentUser?.token || !props.currentUser?.userId || !fullPostInfo?.authorInfo) {
      setLoadingFollows(false);
      setFollows(TSNEnum.FOLLOW.UNSPECIFIED);
      return;
    }
    if (props.currentUser.userId === fullPostInfo.authorInfo.authorId) {
      setFollows(TSNEnum.FOLLOW.UNSPECIFIED);
    } else {
      getFollowInfo();
    }
  }, [fullPostInfo]);

  const followRequest = () => {
    if (!props.currentUser?.userId || !fullPostInfo?.authorInfo?.authorId) {
      return;
    }
    const currentState = follows;
    setLoadingFollows(true);
    requestFollow({
      followerId: props.currentUser.userId,
      followingId: fullPostInfo.authorInfo.authorId
    }).then(({ data }) => {
      data.success ? setFollows(TSNEnum.FOLLOW.FOLLOWS) : setFollows(currentState);
    }).catch(() => {
      setFollows(currentState);
    }).finally(() => {
      setLoadingFollows(false);
    });
  }
  const unfollowRequest = () => {
    if (!props.currentUser?.userId || !fullPostInfo?.authorInfo?.authorId) {
      return;
    }
    const currentState = follows;
    setLoadingFollows(true);
    requestUnFollow({
      followerId: props.currentUser.userId,
      followingId: fullPostInfo.authorInfo.authorId
    }).then(({ data }) => {
      data.success ? setFollows(TSNEnum.FOLLOW.NOT_FOLLOWS) : setFollows(currentState);
    }).catch(() => {
      setFollows(currentState);
    }).finally(() => {
      setLoadingFollows(false);
    });
  }
  const toggleBookmark = () => {
    !isBookmarked ? doBookmark() : undoBookmark();
  }
  const doBookmark = () => {
    if (!props.currentUser?.userId || !postID) {
      return;
    }
    setBookmark({
      userID: props.currentUser.userId,
      postID: postID
    }).then(({ data }) => {
      data.success && setBookmarked(true);
    });
  }
  const undoBookmark = () => {
    if (!props.currentUser?.userId || !postID) {
      return;
    }
    unsetBookmark({
      userID: props.currentUser.userId,
      postID: postID
    }).then(({ data }) => {
      data.success && setBookmarked(false);
    });
  }

  return(
    <>
      {
        loading ? 
        <div className="flex-row-nowrap full-post-container justify-content-evenly">
          <div className="flex-column-nowrap flex-grow-2 full-news">
            <div>
              <Skeleton height={100} />
              <section style={{ margin: '30px 0', lineHeight: 1.5 }}>
                <Skeleton count={3} />
              </section>
              <Skeleton circle={true} height={30} width={30} />
              <div style={{margin: '30px 0', lineHeight: 1.5}}>
                <Skeleton height={200} />
                <Skeleton count={3} />
              </div>
            </div>
          </div>
        </div>
        :
        error ?
        <Error />
        :
        <div className="flex-row-nowrap full-post-container">
          <div className="flex-column-nowrap flex-grow-2 full-news">
            <div>
              <h1 className="news-heading">{parseHTMLToReact(fullPostInfo.metaInfo.title)}</h1>
              <div>
                <div className="full-story-profile-wrapper justify-content-between">
                  <div className="flex-row-nowrap align-items-flexstart">
                    <div className='flex-row-nowrap align-items-center cursor-pointer'
                    onClick={navigateToUserPage}>
                      <UserAvatar size={50} url={fullPostInfo.authorInfo.profilePicUrl} userName={displayName(fullPostInfo.authorInfo)}/>
                      <div className='padding-left-10'>
                        <div className="username">{displayName(fullPostInfo.authorInfo)}</div>
                        <div className="flex-row align-items-center">
                          <span className="news-location">{ fullPostInfo.metaInfo.location }</span>
                          <span className="separator">&#8226;</span>
                          <span className="news-time-of-post">{ timeFormatter(fullPostInfo.metaInfo.createdAt) }</span>
                        </div>
                      </div>
                    </div>
                    { 
                      follows === TSNEnum.FOLLOW.UNSPECIFIED ? <></> 
                      : follows === TSNEnum.FOLLOW.FOLLOWS ? 
                      <span className={"following ts--top-align-5 " + (showLoadingFollows ? "tsn-loading" : "")} 
                      onClick={unfollowRequest}>Following</span> 
                      : <span className={"follow ts--top-align-5 " + (showLoadingFollows ? "tsn-loading" : "")} onClick={followRequest}>Follow</span> 
                    }
                  </div>
                  <div className="full-story-top-items-wrapper flex-column-nowrap">
                    <div className="flex-row-nowrap social-share-wrapper">
                      {
                        isUserLoggedIn ?
                        <>
                          <img src={ isBookmarked ? bookmarked : bookmark} alt="bookmark" className="icon-img padding-left-0" 
                          onClick={toggleBookmark}/>
                          {/* <SocialShare location={'top'}/> */}
                        </>
                        :
                        <></>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <section>{showArticle(fullPostInfo.postInfo.fullStory)}</section>
              <hr />
            </div>
            <div className='margin-top-10'>
              <Tags tags={fullPostInfo.metaInfo.tags}/>
            </div>
            <div>
              <div className="margin-top-10">
                <div className="full-story-profile-wrapper-bottom justify-content-between">
                  {/* <div className="flex-row-nowrap padding-top-8">
                    <PostReaction likes={fullPostInfo.metaInfo.likes} hasUserLiked={false} showViews={true} views={fullPostInfo.metaInfo.views}/>
                  </div> */}
                  <div className="flex-row-nowrap justify-content-between align-items-center">
                    <div className="flex-row-nowrap align-items-center padding-top-8 cursor-pointer"
                    onClick={navigateToUserPage}>
                      <UserAvatar size={50} url={fullPostInfo.authorInfo.profilePicUrl} 
                      userName={displayName(fullPostInfo.authorInfo)}/>
                      <div className="flex-column-nowrap margin-left-8">
                        <span className="written-by">Written By</span>
                        <span className="username">{displayName(fullPostInfo.authorInfo)}</span>
                      </div>
                    </div>
                    { 
                      follows === TSNEnum.FOLLOW.UNSPECIFIED ? <></> 
                      : follows === TSNEnum.FOLLOW.FOLLOWS ? 
                      <span className={"following " + (showLoadingFollows ? "tsn-loading" : "")} 
                      onClick={unfollowRequest}>Following</span> 
                      : <span className={"follow " + (showLoadingFollows ? "tsn-loading" : "")} onClick={followRequest}>Follow</span> 
                    }
                  </div>
                  <div className="flex-row-nowrap social-share-bottom-wrapper padding-top-8">
                  {
                    isUserLoggedIn ?
                    <>
                      <img src={ isBookmarked ? bookmarked : bookmark} alt="bookmark" 
                      className="icon-img padding-left-0" 
                      onClick={toggleBookmark}/>
                      {/* <SocialShare location={'bottom'}/> */}
                    </>
                    :
                    <></>
                  }
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      }
    </>
  )
}
const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});
export default connect(mapStateToProps)(FullPost);