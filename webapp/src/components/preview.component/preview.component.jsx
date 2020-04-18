import React from 'react';
import close from '../../images/close.svg';
import { connect } from "react-redux";
import './preview.component.scss';
import { hidePreview } from '../../reducers/postpreview/preview.action';

const createPost = ({ blocks= [] }) => {
  const layout = [];
  blocks.forEach((entity, index) => {
    switch(entity.type) {
      case 'header':
        layout.push(<h2 key={index} className="preview-header">{entity.data.text}</h2>);
        break;
      case 'paragraph':
        layout.push(<p key={index} className="preview-paragraph">{entity.data.text}</p>);
        break;
      case 'list':
        layout.push(<ul key={index} className="preview-ul">{
          entity.data.items.map((item, i) => {
            return (<li key={index+i} className="preview-li">{item}</li>);
          })
        }
        </ul>);
        break;
      case 'image':
        layout.push(<img key={index} className="preview-img" src={entity.data.url} alt={entity.data.caption}></img>);
        break;
      case 'video':
        debugger;
        layout.push(
          <video key={index} className="preview-video" loop preload="metadata" controls>
            <source src={entity.data.url} type="video/mp4"></source>
          </video>
        );
        break;
      case 'table':
        const temp = entity.data.content.map((rows, i) => {
          return (
            <tr key={index+i} className="preview-tr">
            {
              rows.map((data, i) => {
                return(
                  <td key={index+i} className="preview-td">{data}</td>
                );
              })
            }
            </tr>
            );
        });
        layout.push(
          <table className="preview-table">
            <tbody>
              { temp }
            </tbody>
          </table>
        );
        break;
      case 'quote':
        layout.push(
          <blockquote className="preview-blockqoute" title={entity.data.caption}>{ entity.data.text }</blockquote>
        );
        break;
      case 'delimiter':
        layout.push(
          <div className="preview-delimiter"></div>
        )
        break;
      default:
        break;
    }
  });
  return layout;
};

const Preview = (props) => {
  const { openPreview, editorData } = props;
  if (openPreview) {
    return(
      <div className="preview">
        <img src={close} alt="accordian" className="icon-img preview-close" onClick={props.hidePreview} />
        <div className="preview-container">
         { createPost(editorData) }
        </div>
      </div>
    );
  }
  return (
    <>
    </>
  );
}
const mapDispatchToProps = dispatch => ({
  hidePreview: () => dispatch(hidePreview())
});
const mapStateToProps = ({ preview, editorData }) => ({
  openPreview: preview.preview,
  editorData: editorData.editorData
});
export default connect(mapStateToProps, mapDispatchToProps)(Preview); 