import React, { Component } from 'react';
import Accordian from '../accordian.component/accordian';

class Main extends Component {
    render() {
        return (
            <Accordian windowWidth={this.props.windowWidth}/>
        );
    }
}
export default Main;