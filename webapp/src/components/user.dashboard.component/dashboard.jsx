import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import PersonalInfo from '../personal.info.component/personal.info';
import 'react-tabs/style/react-tabs.scss';
import './dashboard.component.scss';
// import { GrowthGraph } from '../growth.graph.component/growth.graph';
import { useHistory } from 'react-router';
import {connect} from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import BookmarksList from '../bookmarks.component/bookmarks';
import PublishedPostsList from '../published.posts.component/published.posts';
import UnpublishedPostsList from '../unpublished.posts.component/unpublished.posts';
import { axiosGet } from '../../helpers/httpReq';

const Dashboard = ({ windowWidth, currentUser }) => {
  const history = useHistory();
  const [error, setError] = useState(0);
  const [showLoadingPersonalInfo, setLoadingPersonalInfo] = useState(true);
  const [showLoadingPosts, setLoadingPosts] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({});
  const [publishedPostsList, setPublishedPostsList] = useState(null);
  const [unPublishedPostsList, setUnPublishedPostsList] = useState(null);
  const [bookmarksList, setBookmarksList] = useState(null);
  let userID;
  // on load first time
  useEffect(() => {
    const paths = history.location.pathname.split("/");
    userID = paths[paths.length - 1];
    
    if (!userID || userID.length != 36 || userID === "undefined" || userID === "null") {
      // render 404
      setError(404);
      setLoading(false);
    } else {
      axiosGet(`api/user-info/personal-info/${userID}`)
      .then(({data}) => {
        setPersonalInfo(data.personalInfo);
        getPublishedPostsList();
      })
      .catch((e) => {
        setError(404);
        setPersonalInfo({});
      })
      .finally(() => {
        setLoadingPersonalInfo(false);
      });
    }
  }, []);

  const getPublishedPostsList = () => {
    setLoadingPosts(true);
    axiosGet(`api/user-info/published-posts/${userID}`)
    .then(({data}) => {
      setPublishedPostsList(data.postsList);
    })
    .catch((e) => {
      setPublishedPostsList(null);
    }).finally(() => {
      setLoadingPosts(false);
    })
  }
  const getUnPublishedPostsList = () => {
    setLoadingPosts(true);
    axiosGet(`api/user-info/unpublished-posts/${userID}`, {
      headers: {
        Authorization: currentUser.token
      }
    })
    .then(({data}) => {
      setPublishedPostsList(data.postsList);
    })
    .catch((e) => {
      setPublishedPostsList(null);
    }).finally(() => {
      setLoadingPosts(false);
    })
  }
  const getBookmarksList = () => {
    setLoadingPosts(true);
    axiosGet(`api/user-info/bookmarks/${userID}`, {
      headers: {
        Authorization: currentUser.token
      }
    })
    .then(({data}) => {
      setPublishedPostsList(data.postsList);
    })
    .catch((e) => {
      setPublishedPostsList(null);
    }).finally(() => {
      setLoadingPosts(false);
    })
  }


  return (
    <>
      {
        error != 0 ? 
        <div>{error} error</div>
        :
        <>
          <section className="user-personal-info">
            <PersonalInfo loading={showLoadingPersonalInfo} personalInfo={personalInfo}/>
          </section>
          <section className="tabs-info">
            <Tabs>
              <TabList className="dashboard-tab-list">
                <Tab className="tab-item outline-none"
                  onClick={getPublishedPostsList}>
                  Published Posts
                </Tab>
                <Tab className="tab-item outline-none"
                onClick={getUnPublishedPostsList}>
                  Unpublished Posts
                </Tab>
                <Tab className="tab-item outline-none"
                onClick={getBookmarksList}>
                  Bookmarks
                </Tab>
              </TabList>
              <TabPanel>
                <PublishedPostsList loading={showLoadingPosts} windowWidth={windowWidth} posts={publishedPostsList}/>
              </TabPanel>
              <TabPanel>
                <UnpublishedPostsList loading={showLoadingPosts} windowWidth={windowWidth} posts={unPublishedPostsList}/>
              </TabPanel>
              <TabPanel>
                <BookmarksList loading={showLoadingPosts} windowWidth={windowWidth} posts={bookmarksList}/>
              </TabPanel>
            </Tabs>
          </section>
        </> 
      }
    </>
  );
}
const mapStateToProps = ({user}) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(Dashboard);