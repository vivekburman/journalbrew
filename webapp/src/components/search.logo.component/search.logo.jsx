import React, { Component } from 'react';
import search from '../../images/search.svg';
import { connect } from 'react-redux';
import handleSearchRequest from'../../reducers/search/search.action';
import { Switch, Route, withRouter } from 'react-router-dom';
class SearchNLogoComponent extends Component {
    constructor (props) {
      super(props);
      this.state = {
        searchCssClass: '',
        logoCssClass: '',
        searchInputCssClass: '',
        searchText: '',
        hasResized: -1
      }
      this.handleSearchClick = this.handleSearchClick.bind(this);
    }
    handleSearchClick () {
      /* if window less than 768
          *  open => close and vice-versa
          else
          * do nothing
    */
    const { hasWindowResized } = this.props;
    const { searchInputCssClass, hasResized } = this.state;
    if (searchInputCssClass === 'collapse-search' || searchInputCssClass === '' ||
      hasResized !== hasWindowResized) {
      this.setState({
        hasResized: hasWindowResized, 
        searchInputCssClass: 'expand-search', 
        logoCssClass: 'collapse-logo',
        searchCssClass: 'flex-1',
      });
    } else {
      this.setState({
        hasResized: hasWindowResized, 
        searchInputCssClass: 'collapse-search', 
        logoCssClass: 'expand-logo',
        searchCssClass: 'flex-0',
      });
    }
  }
  routeChange = () => {
    this.props.history.push('/');
  }
  render() {
    let { searchInputCssClass, hasResized, logoCssClass, searchCssClass } = this.state;
    const { searchText, windowWidth = window.innerWidth, hasWindowResized, handleSearchRequest } = this.props;
    const placeholder = windowWidth < 576 ? 'Search' : 'Search by location, date or creator';
    if (hasWindowResized !== hasResized) {
      searchCssClass = '';
      logoCssClass = '';
      searchInputCssClass = '';
    }
    return (
      <div className="search-and-logo">
        <h1 onClick={this.routeChange} className={"logo " + logoCssClass}>TopSelfNews</h1>
        <Switch>
          <Route exact path={["/", "/user-profile"]}>
            <div className={"search " + searchCssClass}>
              <input 
                className={"search-input " + searchInputCssClass}
                type="search"
                placeholder={placeholder}
                onChange= {(e) => handleSearchRequest(e.target.value)}
                value={searchText} 
              />
              <figure className="figure" onClick={this.handleSearchClick}>
                  <img src={search} alt="search-icon" className="icon-img"></img>
              </figure>
            </div>
          </Route>
        </Switch>
      </div>
    );
  }
}   
const mapStateToProps = ({ window, search }) => {
  return {
    windowWidth: window.windowSize,
    hasWindowResized: window.hasWindowResized,
    searchText: search.searchText
  };
};
const mapDispatchToProps = dispatch => ({
  handleSearchRequest: searchString => dispatch(handleSearchRequest(searchString))
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchNLogoComponent));