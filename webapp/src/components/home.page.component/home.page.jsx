import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../header.component/header';
import Main from '../main.component/main';
import updateWindowSize from '../../reducers/window/resize.action';
import '../../mainSass/index.scss';
import './home.page.component.scss';
class HomePage extends Component {
    constructor() {
        super();
        this.updateWindowSize = this.updateWindowSize.bind(this);
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowSize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowSize);
    }
    updateWindowSize() {
        this.props.updateWindowSize(window.innerWidth);
    }
    render () {
        return (
            <div className="homepage">
                <Header />
                <Main />
            </div>
        );
    }
}
const mapDispatchToProps = dispatch => ({
    updateWindowSize: (size) => dispatch(updateWindowSize(size))
});
export default connect(null, mapDispatchToProps)(HomePage);