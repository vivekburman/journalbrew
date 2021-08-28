import React from 'react';
import bookmarkImg from '../../images/bookmark.svg';
import './news.thumbnail.component.scss';
import CreatorInfo from '../creator.info.component/creator.info';
import { Tags } from '../tags.component/tags';
import Moment from 'react-moment';
import threeDots from '../../images/threeDots.svg';
import { useState } from 'react';
import PostDropdown from '../post.dropdown.component/post.dropdown';
import { useHistory } from 'react-router';

const MODES = {
  1: '/full-story?',
  2: '/edit-story/'
}

const NewsFeedThumbnail = ({ postID, title, summary, thumbnail, type, 
  username, time, bookmark, showCreator, profilePicUrl, showMenu, mode = 1 }) => {
  
  const [isMenuDropdownOpen, setMenuDropdown] = useState(false);
  const history = useHistory();
  const toggleDD = (e) => {
    e.stopPropagation();
    setMenuDropdown(!isMenuDropdownOpen); 
  }
  const navClick = () => {
    history.push(`${MODES[mode]}${postID}`);
  }
  const hideDropDown = (e) => {
    e && e.stopPropagation();
    setMenuDropdown(false);
  };

  return (
    <div className="news-item cursor-pointer">
      <div onClick={navClick} className="news-item-link">
        {thumbnail ? <div className="news-thumbnail">
          <img src={ thumbnail } alt="Images" className="news-image flex"/>
        </div> : <></>}
        <div className="news-details flex-column-nowrap align-content-spacebetween justify-content-between w-100">
          <div className="margin-bottom-15">
            <div className="flex flex-row-nowrap align-items-center">
              <h1 className="news-title flex-grow-1" >
                {title}
              </h1>
              {
                showMenu && 
                <div className="position-relative">
                  <img src={threeDots} alt="menu" className="icon-img" 
                  onClick={toggleDD} />
                  <PostDropdown 
                  isOpen={isMenuDropdownOpen}
                  hideFunc={hideDropDown}/>
              </div>
              }
            </div>
            <p className="news-snapshot">
              {summary}
            </p>
          </div>
          <div className="flex flex-row-nowrap align-items-center justify-content-between">
              <div className="creator-info">
                {!showCreator ? <Moment fromNow date={time} />
                : 
                <>
                  <img className="creator-pic" src={ profilePicUrl } alt="Creator Profile Pic"/>
                  <CreatorInfo username={username} time={time} />
                </>}
            </div>
            <div className="menu-section flex-row-nowrap align-items-center">
              {type ? <div>
                <Tags readOnly={true} tags={[type]} />
              </div>
              : <></>}
              {bookmark ? <img src={ bookmarkImg } className="icon-img bookmark-link" alt="Bookmark" /> : <></>}
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default NewsFeedThumbnail;