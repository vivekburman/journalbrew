import React from 'react';
import './search.suggestion.scss';
import search from '../../images/search.svg';
import SimpleBar from 'simplebar-react';


const dummyData = [];
for (let i = 0; i < 100; i++) {
  dummyData.push({
    title: `Hellow world ${i}`
  });
}
const SearchSuggestion = ({ suggestions = dummyData }) => {
  return(
    <ul className="suggestion-list-container">
      <SimpleBar style={{ height: '100%' }}>
        { suggestions.map((entry, index) => {
          return (
            <li key={index} className="suggestion-list-item flex flex-row-nowrap align-items-center">
              <img src={search} alt="search" className="icon-img" />
              <span className="suggestion-list-title">{ entry.title || 'This is a placeholder' }</span>
            </li>
          );
        }) }
      </SimpleBar>
    </ul>
  );
}

export default SearchSuggestion;