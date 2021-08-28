import React from 'react';
import withFocusBlur from '../focus.blur.hoc.component/focus.blur';
import './post.dropdown.scss';

const PostDropDown = (props) => {

  const { hideFunc, onDeleteMenuClick, onEditMenuClick } = props;

  const _toggleDD = () => {
    hideFunc();
  }  
  return (
      <>
        <ul 
          className="post-list-wrapper"
          onClick={_toggleDD}>
          <li className="post-list-item" onClick={onEditMenuClick}>Edit Draft</li>
          <li className="post-list-item" onClick={onDeleteMenuClick}>Delete Draft</li>
        </ul>
      </>
    );
}

export default withFocusBlur(PostDropDown);