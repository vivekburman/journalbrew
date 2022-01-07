import React, {Component} from 'react';
import search from '../../images/search.svg';
import close from '../../images/close.svg';
import {connect} from 'react-redux';
import handleSearchRequest from '../../reducers/search/search.action';
import {Switch, Route, withRouter} from 'react-router-dom';
import './search.logo.component.scss';
import SearchSuggestion from '../search.suggestion.component/search.suggestion';
import {openSearchBar, closeSearchBar} from '../../reducers/click/search.bar.action';
class SearchNLogoComponent extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef(null);
    this.searchIconRef = React.createRef(null);
  }
  goToHome = () => {
    this.props.history.push("/");
  }
  _openSearchBar = () => {
    this.props.windowWidth < 768 && openSearchBar();
  }
  _toggleFocus = () =>{
    this.ref.current && this.ref.current.classList.add('on-focus');
    this.searchIconRef.current && this.searchIconRef.current.classList.add('on-focus');
  }
  _toggleBlur = () => {
    this.ref.current && this.ref.current.classList.remove('on-focus');
    this.searchIconRef.current && this.searchIconRef.current.classList.remove('on-focus');
    setTimeout(() => handleSearchRequest(''), 100);
  }
  render() {
    const {searchText='', windowWidth,
      handleSearchRequest, isSearchBarOpen,
      openSearchBar, closeSearchBar} = this.props;
    const placeholder = 'Search by location, date or creator';
    return (
      <div className="search-and-logo">
        <h1 onClick={this.goToHome} className={`logo ${isSearchBarOpen && windowWidth < 567 ? 'collapse-logo' : 'expand-logo'}`}>TopSelfNews</h1>
        <Switch>
          <Route exact path={['/', '/user-profile']}>
            <div className={`search ${windowWidth < 768 && (isSearchBarOpen ? 'flex-1' : 'flex-0')}`}>
              <form className="search-wrapper flex flex-row-nowrap justify-content-center"
                onSubmit={(e) => handleSearchRequest(e.target.value)}>
                <div className="search-wrapper align-items-center">
                  <div className="flex flex-row-nowrap align-items-center">
                    <img src={close} alt="search-icon" className="icon-img icon-img-close"
                      onClick={closeSearchBar}/>
                    <img src={search} alt="search-icon" ref={this.searchIconRef}
                      className="icon-img icon-img-search"
                      onClick={this._openSearchBar} />
                    <input
                      ref = {this.ref}
                      className={`search-input outline-none ${windowWidth < 768 && (isSearchBarOpen ? 'expand-search' : 'collapse-search')}`}
                      type="search"
                      placeholder={placeholder}
                      onChange= {(e) => handleSearchRequest(e.target.value)}
                      value={searchText}
                      onFocus={this._toggleFocus}
                      onBlur={this._toggleBlur}
                    />
                  </div>
                  { (windowWidth > 768 || isSearchBarOpen) && searchText.length > 0 && <SearchSuggestion /> }
                </div>
              </form>
            </div>
          </Route>
        </Switch>
      </div>
    );
  }
}
const mapStateToProps = ({window, search, searchBar}) => {
  return {
    windowWidth: window.windowSize,
    isSearchBarOpen: searchBar.isOpen,
    searchText: search.searchText,
  };
};
const mapDispatchToProps = (dispatch) => ({
  handleSearchRequest: (searchString) => dispatch(handleSearchRequest(searchString)),
  openSearchBar: () => dispatch(openSearchBar()),
  closeSearchBar: () => dispatch(closeSearchBar()),
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchNLogoComponent));
