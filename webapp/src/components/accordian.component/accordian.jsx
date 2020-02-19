import React, { Component } from 'react';
import { connect } from 'react-redux';
import './accordian.component.scss';
import sport from '../../images/accordian/sport.svg';
import story from '../../images/accordian/story.svg';
import bookmark from '../../images/accordian/bookmark.svg';
import technology from '../../images/accordian/technology.svg';
import health from '../../images/accordian/health.svg';
import national from '../../images/accordian/national.svg';
import business from '../../images/accordian/business.svg';
import science from '../../images/accordian/science.svg';
import local from '../../images/accordian/local.svg';
import global from '../../images/accordian/global.svg';
import opinion from '../../images/accordian/opinion.svg';

/*
TODO: Style it,
    animate it,
    click it
    if possible add auto collapse
*/
class Accordian extends Component {
    render() {
        const shouldOpen = (this.props.shouldOpen || this.props.windowWidth > 767) ? 'show-list' : 'hide-list';
        return (
            <ul className={"accordian-list " + shouldOpen}>
                <li className="accordian-list-item">
                    <img src={story} className="item-img" alt="list-item-icon" />
                    <span className="item-name">New Story</span>
                </li>
                <li className="accordian-list-item">
                    <img src={bookmark} className="item-img" alt="list-item-icon" />
                    <span className="item-name">Bookmarks</span>
                </li>
                <li className="accordian-list-item divider">
                    <img src={national} className="item-img" alt="list-item-icon" />
                    <span className="item-name">National</span>
                </li>
                <li className="accordian-list-item">
                    <img src={local} className="item-img" alt="list-item-icon" />
                    <span className="item-name">Local</span>
                </li>
                <li className="accordian-list-item">
                    <img src={global} className="item-img" alt="list-item-icon" />
                    <span className="item-name">Global</span>
                </li>
                <li className="accordian-list-item">
                    <img src={business} className="item-img" alt="list-item-icon" />
                    <span className="item-name">Business</span>
                </li>
                <li className="accordian-list-item">
                    <img src={technology} className="item-img" alt="list-item-icon" />
                    <span className="item-name">Technology</span>
                </li>
                <li className="accordian-list-item">
                    <img src={sport} className="item-img" alt="list-item-icon" />
                    <span className="item-name">Sports</span>
                </li>
                <li className="accordian-list-item">
                    <img src={science} className="item-img" alt="list-item-icon" />
                    <span className="item-name">Science</span>
                </li>
                <li className="accordian-list-item">
                    <img src={health} className="item-img" alt="list-item-icon" />
                    <span className="item-name">Health</span>
                </li>
                <li className="accordian-list-item">
                    <img src={opinion} className="item-img" alt="list-item-icon" />
                    <span className="item-name">Opinion</span>
                </li>
            </ul>
        );
    }
}
const mapStateToProps = state => ({
    windowWidth: state.window.windowSize,
    shouldOpen: state.accordian.isOpen
});
export default connect(mapStateToProps)(Accordian);