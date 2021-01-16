import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../header.component/header';
import Main from '../main.component/main';
import updateWindowSize from '../../reducers/window/resize.action';
import '../../mainSass/index.scss';
import './home.page.component.scss';
import { Switch, Route } from 'react-router';
import { setCurrentUser } from '../../reducers/user/user.action';
import silentRefresh from '../../helpers/silentRefresh';
import OauthCallback from '../loadable.component/OauthCallback.lazy';

class HomePage extends Component {
    constructor() {
        super();
        this.updateWindowSize = this.updateWindowSize.bind(this);
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowSize);
        silentRefresh(this.props.setCurrentUser);
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
    setCurrentUser: (payload) => dispatch(setCurrentUser(payload))
});
export default connect(null, mapDispatchToProps)(HomePage);