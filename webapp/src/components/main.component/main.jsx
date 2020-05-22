import React, { Component } from 'react';
// import Advertisement from '../advertisement.component/advertisement';
import './main.component.scss';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

const UserProfile = Loadable({
  loader: () => import('../loadable.component/loadableUserProfile'),
  loading() {
    return <></>;
  }
});

const NewsFeed = Loadable({
  loader: () => import('../loadable.component/loadableNewsFeed'),
  loading() {
    return <></>;
  }
});

const TextEditor = Loadable({
  loader: () => import('../loadable.component/loadableTextEditor'),
  loading() {
    return <></>;
  }
});

const FullNews = Loadable({
  loader: () => import('../loadable.component/loadableFullNews'),
  loading() {
    return <></>;
  }
});

const PaymentInsights = Loadable({
  loader: () => import('../loadable.component/loadablePaymentInsights'),
  loading() {
    return <></>;
  }
});


class Main extends Component {
  render() {
    return (
      <main className="main">
        <Switch>
          <Route exact path="/user-profile" component={UserProfile} />
          <Route exact path={["/", "/opinions"]} component={NewsFeed} />
          <Route exact path="/new-story" component={TextEditor} />          
          <Route exact path="/full-story" component={FullNews} />
          <Route exact path="/payment-history-&-insights" component={PaymentInsights} />
        </Switch>
      </main>
    );
  }
}
export default Main;