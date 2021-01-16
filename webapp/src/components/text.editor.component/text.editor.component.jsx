import React from 'react';
import './text.editor.scss';
import EditorJs from 'react-editor-js';
import {EDITOR_JS_TOOLS} from './tool';
import JSONDiff from '../../helpers/jsondiff';
import { Component } from 'react';
import { createRef } from 'react';
import {setEditorData} from '../../reducers/post/post.action';
import { connect } from 'react-redux';
import workerScript from '../../helpers/uploadWorker';
import imageCompression from 'browser-image-compression';
import { convertToPng, getPngName } from '../../helpers/convertToPng';

const imageSize = 1024 * 1024 * 5;
class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.timer = 0;
    this.instanceRef = createRef(null);
    this.EDITOR_JS_TOOLS = {...EDITOR_JS_TOOLS};
    this.EDITOR_JS_TOOLS.image.config = {
      ...this.EDITOR_JS_TOOLS.image.config,
      uploader : {
        uploadByFile: this.handleEditorImageUpload,
        // uploadByURL: this.handleEditorImageUpload
      },
      defaultElements: ['withBorder', 'stretched', 'withBackground'],
      onRemove: data => console.log('Deleted', data)
    };
    this.EDITOR_JS_TOOLS.video.config = {
      ...this.EDITOR_JS_TOOLS.video.config,
      uploader : {
        uploadByFile: this.handleEditorVideoUpload,
        // uploadByURL: this.handleEditorImageUpload
      },
      defaultElements: ['withBorder', 'stretched', 'withBackground'],
      onRemove: data => console.log('Deleted', data)
    };
  }
  compressImage = (file) => {
    const options = {
      maxSizeMB: 5,
      useWebWorker: true,
      fileType: 'image/png',
    }
    return imageCompression(file, options);
  }
  handleEditorImageUpload = (fileOrURL) => {
    // return a promise
    const {currentUser} = this.props;
    if (!currentUser) {
      return Promise.reject({
        'success': 0,
        'file': {
          'url': null
        }
      });
    }
    return new Promise(async (resolve, reject) => {
      let file;
      if (fileOrURL.size > imageSize) {
        file = await this.compressImage(fileOrURL);
        const filename = getPngName(file.name);
        file= new File([file], filename, {type: 'image/png', lastModified: Date.now()});
      } else {
        file = await convertToPng(fileOrURL);
      }
      const worker = new Worker(workerScript);
      worker.addEventListener('message', (e) => {
        const data = e.data;
        return data.success == 1 ? resolve(data) : reject(data);
      });
      worker.postMessage({
        fileOrURL: file,
        token: currentUser.token,
        baseURL: window.location.origin,
        type: 1
      });
    });
  }
  handleEditorVideoUpload = (fileOrURL) => {
    const {currentUser} = this.props;
    if (!currentUser) {
      return Promise.reject({
        'success': 0,
        'file': {
          'url': null
        }
      });
    }
    return new Promise(async (resolve, reject) => {
      const worker = new Worker(workerScript);
      worker.addEventListener('message', (e) => {
        const data = e.data;
        return data.success == 1 ? resolve(data) : reject(data);
      });
      worker.postMessage({
        fileOrURL,
        token: currentUser.token,
        baseURL: window.location.origin,
        type: 0
      });
    });
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
        <EditorJs data={this.props.editorData}
          onChange={saveEditorData}
          tools={ EDITOR_JS_TOOLS }
          instanceRef = { (instance) => (this.instanceRef.current = instance) }
          placeholder={defaultPlaceholder} />
      </article>
    );
  }
}
const mapStateToProps = ({editorData, user}) => ({
  editorData: editorData.data,
  currentUser: user.currentUser
});
const mapDispatchToProps = (dispatch) => ({
  setEditorData: (payload) => dispatch(setEditorData(payload))
});
export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
