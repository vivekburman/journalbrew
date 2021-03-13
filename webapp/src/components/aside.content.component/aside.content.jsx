import React from 'react';
import './aside.component.scss';
import Article from '../article.thumbnail.component/article.thumbnail';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import EventOfDay from '../event.of.day.component/event.of.day';

const createSkeleton = (size = 3) => {
  const _skeleton = [];
    for(let i = 0; i < size; i++) {
      _skeleton.push(
        <li className="aside-list-item flex flex-row-nowrap">
          <div className="flex-grow-1">
            <Skeleton circle={true} height={50} width={50} />
          </div>
          <div className="padding-8 w-100">
            <Skeleton count={3} height={10}/>
          </div>
        </li>
      );
    }
  return _skeleton;
}

const AsideContent = (props) => {
  const { list, location } = props;

  return (
    <div className="aside-container flex-grow-1">
      <Switch>
        <Route exact path="/">
          <EventOfDay isSticky={true}/>
          <div className="">
          </div>
        </Route>
      </Switch>
    </div>
  );
}
export default withRouter(AsideContent);