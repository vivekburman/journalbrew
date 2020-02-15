import React from 'react';
import './show.feed.component.scss';
const ShowFeed = ({ feeds = [] }) => {
    const feedList = [];
    for (let i = 0; i < 10; i++) {
        feedList.push((
            <li key={ i } className="news-item">
                <div className="news-thumbnail">
                    {/* will have multiple images or a video */}
                </div>
                <h1 className="news-title">
        { i } This is a dummy title. This is fixed to some length
                </h1>
                <div className="creator-info">
                    <img className="creator-pic" src="" alt="Creator Profile Pic"/>
                    <h2>Mr. TalkBox</h2>
                    <time>10:00AM</time>
                </div>      
                <div className="menu-section">
                    <img className="bookmark-link" alt="Bookmark" />
                    <img className="share-link" alt="Share" /> 
                </div>
            </li>
        ));
    }      
    return (
    <ul className="news-feed">
        { feedList }
    </ul>
    );
}
export default ShowFeed;