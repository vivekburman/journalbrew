import React, { Component } from 'react';
import TextEditor from '../text.editor.component/text.editor.component';
import {connect} from 'react-redux';
import { setPostInfo } from '../../reducers/post/post.action';
import withAuth from '../hoc/withAuth';
import { withRouter } from 'react-router';
import { createPostById, updatePostById } from '../../services/postService';


const updatePostREST = (data, token, postId=null) => {
  if (postId) {
    return updatePostById(data, postId, token);
  }
  return Promise.reject();
}
const createPostREST = (data, token) => {
  return createPostById(data, token);
}

class CreateOrUpdatePost extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.state = {
      error: "",
    }
  }
  componentDidMount() {
    this.props.setPostInfo(null);
  }
  componentWillUnmount() {
    this.props.setPostInfo(null);
  }
  handleSave(newEditorData, jsonPatch) {
    this.setState({
      error: ""
    });
    const props = this.props;
    // 1. call create-post or update post to create new post
    const promise = props.postInfo?.postId  ? updatePostREST(jsonPatch, props.currentUser?.token, props.postInfo?.postId) 
      : createPostREST(newEditorData, props.currentUser?.token);
    promise.then(({ data }) => {
      if (data.post_id) {
        // update post_id
        props.setPostInfo({...props.postInfo, postId: data.post_id});
        // move to edit page, if not on it
        if (props.history.location.pathname === "/new-story") {
          props.history.push(`/edit-story/${data.post_id}`);
        }
      }
    }).catch(e => {
      this.setState({
        error: `Unable to save new ${props.postInfo?.postId ? 'article' : 'changes'}, last state is saved. Please logout and login`
      });
    }) 
  }

  render() {
    return (
      <>
      <div className={!this.state.error ? "display-none" : "w-100 h-100 flex-row-nowrap position-absolute align-items-center justify-content-center"}
      style={{"top": "0"}}>
        <div className="publish-error" style={{"padding": "30px"}}>
          <span>&#128533;</span>
          <span>{this.state.error}</span>
        </div>
      </div>
        <TextEditor handleSave={this.handleSave} />
      </>
    );
  }
}

const mapStateToProps = ({post, user}) => ({
  postInfo: post.postInfo,
  currentUser: user.currentUser
});

const mapDispatchToProps = (dispatch) => ({
  setPostInfo: payload => dispatch(setPostInfo(payload))
});
export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(withAuth(CreateOrUpdatePost)));