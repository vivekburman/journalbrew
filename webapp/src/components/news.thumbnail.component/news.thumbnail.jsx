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

const NewsFeedThumbnail = ({ postID, showCompletePost, title, summary, thumbnail, type, username, time }) => {
  const handleClick = () => {
    showCompletePost(postID);
  };

  return (
    <div className="news-item" onClick={handleClick} >
      <Link to={`/full-story?${postID}` } className="news-item-link">
        <div className="news-thumbnail">
          <img src={ thumbnail || dummy } alt="Images" className="news-image flex"/>
        </div>
        <div className="news-details flex-column-nowrap align-content-spacebetween justify-content-between">
          <div>
            <h1 className="news-title">
              {title || "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam commodi, voluptatem magnam rem quia consequuntur provident officia iusto corrupti error sint voluptatibus, temporibus cumque sapiente modi ad saepe maiores explicabo!"}
            </h1>
            <p className="news-snapshot">
              {summary || "Lorem ipsum dolor sit, amet consectetur adipisicing elit.\
              Eveniet inventore illo voluptatibus, eum itaque unde ea rem amet aliquam qui. Sed,\
              repellendus placeat iure harum itaque delectus id necessitatibus ullam?"}
            </p>
          </div>
          <div className="flex flex-row-nowrap align-items-center justify-content-between">
            <div className="creator-info">
              <img className="creator-pic" src={ profilePlaceholder } alt="Creator Profile Pic"/>
              <CreatorInfo username={username} time={'10:30AM'} />
            </div>      
            <div className="menu-section flex-row-nowrap align-items-center">
              <div>
                <Tags readOnly={true} tags={[type]} />
              </div>
              <img src={ bookmark } className="icon-img bookmark-link" alt="Bookmark" />
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