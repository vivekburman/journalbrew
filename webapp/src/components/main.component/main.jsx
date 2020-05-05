import React, { Component } from 'react';
import Accordian from '../accordian.component/accordian';
import {Dashboard} from '../dashboard.component/dashboard';
// import Advertisement from '../advertisement.component/advertisement';
import TextEditor from '../text.editor.component/text.editor.component';
import ShowFeed from '../show.feed.component/show.feed';
import './main.component.scss';
import { Switch, Route } from 'react-router-dom';
import { FullPost } from '../full.post.component/full.post';
class Main extends Component {
  render() {
    const { windowWidth } = this.props;
    return (
      <main className="main">
        <Switch>
          <Route exact path="/user-profile">
            <Accordian windowWidth= {windowWidth}/>
            <div className="main-feed">
              <Dashboard windowWidth= {windowWidth}/>
            </div>
            {/* <Advertisement/> */}
          </Route>
          <Route exact path="/new-story">
            <TextEditor />
          </Route>
          <Route exact path="/full-story">
            <div className="margin-main w-100">
              <FullPost />
            </div>
          </Route>
          <Route exact path="/">
            <Accordian windowWidth= {windowWidth}/>
            <div className="main-feed">
              <ShowFeed windowWidth= {windowWidth}/>
            </div>
            {/* <Advertisement/> */}
          </Route>
        </Switch>
      </main>
    );
  }
}
export default Main;