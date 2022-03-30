import React, { Component } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import PersonalInfo from '../personal.info.component/personal.info';
import 'react-tabs/style/react-tabs.scss';
import './dashboard.component.scss';
// import { GrowthGraph } from '../growth.graph.component/growth.graph';
import {withRouter} from 'react-router-dom';

import BookmarksList from '../bookmarks.component/bookmarks';
import PublishedPostsList from '../published.posts.component/published.posts';
import UnderReviewPostsList from '../underreview.posts.component/underreview.posts';
import { axiosGet } from '../../helpers/httpReq';
import DraftPostsList from '../draft.posts.component/draft.posts';
import { connect } from 'react-redux';
import Error from '../error.component/error';

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
  setError = (error) => this.setState({error: error, showLoadingPersonalInfo: false, userID: null, personalInfo: {}});
  setPersonalInfo = (personalInfo, userID) => this.setState({showLoadingPersonalInfo: false, personalInfo: personalInfo, userID: userID, error: 0});
  resetState = () => this.setState({showLoadingPersonalInfo: true, userID: null, personalInfo: {}, error: 0});
  componentDidMount() {
    this.getInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId != this.props.match.params.userId) {
      this.resetState();
      this.getInfo();
    }
  }

  getInfo = () => {
    const userID = this.props.match.params.userId;
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
    const { currentUser } = this.props;
    return (
      <div className="dashboard">
        {
          error != 0 ? 
          <Error />
          :
          <div className="user-personal-info-container">
            <section className="user-personal-info">
              <PersonalInfo loading={showLoadingPersonalInfo} personalInfo={personalInfo}/>
            </section>
            {
              !showLoadingPersonalInfo ? <section className="tabs-info">
              <Tabs>
                <TabList className="dashboard-tab-list">
                  <Tab className="tab-item outline-none">
                    Published
                  </Tab>
                  {
                    currentUser.userId == userID ?
                    <>
                      <Tab className="tab-item outline-none">
                        Reviewing
                      </Tab>
                      <Tab className="tab-item outline-none">
                        Bookmarks
                      </Tab>
                      <Tab className="tab-item outline-none">
                        Drafts
                      </Tab>
                    </>
                    :
                    <>
                    </>
                  }
                </TabList>
                <TabPanel>
                  <PublishedPostsList userID={userID} personalInfo={personalInfo}/>
                </TabPanel>
                {
                  currentUser.userId == userID ?
                  <>
                    <TabPanel>
                      <UnderReviewPostsList userID={userID} personalInfo={personalInfo}/>
                    </TabPanel>
                    <TabPanel>
                      <BookmarksList userID={userID} personalInfo={personalInfo}/>
                    </TabPanel>
                    <TabPanel>
                      <DraftPostsList userID={userID} personalInfo={personalInfo}/>
                    </TabPanel>
                  </>
                  :
                  <></>
                }
              </Tabs>
            </section>
            : 
            <></>
            }
          </div> 
        }
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(withRouter(Dashboard));