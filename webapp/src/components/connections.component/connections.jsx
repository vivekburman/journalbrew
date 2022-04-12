import React, { Component } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import InfiniteScroll from '../infinitescroll.dynamic.component/infinite.scroll.dynamic';
import Skeleton from 'react-loading-skeleton';

import './connections.scss';
import { getFolloweeConnections, getFollowerConnections } from '../../services/userService';
const DATA_INDEX = "dataIndex",
  UNIQUE_ID="id";
class Connections extends Component {
    constructor(props) {
        super(props);
        this.allData = [];
        this.MODES = {
            FOLLOW: 1,
            FOLLOWING: 2
        };
        this.currentMode = 1;
        this.sliderSize = 20;
        this.getRangeData = this.getRangeData.bind(this);
        this.emptyStateUI = this.emptyStateUI.bind(this);
        this.onModeToggle = this.onModeToggle.bind(this);
    }
    getSkeletonUI = () => {
        const feedList = [];
        for(let i = 0; i < 10; i++) {
          feedList.push((
            <li key={ i }>
                <div className='connection-item flex-row-nowrap margin-bottom-5 align-items-center'>
                    <Skeleton circle={true} height={50} width={50} />
                    <div className='margin-left-15'></div>
                    <Skeleton width={250} height={20}/>
                    <div className='margin-left-15 margin-right-15 flex-grow-1'></div>
                    <Skeleton width={50} height={20}/>
                </div>
            </li>
          ));
        }
        return <ul className="ul-default">{feedList}</ul>;
    }
    getListItemDOM = (data, index) => {
        return  (
            <div>apple</div>
        );
    }
    getConnections = (userID, start, end) => {
        const restAPI = this.currentMode === this.MODES.FOLLOW ? getFollowerConnections : getFolloweeConnections;
        return restAPI(userID, start, end, this.props.currentUser?.token)
        .then(({data}) => {
            this.allData = [...this.allData, ...data.userList];
            return {data: data.userList, isLast: data.userList.length && data.userList[0].totalCount - 1 <= end};
        });
    }
    getRangeData (start, end) {
        const userID = this.props.currentUser.userId;
        if (this.allData.length) {
            const lastData = this.allData[this.allData.length - 1];
            const _end = Math.min(lastData.totalCount - 1, end);
            if (_end <= lastData[DATA_INDEX]) {
                return Promise.resolve({data: this.allData.slice(start, _end), isLast: lastData.totalCount - 1 <= end});
            }
        }
        return this.getConnections(userID, start, end);
    }
    emptyStateUI() {
        return(
            <div>
            <h1>Nothing to show here</h1>
            <p>{this.MODES.FOLLOW === this.currentMode ? 'You have no followers yet' : 'You haven\'t followed anyone yet'} &#128578;</p>
            </div>
        );
    }
    onModeToggle (e) {
        const type = +e.currentTarget.dataset.itemType;
        if (type === this.MODES.FOLLOW) {
            this.currentMode = this.MODES.FOLLOW;
        } else {
            this.currentMode = this.MODES.FOLLOWING;
        }
    }
    render() {
        return(
            <div className='follow-following-component'>
                <header className='ff-title font-playfair'>Your Connections</header>
                <Tabs>
                    <TabList className="ff-tabslist flex-row-nowrap list-style-none">
                    <Tab className="ff-tab-item ts--top-align-1 cursor-pointer outline-none"
                    data-item-type={this.MODES.FOLLOW}
                    onClick={this.onModeToggle}>
                        Followers
                    </Tab>
                    <Tab className="ff-tab-item ts--top-align-1 cursor-pointer outline-none"
                    data-item-type={this.MODES.FOLLOWING}
                    onClick={this.onModeToggle}>
                        Following
                    </Tab>
                    </TabList>
                    <TabPanel>
                    <div className="main-feed-list-wrapper margin-top-0 padding-right-8 padding-left-8">
                        <InfiniteScroll 
                            key={this.MODES.FOLLOW} 
                            dataIndex={DATA_INDEX}
                            sliderSize={this.sliderSize}
                            getLoadingUI = {this.getSkeletonUI}
                            getListItemDOM = {this.getListItemDOM}
                            getRangeData={this.getRangeData}
                            uniqueId={UNIQUE_ID}
                            emptyStateUI={this.emptyStateUI}
                        />
                    </div>
                    </TabPanel>
                    <TabPanel>
                    <div className="main-feed-list-wrapper margin-top-0 padding-right-8 padding-left-8">
                        <InfiniteScroll
                            key={this.MODES.FOLLOWING} 
                            dataIndex={DATA_INDEX}
                            sliderSize={this.sliderSize}
                            getLoadingUI = {this.getSkeletonUI}
                            getListItemDOM = {this.getListItemDOM}
                            getRangeData={this.getRangeData}
                            uniqueId={UNIQUE_ID}
                            emptyStateUI={this.emptyStateUI}
                            />
                    </div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}
const mapStateToProps = ({user}) => ({
    currentUser: user.currentUser,
});
export default connect(mapStateToProps)(Connections);