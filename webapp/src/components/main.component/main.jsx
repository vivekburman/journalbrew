import React, {Component} from 'react';
import './main.component.scss';
import {Switch, Route} from 'react-router-dom';
import UserProfile from '../loadable.component/UserProfile.lazy';
import NewsFeed from '../loadable.component/NewsFeed.lazy';
import CreateOrUpdatePost from '../loadable.component/CreateOrUpdatePost.lazy';
import FullNews from '../loadable.component/FullNews.lazy';
import PaymentInsights from '../loadable.component/PaymentInsights.lazy';
class Main extends Component {
  render() {
    return (
      <main className="main flex-grow-1">
        <div className='main-content'>
          <Switch>
            <Route exact path="/" component={NewsFeed} />
            <Route exact path="/user-profile/:userId" component={UserProfile} />
            <Route exact path="/new-story" component={CreateOrUpdatePost} />
            <Route exact path="/edit-story/:postId" component={CreateOrUpdatePost} />
            <Route exact path="/full-story/:userId/:postId" component={FullNews} />
            <Route exact path="/payment-history-&-insights" component={PaymentInsights} />
          </Switch>
        </div>
      </main>
    );
  }
}
export default Main;
