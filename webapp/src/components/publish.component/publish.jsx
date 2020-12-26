import React, { useEffect } from 'react';
import { useState } from 'react';
import upload from '../../images/upload.svg';
import close from '../../images/close.svg';
import './publish.component.scss';
import { connect } from 'react-redux';
import { useRef } from 'react';
import { Tags } from '../tags.component/tags';
import axios from 'axios';
import { setCurrentUser } from '../../reducers/user/user.action';
import silentRefresh from '../../helpers/silentRefresh';
import { css } from "@emotion/core";
import PropagateLoader from "react-spinners/PropagateLoader";
import { withRouter } from 'react-router';
import imageCompression from 'browser-image-compression';
import {convertToPng} from '../../helpers/convertToPng';
import RadioButton from '../radio.button.component/radio.button.component';

const publishPostAPI = (postId, token, formData) => {
  const _formData = new FormData();
  _formData.append('postId', postId);
  _formData.append('title', formData.title);
  _formData.append('location', formData.location);
  _formData.append('tags', formData.tags);
  _formData.append('summary', formData.summary);
  _formData.append('type', formData.type);
  _formData.append('thumb', formData.thumb);

  return axios.post('api/post/publish-post', _formData, {
    headers: {
      'Authorization': token,
      'Content-Type': 'multipart/form-data'
    }
  });
}


