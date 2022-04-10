import React, { Component } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import './connections.scss';

class Connections extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className='follow-following-component'>
                <header className='ff-title font-playfair'>Your Connections</header>
                <Tabs>
                    <TabList className="ff-tabslist flex-row-nowrap list-style-none">
                    <Tab className="ff-tab-item ts--top-align-1 cursor-pointer outline-none">
                        Followers
                    </Tab>
                    <Tab className="ff-tab-item ts--top-align-1 cursor-pointer outline-none">
                        Following
                    </Tab>
                    </TabList>
                    <TabPanel>
                        <div>Followers</div>
                    </TabPanel>
                    <TabPanel>
                        <div>Following</div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}
export default Connections;