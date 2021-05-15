import React, { Component } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import PersonalInfo from '../personal.info.component/personal.info';
import 'react-tabs/style/react-tabs.scss';
import './dashboard.component.scss';
// import { GrowthGraph } from '../growth.graph.component/growth.graph';
import {withRouter} from 'react-router-dom';

import BookmarksList from '../bookmarks.component/bookmarks';
import PublishedPostsList from '../published.posts.component/published.posts';
import UnpublishedPostsList from '../unpublished.posts.component/unpublished.posts';
import { axiosGet } from '../../helpers/httpReq';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: 0,
      showLoadingPersonalInfo: true,
      userID: null,
      personalInfo: {}
    }
  }
  setError = (error) => this.setState({error: error, showLoadingPersonalInfo: false, userID: null});
  setPersonalInfo = (personalInfo, userID) => this.setState({showLoadingPersonalInfo: false, personalInfo: personalInfo, userID: userID});
  componentDidMount() {
    const paths = this.props.history.location.pathname.split("/");
    const userID = paths[paths.length - 1];
    if (!userID || userID.length != 36 || userID === "undefined" || userID === "null") {
      // render 404
      this.setError(404);
    } else {
      axiosGet(`api/user-info/personal-info/${userID}`)
      .then(({data}) => {
        this.setPersonalInfo(data.personalInfo, userID);
      })
      .catch(() => {
        this.setError(404);
      })
    }
  }
  render() {
    const {error, personalInfo, showLoadingPersonalInfo, userID} = this.state;
    return (
      <div className="dashboard">
        {
          error != 0 ? 
          <div>{error} error</div>
          :
          <div className="user-personal-info-container">
            <section className="user-personal-info">
              <PersonalInfo loading={showLoadingPersonalInfo} personalInfo={personalInfo}/>
            </section>
            <section className="tabs-info">
              <Tabs>
                <TabList className="dashboard-tab-list">
                  <Tab className="tab-item outline-none">
                    Published Posts
                  </Tab>
                  <Tab className="tab-item outline-none">
                    Unpublished Posts
                  </Tab>
                  <Tab className="tab-item outline-none">
                    Bookmarks
                  </Tab>
                </TabList>
                <TabPanel>
                  <PublishedPostsList loading={showLoadingPersonalInfo} userID={userID} personalInfo={personalInfo}/>
                </TabPanel>
                <TabPanel>
                  <UnpublishedPostsList />
                </TabPanel>
                <TabPanel>
                  <BookmarksList />
                </TabPanel>
              </Tabs>
            </section>
          </div> 
        }
      </div>
    );
  }
}

export default withRouter(Dashboard);