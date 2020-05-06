import React, { useRef } from 'react';
import './text.editor.scss';
import EditorJS from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './tool';
import Preview from '../preview.component/preview';
import { handleEditorData } from '../../reducers/editordata/editor.data.action';
import { connect } from 'react-redux';

const TextEditor = (props) => {
	const instanceRef = useRef(null);
	let data = {};
	async function handleSave() {
		data = instanceRef.current.save && await instanceRef.current.save();
		props.handleEditorData(data);
	} 
	const defaultPlaceholder = 'Let the world know what happend!';
	return (
		<article className='text-editor-container'>
			<EditorJS data={data}
				onChange={handleSave}
				tools={ EDITOR_JS_TOOLS } 
				instanceRef = { instance => (instanceRef.current = instance) }
				placeholder={defaultPlaceholder} />
			<Preview />
		</article>
	);
}

const mapDispatchToProps = dispatch => ({
	handleEditorData: (data) => dispatch(handleEditorData(data))
});
export default connect(null, mapDispatchToProps)(TextEditor);