/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import './accordian.component.scss';
import story from '../../images/story.svg';
import bookmark from '../../images/bookmarked.svg';
import help from '../../images/help.svg';

import {Link} from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import {closeAccordian} from '../../reducers/click/accordian.action';


class Accordian extends Component {
  render() {
    const {collapseAccordian, currentUser} = this.props;
    const shouldOpen = (this.props.shouldOpen || this.props.windowWidth > 929) ? 'show-list' : 'hide-list';
    return (
      <div className={'accordian-list-container ' + shouldOpen}
        onClick={collapseAccordian}>
        <div className="accordian-list" >
          <SimpleBar style={{paddingBottom: '60px', boxSizing: 'content-box', maxHeight: '99vh'}}>
            {currentUser && <div className="accordian-list-item">
              <Link to="/new-story" className="link">
                <div className="accordian-item">
                  <img src={story} className="item-img ts--top-align-2" alt="list-item-icon" />
                  <span className="item-name">New Story</span>
                </div>
              </Link>
            </div>}
            <div className="accordian-list-item">
              <div className="accordian-item">
                <img src={bookmark} className="item-img ts--top-align-2" alt="list-item-icon" />
                <span className="item-name">Bookmarks</span>
              </div>
            </div>
            <div className="accordian-list-item">
              <Link to="/helpcenter" className="link">
                <div className="accordian-item">
                  <img src={help} className="item-img ts--top-align-2" alt="list-item-icon" />
                  <span className="item-name">Help Center</span>
                </div>
              </Link>
            </div>
          </SimpleBar>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({window, accordian, user}) => ({
  windowWidth: window.windowSize,
  shouldOpen: accordian.isOpen,
	currentUser: user.currentUser
});
const mapDispatchToProps = (dispatch) => ({
  collapseAccordian: (e) => dispatch(closeAccordian(e)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Accordian);
