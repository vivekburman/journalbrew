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
      <main className="main">
          <Switch>
            <Route exact path={['/', '/opinions']} component={NewsFeed} />
            <Route exact path="/user-profile" component={UserProfile} />
            <Route exact path="/new-story" component={CreateOrUpdatePost} />
            <Route exact path="/edit-story/a/:postId" component={CreateOrUpdatePost} />
            <Route exact path="/full-story" component={FullNews} />
            <Route exact path="/payment-history-&-insights" component={PaymentInsights} />
          </Switch>
      </main>
    );
  }
}
export default Main;
