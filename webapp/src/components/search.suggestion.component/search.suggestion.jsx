/* eslint-disable react/prop-types */
import React from 'react';
import './search.suggestion.scss';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import Skeleton from 'react-loading-skeleton';
import { getFormattedTime } from '../../helpers/util';

const getLoadingUI = () => {
  const loadingUI = [];
  for(let i = 0; i < 10; i++) {
    loadingUI.push((
      <div key={ i } className="margin-bottom-10 padding-left-15 padding-right-15">
        <div style={{lineHeight: 1.5}}>
          <Skeleton width={"100%"}/>
          <Skeleton circle={true} height={15} width={15} />
        </div>
      </div>
    ));
  }
  return loadingUI; 
}
const SearchSuggestion = ({loading, items, error, onSelectCallback}) => {
  const onNavClick = (authorID, postID) => {
    return () => onSelectCallback(authorID, postID);
  }
  return (
    <div className="suggestion-list-container">
      <SimpleBar style={{height: '100%'}}>
        {
          loading === null ?
          <div className='font-roboto margin-top-10 text-align-center search-help-text'>
            <em>Hit Enter to Search</em>
          </div>
          :
          loading ?
          <div>
            { getLoadingUI() }
          </div>
          :
          error ? 
          <div className='font-roboto text-align-center margin-top-10'>
            <span className='margin-right-5'>&#128533;</span>
            <span>{error}</span>
          </div>
          :
          items.length === 0 ?
          <div className='font-roboto text-align-center margin-top-10'>
            <span className='margin-right-5'>&#128533;</span>
            <em>No Result Found</em>
          </div>
          :
          items.map(i => {
            return (
              <div key={i.id}
              onClick={onNavClick(i.authorID, i.postID)}
              className='suggestion-item font-roboto cursor-pointer padding-left-10 padding-right-10 padding-top-10 padding-bottom-10'>
                <div className='text-ellpsis'>{i.title}</div>
                <div className='time'>{getFormattedTime(i.createdAt)}</div>
              </div>
            );
          })
        }
      </SimpleBar>
    </div>
  );
};

export default SearchSuggestion;
