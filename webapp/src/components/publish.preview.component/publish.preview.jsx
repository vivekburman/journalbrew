import React from 'react';
import upload from '../../images/upload.svg';
import preview from '../../images/preview.svg';
import './publish.preview.component.scss';
import { showPreview } from '../../reducers/postpreview/preview.action';
import { connect } from 'react-redux';

const PublishPreview = (props) => {
  return (
    <ul className="post-preview-component">
      <li>
        <img src={ upload } alt="upload" className="icon-img" />	
      </li>
      {/* <li onClick={props.showPreview}>
        <img src={ preview } alt="preview" className="icon-img" />
      </li> */}
    </ul>
  );
}
const mapDispatchToProps = dispatch => ({
  showPreview: () => dispatch(showPreview())
});
export default connect(null, mapDispatchToProps)(PublishPreview);