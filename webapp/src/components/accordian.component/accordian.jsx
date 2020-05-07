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
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { closeAccordian } from '../../reducers/click/accordian.action';


/*
TODO: Style it,
    animate it,
    click it
    if possible add auto collapse
*/

class Accordian extends Component {
  render() {
    const { collapseAccordian } = this.props;
    const shouldOpen = (this.props.shouldOpen || this.props.windowWidth > 767) ? 'show-list' : 'hide-list';
    return (
      <div className={"accordian-list-container " + shouldOpen} >
        <div className="accordian-list" onClick={collapseAccordian}>
          <SimpleBar style={{ maxHeight: '100vh', paddingBottom: '20px' }}>
            <div className="accordian-list-item">
              <Link to="/new-story">
                <img src={story} className="item-img" alt="list-item-icon" />
                <span className="item-name">New Story</span>
              </Link>
            </div>
            <div className="accordian-list-item">
              <img src={bookmark} className="item-img" alt="list-item-icon" />
              <span className="item-name">Bookmarks</span>
            </div>
            <div className="accordian-list-item divider">
              <img src={national} className="item-img" alt="list-item-icon" />
              <span className="item-name">National</span>
            </div>
            <div className="accordian-list-item">
              <img src={local} className="item-img" alt="list-item-icon" />
              <span className="item-name">Local</span>
            </div>
            <div className="accordian-list-item">
              <img src={global} className="item-img" alt="list-item-icon" />
              <span className="item-name">Global</span>
            </div>
            <div className="accordian-list-item">
              <img src={business} className="item-img" alt="list-item-icon" />
              <span className="item-name">Business</span>
            </div>
            <div className="accordian-list-item">
              <img src={technology} className="item-img" alt="list-item-icon" />
              <span className="item-name">Technology</span>
            </div>
            <div className="accordian-list-item">
              <img src={sport} className="item-img" alt="list-item-icon" />
              <span className="item-name">Sports</span>
            </div>
            <div className="accordian-list-item">
              <img src={science} className="item-img" alt="list-item-icon" />
              <span className="item-name">Science</span>
            </div>
            <div className="accordian-list-item">
              <img src={health} className="item-img" alt="list-item-icon" />
              <span className="item-name">Health</span>
            </div>
            <div className="accordian-list-item">
              <img src={opinion} className="item-img" alt="list-item-icon" />
              <span className="item-name">Opinion</span>
            </div>
          </SimpleBar>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
    windowWidth: state.window.windowSize,
    shouldOpen: state.accordian.isOpen
});
const mapDispatchToProps = (dispatch) => ({
  collapseAccordian: (e) => dispatch(closeAccordian(e)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Accordian);