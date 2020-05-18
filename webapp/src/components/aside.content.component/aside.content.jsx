import React from 'react';
import './aside.component.scss';
import Article from '../article.component/article';
const AsideContent = (props) => {
  return(
    <div className="aside-container flex-grow-1">
      <Article type={'article'}/>
      <Article type={'opinion'} sticky={true}/>
    </div>
  );
}
export default AsideContent;