/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {connect} from 'react-redux';
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
import history from '../../images/accordian/history.svg';

import {Link} from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import {closeAccordian} from '../../reducers/click/accordian.action';


/*
TODO: Style it,
    animate it,
    click it
    if possible add auto collapse
*/

class Accordian extends Component {
  render() {
    const {collapseAccordian} = this.props;
    const shouldOpen = (this.props.shouldOpen || this.props.windowWidth > 929) ? 'show-list' : 'hide-list';
    return (
      <div className={'accordian-list-container ' + shouldOpen}
        onClick={collapseAccordian}>
        <div className="accordian-list" >
          <SimpleBar style={{paddingBottom: '60px', boxSizing: 'content-box', maxHeight: '99vh'}}>
            <div className="accordian-list-item">
              <Link to="/new-story" className="link">
                <div className="accordian-item">
                  <img src={story} className="item-img" alt="list-item-icon" />
                  <span className="item-name">New Story</span>
                </div>
              </Link>
            </div>
            <div className="accordian-list-item external-item">
              <Link to={`/full-story?${'history'}`} className="link">
                <div className="accordian-item">
                  <img src={history} className="item-img" alt="list-item-icon" />
                  <span className="item-name">Historical Event</span>
                </div>
              </Link>
            </div>
            <div className="accordian-list-item">
              <div className="accordian-item">
                <img src={bookmark} className="item-img" alt="list-item-icon" />
                <span className="item-name">Bookmarks</span>
              </div>
            </div>
            <div className="accordian-list-item divider">
              <div className="accordian-item">
                <img src={national} className="item-img" alt="list-item-icon" />
                <span className="item-name">National</span>
              </div>
            </div>
            <div className="accordian-list-item">
              <div className="accordian-item">
                <img src={local} className="item-img" alt="list-item-icon" />
                <span className="item-name">Local</span>
              </div>
            </div>
            <div className="accordian-list-item">
              <div className="accordian-item">
                <img src={global} className="item-img" alt="list-item-icon" />
                <span className="item-name">Global</span>
              </div>
            </div>
            <div className="accordian-list-item">
              <div className="accordian-item">
                <img src={business} className="item-img" alt="list-item-icon" />
                <span className="item-name">Business</span>
              </div>
            </div>
            <div className="accordian-list-item">
              <div className="accordian-item">
                <img src={technology} className="item-img" alt="list-item-icon" />
                <span className="item-name">Technology</span>
              </div>
            </div>
            <div className="accordian-list-item">
              <div className="accordian-item">
                <img src={sport} className="item-img" alt="list-item-icon" />
                <span className="item-name">Sports</span>
              </div>
            </div>
            <div className="accordian-list-item">
              <div className="accordian-item">
                <img src={science} className="item-img" alt="list-item-icon" />
                <span className="item-name">Science</span>
              </div>
            </div>
            <div className="accordian-list-item">
              <div className="accordian-item">
                <img src={health} className="item-img" alt="list-item-icon" />
                <span className="item-name">Health</span>
              </div>
            </div>
            <div className="accordian-list-item external-item">
              <Link to="/opinions" className="link">
                <div className="accordian-item">
                  <img src={opinion} className="item-img" alt="list-item-icon" />
                  <span className="item-name">Opinion</span>
                </div>
              </Link>
            </div>
          </SimpleBar>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  windowWidth: state.window.windowSize,
  shouldOpen: state.accordian.isOpen,
});
const mapDispatchToProps = (dispatch) => ({
  collapseAccordian: (e) => dispatch(closeAccordian(e)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Accordian);
