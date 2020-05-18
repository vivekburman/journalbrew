import React from 'react';
import SimpleBar from 'simplebar-react';
import { UserAvatar } from '../avatar.component/avatar';
import './article.component.scss';
import { Link } from 'react-router-dom';
import CreatorInfo from '../creator.info.component/creator.info';
import Skeleton from 'react-loading-skeleton';


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
  },  {
    title: 'What has happend... So what will happen next... can we do someting?',
    name: 'Dummy Name',
    time: '10:00AM',
    link: '/',
  },  {
    title: 'What has happend... So what will happen next... can we do someting?',
    name: 'Dummy Name',
    time: '10:00AM',
    link: '/',
  },  {
    title: 'What has happend... So what will happen next... can we do someting?',
    name: 'Dummy Name',
    time: '10:00AM',
    link: '/',
  },  {
    title: 'What has happend... So what will happen next... can we do someting?',
    name: 'Dummy Name',
    time: '10:00AM',
    link: '/',
  }
];

const createAsideList = (list=[]) => {
  const _skeleton = [];
  if (list.length < 1) {
   for(let i = 0; i < 10; i++) {
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

  return list.map((entry, index) => {
    return (
      <li key={index} className="aside-list-item flex flex-row-nowrap">
        <Link to={ entry.link } className="link">
          <div className="flex flex-row-nowrap">
            <UserAvatar size={50} type={entry.type} id={entry.id} />
            <div className="flex flex-column-nowrap">
              <h3 className="aside-news-title">{ entry.title }</h3>
              <CreatorInfo username={entry.name} time={entry.time} />
            </div>
          </div>
        </Link>
      </li>
    );
  });
};

const loadMoreData = () => {
  return [...dummyData, ...dummyData];
}

const Article = ({ list=[], type, sticky=false }) => {
  return (
    <div className={`aside-item flex flex-column-nowrap ${sticky && 'sticky'}`}>
      <h2 className="header">{type === 'article' ? 'Articles' : 'Opinions'}</h2>
      <div className="overflow-scroll hide-scrollbar">
        <SimpleBar style={{ height: '400px' }}>
          <ul className="ul">
            { createAsideList() }
            <li className="padding-8">
              <button className="see-more" onClick={loadMoreData}>See More...</button>
            </li> 
          </ul>
        </SimpleBar>
      </div>
    </div>
  );
}
export default Article;