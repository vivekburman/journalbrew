import React from 'react';
import './show.feed.component.scss';
import Skeleton from 'react-loading-skeleton';
import NewsFeedThumbnail from '../news.thumbnail.component/news.thumbnail';
import Article from '../article.thumbnail.component/article.thumbnail';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const createList = (feeds=[], location) => {
  const feedList = [];
  const postID = 'asdasd';

  if (feeds.length !== 0) {
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
      if (location === 'opinion') {
        feedList.push(
          <Article setStyle={true}/>
        );
      } else {
        feedList.push(
          <NewsFeedThumbnail key={i} postID={postID} />
        );
      }
    }   
  } 
  return feedList;
}

const ShowFeed = ({ feeds = [], location }) => {

  let header;
  switch(location.pathname.substr(1)) {
    case 'opinions':
      header = 'opinion';
      break;
    default:
      header = 'home';
      break;
  }
  return (
    <ul className="main-feed-list-wrapper list-style-none margin-top-0 flex flex-column-nowrap">
      { createList(feeds, header) }
    </ul>
  );
}
const mapStateToProps = ({ feedType }) => ({
  feedType: feedType.fetchFeedOfType,
});

export default connect(mapStateToProps)(withRouter(ShowFeed));