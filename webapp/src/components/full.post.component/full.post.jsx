import React, { useRef, useEffect, useState } from 'react';
import './full.post.scss';
import bookmark from '../../images/bookmark.svg';
import PostReaction from '../user.reaction.component/user.reaction';
import { postData } from './dummydata';
import { parseHTMLToReact } from '../../helpers/jsontohtml';
import { UserAvatar } from '../avatar.component/avatar';
import { createPost } from '../../helpers/generateHTMLView';
import SocialShare from '../social.share.component/social.share';
import { Tags } from '../tags.component/tags';
import Skeleton from 'react-loading-skeleton';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const timeFormatter = (time) => {
  const _time = new Date(time);
  return `${months[_time.getMonth()]} ${_time.getDate()}`;
}
const showArticle = (blocks) => {
  const _blocks = blocks.slice(1);
  return(
    <>
      { createPost(_blocks) }
    </>
  );
}

const useOnScreen = (options) => {
  const ref = useRef();
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, options);
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    }
  }, [ref, options])
  return [ref, visible]
};
export const FullPost = (props) => {
  const [ref, visible] = useOnScreen({ threshold: 0 });
  const { hasUserLiked=false, post=postData, hasUserFollowed } = props;
  const metaData = post.metaData;
  const article = post.blocks;
  if (!article) {
    return (
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
    );
  } 
  return(
    <div className="flex-row-nowrap full-post-container">
      <div className="post-reaction-container">
        {!visible && <div className="news-reaction-bookmark">
          <PostReaction likes={metaData.likes} 
            hasUserLiked={hasUserLiked} 
            showViews={true} 
            views={metaData.views}
            direction='column'/>
          <img src={bookmark} alt="bookmark" className="icon-img" />
        </div>}
      </div>
      <div className="flex-column-nowrap flex-grow-2 full-news">
        <div>
          <h1 className="news-heading">{parseHTMLToReact(article[0].data.text)}</h1>
          <div>
            <div className="full-story-profile-wrapper justify-content-between">
              <div className="flex flex-row-nowrap align-items-center ">
                <UserAvatar id={metaData.userID} type={metaData.typeOfID} size={50}/>
                <div className="flex flex-column-nowrap padding-8">
                 <div className="flex flex-row-nowrap align-items-center" >
                  <span className="username">{metaData.userName}</span>
                  { hasUserFollowed ? <span className="following">Following</span> : <span className="follow">Follow</span> }
                 </div>
                  <div className="flex flex-row align-items-center">
                    <span className="news-location">{ metaData.location }</span>
                    <span className="separator">&#8226;</span>
                    <span className="news-time-of-post">{ timeFormatter(metaData.time) }</span>
                  </div>
                </div>
              </div>
              <SocialShare location={'top'}/>  
            </div>
          </div>
          <section>{showArticle(article)}</section>
          <hr ref={ref}/>
        </div>
        <div>
          <Tags tags={['Nokia', 'Telecommunication', 'India', 'XP13']}/>
        </div>
        <div>
          <div className="full-story-profile-wrapper-bottom justify-content-between">
            <div className="full-story-profile-wrapper justify-content-between">
              <div className="flex flex-row-nowrap padding-top-8">
                <PostReaction likes={metaData.likes} hasUserLiked={hasUserLiked} showViews={true} views={metaData.views}/>
              </div>
              <div className="flex flex-row-nowrap social-share-wrapper padding-top-8">
                <img src={bookmark} alt="bookmark" className="icon-img" />
                <SocialShare location={'bottom'}/>
              </div>
            </div>
            <div className="flex flex-row-nowrap justify-content-between align-items-center">
              <div className="flex flex-row-nowrap align-items-center padding-top-8">
                <UserAvatar id={metaData.userID} type={metaData.typeOfID} size={50}/>
                <div className="flex flex-column-nowrap margin-left-8">
                  <span className="written-by">Written By</span>
                  <span className="username">{metaData.userName}</span>
                </div>
              </div>
              { !hasUserFollowed ? <span className="following">Following</span> : <span className="follow">Follow</span> }
            </div>
          </div>
        </div>
      </div>
   </div>
  );
}
