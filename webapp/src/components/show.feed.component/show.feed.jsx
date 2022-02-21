import React, { Component } from 'react';
import './show.feed.component.scss';
import Skeleton from 'react-loading-skeleton';
import NewsFeedThumbnail from '../news.thumbnail.component/news.thumbnail';
import InfiniteScroll from '../infinitescroll.dynamic.component/infinite.scroll.dynamic';
import { connect } from 'react-redux';
import { getDisplayName } from '../../helpers/util';
import { searchByTag, searchByDefault } from '../../services/searchService';


const DATA_INDEX = "dataIndex",
  UNIQUE_ID="postID";

class ShowFeed extends Component {
  constructor(props) {
    super(props);
    this.allData = [];
    this.sliderSize = 50;
    this.getRangeData = this.getRangeData.bind(this);
  }
  getSkeletonUI = () => {
    const feedList = [];
    for(let i = 0; i < 10; i++) {
      feedList.push((
        <li key={ i } className="news-item flex flex-row-nowrap justify-content-between">
          <div className="news-details w-100" style={{lineHeight: 1.5}}>
            <Skeleton />
            <div style={{margin: '15px 0'}}></div>
            <Skeleton count={4}/>
            <Skeleton circle={true} height={30} width={30} />
          </div>
          <Skeleton height={150} width={150}/>
        </li>
      ));
    }
    return <ul className="ul-default">{feedList}</ul>;
  }
  getListItemDOM = (data, index) => {
    return <NewsFeedThumbnail 
      key={index} 
      showCreator={true}
      profilePicUrl={data.profilePicUrl}
      username={getDisplayName(data.firstName, data.middleName, data.lastName)}
      postID={data.id} 
      time={data.createdAt}
      title={data.title}
      summary={data.summary}
      thumbnail={data.thumbnail}
      type={data.type}
      userID={data.userID}
      />
  }
  getRangeData (start, end) {
    if (this.allData.length) {
      const lastData = this.allData[this.allData.length - 1];
      const _end = Math.min(lastData.totalCount - 1, end);
      if (_end <= lastData[DATA_INDEX]) {
        return Promise.resolve({data: this.allData.slice(start, _end), isLast: lastData.totalCount - 1 <= end});
      }
    }
    return this.getFeed(start, end);
  }
  getFeed(start, end) {
    const { filterText="" } = this.props;
    const func = filterText ? searchByTag : searchByDefault;
    return func(filterText, start, end)
    .then(({data}) => {
      this.allData = [...this.allData, ...data.postsList];
      return {data: data.postsList, isLast: data.postsList.length && data.postsList[0].totalCount - 1 <= end};
    }).catch((e) => {
        return Promise.reject();
    });
  }
  emptyStateUI = () => {
    return(
      <div>
        <h1>Nothing to show here</h1>
        <p>Seems like no articles have been published yet &#128578;</p>
      </div>
    );
  }
  
  render() {
    return (
      <div className="main-feed-list-wrapper margin-top-0 flex-column-nowrap">
        <InfiniteScroll 
          key={this.props.filterText}
          dataIndex={DATA_INDEX}
          sliderSize={this.sliderSize}
          getLoadingUI = {this.getSkeletonUI}
          getListItemDOM = {this.getListItemDOM}
          getRangeData={this.getRangeData}
          uniqueId={UNIQUE_ID}
          emptyStateUI={this.emptyStateUI}
        />
      </div>
    );
  }
}
const mapStateToProps = ({ filterState }) => ({
  filterText: filterState.filterText
});
export default connect(mapStateToProps)(ShowFeed);