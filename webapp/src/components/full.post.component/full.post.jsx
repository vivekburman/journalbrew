import React from 'react';
import './full.post.scss';
import bookmark from '../../images/bookmark.svg';
import PostReaction from '../user.reaction.component/user.reaction';
import { postData } from './dummydata';
import { parseHTMLToReact } from '../../helpers/jsontohtml';
import { UserAvatar } from '../avatar.component/avatar';
import { createPost } from '../../helpers/generateHTMLView';
import { SocialShare } from '../social.share.component/social.share';
import { Tags } from '../tags.component/tags';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

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
  const { hasUserLiked=false, post=postData } = props;
  const metaData = post.metaData;
  const article = post.blocks;
  return(
    <div className="flex-row-nowrap full-post-container">
      <div className="flex-grow-1">
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
            <div className="flex flex-row-nowrap justify-space-between">
              <div className="flex flex-row-nowrap align-items-center ">
                <UserAvatar id={metaData.userID} type={metaData.typeOfID} size={50}/>
                <div className="flex flex-column-nowrap padding-8">
                  <span className="username">{metaData.userName}</span>
                  <div className="flex flex-row align-items-center">
                    <span className="news-location">{ metaData.location }</span>
                    <span className="separator">&#8226;</span>
                    <span className="news-time-of-post">{ timeFormatter(metaData.time) }</span>
                  </div>
                </div>
              </div>
              <SocialShare/>  
            </div>
          </div>
          <section>{showArticle(article)}</section>
          <hr ref={ref}/>
        </div>
        <div>
          <Tags tags={['Nokia', 'Telecommunication', 'India', 'XP13']}/>
        </div>
        <div className="border-btm">
          <div className="flex flex-row-nowrap justify-space-between">
            <div className="flex flex-row-nowrap align-items-center ">
              <PostReaction likes={metaData.likes} hasUserLiked={hasUserLiked} showViews={true} views={metaData.views}/>
            </div>
            <div className="flex flex-row">
              <SocialShare />
              <img src={bookmark} alt="bookmark" className="icon-img" />
            </div>
          </div>
        </div>
      </div>
      <div>
        aside/advertisement/more to read
      </div>
   </div>
  );
}
