import React, { useRef, useState } from 'react';
import Moment from 'react-moment';
import { useHistory } from 'react-router';

import CreatorInfo from '../creator.info.component/creator.info';
import PostDropdown from '../post.dropdown.component/post.dropdown';
import bookmarkImg from '../../images/bookmark.svg';
// import { Tags } from '../tags.component/tags';
import threeDots from '../../images/threeDots.svg';
import user from '../../images/user.svg';
import './news.thumbnail.component.scss';


const MODES = {
  1: '/full-story/',
  2: '/edit-story/'
}

const NewsFeedThumbnail = ({ postID, title, summary, thumbnail, type, 
  username, time, bookmark, showCreator, profilePicUrl, showMenu, 
  onDeleteMenuClick, onEditMenuClick,
  removeItemFunc, mode = 1, userID=null }) => {
  
  const [isMenuDropdownOpen, setMenuDropdown] = useState(false);
  const history = useHistory();
  const rootRef = useRef(null);

  const toggleDD = (e) => {
    e.stopPropagation();
    setMenuDropdown(!isMenuDropdownOpen); 
  }
  const navClick = () => {
    history.push(`${MODES[mode]}${userID ? `${userID}/${postID}` : `${postID}` }`);
  }
  const hideDropDown = (e) => {
    e && e.stopPropagation();
    setMenuDropdown(false);
  };

  const onEditClick = () => {
    onEditMenuClick(postID, MODES[mode]);
  }
  const onDeleteClick = async () => {
    rootRef.current && (rootRef.current.style.pointerEvents = "none");
    const response = await onDeleteMenuClick(postID);
    if (response.status) {
      removeItemFunc(postID);
    } else {
      rootRef.current && (rootRef.current.style.pointerEvents = "");
    }
  }

  const onProfilePicLoadError = (e) => {
    const img = e.target;
    img.src = user;
    img.classList.add("on-error");
  }

  return (
    <div className="news-item"
    ref={rootRef}>
      <div className="news-item-link">
        {thumbnail ? <div className="news-thumbnail">
          <img src={ thumbnail } alt="Images" className="news-image flex"/>
        </div> : <></>}
        <div className="news-details flex-column-nowrap align-content-spacebetween justify-content-between w-100">
          <div className="margin-bottom-15">
            <div className="flex flex-row-nowrap align-items-center">
              <h1 className="news-title flex-grow-1 cursor-pointer" onClick={navClick}>
                {title}
              </h1>
              {
                showMenu && 
                <div className="position-relative">
                  <img src={threeDots} alt="menu" className="icon-img rotate-z-90" 
                  onClick={toggleDD} />
                  <PostDropdown 
                  onDeleteMenuClick={onDeleteClick}
                  onEditMenuClick={onEditClick}
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
              <div className="flex flex-row-nowrap align-items-center">
                {!showCreator ? <Moment fromNow date={time} />
                : 
                <>
                  <img className="creator-pic" src={ profilePicUrl } onError={onProfilePicLoadError}/>
                  <CreatorInfo username={username} time={time} />
                </>}
            </div>
            <div className="menu-section flex-row-nowrap align-items-center">
              {/* {type ? <div>
                <Tags readOnly={true} tags={[type]} />
              </div>
              : <></>} */}
              {bookmark ? <img src={ bookmarkImg } className="icon-img bookmark-link" alt="Bookmark" /> : <></>}
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default NewsFeedThumbnail;