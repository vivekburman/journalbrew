import React, { Component } from 'react';
import './text.editor.scss';
import Paragraph from '../paragraph.component/paragraph.component';
import { connect } from 'react-redux';
import { updateText } from '../../reducers/contentEdit/contentEdit.action';

/*
    onKeyDown for everything as onKeyPress is deprecated
*/
class TextEditor extends Component {
    handleKeyPressedEvent = (e) => {
        e.persist();
        const keyCode = e.which || e.keyCode;
        const charKey = e.key;
        const currentNode = window.getSelection().focusNode;
        const text = currentNode.textContent;
        const currentNodeDataKey = currentNode.parentNode.attributes['data-key'].value;
        switch ( keyCode ) {
            case 8:
                // backspace
                this.props.updateText({ paragraphId: currentNodeDataKey, oldText: text.slice(0, -1) });
                break;
            case 46:
                // delete
                break;
            default:
                this.props.updateText({ paragraphId: currentNodeDataKey, oldText: text + charKey });
                break;
        }
    }
    render () {
        let i = 0;
        return (
            <article 
                suppressContentEditableWarning={ true }
                contentEditable='true'
                className="text-editor-conatiner"
                onKeyDown={ this.handleKeyPressedEvent }
                >
                <Paragraph itemIndex={++i} type='title'/>
                <Paragraph itemIndex={++i} />
            </article>
        );
    }
}
export default connect(null, { updateText })(TextEditor);