import React, { useRef } from 'react';
import './text.editor.scss';
import EditorJS from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './tool';
const TextEditor = () => {
	const instanceRef = useRef(null);
	const data = {};
	async function handleSave() {
		await instanceRef.current.save();
	} 
	const defaultPlaceholder = 'Let the world know what happend!';
	return (
		<article className='text-editor-container'>
			<EditorJS data={data}
				onChange={handleSave}
				tools={ EDITOR_JS_TOOLS } 
				instanceRef = { instance => (instanceRef.current = instance) }
				placeholder={defaultPlaceholder} />
		</article>
	);
}
export default TextEditor;