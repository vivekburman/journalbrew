import React from 'react';
import upload from '../../images/upload.svg';
import close from '../../images/close.svg';
import './publish.component.scss';
import { connect } from 'react-redux';
import { Tags } from '../tags.component/tags';
import { css } from "@emotion/core";
import PropagateLoader from "react-spinners/PropagateLoader";
import { withRouter } from 'react-router';
import imageCompression from 'browser-image-compression';
import {convertToPng, getPngName} from '../../helpers/convertToPng';
import RadioButton from '../radio.button.component/radio.button.component';
import { Component } from 'react';
import { createRef } from 'react';
import { publishPost } from '../../services/postService';

const publishPostAPI = (postId, token, formData) => {
  const _formData = new FormData();
  _formData.append('postId', postId);
  _formData.append('title', formData.title);
  _formData.append('location', formData.location);
  _formData.append('tags', JSON.stringify(formData.tags));
  _formData.append('summary', formData.summary);
  // _formData.append('type', formData.type);
  // _formData.append('thumb', formData.thumb);
  return publishPost(_formData);
}
const ERR_TITLE_LIMIT = 'Title should be within 150 characters.';
const ERR_EMPTY = 'field cannot be empty.';
const ERR_SUMMARY = 'Summary should be within 150 characters.';
const ERR_LOCATION = 'Location should be within 50 characters.';
const ERR_TAGS_LIMIT = 'Tags limit reached';
// const ERR_THUMB_MAX_SIZE = 'Thumb size exceeded max 2MB';
// const ERR_TYPE_ERROR = 'Type must be one of supported types';
// const thumbSize = 1024 * 1024 * 2;
// let file = null;
const types = [{
  title: 'article',
  value: 'ARTICLE'
  },
  {
    title: 'opinion',
    value: 'OPINION'
}];
class Publish extends Component {
  constructor(props) {
    super(props);
    this.edData = props.editorData || {
      blocks: []
    };
    this.handlePublish = this.handlePublish.bind(this);
    this._summary = '';
    this.item = this.edData.blocks;
    this.state = {
      toggle: false,
      title: '',
      // thumbnail: '',
      loader: false,
      tag: '',
      tagsList: [],
      location: '',
      summary: this._summary,
      // type: types[0].value,
      spinner: false,
      publishError: false,
      // thumbError: '',
      titleError: '',
      locationError: '',
      tagError: '',
      summaryError: '',
      // typeError: ''
    };
    // this.fileInputRef = createRef(null);
    this.tagInputRef = createRef(null);
    this.summaryInputRef = createRef(null);
    this.titleInputRef = createRef(null);
  }
  handleFormLoad = () => {
    this._summary = '';
    this.edData = this.props.editorData || {
      blocks: []
    };
    this.item = this.edData.blocks;
    for (let i = 0; i < this.edData.blocks.length; i++) {
      if(this.item[i].type == 'paragraph' && !this._summary) {
        this._summary = this.item[i].data.text.slice(0, 150);
        break;
      }
    }
  }
  handleToggle = () => {
    const _toggle = this.state.toggle;
    if (!_toggle) {
      this.handleFormLoad();
    }
    console.log(this._summary);
    this.setState({
      toggle: !this.state.toggle,
      tagError: '',
      // thumbError: '',
      titleError: '',
      locationError: '',
      summaryError: '',
      // typeError: '',
      publishError: false,
      title: '',
      location: '',
      tagsList: [],
      tag: '',
      // thumbnail: '',
      summary: this._summary || ''
    });
    // file = null;
    requestAnimationFrame(() => {
      document.body.style.overflow = _toggle ? '' : 'hidden';
    });
    
  }
  handleInputOverflow = (ref, offset) => {
    requestAnimationFrame(() => {
      if (ref.current) {
        const el = ref.current;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight - offset}px`; 
      }
    });
  }
  handleFormChange = (event) => {
    const target = event.target;
    switch(target.name) {
      // case 'thumbnail':
      //   this.preventDefaults(event);
      //   this.handleImageDrop(target.files[0]);
      //   break;
      case 'title':
        if (this.state.title.length == 150 && target.value.length >= 150) {
          this.setState({
            titleError: ERR_TITLE_LIMIT
          });
          return;
        }
        else if (target.value.length == 0) {
          this.setState({
            titleError: 'Title '+ ERR_EMPTY
          });
        } else {
          this.setState({
            titleError: ''
          });
        }
        this.handleInputOverflow(this.titleInputRef, 10);
        this.setState({
          title: target.value
        });
        break;
      case 'location':
        if (this.state.location.length == 50 && target.value.length >= 50) {
          this.setState({
            locationError: ERR_LOCATION
          });
          return;
        }
        else if (target.value.length == 0) {
          this.setState({
            locationError: 'Location '+ ERR_EMPTY
          });
        } else {
          this.setState({
            locationError: ''
          });
        }
        this.setState({
          location: target.value,
        });
        break;
      case 'tags':
        if (this.state.tagsList.length == 0) {
          this.setState({
            tagError: 'Tag '+ ERR_EMPTY
          });
        } else if(this.state.tagsList.length == 5) {
          this.setState({
            tagError: ERR_TAGS_LIMIT
          });
          return;
        }
        this.setState({
          tagError: '',
          tag: target.value
        });
        break; 
      case 'summary':
        if (this.state.summary.length == 150 && target.value.length >= 150) {
          this.setState({
            summaryError: ERR_SUMMARY,
          });
          return;
        }
        else if (target.value.length == 0) {
          this.setState({
            summaryError: 'Summary '+ ERR_EMPTY,
          });
        } else {
          this.setState({
            summaryError: '',
          });
        }
        this.handleInputOverflow(this.summaryInputRef, 10);
        this.setState({
          summary: target.value,
        });
        break;
    }
  }
  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  async handlePublish() {
    publishPostAPI(this.props.postInfo?.postId, this.props.currentUser?.token, {
      thumb: file,
      title: this.state.title,
      location: this.state.location,
      tags: this.state.tagsList,
      summary: this.state.summary,
      // type: this.state.type
    }).then(() => {
      // stop spinner and go to homepage
      this.setState({
        spinner: false,
        toggle: false
      });
      this.props.history.push("/");
    }).catch(e => {
      //there is an error
      this.setState({
        spinner: false,
        publishError: true
      });
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let flag_err = false;
    // if (!file || file.size > thumbSize) {
    //   flag_err = true;
    //   this.setState({
    //     thumbError: ERR_THUMB_MAX_SIZE
    //   });
    // }
    if (this.state.title.length == 0) {
      flag_err = true;
      this.setState({
        titleError: 'Title ' + ERR_EMPTY
      });
    }
    if (this.state.tagsList.length == 0) {
      flag_err = true;
      this.setState({
        tagError: 'Tag ' + ERR_EMPTY
      });
    }
    if (this.state.location.length == 0) {
      flag_err = true;
      this.setState({
        locationError: 'Location ' + ERR_EMPTY
      });
    }
    if (this.state.summary.length == 0) {
      flag_err = true;
      this.setState({
        summaryError: 'Summary ' + ERR_EMPTY
      });
    }
    // if (!this.state.thumbnail) {
    //   flag_err = true;
    //   this.setState({
    //     thumbError: 'Thumb ' + ERR_EMPTY
    //   });
    // }
    // if (!this.state.type || !this.state.type.length) {
    //   flag_err =true;
    //   this.setState({
    //     typeError: 'Type '+ ERR_EMPTY
    //   });
    // }

    if (this.state.title.length > 150) {
      flag_err = true;
      this.setState({
        titleError: ERR_TITLE_LIMIT
      });
    }
    if (this.state.tagsList.length > 5) {
      flag_err = true;
      this.setState({
        tagError: ERR_TAGS_LIMIT
      });
    }
    if (this.state.summary.length > 150) {
      flag_err = true;
      this.setState({
        summaryError: ERR_SUMMARY
      });
    } 
    if (this.state.location.length > 50) {
      flag_err = true;
      this.setState({
        locationError: ERR_LOCATION
      });
    }
    
    // if (types.findIndex(e => e.value == this.state.type) == -1) {
    //   flag_err =true;
    //   this.setState({
    //     typeError: ERR_TYPE_ERROR
    //   });
    // }

    if (flag_err) return;
    this.setState({
      spinner: true,
      publishError: false
    });
    this.handlePublish();
  }

  // handleManualImageUpload = () => {
  //   this.fileInputRef.current.click();
  // }

  preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
  // compressImage = (file) => {
  //   const options = {
  //     maxSizeMB: 2,
  //     maxWidthOrHeight: 246.67,
  //     useWebWorker: true,
  //     fileType: 'png',
  //   }
  //   return imageCompression(file, options);
  // }
  // handleImageDrop = async (_file) => {
  //   let compressedFile = _file;
  //   this.setState({
  //     loader: true
  //   });
  //   if (_file.size > thumbSize) {
  //     compressedFile = await this.compressImage(_file);
  //     const filename = getPngName(compressedFile.name);
  //     compressedFile = new File([compressedFile], filename, {type: 'image/png', lastModified: Date.now()});
  //   } else {
  //     compressedFile = await convertToPng(_file);
  //   }
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     this.setState({
  //       thumbnail: e.target.result,
  //       loader: false
  //     });
  //     file = compressedFile;
  //   }
  //   reader.readAsDataURL(compressedFile);
  // }
  // handleRemove = () => {
  //   file = null; 
  //   this.setState({
  //     thumbnail: '',
  //     loader: false
  //   });
  // }
  // handleRadioBtnChange = (val) => {
  //   if (val >= 0 && val < types.length) {
  //     this.setState({
  //       typeError: '',
  //       type: types[val].value
  //     });
  //   } else {
  //     this.setState({
  //       typeError: 'Type ' + ERR_EMPTY,
  //     });
  //   }
  // }
  render() {
    return (
      <>
        <ul className="post-publish-component">
          <li>
            <img src={ upload } alt="upload" className="icon-img" onClick={this.handleToggle} />	
          </li>
        </ul>
        {
          this.state.toggle &&
          <div className={"publish-form-container " + `${!this.state.spinner ? "full-hide" : "partial-hide"}`  }>
            {this.state.spinner ? <div className="flex-row-nowrap w-100 h-100 align-items-center justify-content-center">
              <div className="publish-form publish-uploading flex-column-nowrap">
                <div className="publish-heading">Publishing your news <span>&#128516;</span></div>
                <PropagateLoader
                css={css`
                position: relative;
                left: -15px;
                align-self: center;
                top: 42px;
              `}
              color={"#9B9B9B"}
              size={15}/>
              </div>
            </div> :
            <div className="form-wrapper">
              <div className="contents-container">
                <img src={close} alt="close" className="icon-img icon-img-close float-right" onClick={this.handleToggle}/>
                <div className="publish-body-wrapper">
                  {this.state.publishError && <div className="publish-error"><span>&#128533;</span> Seems like there is some trouble in publishing, give it a retry</div>}
                  <form className="publish-form">
                    <div className="forminput-container child-1">
                      {/* {
                        !this.state.thumbnail ? 
                        <div>
                            { this.state.loader ? 
                              <div className="form-image-wrapper">
                                <div className="form-image-alt form-loader">
                                <PropagateLoader
                                  css={css`
                                  display: block;
                                  margin: 0 auto;
                                `}
                                color={"#9B9B9B"}
                                size={15}/>
                                </div>
                              </div> 
                              : 
                              <div className="form-image-wrapper"
                              onDragStart={this.preventDefaults}
                              onDrop={(e) => {
                                this.preventDefaults(e);
                                this.handleImageDrop(e.dataTransfer.files[0]);
                              }}
                              onDragOver={this.preventDefaults}
                              onDragLeave={this.preventDefaults}>
                              <input 
                              ref={this.fileInputRef}
                              className="publish-form-input form-image" 
                              value={this.state.thumbnail}
                              onChange={this.handleFormChange}
                              required
                              type="file" accept="image/*" name="thumbnail" />
                              <p className="form-image-alt">
                                <strong className="cursor-pointer form-input-manual" onClick={this.handleManualImageUpload}>
                                  Choose a file or 
                                </strong> drag here an image that provides a glance to story, or better 
                                use a meme to attract readers. <span>&#128521;</span>
                              </p>
                            </div>
                            }
                          <div className={"form-error " + (this.state.thumbError.length > 0 ? 'err-show' : 'err-hide')}>{this.state.thumbError}</div>
                        </div>
                      
                      :
                      <div className="form-image-wrapper">
                        <div className="thumbnail-img" style={{backgroundImage: `url(${this.state.thumbnail})`}}></div>
                        <div className="remove-btn-wrapper">
                          <span className="remove-img-btn" onClick={this.handleRemove}>Remove</span>
                        </div>
                      </div>
                      } */}
                      <div className="publish-form-input-wrapper">
                        <textarea className="publish-form-input form-title" 
                        value={this.state.title}
                        rows="1"
                        ref={this.titleInputRef}
                        onChange={this.handleFormChange}
                        required
                        type="text" placeholder="Title of News" name="title" />
                        <div className={"form-error " + (this.state.titleError.length > 0 ? 'err-show' : 'err-hide')}>{this.state.titleError}</div>
                      </div>
                      <div className="publish-form-input-wrapper">
                        <input className="publish-form-input form-location" 
                        value={this.state.location}
                        onChange={this.handleFormChange}
                        required
                        type="text" placeholder="Location ex: (Vivekanand Marg, Delhi)" name="location" />
                        <div className={"form-error " + (this.state.locationError.length > 0 ? 'err-show' : 'err-hide')}>{this.state.locationError}</div>
                      </div>
                    </div>
                    <div className="forminput-container">
                      <div>
                        <div className="forminput-tag-wrapper">
                          <Tags readOnly={false} tags={this.state.tagsList} handleCrossClick={(index) => {
                            this.state.tagsList.splice(index, 1);
                            this.setState({
                              tagsList: [...this.state.tagsList],
                              tag: ''
                            });
                            }}/>
                          {this.state.tagsList.length < 5 && <input ref={this.tagInputRef} className="publish-form-input form-tags" 
                          value={this.state.tag}
                          onChange={this.handleFormChange}
                          onKeyDown={(e) => {
                            if (e.key == 'Enter') {
                              this.preventDefaults(e);
                              this.setState({
                                tagsList: [...this.state.tagsList, this.state.tag],
                                tag: ''
                              });
                            }
                          }}
                          required
                          type="text" placeholder="Add a Tag (max 5)" 
                          name="tags" />}
                        </div>
                        <div className={"form-error " + (this.state.tagError.length > 0 ? 'err-show' : 'err-hide')}>{this.state.tagError}</div>
                      </div>
                      {/* <div>
                        <div className={`publish-form-input-wrapper flex ${this.props.windowWidth > 768 ? 'flex-row-nowrap align-items-center' : 'flex-column-nowrap'}`}>
                          <div className="publish-radio-title">Article Type:</div>
                          <RadioButton options={types} orientation={this.props.windowWidth > 768 ? 0 : 1} onChange={this.handleRadioBtnChange}/>
                        </div>
                        <div className={"form-error " + (this.state.typeError.length > 0 ? 'err-show' : 'err-hide')}>{this.state.typeError}</div>
                      </div> */}
                      <div className="publish-form-input-wrapper">
                        <textarea className="publish-form-input form-summary" 
                        value={this.state.summary}
                        onChange={this.handleFormChange}
                        required
                        ref={this.summaryInputRef}
                        onKeyDown={this.handleKeyDown}
                        placeholder="Summary of news" rows="1"
                        name="summary"/>
                        <div className={"form-error " + (this.state.summaryError.length > 0 ? 'err-show' : 'err-hide')}>{this.state.summaryError}</div>
                      </div>
                      <input type="submit" value="Publish Story" className="btn-primary form-submit" onClick={this.handleSubmit}/>
                    </div>
                    </form>
                </div>
              </div>
            </div>}
          </div>
        }
      </>
    );
  }

}
const mapStateToProps = ({editorData, post, user, window}) => ({
  editorData: editorData.data,
  postInfo: post.postInfo,
  currentUser: user.currentUser,
  windowWidth: window.windowSize,
});

export default connect(mapStateToProps)(withRouter(Publish));