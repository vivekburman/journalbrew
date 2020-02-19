import React from 'react';
import { connect } from 'react-redux';
import './show.feed.component.scss';
import dummy from '../../images/dummy.jpeg';

import profilePlaceholder from '../../images/profile-pic-placeholder.png';
import bookmark from '../../images/bookmark.svg';
import share from '../../images/share.svg';

const ShowFeed = ({ feeds = [], windowWidth }) => {
    const feedList = [];
    for (let i = 0; i < 10; i++) {
        feedList.push((
            <li key={ i } className="news-item" >
                <div className="news-thumbnail">
                   <img src={ dummy } alt="Images" className="news-image"/>
                </div>
                <div className="news-details">
                    <h1 className="news-title">
                        India is a democratic country. Until you critisize it.
                    </h1>
                    <p className="news-snapshot">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        Eveniet inventore illo voluptatibus, eum itaque unde ea rem amet aliquam qui. Sed,
                        repellendus placeat iure harum itaque delectus id necessitatibus ullam?
                    </p>
                    <div className="flex-row">
                    <div className="creator-info">
                        <img className="creator-pic" src={ profilePlaceholder } alt="Creator Profile Pic"/>
                        <div className="creator">
                            <h2 className="creator-name">Mr. TalkBox</h2>
                            <time className="creation-time">10:00AM</time>
                        </div>
                    </div>      
                    <div className="menu-section">
                        <img src={ bookmark } className="icon-img bookmark-link" alt="Bookmark" />
                        <img src={ share } className="icon-img share-link" alt="Share" /> 
                    </div>
                    </div>
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
const mapStateToProps = ({ window }) => ({
    windowWidth: window.windowSize
})
export default connect(mapStateToProps)(ShowFeed);