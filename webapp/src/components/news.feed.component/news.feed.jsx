import React, { Component } from 'react';
import Accordian from '../accordian.component/accordian';
import ShowFeed from '../show.feed.component/show.feed';
import AsideContent from '../aside.content.component/aside.content';
import './news.feed.component.scss';
import FeedFilter from '../feed.filter.component/feedFilter';
class NewsFeed extends Component {
  render() {
    return (
      <div className="news-feed-wrapper flex-row-wrap">
        <Accordian />
        <main className='news-feed-main-wrapper flex-grow-1'>
          <div className='feed-wrapper h-100'>
            <>
              <FeedFilter />
            </>
            <div className="main-feed">
              <ShowFeed />
            </div>
          </div>
        </main>
        <AsideContent /> 
      </div>
    ); 
  }
}
export default NewsFeed;