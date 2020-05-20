import React from 'react';
import { UserAvatar } from '../avatar.component/avatar';
import './article.thumbnail.component.scss';
import { Link } from 'react-router-dom';
import CreatorInfo from '../creator.info.component/creator.info';

const dummyData = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus placeat id commodi reprehenderit ex dolorum quo excepturi expedita, debitis enim laboriosam nemo earum ipsa velit repellendus dicta possimus minima ipsam.';
const Article = ({ entry={}, index=0, setStyle=false}) => {
  return (
    <li key={index} 
      className={`aside-list-item flex flex-row-nowrap ${setStyle && 'aside-list-item-url'}`}>
      <Link to={ entry.link } className="link">
        <div className="flex flex-row-nowrap">
          <UserAvatar size={50} type={entry.type} id={entry.id} />
          <div className="flex flex-column-nowrap">
            <h3 className="aside-news-title">{ dummyData || entry.title }</h3>
            <CreatorInfo username={entry.name} time={entry.time} />
          </div>
        </div>
      </Link>
    </li>
  );
}
export default Article;