import React from 'react';
import './text.editor.scss';
import EditorJS from '../../_internal/react-editor-js/lib/index';
import {EDITOR_JS_TOOLS} from './tool';
import JSONDiff from '../../helpers/jsondiff';
import { Component } from 'react';
import { createRef } from 'react';

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.timer = 0;
    this.instanceRef = createRef(null);
    this.state = {
      editorData: {}
    }
  }
  saveEditorData = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      const newEditorData = await this.instanceRef.current.save();
      // remove unwanted data
      const diff = new JSONDiff({...this.state.editorData, time: 0, version: 0}, {...newEditorData, time: 0, version: 0});
      diff.generateObjDiff();
      diff.jsonPatch.length && this.props.handleSave(newEditorData, diff.jsonPatch);
      this.setState({editorData: newEditorData});
    }, 1000);
  }

  render() {
    const defaultPlaceholder = 'Let the world know what happend!';
  
    return (
      <article className='text-editor-container outline-none'>
        <EditorJS data={this.state.editorData}
          onChange={() => this.saveEditorData()}
          tools={ EDITOR_JS_TOOLS }
          instanceRef = { (instance) => (this.instanceRef.current = instance) }
          placeholder={defaultPlaceholder} />
      </article>
    );
  }
}
export default TextEditor;
