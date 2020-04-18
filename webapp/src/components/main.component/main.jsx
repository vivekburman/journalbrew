import React, { Component } from 'react';
import Accordian from '../accordian.component/accordian';
// import Advertisement from '../advertisement.component/advertisement';
import TextEditor from '../text.editor.component/text.editor.component';
import ShowFeed from '../show.feed.component/show.feed';
import './main.component.scss';
import { Switch, Route } from 'react-router-dom';
class Main extends Component {
    render() {
        const { windowWidth } = this.props;
        console.log(windowWidth);
        return (
            <main className="main">
               <Switch>
                   <Route exact path="/">
                    <Accordian windowWidth= {windowWidth}/>
                    <ShowFeed windowWidth= {windowWidth}/>
                    {/* <Advertisement/> */}
                   </Route>
                   <Route exact path="/new-story">
                    <TextEditor />
                   </Route>
               </Switch>
            </main>
        );
    }
}
export default Main;