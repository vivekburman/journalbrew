import React from 'react';
import { connect } from 'react-redux';
import dummy from '../../images/dummy.jpeg';
import profilePlaceholder from '../../images/profile-pic-placeholder.png';
import bookmark from '../../images/bookmark.svg';
import { showCompletePost } from '../../reducers/click/showcompletepost.action';
import { Link } from 'react-router-dom';
import './news.thumbnail.component.scss';
import CreatorInfo from '../creator.info.component/creator.info';

const NewsFeedThumbnail = ({ postID, showCompletePost }) => {
  // const imgRef = useRef();
  // const refs = useRef([]);
  // let counter = 0;
  // const resetPreview = () => {
  //   counter = 0;
  //   refs.current.forEach(ref => {
  //     ref.animationReset();
  //   })
  // }
  // const startPreview = (e) => {
  //   if (counter >= 3) {
  //     resetPreview(refs);
  //     return;
  //   }
  //   const _ref = refs.current[counter];
  //   _ref.animationStart(() => {
  //     startPreview(e, refs, ++counter);
  //   });
  // }
  // const endPreview = (e) => {
  //   if (counter >= 3) {
  //     resetPreview(refs);
  //     return;
  //   }
  //   const _ref = refs.current[counter];
  //   _ref.animationPause();
  // }
  
  return (
    <li className="news-item" onClick={() => showCompletePost(postID)} >
      <Link to={`/full-story?${postID}` } className="news-item-link">
        <div className="news-thumbnail">
          <img src={ dummy } alt="Images" className="news-image flex"/>
        </div>
        <div className="news-details">
          <h1 className="news-title">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam commodi, voluptatem magnam rem quia consequuntur provident officia iusto corrupti error sint voluptatibus, temporibus cumque sapiente modi ad saepe maiores explicabo!
          </h1>
          <p className="news-snapshot">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Eveniet inventore illo voluptatibus, eum itaque unde ea rem amet aliquam qui. Sed,
            repellendus placeat iure harum itaque delectus id necessitatibus ullam?
          </p>
          <div className="flex flex-row-nowrap align-items-center justify-content-between">
            <div className="creator-info">
              <img className="creator-pic" src={ profilePlaceholder } alt="Creator Profile Pic"/>
              <CreatorInfo username={'Mr.Talkbox'} time={'10:30AM'} />
            </div>      
            <div className="menu-section">
              <img src={ bookmark } className="icon-img bookmark-link" alt="Bookmark" />
            </div>
          </div>
        </div>
      </Link>
    </li>  
  );
};

const mapDispatchToProps = dispatch => ({
  showCompletePost: (postID) => dispatch(showCompletePost(postID)),
});
export default connect(null, mapDispatchToProps)(NewsFeedThumbnail);