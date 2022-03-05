import React from 'react';
import './text.editor.scss';
import EditorJs from 'react-editor-js';
import {EDITOR_JS_TOOLS} from './tool';
import JSONDiff from '../../helpers/jsondiff';
import { Component } from 'react';
import { createRef } from 'react';
import {setEditorData} from '../../reducers/post/post.action';
import { connect } from 'react-redux';
// import workerScript from '../../helpers/uploadWorker';
import imageCompression from 'browser-image-compression';
// import { convertToPng, getPngName } from '../../helpers/convertToPng';
import { setPostInfo } from '../../reducers/post/post.action';
import { withRouter } from 'react-router';    
import { getDraftById } from '../../services/postService';
import Error from '../error.component/error';


// const imageSize = 1024 * 1024 * 5;
// const MEDIA_TYPE = {
//   image: 1,
//   video: 2
// };

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.MODES = {
      EDIT: 1,
      NEW: 2,
      NONE: 3
    };
    this.pendingRemove = null;
    this.timer = 0;
    this.currentMode = this.MODES.NONE;
    this.state = {
      error: false,
      updateOrCreateRESTError: false,
    };
    this.instanceRef = createRef(null);
    //bind this
    this.EDITOR_JS_TOOLS = {...EDITOR_JS_TOOLS};
    this.EDITOR_JS_TOOLS.image.config = {
      ...this.EDITOR_JS_TOOLS.image.config,
      uploader : {
        // uploadByFile: this.handleEditorImageUpload,
        uploadByUrl: this.handleEditorImageUploadByURL
      },
      defaultElements: ['withBorder', 'stretched', 'withBackground'],
      // onRemove: (data) => this.deleteMedia(data, MEDIA_TYPE.image)
    };
    this.EDITOR_JS_TOOLS.video.config = {
      ...this.EDITOR_JS_TOOLS.video.config,
      uploader : {
        // uploadByFile: this.handleEditorVideoUpload,
        uploadByUrl: this.handleEditorVideoUploadByURL
      },
      defaultElements: ['withBorder', 'stretched', 'withBackground'],
      // onRemove: (data) => this.deleteMedia(data, MEDIA_TYPE.video)
    };
  }
  componentDidMount() {
    this.editOrNewMode().then(res => {
      if (res == null) return this.setState({error: true});
      if (typeof res === "object") {
        this.currentMode = this.MODES.EDIT;
        this.props.setPostInfo({postId: res.postId});
        this.props.setEditorData(res.data);  
      }    
      this.setState({
        error: false,
      });
    }).catch(() => {
      this.setState({error: true});
    });
  }
  componentWillUnmount() {
    this.props.setEditorData(null);
  }
  getArticleById = (postId) => {
    if (!postId) return Promise.reject();
    return getDraftById(postId);
  }
  editOrNewMode = () => {
    if(this.props.location.pathname.startsWith("/edit-story/")) {
      const postId = this.props.match.params.postId;
      return this.getArticleById(postId)
      .then(( { data } ) => {
        return {data: data.story, postId: postId}
      });
    }
    this.currentMode = this.MODES.NEW;
    return Promise.resolve(1);
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
  // deleteMedia = (data, type) => {
  //   let pattern, regex;
  //   if (type == MEDIA_TYPE.image) {
  //     pattern = /^https:\/\/topselfnewsbucket.*.png$/;
  //     regex = new RegExp(pattern);
  //   } else {
  //     pattern = /^https:\/\/topselfnewsbucket.*.mp4$/;
  //   }
  //   regex = new RegExp(pattern);
  //   if (!regex.test(data.file.url)) return;
  //   Axios.post(`api/post/delete-media/${type == MEDIA_TYPE.image ? 'image' : 'video'}`, {
  //     mediaURL: data.file.url,
  //     mediaKey: data.file.key,
  //     postId: this.props.postInfo?.postId,
  //   }, {
  //     headers: {
  //       'Authorization': this.props.currentUser?.token
  //     }
  //   }).then(e => {
  //     this.pendingRemove = null;
  //   }).catch(e => {
  //     if (e.response.status == 401) {
  //       this.pendingRemove = {data, type};
  //     } else {
  //       this.pendingRemove = null;
  //     }
  //   });      
  // }

  compressImage = (file) => {
    const options = {
      maxSizeMB: 5,
      useWebWorker: true,
      fileType: 'image/png',
    }
    return imageCompression(file, options);
  }
  // handleEditorImageUpload = (fileObj) => {
  //   // return a promise
  //   const {currentUser} = this.props;
  //   if (!currentUser) {
  //     return Promise.reject({
  //       'success': 0,
  //       'file': {
  //         'url': null,
  //         'key': null
  //       }
  //     });
  //   }
  //   return new Promise(async (resolve, reject) => {
  //     let file;
  //     if (fileObj.size > imageSize) {
  //       file = await this.compressImage(fileObj);
  //       const filename = getPngName(file.name);
  //       file= new File([file], filename, {type: 'image/png', lastModified: Date.now()});
  //     } else {
  //       file = await convertToPng(fileObj);
  //     }
  //     const self = this;
  //     const worker = new Worker(workerScript);
  //     worker.addEventListener('message', (e) => {
  //       const data = e.data;
  //       if (data.success == -1) {
  //         silentRefresh(self.props.setCurrentUser).then(() => {
  //           if (!self.props.currentUser) {
  //             reject({...data, success: 0});
  //           } else {
  //             worker.postMessage({
  //               file: file,
  //               token: self.props.currentUser.token,
  //               baseURL: window.location.origin,
  //               type: 1
  //             });
  //           }
  //         }).catch(() => reject({...data, success: 0}));
  //       } else {
  //         return data.success == 1 ? resolve(data) : reject(data);
  //       }
  //     });
  //     worker.postMessage({
  //       file: file,
  //       token: currentUser.token,
  //       baseURL: window.location.origin,
  //       type: 1
  //     });
  //   });
  // }
  // handleEditorVideoUpload = (fileObj) => {
  //   const {currentUser} = this.props;
  //   if (!currentUser) {
  //     return Promise.reject({
  //       'success': 0,
  //       'file': {
  //         'url': null,
  //         'key': null
  //       }
  //     });
  //   }
  //   return new Promise((resolve, reject) => {
  //     const worker = new Worker(workerScript);
  //     const self = this;

  //     worker.addEventListener('message', (e) => {
  //       const data = e.data;
  //       if (data.success == -1) {
  //         silentRefresh(self.props.setCurrentUser).then(() => {
  //           if (!self.props.currentUser) {
  //             reject({...data, success: 0});
  //           } else {
  //             worker.postMessage({
  //               file: fileObj,
  //               token: self.props.currentUser.token,
  //               baseURL: window.location.origin,
  //               type: 0
  //             });
  //           }
  //         }).catch(() => reject({...data, success: 0}));
  //       } else {
  //         return data.success == 1 ? resolve(data) : reject(data);
  //       }
  //     });
  //     worker.postMessage({
  //       file: fileObj,
  //       token: currentUser.token,
  //       baseURL: window.location.origin,
  //       type: 0
  //     });
  //   });
  // }
  saveEditorData = () => {
    if (this.timer) clearTimeout(this.timer);
    const self = this;
    this.timer = setTimeout(async () => {
      const newEditorData = await self.instanceRef.current.save();
      // remove unwanted data
      const diff = new JSONDiff({...self.props.editorData, time: 0, version: 0}, {...newEditorData, time: 0, version: 0});
      diff.generateObjDiff();
      self.props.setEditorData(newEditorData);
      if (self.checkForMeaningfulUpdate(diff.jsonPatch)) {
        // self.props.handleSave(newEditorData, diff.jsonPatch, () => {
        //   // if (self.pendingRemove) {
        //   //   // remove it
        //   //   self.deleteMedia(self.pendingRemove.data, self.pendingRemove.type);
        //   // }
        // });
        self.props.handleSave(newEditorData, diff.jsonPatch);
      }
    }, 500);
  }
  checkForMeaningfulUpdate = (jsonPatch) => {
    if (jsonPatch.length == 0) return;
    // TODO: cleanup data that is left empty
    return true;
  }

  render() {
    const defaultPlaceholder = 'Let the world know what happend!';
    const saveEditorData = this.saveEditorData;
    const {error} = this.state;
    const data = this.props.editorData;
    return (
      <article className='text-editor-container outline-none'>
        {error ?
        <Error /> 
        :
        this.currentMode === this.MODES.NONE ? 
        <></>
        :
        <EditorJs 
          data={data}
          onChange={saveEditorData}
          tools={ this.EDITOR_JS_TOOLS }
          instanceRef = { (instance) => (this.instanceRef.current = instance) }
          placeholder={defaultPlaceholder} />
        }
      </article>
    );
  }
}
const mapStateToProps = ({editorData, user}) => ({
  editorData: editorData.data,
  currentUser: user.currentUser
});
const mapDispatchToProps = (dispatch) => ({
  setEditorData: (payload) => dispatch(setEditorData(payload)),
  setPostInfo: payload => dispatch(setPostInfo(payload))
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TextEditor));
