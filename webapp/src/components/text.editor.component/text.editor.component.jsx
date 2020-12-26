import React from 'react';
import './text.editor.scss';
import EditorJS from '../../_internal/react-editor-js/lib/index';
import {EDITOR_JS_TOOLS} from './tool';
import JSONDiff from '../../helpers/jsondiff';
import { Component } from 'react';
import { createRef } from 'react';
import {setEditorData} from '../../reducers/post/post.action';
import { connect } from 'react-redux';

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.timer = 0;
    this.instanceRef = createRef(null);
  }
  saveEditorData = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      const newEditorData = await this.instanceRef.current.save();
      // remove unwanted data
      const diff = new JSONDiff({...this.props.editorData, time: 0, version: 0}, {...newEditorData, time: 0, version: 0});
      diff.generateObjDiff();
      this.props.setEditorData(newEditorData);
      diff.jsonPatch.length && this.props.handleSave(newEditorData, diff.jsonPatch);
    }, 500);
  }

  render() {
    const defaultPlaceholder = 'Let the world know what happend!';
    const saveEditorData = this.saveEditorData;
    return (
      <article className='text-editor-container outline-none'>
        <EditorJS data={this.props.editorData}
          onChange={saveEditorData}
          tools={ EDITOR_JS_TOOLS }
          instanceRef = { (instance) => (this.instanceRef.current = instance) }
          placeholder={defaultPlaceholder} />
      </article>
    );
  }
}
const mapStateToProps = ({editorData}) => ({
  editorData: editorData.data
});
const mapDispatchToProps = (dispatch) => ({
  setEditorData: (payload) => dispatch(setEditorData(payload))
});
export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
