import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../header.component/header';
import Main from '../main.component/main';
import updateWindowSize from '../../reducers/window/resize.action';
import '../../mainSass/index.scss';
import './home.page.component.scss';
import { Switch, Route } from 'react-router';
import OauthCallback from '../loadable.component/OauthCallback.lazy';
import { createAxiosInterceptor } from '../../services/interceptorService';

class HomePage extends Component {
    constructor() {
        super();
        this.updateWindowSize = this.updateWindowSize.bind(this);
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowSize);
        createAxiosInterceptor();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowSize);
    }
    updateWindowSize() {
        this.props.updateWindowSize(window.innerWidth);
    }
    render () {
        return (
            <Switch>
                <Route exact path="/oauth_callback" component={OauthCallback}>
                </Route>
                <Route>
                    <div className="homepage">
                        <Header />
                        <Main />
                    </div>
                </Route>
            </Switch>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateWindowSize: (size) => dispatch(updateWindowSize(size)),
});
export default connect(null, mapDispatchToProps)(HomePage);