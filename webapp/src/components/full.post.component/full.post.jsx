import React, { useRef, useEffect, useState } from 'react';
import './full.post.scss';
import bookmark from '../../images/bookmark.svg';
import PostReaction from '../user.reaction.component/user.reaction';
import { parseHTMLToReact } from '../../helpers/jsontohtml';
import { UserAvatar } from '../avatar.component/avatar';
import SocialShare from '../social.share.component/social.share';
import { Tags } from '../tags.component/tags';
import Skeleton from 'react-loading-skeleton';
import { months } from '../../helpers/timeformatter';
import { renderTemplate } from '../news.template.component/news.template';
import { getFullPost } from '../../services/postService';
import Error from '../error.component/error';
import { useParams } from 'react-router';
import { getDisplayName } from '../../helpers/util';

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
export const FullPost = (props) => {
  const [fullPostInfo, setFullPostInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {userId: userID, postId: postID} = useParams();

  useEffect(() => {
    getFullPost(postID, userID)
    .then(({ data }) => {
      setFullPostInfo(data);
      setError(false);
    })
    .catch(e => {
      setFullPostInfo();
      setError(true);
    })
    .finally(() =>{
      setLoading(false);
    }); 
  }, []);

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
                  <div className="flex flex-row-nowrap align-items-center">
                    <UserAvatar size={50} url={fullPostInfo.authorInfo.profilePicUrl} userName={displayName(fullPostInfo.authorInfo)}/>
                    <div className="flex flex-column-nowrap padding-8">
                    <div className="flex flex-row-nowrap align-items-center" >
                      <span className="username">{displayName(fullPostInfo.authorInfo)}</span>
                      {/* { hasUserFollowed ? <span className="following">Following</span> : <span className="follow">Follow</span> } */}
                    </div>
                      <div className="flex flex-row align-items-center">
                        <span className="news-location">{ fullPostInfo.metaInfo.location }</span>
                        <span className="separator">&#8226;</span>
                        <span className="news-time-of-post">{ timeFormatter(fullPostInfo.metaInfo.createdAt) }</span>
                      </div>
                    </div>
                  </div>
                  <div className="full-story-top-items-wrapper flex flex-column-nowrap">
                    <div className="flex flex-row-nowrap social-share-wrapper">
                      <img src={bookmark} alt="bookmark" className="icon-img padding-left-0" />
                      <SocialShare location={'top'}/>
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
              <div className="full-story-profile-wrapper-bottom justify-content-between">
                <div className="full-story-profile-wrapper justify-content-between">
                  <div className="flex flex-row-nowrap padding-top-8">
                    <PostReaction likes={fullPostInfo.metaInfo.likes} hasUserLiked={false} showViews={true} views={fullPostInfo.metaInfo.views}/>
                  </div>
                  <div className="flex flex-row-nowrap social-share-bottom-wrapper padding-top-8">
                    <img src={bookmark} alt="bookmark" className="icon-img" />
                    <SocialShare location={'bottom'}/>
                  </div>
                </div>
                <div className="flex flex-row-nowrap justify-content-between align-items-center">
                  <div className="flex flex-row-nowrap align-items-center padding-top-8">
                    <UserAvatar size={50} url={fullPostInfo.authorInfo.profilePicUrl} userName={displayName(fullPostInfo.authorInfo)}/>
                    <div className="flex flex-column-nowrap margin-left-8">
                      <span className="written-by">Written By</span>
                      <span className="username">{displayName(fullPostInfo.authorInfo)}</span>
                    </div>
                  </div>
                  {/* { !hasUserFollowed ? <span className="following">Following</span> : <span className="follow">Follow</span> } */}
                </div>
              </div>
            </div>
          </div>
      </div>
      }
    </>
  )
}
