import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import ShowFeed from '../show.feed.component/show.feed';
import {PersonalInfo} from '../personal.info.component/personal.info';
import 'react-tabs/style/react-tabs.scss';
import './dashboard.component.scss';
export const Dashboard = ({ windowWidth }) => {
  return (
    <>
      <section className="user-personal-info">
        <PersonalInfo />
      </section>
      <section className="tabs-info">
        <Tabs>
          <TabList className="dashboard-tab-list">
            <Tab className="tab-item">
              Posts
            </Tab>
            <Tab className="tab-item">
              Likes
            </Tab>
            <Tab className="tab-item">
              Bookmarks
            </Tab>
            <Tab className="tab-item">
              Growth Graph
            </Tab>
            <Tab className="tab-item">
              Notifications
            </Tab>
          </TabList>
          <TabPanel>
            <ShowFeed windowWidth/>
          </TabPanel>
          <TabPanel>
            <ShowFeed windowWidth/>
          </TabPanel>
          <TabPanel>
            <ShowFeed windowWidth/>
          </TabPanel>
          <TabPanel>
            <ShowFeed windowWidth/>
          </TabPanel>
          <TabPanel>
            <ShowFeed windowWidth/>
          </TabPanel>
        </Tabs>
      </section>
    </>
  );
}