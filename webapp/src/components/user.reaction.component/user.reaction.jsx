import React, { Component } from 'react';
import { connect } from 'react-redux';
import liked from '../../images/liked.svg';
import likePlaceholder from '../../images/likePlaceholder.svg';
import { userLiked, userDisliked } from '../../reducers/click/userreaction.action';
import './user.reaction.scss';
const formatCount = (likes) => {
  if (likes >= 1000000) {
    const result = likes / 1000000;
    return Number.isInteger(result) ? `${result}M` : `${result.toFixed(2)}M`;
  }
  else if (likes >= 1000) {
    const result = likes / 1000;
    return Number.isInteger(result) ? `${result}K` : `${result.toFixed(2)}K`;
  }
  return likes;
};
class UserReaction extends Component {
  render() {
    const { likes, hasUserLiked, userLiked, userDisliked, showViews=false, views, direction='row'} = this.props;
    return (
      <div className={`flex flex-${direction}-nowrap ${direction ==='row' ? 'align-items-center' : ''} margin-btm-10`}>
        <div className="flex flex-row-nowrap align-items-center">
          { hasUserLiked ? <img src={liked} alt="liked" className="icon-img rotate-180 size-29" onClick={userDisliked} />
          : <img src={likePlaceholder} alt="likePlaceholder" className="icon-img rotate-180 size-29" onClick={userLiked} /> }
          <span className="align-self-center likes-count">{formatCount(likes)}</span>
          { direction === 'row' && <span className="separator">&#8226;</span>}
        </div>
        { showViews &&  <span className={`align-self-center likes-count views-${direction}`}>{ `${formatCount(views)} views` }</span>}
      </div>
    );
  }
}

const mapStateToProps = ({ userReaction }) => ({
  hasUserLiked: userReaction.hasUserLiked
});
const mapDispatchToProps = dispatch => ({
  userLiked: postID => dispatch(userLiked(postID)),
  userDisliked: postID => dispatch(userDisliked(postID)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UserReaction);