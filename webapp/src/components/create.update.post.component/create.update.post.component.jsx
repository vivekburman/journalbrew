import React, { Component } from 'react';
import withAuth from '../hoc/withAuth';
import TextEditor from '../text.editor.component/text.editor.component';
import {connect} from 'react-redux';
import axios from 'axios';
import silentRefresh from '../../helpers/silentRefresh';
import { setPostInfo } from '../../reducers/post/post.action';
import { setCurrentUser } from '../../reducers/user/user.action';

const createOrUpdatePostREST = (data, token, postId=null) => {
  if (postId) {
    return axios.patch('api/post/update-post', {
      storypatchData: data,
      postId: postId
    },  {
      headers: {
        'Authorization': token
      }
    });
  }
  return axios.post('api/post/create-post', {
    postStory: data
  }, {
    headers: {
      'Authorization': token
    }
  });
}

class CreateOrUpdatePost extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }
  handleSave(newEditorData, jsonPatch) {
    const props = this.props;
    // 1. call create-post or update post to create new post
    createOrUpdatePostREST(props.postInfo?.postId ? jsonPatch : newEditorData, props.currentUser?.token, props.postInfo?.postId)
    .then(({data}) => {
      if (data.post_id) {
        // update post_id
        props.setPostInfo({...props.postInfo, postId: data.post_id});
      }
    })
    .catch((e) => {
      // 2. if fails call silent refresh  
      if (e.response.status == 401) {
        silentRefresh(props.setCurrentUser).then(() => {
          // try to do same again
          this.handleSave(newEditorData, jsonPatch);
        }); // if it fails then props.currentUser will be false so, it will automatically show login modal
      }
    });
    // 4. else server error
  }

  shouldComponentUpdate() {
    // no need to update text editor
    return false;
  }
  render() {

    return (
      <TextEditor handleSave={this.handleSave} />
    );
  }
}

const mapStateToProps = ({post, user}) => ({
  postInfo: post.postInfo,
  currentUser: user.currentUser
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (payload) => dispatch(setCurrentUser(payload)),
  setPostInfo: payload => dispatch(setPostInfo(payload))
});
export default  connect(mapStateToProps, mapDispatchToProps)(CreateOrUpdatePost);