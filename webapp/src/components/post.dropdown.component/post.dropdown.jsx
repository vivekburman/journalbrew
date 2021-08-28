import React from 'react';
import withFocusBlur from '../focus.blur.hoc.component/focus.blur';
import './post.dropdown.scss';

const PostDropDown = (props) => {

  const { hideFunc } = props;

  const _toggleDD = () => {
    hideFunc();
  }  
  return (
      <>
        <ul 
          className="post-list-wrapper"
          onClick={_toggleDD}>
          <li className="post-list-item">Edit Draft</li>
          <li className="post-list-item">Delete Draft</li>
        </ul>
      </>
    );
}

export default withFocusBlur(PostDropDown);