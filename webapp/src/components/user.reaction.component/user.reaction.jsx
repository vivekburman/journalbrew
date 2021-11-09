import React, { Component } from 'react';
import liked from '../../images/liked.svg';
import likePlaceholder from '../../images/likePlaceholder.svg';
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
    const { likes, hasUserLiked, showViews=false, views, direction='row'} = this.props;
    return (
      <div className={`flex flex-${direction}-nowrap ${direction ==='row' ? 'align-items-center' : ''}`}>
        <div className="flex flex-row-nowrap align-items-center">
          { hasUserLiked ? <img src={liked} alt="liked" className="icon-img rotate-180 size-29" />
          : <img src={likePlaceholder} alt="likePlaceholder" className="icon-img rotate-180 size-29" /> }
          <span className="align-self-center likes-count">{`${formatCount(likes)} Likes`}</span>
          { direction === 'row' && <span className="separator">&#8226;</span>}
        </div>
        { showViews &&  <span className={`align-self-center likes-count views-${direction}`}>{ `${formatCount(views)} Views` }</span>}
      </div>
    );
  }
}
export default UserReaction;