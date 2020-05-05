import React from 'react';
import './tags.component.scss';
const createTags = (tags=[]) => {
  return tags.map(item => {
    return (
      <li className="tag">{item}</li>
    );
  });
}
export const Tags = ({ tags=[] }) => {
  return(
    <ul className="flex flex-row-wrap tags-container">
      { createTags(tags) }
    </ul>
  );
}