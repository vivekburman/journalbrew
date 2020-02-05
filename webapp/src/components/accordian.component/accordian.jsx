import React, { Component } from 'react';
import { connect } from 'react-redux';
import './accordian.component.scss';
class Accordian extends Component {
    render() {
        const shouldOpen = this.props.shouldOpen ? 'show-list' : 'hide-list';
        return (
            <ul className={"accordian-list " + shouldOpen}>
                <li className="accordian-list-item">
                    <img className="item-img" alt="list-item-icon" />
                    <span className="item-name">National News</span>
                </li>
            </ul>
        );
    }
}
const mapStateToProps = state => ({
    shouldOpen: state.accordian.isOpen
});
export default connect(mapStateToProps)(Accordian);