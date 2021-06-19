import React from 'react';
import { connect } from 'react-redux';
import dummy from '../../images/dummy.jpeg';
import profilePlaceholder from '../../images/profile-pic-placeholder.png';
import bookmark from '../../images/bookmark.svg';
import { showCompletePost } from '../../reducers/click/showcompletepost.action';
import { Link } from 'react-router-dom';
import './news.thumbnail.component.scss';
import CreatorInfo from '../creator.info.component/creator.info';
import { Tags } from '../tags.component/tags';
import Moment from 'react-moment';
import moment from 'moment';

const NewsFeedThumbnail = ({ postID, showCompletePost, title, summary, thumbnail, type, username, time, bookmark, showCreator, profilePicUrl }) => {
  const handleClick = () => {
    showCompletePost(postID);
  };

  return (
    <div className="news-item" onClick={handleClick} >
      <Link to={`/full-story?${postID}` } className="news-item-link">
        {thumbnail ? <div className="news-thumbnail">
          <img src={ thumbnail } alt="Images" className="news-image flex"/>
        </div> : <></>}
        <div className="news-details flex-column-nowrap align-content-spacebetween justify-content-between w-100">
          <div className="margin-bottom-15">
            <h1 className="news-title">
              {title}
            </h1>
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
              {bookmark ? <img src={ bookmark } className="icon-img bookmark-link" alt="Bookmark" /> : <></>}
            </div>
          </div>
        </div>
      </Link>
    </div>  
  );
};

const mapDispatchToProps = dispatch => ({
  showCompletePost: (postID) => dispatch(showCompletePost(postID)),
});
export default connect(null, mapDispatchToProps)(NewsFeedThumbnail);