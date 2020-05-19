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


const dummyData = [
  {
    title: 'What has happend... So what will happen next... can we do someting So what will happen next... can we do someting?',
    name: 'Dummy Name',
    time: '10:00AM',
    link: '/'
  },  {
    title: 'What has happend... So what will happen next... can we do someting?',
    name: 'Dummy Name',
    time: '10:00AM',
    link: '/'
  },  {
    title: 'What has happend... So what will happen next... can we do someting?',
    name: 'Dummy Name',
    time: '10:00AM',
    link: '/',
  }
];
const AsideContent = (props) => {
  const { list=[...dummyData], location } = props;
  
  if (list.length < 1) {
    return (
      <div className="aside-container flex-grow-1">
        <ul className="ul sticky">
          { createSkeleton() }
        </ul>
      </div>
    );
  }

  return (
    <div className="aside-container flex-grow-1">
      <EventOfDay isSticky={location.pathname === '/opinions'}/>
      <Switch>
        <Route exact path="/">
          <div className="aside-item sticky">
            <h3 className="header">Opinions</h3>
            <ul className="ul">
              { list.map((entry, index) => {
                return (
                  <Article entry={entry} index={index} />
                );
              }) }
            </ul>
            <Link to="/opinions" className="link">
              <div className="see-more">See More</div>
            </Link>
          </div>
        </Route>
      </Switch>
    </div>
  );
}
export default withRouter(AsideContent);