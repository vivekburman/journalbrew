import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';
import { deleteDraft, getDrafts } from '../../services/postService';
import InfiniteScroll from '../infinitescroll.dynamic.component/infinite.scroll.dynamic';
import NewsThumbnail from '../news.thumbnail.component/news.thumbnail';
import { withRouter } from 'react-router-dom';

const DATA_INDEX = "dataIndex",
  UNIQUE_ID="id";
class DraftPostsList extends Component {
  constructor(props) {
    super(props);
    this.allData = [];
    this.sliderSize = 20;
    this.getRangeData = this.getRangeData.bind(this);
    this.onDeleteMenuClick = this.onDeleteMenuClick.bind(this);
    this.onEditMenuClick = this.onEditMenuClick.bind(this);
  }

  getSkeletonUI = () => {
    const feedList = [];
    for(let i = 0; i < 10; i++) {
      feedList.push((
        <li key={ i } className="news-item-loader">
          <div className="news-item-loader-desktop news-item-loader-details flex-row-nowrap justify-content-between">
            <div className="w-100 padding-8 flex-column-nowrap justify-content-between">
              <Skeleton />
              <div style={{margin: '15px 0'}}></div>
              <Skeleton count={3}/>
            </div>
          </div>
          <div className="w-100 h-100 news-item-loader-mobile">
            <div className="news-item-loader-details margin-top-5">
              <Skeleton />
              <div style={{margin: '15px 0'}}></div>
              <Skeleton count={2}/>
            </div>
          </div>
        </li>
      ));
    }
    return <ul className="ul-default">{feedList}</ul>;
  }
  onDeleteMenuClick = (postID) => {
    deleteDraft(postID, this.props.userID, this.props.currentUser?.token);
  }
  onEditMenuClick = (postID, path) => {
    this.props.history.push(`${path}${postID}`);
  }
  getListItemDOM = (data, index) => {
    return <NewsThumbnail 
      key={index} 
      showMenu={true}
      onDeleteMenuClick={this.onDeleteMenuClick}
      onEditMenuClick={this.onEditMenuClick}
      mode={2}
      showCreator={false}
      time={data.createdAt}
      postID={data.id} 
      title={data.title}
      summary={data.summary}
      />
  }
  getPosts = (userID, start, end) => {
    const self = this;
    return getDrafts(userID, start, end, this.props.currentUser?.token)
    .then(({data}) => {
      this.allData = [...this.allData, ...data.postsList];
      return {data: data.postsList, isLast: data.postsList.length && data.postsList[0].totalCount - 1 <= end};
    });
  }
  getRangeData (start, end) {
    const userID = this.props.userID;
    if (this.allData.length) {
      const lastData = this.allData[this.allData.length - 1];
      const _end = Math.min(lastData.totalCount - 1, end);
      if (_end <= lastData[DATA_INDEX]) {
        return Promise.resolve({data: this.allData.slice(start, _end), isLast: lastData.totalCount - 1 <= end});
      }
    }
    return this.getPosts(userID, start, end);
  }
  emptyStateUI = () => {
    return(
      <div>
        <h1>Nothing to show here</h1>
        <p>You have no articles in draft. &#128578;</p>
      </div>
    );
  }
  render() {
    const {windowWidth} = this.props;
    return (
      <div className="main-feed-list-wrapper margin-top-0 padding-right-8 padding-left-8">
          <InfiniteScroll 
            windowWidth={windowWidth}
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
const mapStateToProps = ({user, window}) => ({
  currentUser: user.currentUser,
  windowWidth: window.windowSize
});
const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (payload) => dispatch(setCurrentUser(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DraftPostsList));