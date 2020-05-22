import React from 'react';
import close from '../../images/close.svg';
import { connect } from "react-redux";
import { hidePreview } from '../../reducers/postpreview/preview.action';
import { createPost } from '../../helpers/generateHTMLView';

const Preview = (props) => {
  const { openPreview, editorData } = props;
  if (openPreview) {
    return(
      <div className="preview">
        <div className="preview-container">
          <img src={close} alt="accordian" className="icon-img icon-img-close preview-close" onClick={props.hidePreview} />
         { createPost(editorData.blocks) }
        </div>
      </div>
    );
  }
  return (
    <>
    </>
  );
}
const mapDispatchToProps = dispatch => ({
  hidePreview: () => dispatch(hidePreview())
});
const mapStateToProps = ({ preview, editorData }) => ({
  openPreview: preview.preview,
  editorData: editorData
});
export default connect(mapStateToProps, mapDispatchToProps)(Preview); 