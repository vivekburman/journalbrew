import React from 'react';
import './tags.component.scss';

const getCapitalizedText = (str) => {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}


const createTags = (tags=[], readOnly, handleCrossClick) => {
  
  const _handleCrossClick = (e) => {
    handleCrossClick(+e.target.getAttribute("data-index"));
  }


  return tags.map((item, index) => {
    if (readOnly) {
      return (
        <span key={item} className="tag">{getCapitalizedText(item)}</span>
      );
    }
    else {
      return (
        <span key={item} className="tag tag-closeable">
          <span title={item} className="tag-text">{getCapitalizedText(item)}</span>
          <i className="tag-cross" data-index={index} onClick={_handleCrossClick}>&times;</i>
        </span>
      );
    }
  });
}
export const Tags = ({ tags=[], readOnly=true, handleCrossClick }) => {
  return(
    <>
      { createTags(tags, readOnly, handleCrossClick) }
    </>
  );
}