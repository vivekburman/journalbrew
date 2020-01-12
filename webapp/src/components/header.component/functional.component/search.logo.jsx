import React, { Component } from 'react';
import search from '../../../images/search.svg';
class SearchNLogoComponent extends Component {
    constructor () {
        super();
        this.state = {
            searchInputField: '',
            logoClass: '',
            searchInputClass: '',
            searchClass: '',
            hasResized: -1
        }
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleSearchRequest = this.handleSearchRequest.bind(this);
    }
    handleSearchRequest (e) {
        this.setState({searchInputField: e.target.value});
    }
    handleSearchClick(e) {
        const { searchInputClass, hasResized, searchClass } = this.state,
            { windowWidth, hasWindowResized } = this.props;
        if (windowWidth < 768) {
            // initial state, here search is closed by default
            // therefore we need to open it and close logo
            // or is closed then open and vice-versa.
            if (searchInputClass === 'collapse-search' || searchInputClass === '' ||
                hasResized !== hasWindowResized) {
                this.setState({
                    hasResized: hasWindowResized, 
                    searchInputClass: 'expand-search', 
                    logoClass: 'collapse-logo',
                    searchClass: 'flex-1'
                });
            } else {
                this.setState({
                    hasResized: hasWindowResized, 
                    searchInputClass: 'collapse-search', 
                    logoClass: 'expand-logo',
                    searchClass: 'flex-0'
                });
            }
        }
    }
    render() {
        let { searchInputField, searchClass, logoClass, hasResized, searchInputClass} = this.state,
            { windowWidth, hasWindowResized } = this.props;
        if (hasWindowResized !== hasResized && searchInputClass) {
            searchClass = '';
            logoClass = '';
            searchInputClass = '';
        }
        let placeholder = windowWidth < 576 ? 'Search' : 'Search by location, date or creator';
        return (
            <div className="search-and-logo">
                <h1 className={"logo " + logoClass}>TopSelfNews</h1>    
                <div className={"search " + searchClass}>
                    <input 
                        className={"search-input " + searchInputClass}
                        type="search"
                        placeholder={placeholder}
                        onChange={this.handleSearchRequest}
                        value={searchInputField} 
                    />
                    <figure className="figure" onClick={this.handleSearchClick}>
                        <img src={search} alt="search-icon" className="icon-img"></img>
                    </figure>
                </div>
            </div>
        );
    }
}   

export default SearchNLogoComponent;