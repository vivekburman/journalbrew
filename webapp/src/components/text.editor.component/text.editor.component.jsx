/* eslint-disable react/prop-types */
import React, {useRef} from 'react';
import './text.editor.scss';
import EditorJS from '../../_internal/react-editor-js/lib/index';
import {EDITOR_JS_TOOLS} from './tool';
import Preview from '../preview.component/preview';
import {handleEditorData} from '../../reducers/editordata/editor.data.action';
import {connect} from 'react-redux';
import JSONDiff from '../../helpers/jsondiff';

const TextEditor = (props) => {
  const instanceRef = useRef(null);
  let timer = 0;
  let data = {};
  function handleSave(e) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      let prevData = await instanceRef.current.save();
      let diff = new JSONDiff(data, prevData);
      diff.generateObjDiff();
      data = prevData;
      console.log('json diff = ', diff.jsonPatch);
      props.handleEditorData(data);
    }, 200);
  }
  const defaultPlaceholder = 'Let the world know what happend!';
  return (
    <article className='text-editor-container outline-none'>
      <EditorJS data={data}
        onChange={handleSave}
        tools={ EDITOR_JS_TOOLS }
        instanceRef = { (instance) => (instanceRef.current = instance) }
        placeholder={defaultPlaceholder} />
      <Preview />
    </article>
  );
};

const mapDispatchToProps = (dispatch) => ({
  handleEditorData: (data) => dispatch(handleEditorData(data)),
});
export default connect(null, mapDispatchToProps)(TextEditor);
