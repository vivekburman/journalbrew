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
import Axios from 'axios';

const imageSize = 1024 * 1024 * 5;
const MEDIA_TYPE = {
  image: 1,
  video: 2
};

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.pendingRemove = null;
    this.timer = 0;
    this.instanceRef = createRef(null);
    this.EDITOR_JS_TOOLS = {...EDITOR_JS_TOOLS};
    this.EDITOR_JS_TOOLS.image.config = {
      ...this.EDITOR_JS_TOOLS.image.config,
      uploader : {
        uploadByFile: this.handleEditorImageUpload,
        uploadByUrl: this.handleEditorImageUploadByURL
      },
      defaultElements: ['withBorder', 'stretched', 'withBackground'],
      onRemove: (data) => this.deleteMedia(data, MEDIA_TYPE.image)
    };
    this.EDITOR_JS_TOOLS.video.config = {
      ...this.EDITOR_JS_TOOLS.video.config,
      uploader : {
        uploadByFile: this.handleEditorVideoUpload,
        uploadByUrl: this.handleEditorVideoUploadByURL
      },
      defaultElements: ['withBorder', 'stretched', 'withBackground'],
      onRemove: (data) => this.deleteMedia(data, MEDIA_TYPE.video)
    };
  }
  componentDidMount() {
    this.props.setEditorData(null);
  }
  componentWillUnmount() {
    this.props.setEditorData(null);
  }
  handleEditorImageUploadByURL = (url) => {
    return Promise.resolve({
      "success": 1,
      "file": {
        "url": url
      }
    });
  }
  handleEditorVideoUploadByURL = (url) => {
    return Promise.resolve({
      "success": 1,
      "file": {
        "url": url
      }
    });
  }
  deleteMedia = (data, type) => {
    let pattern, regex;
    if (type == MEDIA_TYPE.image) {
      pattern = /^https:\/\/topselfnewsbucket.*.png$/;
      regex = new RegExp(pattern);
    } else {
      pattern = /^https:\/\/topselfnewsbucket.*.mp4$/;
    }
    regex = new RegExp(pattern);
    if (!regex.test(data.file.url)) return;
    Axios.post(`api/post/delete-media/${type == MEDIA_TYPE.image ? 'image' : 'video'}`, {
      mediaURL: data.file.url,
      mediaKey: data.file.key,
      postId: this.props.postInfo?.postId,
    }, {
      headers: {
        'Authorization': this.props.currentUser?.token
      }
    }).then(e => {
      this.pendingRemove = null;
    }).catch(e => {
      if (e.response.status == 401) {
        this.pendingRemove = {data, type};
      } else {
        this.pendingRemove = null;
      }
    });      
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
          'url': null,
          'key': null
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
    const self = this;
    this.timer = setTimeout(async () => {
      const newEditorData = await self.instanceRef.current.save();
      // remove unwanted data
      const diff = new JSONDiff({...self.props.editorData, time: 0, version: 0}, {...newEditorData, time: 0, version: 0});
      diff.generateObjDiff();
      self.props.setEditorData(newEditorData);
      diff.jsonPatch.length && self.props.handleSave(newEditorData, diff.jsonPatch, () => {
        if (self.pendingRemove) {
          // remove it
          self.deleteMedia(self.pendingRemove.data, self.pendingRemove.type);
        }
      });
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
const mapStateToProps = ({editorData, user, post}) => ({
  editorData: editorData.data,
  postInfo: post.postInfo,
  currentUser: user.currentUser
});
const mapDispatchToProps = (dispatch) => ({
  setEditorData: (payload) => dispatch(setEditorData(payload))
});
export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
