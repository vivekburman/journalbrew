/* eslint-disable new-cap */
import React, {Component} from 'react';
// import Advertisement from '../advertisement.component/advertisement';
import './main.component.scss';
import {Switch, Route} from 'react-router-dom';
import loadable from '@loadable/component';
import LoadableNewsFeed from '../loadable.component/loadableNewsFeed';

// const UserProfile = loadable(() => import('../loadable.component/loadableUserProfile'));

const UserProfile = loadable(() => import('../loadable.component/loadableUserProfile'));

const NewsFeed = loadable(() => import('../loadable.component/loadableNewsFeed'));

const TextEditor = loadable(() => import('../loadable.component/loadableTextEditor'));

const FullNews = loadable(() => import('../loadable.component/loadableFullNews'));

const PaymentInsights = loadable(() => import('../loadable.component/loadablePaymentInsights'));

class Main extends Component {
  render() {
    return (
      <main className="main">
        <React.Suspense fallback={<></>}>
          <Switch>
            <Route exact path={['/', '/opinions']} component={NewsFeed} />
            <Route exact path="/user-profile" component={UserProfile} />
            <Route exact path="/new-story" component={TextEditor} />
            <Route exact path="/full-story" component={FullNews} />
            <Route exact path="/payment-history-&-insights" component={PaymentInsights} />
          </Switch>
        </React.Suspense>
      </main>
    );
  }
}
export default Main;
