import React, { Component } from 'react';
import Accordian from '../accordian.component/accordian';
import Advertisement from '../advertisement.component/advertisement';
import ShowFeed from '../show.feed.component/show.feed';
import './main.component.scss';
class Main extends Component {
    render() {
        const { windowWidth } = this.props;
        return (
            <main className="main">
                <Accordian windowWidth= {windowWidth}/>
                <ShowFeed windowWidth= {windowWidth}/>
                <Advertisement/>
            </main>
        );
    }
}
export default Main;