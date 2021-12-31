import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';
import { getDisplayName } from '../../helpers/util';
import { getPublishedPosts } from '../../services/postService';
import InfiniteScroll from '../infinitescroll.dynamic.component/infinite.scroll.dynamic';
import NewsThumbnail from '../news.thumbnail.component/news.thumbnail';

const DATA_INDEX = "dataIndex",
  UNIQUE_ID="id";
class PublishedPostsList extends Component {

  constructor(props) {
    super(props);
    this.allData = [];
    this.sliderSize = 20;
    this.getRangeData = this.getRangeData.bind(this);
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
              <Skeleton count={4}/>
              <Skeleton circle={true} height={30} width={30} />
            </div>
            <Skeleton height={200} width={200}/>
          </div>
          <div className="w-100 h-100 news-item-loader-mobile">
            <Skeleton height={150}/>
            <div className="news-item-loader-details margin-top-5">
              <Skeleton />
              <div style={{margin: '15px 0'}}></div>
              <Skeleton count={2}/>
              <Skeleton circle={true} height={30} width={30} />
            </div>
          </div>
        </li>
      ));
    }
    return <ul className="ul-default">{feedList}</ul>;
  }
  
  getListItemDOM = (data, index) => {
    const personalInfo = this.props.personalInfo;
    return <NewsThumbnail 
      key={index} 
      showCreator={false}
      profilePicUrl={personalInfo.profilePicUrl}
      username={getDisplayName(personalInfo.firstName, personalInfo.middleName, personalInfo.lastName)}
      postID={data.id} 
      time={data.createdAt}
      title={data.title}
      summary={data.summary}
      thumbnail={data.thumbnail}
      type={data.type}
      userID={this.props.userID}
      />
  }

  getPosts = (userID, start, end) => {
    return getPublishedPosts(userID, start, end)
    .then(({data}) => {
      this.allData = [...this.allData, ...data.postsList];
      return {data: data.postsList, isLast: data.postsList.length && data.postsList[0].totalCount - 1 <= end};
    }).catch((e) => {
        return Promise.reject();
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
        <p>You have no articles published yet &#128578;</p>
      </div>
    );
  }

  render() {
    return (
      <div className="main-feed-list-wrapper margin-top-0 padding-right-8 padding-left-8">
          <InfiniteScroll 
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

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (payload) => dispatch(setCurrentUser(payload)),
});

export default connect(null, mapDispatchToProps)(PublishedPostsList);