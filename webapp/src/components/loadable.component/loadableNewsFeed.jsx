import React from 'react';
import Accordian from '../accordian.component/accordian';
import ShowFeed from '../show.feed.component/show.feed';
import AsideContent from '../aside.content.component/aside.content';

const LoadableNewsFeed = () => {
  return (
    <>
      <Accordian />
      <div className="main-feed">
        <ShowFeed />
      </div>
      <AsideContent /> 
    </>
  );
}

export default LoadableNewsFeed;