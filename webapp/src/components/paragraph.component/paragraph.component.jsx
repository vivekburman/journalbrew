import React, { Component } from 'react';
import './paragraph.component.scss';
class Paragraph extends Component {
    render() {
        const { oldText=null, type, itemIndex } = this.props;
        let newText;
        switch (type) {
            case 'title':
                newText = (oldText !== null ? oldText : 'Title');  
                return (
                    <h1 data-key={itemIndex} className="oldText-holder">
                        { newText }
                    </h1>
                );
            case 'sub-title':
                newText = (oldText !== null ? oldText : 'Sub Title' );    
                return (
                    <h2 className="oldText-holder">
                        { newText }
                    </h2>
                )
            case 'image':
                return (
                    <img src="" alt="" className="image"/>
                );
            case 'video':
                break;
            case 'blockquote':
                break;
            case 'quotation':
                break;
            default:
                newText = (oldText !== null ? oldText : 'Tell your news here....'); 
                return (
                    <p data-key={itemIndex} className="oldText-holder">
                        { newText }
                    </p>
                );
        }
    }
}

// const mapStateToProps = ({ contentEdit }) => {
//     return {
//         newKey: contentEdit.newKey,
//         oldText: contentEdit.oldText
//     }
// }
export default Paragraph;