let file = null;
const Publish = (props) => {
  const thumbSize = 1024 * 1024 * 2;
  const types = [{
    title: 'article',
    value: 'ARTICLE'
    },
    {
      title: 'opinion',
      value: 'OPINION'
  }];
  const edData = props.editorData || {
    blocks: []
  };
  let _thumbnail = null, _summary = '';
  
  for (let i = 0; i < edData.blocks.length; i++) {
    if (item.type == 'image') {
      _thumbnail = data.url;
    } else if(item.type == 'paragraph') {
      _summary = data.text;
    }
    if (_thumbnail && _summary) {
      break;
    }
  }

  const ERR_TITLE_LIMIT = 'Title should be within 150 characters.';
  const ERR_EMPTY = 'field cannot be empty.';
  const ERR_SUMMARY = 'Summary should be within 150 characters.';
  const ERR_LOCATION = 'Location should be within 50 characters.';
  const ERR_TAGS_LIMIT = 'Tags limit reached';
  const ERR_THUMB_MAX_SIZE = 'Thumb size exceeded max 2MB';
  const ERR_TYPE_ERROR = 'Type must be one of supported types';

  const [toggle, setToggle] = useState(false);
  const [title, setFormTitle] = useState('');
  const [thumbnail, setFormThumbnail] = useState('');
  const [loader, setLoader] = useState(true);
  const [tag, setFormTag] = useState('');
  const [tagsList, setTags] = useState([]);
  const [location, setFormLocation] = useState('');
  const [summary, setFormSummary] = useState(_summary);
  const [type, setFormType] = useState(types[0].value);
  const [spinner, setSpinner] = useState(false);
  const [publishError, setPublishError] = useState(false);
  
  const fileInputRef = useRef(null);
  const tagInputRef = useRef(null);
  const summaryInputRef = useRef(null);
  const titleInputRef = useRef(null);


  const [thumbError, setThumbError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [tagError, setTagError] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [typeError, setTypeError] = useState('');


  useEffect(() => {
    if (!_thumbnail) {
      setLoader(false);
    } else {
      handleImageDrop(_thumbnail);
    }
  }, []);

  const handleToggle = () => {
    const _toggle = toggle;
    setToggle(!toggle);
    setTagError('');
    setThumbError('');
    setTitleError('');
    setLocationError('');
    setSummaryError('');
    setTypeError('');
    requestAnimationFrame(() => {
      document.body.style.overflow = _toggle ? '' : 'hidden';
    });
  }
  const handleInputOverflow = (ref, offset) => {
    requestAnimationFrame(() => {
      if (ref.current) {
        const el = ref.current;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight - offset}px`; 
      }
    });
  }
  const handleFormChange = (event) =>{
    const target = event.target;
    switch(target.name) {
      case 'thumbnail':
        preventDefaults(event);
        handleImageDrop(target.files[0]);
        break;
      case 'title':
        if (title.length == 150 && target.value.length >= 150) {
          setTitleError(ERR_TITLE_LIMIT);
          return;
        }
        else if (target.value.length == 0) {
          setTitleError('Title '+ ERR_EMPTY);
        } else {
          setTitleError('');
        }
        handleInputOverflow(titleInputRef, 10);
        setFormTitle(target.value);
        break;
      case 'location':
        if (location.length == 50 && target.value.length >= 50) {
          setLocationError(ERR_LOCATION);
          return;
        }
        else if (target.value.length == 0) {
          setLocationError('Location '+ ERR_EMPTY);
        } else {
          setLocationError('');
        }
        setFormLocation(target.value);
        break;
      case 'tags':
        if (tagsList.length == 0) {
          setTagError('Tag '+ ERR_EMPTY);
        } else if(tagsList.length == 5) {
          setTagError(ERR_TAGS_LIMIT);
          return;
        }
        setTagError('');
        setFormTag(target.value);
        break; 
      case 'summary':
        if (summary.length == 150 && target.value.length >= 150) {
          setSummaryError(ERR_SUMMARY);
          return;
        }
        else if (target.value.length == 0) {
          setSummaryError('Summary '+ ERR_EMPTY);
        } else {
          setSummaryError('');
        }
        handleInputOverflow(summaryInputRef, 10);
        setFormSummary(target.value);
        break;
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  const handlePublish = async () => {
    publishPostAPI(props.postInfo?.postId, props.currentUser?.token, {
      thumb: file,
      title: title,
      location: location,
      tags: tagsList,
      summary: summary
    }).then(() => {
      // stop spinner and go to homepage
      setSpinner(false);
      setToggle(false);
      props.history.push("/");
    }).catch(e => {
      if (e.response.status == 401) {
        silentRefresh(props.setCurrentUser).then(() => {
          // try to do same again
          handlePublish();
        });
      } else {
        //there is an error
        setSpinner(false);
        setPublishError(true);
      }
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    let flag_err = false;
    if (!file || file.size > thumbSize) {
      flag_err = true;
      setThumbError(ERR_THUMB_MAX_SIZE);
    }
    if (title.length == 0) {
      flag_err = true;
      setTitleError('Title ' + ERR_EMPTY);
    }
    if (tagsList.length == 0) {
      flag_err = true;
      setTagError('Tag ' + ERR_EMPTY);
    }
    if (location.length == 0) {
      flag_err = true;
      setLocationError('Location ' + ERR_EMPTY);
    }
    if (summary.length == 0) {
      flag_err = true;
      setSummaryError('Summary ' + ERR_EMPTY);
    }
    if (!thumbnail) {
      flag_err = true;
      setThumbError('Thumb ' + ERR_EMPTY);
    }
    if (!type || !type.length) {
      flag_err =true;
      setTypeError('Type '+ ERR_EMPTY);
    }

    if (title.length > 150) {
      flag_err = true;
      setTitleError(ERR_TITLE_LIMIT);
    }
    if (tagsList.length > 5) {
      flag_err = true;
      setTagError(ERR_TAGS_LIMIT);
    }
    if (summary.length > 150) {
      flag_err = true;
      setSummaryError(ERR_SUMMARY);
    } 
    if (location.length > 50) {
      flag_err = true;
      setLocationError(ERR_LOCATION);
    }
    
    if (types.findIndex(e => e.value == type) == -1) {
      flag_err =true;
      setTypeError(ERR_TYPE_ERROR);
    }

    if (flag_err) return;
    setSpinner(true);
    setPublishError(false);
    handlePublish();
  }

  const handleManualImageUpload = () => {
    fileInputRef.current.click();
  }

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
  const compressImage = (file) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 246.67,
      useWebWorker: true,
      fileType: 'png',
    }
    return imageCompression(file, options);
  }
  const handleImageDrop = async (_file) => {
    let compressedFile = _file;
    setLoader(true);
    if (_file.size > thumbSize) {
      compressedFile = await compressImage(_file);
    } else {
      compressedFile = await convertToPng(_file);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormThumbnail(e.target.result);
      setLoader(false);
      file = compressedFile;
    }
    reader.readAsDataURL(compressedFile);
  }
  const handleRemove = () => {
    file = null; 
    setFormThumbnail(null);
  }
  const handleRadioBtnChange = (val) => {
    if (val >= 0 && val < types.length) {
      setTypeError('');
      setFormType(types[val].value);
    } else {
      setTypeError('Type ' + ERR_EMPTY);
    }
  }
  return (
    <>
      <ul className="post-publish-component">
        <li>
          <img src={ upload } alt="upload" className="icon-img" onClick={handleToggle} />	
        </li>
      </ul>
      {
        toggle &&
        <div className={"publish-form-container " + `${!spinner ? "full-hide" : "partial-hide"}`  }>
          {spinner ? <div className="flex-row-nowrap w-100 h-100 align-items-center justify-content-center">
            <div className="publish-form publish-uploading">
              <div className="publish-heading">Publishing your news <span>&#128516;</span></div>
              <PropagateLoader
              css={css`
              top: 23%;
              display: block;
              margin: 0 auto;
            `}
            color={"#9B9B9B"}
            size={15}/>
            </div>
          </div> :
          <div className="form-wrapper">
            <div className="contents-container">
              <img src={close} alt="close" className="icon-img icon-img-close float-right" onClick={handleToggle}/>
              <div className="publish-body-wrapper">
                {publishError && <div className="publish-error"><span>&#128533;</span> Seems like there is some trouble in publishing, give it a retry</div>}
                <form className="publish-form">
                  <div className="forminput-container child-1">
                    {
                      !thumbnail ? 
                      <div>
                          { loader ? 
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
                            onDragStart={preventDefaults}
                            onDrop={(e) => {
                              preventDefaults(e);
                              handleImageDrop(e.dataTransfer.files[0]);
                            }}
                            onDragOver={preventDefaults}
                            onDragLeave={preventDefaults}>
                            <input 
                            ref={fileInputRef}
                            className="publish-form-input form-image" 
                            value={thumbnail}
                            onChange={handleFormChange}
                            required
                            type="file" accept="image/*" name="thumbnail" />
                            <p className="form-image-alt">
                              <strong className="cursor-pointer form-input-manual" onClick={handleManualImageUpload}>
                                Choose a file or 
                              </strong> drag here an image that provides a glance to story, or better 
                              use a meme to attract readers. <span>&#128521;</span>
                            </p>
                          </div>
                          }
                        <div className={"form-error " + (thumbError.length > 0 ? 'err-show' : 'err-hide')}>{thumbError}</div>
                      </div>
                    
                    :
                    <div className="form-image-wrapper">
                      <div className="thumbnail-img" style={{backgroundImage: `url(${thumbnail})`}}></div>
                      <div className="remove-btn-wrapper">
                        <span className="remove-img-btn" onClick={handleRemove}>Remove</span>
                      </div>
                    </div>
                    }
                    <div className="publish-form-input-wrapper">
                      <textarea className="publish-form-input form-title" 
                      value={title}
                      rows="1"
                      ref={titleInputRef}
                      onChange={handleFormChange}
                      required
                      type="text" placeholder="Title of News" name="title" />
                      <div className={"form-error " + (titleError.length > 0 ? 'err-show' : 'err-hide')}>{titleError}</div>
                    </div>
                    <div className="publish-form-input-wrapper">
                      <input className="publish-form-input form-location" 
                      value={location}
                      onChange={handleFormChange}
                      required
                      type="text" placeholder="Location incident took place(Vivekanand Marg, Delhi)" name="location" />
                      <div className={"form-error " + (locationError.length > 0 ? 'err-show' : 'err-hide')}>{locationError}</div>
                    </div>
                  </div>
                  <div className="forminput-container">
                    <div>
                      <div className="forminput-tag-wrapper">
                        <Tags readOnly={false} tags={tagsList} handleCrossClick={(index) => {
                          tagsList.splice(index, 1);
                          setTags([...tagsList]);
                          setFormTag('');
                          }}/>
                        {tagsList.length < 5 && <input ref={tagInputRef} className="publish-form-input form-tags" 
                        value={tag}
                        onChange={handleFormChange}
                        onKeyDown={(e) => {
                          if (e.key == 'Enter') {
                            preventDefaults(e);
                            setTags([...tagsList, tag]);
                            setFormTag('');
                          }
                        }}
                        required
                        type="text" placeholder="Add a Tag (max 5)" 
                        name="tags" />}
                      </div>
                      <div className={"form-error " + (tagError.length > 0 ? 'err-show' : 'err-hide')}>{tagError}</div>
                    </div>
                    <div>
                      <div className={`publish-form-input-wrapper flex ${props.windowWidth > 768 ? 'flex-row-nowrap align-items-center' : 'flex-column-nowrap'}`}>
                        <div class="publish-radio-title">Article Type:</div>
                        <RadioButton options={types} orientation={props.windowWidth > 768 ? 0 : 1} onChange={handleRadioBtnChange}/>
                      </div>
                      <div className={"form-error " + (typeError.length > 0 ? 'err-show' : 'err-hide')}>{typeError}</div>
                    </div>
                    <div className="publish-form-input-wrapper">
                      <textarea className="publish-form-input form-summary" 
                      value={summary}
                      onChange={handleFormChange}
                      required
                      ref={summaryInputRef}
                      onKeyDown={handleKeyDown}
                      placeholder="Summary of news" rows="1"
                      name="summary"/>
                      <div className={"form-error " + (summaryError.length > 0 ? 'err-show' : 'err-hide')}>{summaryError}</div>
                    </div>
                    <input type="submit" value="Publish Story" className="btn-primary form-submit" onClick={handleSubmit}/>
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
const mapStateToProps = ({editorData, post, user, window}) => ({
  editorData: editorData.data,
  postInfo: post.postInfo,
  currentUser: user.currentUser,
  windowWidth: window.windowSize,
});
const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (payload) => dispatch(setCurrentUser(payload))
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Publish));