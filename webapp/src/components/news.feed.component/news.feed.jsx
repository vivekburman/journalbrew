import React from 'react';
import Accordian from '../accordian.component/accordian';
import ShowFeed from '../show.feed.component/show.feed';
import AsideContent from '../aside.content.component/aside.content';
import './news.feed.component.scss';
const NewsFeed = () => {
  return (
    <div className="news-feed-wrapper flex-row-wrap">
      <Accordian />
      <div className="main-feed">
        <ShowFeed />
      </div>
      <AsideContent /> 
    </div>
  );
}
export default NewsFeed;