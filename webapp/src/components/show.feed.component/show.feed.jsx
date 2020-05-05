import React from 'react';
import './show.feed.component.scss';
import dummy from '../../images/dummy.jpeg';
import profilePlaceholder from '../../images/profile-pic-placeholder.png';
import bookmark from '../../images/bookmark.svg';
import { showCompletePost } from '../../reducers/click/showcompletepost.action';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const ShowFeed = ({ feeds = [], showCompletePost }) => {
  const feedList = [];
  const postID = 'asdasd';
  for (let i = 0; i < 10; i++) {
    feedList.push((
      <li key={ i } className="news-item" onClick={() => showCompletePost(postID)}>
        <Link to={`/full-story?${postID}` } className="news-item-link">
          <div className="news-thumbnail">
            <img src={ dummy } alt="Images" className="news-image"/>
          </div>
          <div className="news-details">
            <h1 className="news-title">
              India is a democratic country. Until you critisize it. Then it is no more a democratic country.
            </h1>
            <p className="news-snapshot">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Eveniet inventore illo voluptatibus, eum itaque unde ea rem amet aliquam qui. Sed,
              repellendus placeat iure harum itaque delectus id necessitatibus ullam?
            </p>
            <div className="flex flex-row align-items-center justify-space-between">
              <div className="creator-info">
                <img className="creator-pic" src={ profilePlaceholder } alt="Creator Profile Pic"/>
                <div className="creator">
                  <h2 className="creator-name">Mr. TalkBox</h2>
                  <time className="creation-time">10:00AM</time>
                </div>
              </div>      
              <div className="menu-section">
                <img src={ bookmark } className="icon-img bookmark-link" alt="Bookmark" />
              </div>
            </div>
          </div>
        </Link>
      </li>
    ));
  }      
  return (
    <ul className="padding-left-0">
      { feedList }
    </ul>
  );
}
const mapDispatchToProps = dispatch => ({
  showCompletePost: (postID) => dispatch(showCompletePost(postID)),
});
export default connect(null, mapDispatchToProps)(ShowFeed);