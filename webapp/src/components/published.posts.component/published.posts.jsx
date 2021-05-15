import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getDisplayName } from '../../helpers/util';
import { getPublishedPosts } from '../../services/postService';
import InfiniteScroll from '../infinitescroll.dynamic.component/infinite.scroll.dynamic';
import NewsThumbnail from '../news.thumbnail.component/news.thumbnail';

const DATA_INDEX = "dataIndex",
  UNIQUE_ID="id";
class PublishedPostsList extends Component {

  constructor(props) {
    super(props);
    this.sliderSize = 40;
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
      username={getDisplayName(personalInfo.firstName, personalInfo.middleName, personalInfo.lastName)}
      postID={data.id} 
      title={data.dataIndex + "------" + data.title}
      summary={data.summary}
      thumbnail={data.thumbnail}
      type={data.type}
      />
  }
  
  getRangeData (start, end) {
    const userID = this.props.userID;
    return getPublishedPosts(userID, start, end)
    .then(({data}) => {
      return {data: data.postsList, isLast: data.postsList.length && data.postsList[0].totalCount - 1 <= end};
    });
  }
  render() {
    const {loading} = this.props;
    return (
      <div className="main-feed-list-wrapper margin-top-0">
        {
          loading ? 
            this.getSkeletonUI()
          :
          <InfiniteScroll 
            dataIndex={DATA_INDEX}
            sliderSize={this.sliderSize}
            getLoadingUI = {this.getSkeletonUI}
            getListItemDOM = {this.getListItemDOM}
            getRangeData={this.getRangeData}
            uniqueId={UNIQUE_ID}
            />
        }
      </div>
    );
  }
}

export default PublishedPostsList;