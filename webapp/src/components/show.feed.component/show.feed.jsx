import React from 'react';
import './show.feed.component.scss';
import Skeleton from 'react-loading-skeleton';
import NewsFeedThumbnail from '../news.thumbnail.component/news.thumbnail';

const createList = (feeds=[], loading) => {
  const feedList = [];
  const postID = 'asdasd';

  if (loading) {
    for(let i = 0; i < 10; i++) {
      feedList.push((
        <li key={ i } className="news-item flex flex-row-nowrap justify-content-between">
          <div className="news-details" style={{lineHeight: 1.5}}>
            <Skeleton />
            <div style={{margin: '15px 0'}}></div>
            <Skeleton count={4}/>
            <Skeleton circle={true} height={30} width={30} />
          </div>
          <Skeleton height={150} width={150}/>
        </li>
      ));
    }
  } else {
    for (let i = 0; i < 10; i++) {
      feedList.push(
        <NewsFeedThumbnail key={i} postID={postID} />
      );
    }   
  } 
  return feedList;
}

const ShowFeed = ({ feeds = [], loading }) => {
  return (
    <ul className="main-feed-list-wrapper list-style-none margin-top-0 flex flex-column-nowrap">
      { createList(feeds, loading) }
    </ul>
  );
}
export default ShowFeed;