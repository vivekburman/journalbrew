import React, {Component} from 'react';
import './main.component.scss';
import {Switch, Route} from 'react-router-dom';
import loadable from '@loadable/component';

const UserProfile = loadable(() => import('../loadable.component/loadableUserProfile'));

const NewsFeed = loadable(() => import('../loadable.component/loadableNewsFeed'));

const CreateOrUpdatePost = loadable(() => import('../loadable.component/LoadableCreateOrUpdatePost'));

const FullNews = loadable(() => import('../loadable.component/loadableFullNews'));

const PaymentInsights = loadable(() => import('../loadable.component/loadablePaymentInsights'));

class Main extends Component {
  render() {
    return (
      <main className="main">
          <Switch>
            <Route exact path={['/', '/opinions']} component={NewsFeed} />
            <Route exact path="/user-profile" component={UserProfile} />
            <Route exact path="/new-story" component={CreateOrUpdatePost} />
            <Route exact path="/full-story" component={FullNews} />
            <Route exact path="/payment-history-&-insights" component={PaymentInsights} />
          </Switch>
      </main>
    );
  }
}
export default Main;
