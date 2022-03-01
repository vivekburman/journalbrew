import React, {Component} from 'react';
import search from '../../images/search.svg';
import close from '../../images/close.svg';
import {connect} from 'react-redux';
import {Switch, Route, withRouter} from 'react-router-dom';
import './search.logo.component.scss';
import SearchSuggestion from '../search.suggestion.component/search.suggestion';
import { searchWithoutType } from '../../services/searchService';
import help from '../../images/help.svg';
import SearchHelp from '../search.help.component/search.help';

class SearchNLogoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchBarOpen: false,
      searchText: "",
      searchResult: [],
      searchError: null,
      searchLoading: null,
      toggleHelpPopover: false,
    }
  }
  goToHome = () => {
    this.props.history.push("/");
  }
  _openSearchBar = () => {
    this.props.windowWidth < 768 && this.setState({
      isSearchBarOpen: true,
      searchText: "",
      searchResult: [],
      searchError: null,
      searchLoading: null
    });
  }
  _closeSearchBar = () => {
    this.setState({
      isSearchBarOpen: false,
      searchText: "",
      searchResult: [],
      searchError: null,
      searchLoading: null
    });
  }
  _toggleHelpPopover = () => {
    this.setState({
      toggleHelpPopover: !this.state.toggleHelpPopover
    });
  }
  performSearch = async (event) => {
    if (event.which === 13) {
    // perform search
      this.setState({
        searchLoading: true,
        searchResult: [],
        searchError: null,
      });
      try {
        const response = await searchWithoutType(this.state.searchText, null, 0, 50);
        this.setState({
          searchLoading: false,
          searchError: null,
          searchResult: response.data.postsList || [],
          toggleHelpPopover: false,
        });
      } catch(e) {
        this.setState({
          searchLoading: false,
          searchError: e.error,
          searchResult: [],
          toggleHelpPopover: false,
        })
      }
    }
  }
  onSelectItemCallback = (authorID, postID) => {
    this.setState({
      searchText: "",
      searchLoading: null,
      searchResult: [],
      searchError: null,
    });
    this.props.history.push(`/full-story/${authorID}/${postID}`);
  }
  onChange = (e) => {
    this.setState({
      searchText: e.target.value,
      searchLoading: null,
      searchResult: [],
      searchError: null,
      toggleHelpPopover: false,
    });
  }
  hideSearchInfoPopover = (e) => {
    this.setState({
      toggleHelpPopover: false
    });
  }

  render() {
    const { windowWidth } = this.props;
    const { searchText, isSearchBarOpen, searchError, searchLoading, searchResult, toggleHelpPopover } = this.state;
    const placeholder = 'Search news';
    return (
      <div className="search-and-logo">
        <h1 onClick={this.goToHome} className={`logo ${isSearchBarOpen && windowWidth < 567 ? 'collapse-logo' : 'expand-logo'}`}>TopSelfNews</h1>
        <div className='search-logo-separator'></div>
        <Switch>
          <Route exact path={['/', '/user-profile']}>
            <div className={`search ${windowWidth < 768 && (isSearchBarOpen ? 'flex-grow-1 search-grow' : '')}`}>
              <div className="search-wrapper flex flex-row-nowrap justify-content-center">
                <div className="search-wrapper align-items-center">
                  <div className="flex flex-row-nowrap align-items-center">
                    <img src={close} className="icon-img icon-img-close"
                      onClick={this._closeSearchBar}/>
                    <img src={search}
                      className="icon-img icon-img-search"
                      onClick={this._openSearchBar} />
                    <div className='flex flex-row-nowrap flex-grow-1 align-items-center'>
                      <input
                        className={`search-input outline-none on-focus ${isSearchBarOpen ? 'expand-search' : 'collapse-search'}`}
                        type="text"
                        onChange={this.onChange}
                        onKeyDown={this.performSearch}
                        placeholder={placeholder}
                        value={searchText}
                      />
                      <img src={help} 
                        className={`icon-img icon-img-help ${!isSearchBarOpen && windowWidth < 768 ? 'display-none' : ''}`}
                        onClick={this._toggleHelpPopover}/>
                    </div>
                    <div className={"search-popover " + (toggleHelpPopover ? '' : 'display-none')}>
                      <SearchHelp  isOpen={toggleHelpPopover}
                      hideFunc={this.hideSearchInfoPopover}
                      noFullScreen={true}/>
                    </div>
                  </div>
                  { searchText.length > 0 && <SearchSuggestion 
                  loading={searchLoading}
                  error={searchError}
                  items={searchResult}
                  onSelectCallback={this.onSelectItemCallback}
                  /> }
                </div>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    );
  }
}
const mapStateToProps = ({window}) => {
  return {
    windowWidth: window.windowSize
  };
};
export default connect(mapStateToProps)(withRouter(SearchNLogoComponent));
