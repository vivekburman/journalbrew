import React from 'react';
import { parseHTMLToReact } from './jsontohtml';
export const createPost = (blocks) => {
  const layout = [];
  blocks.forEach((entity, index) => {
    switch(entity.type) {
      case 'header':
        switch (entity.data.level) {
          case 1:
            layout.push(<h1 key={index} className="preview-header">{parseHTMLToReact(entity.data.text)}</h1>);
            break;
          case 3:
            layout.push(<h3 key={index} className="preview-header">{parseHTMLToReact(entity.data.text)}</h3>);
            break;
          case 4:
            layout.push(<h4 key={index} className="preview-header">{parseHTMLToReact(entity.data.text)}</h4>);
            break;
          case 5:
            layout.push(<h5 key={index} className="preview-header">{parseHTMLToReact(entity.data.text)}</h5>);
            break;
          case 6:
            layout.push(<h6 key={index} className="preview-header">{parseHTMLToReact(entity.data.text)}</h6>);
            break;
          default:
            layout.push(<h2 key={index} className="preview-header">{parseHTMLToReact(entity.data.text)}</h2>);
            break;
        }
        break;
      case 'paragraph':
        layout.push(<p key={index} className="preview-paragraph">{parseHTMLToReact(entity.data.text)}</p>);
        break;
      case 'list':
        layout.push(<ul key={index} className="preview-ul">{
          entity.data.items.map((item, i) => {
            return (<li key={index+i} className="preview-li">{parseHTMLToReact(item)}</li>);
          })
        }
        </ul>);
        break;
      case 'image':
        layout.push(<img key={index} className="preview-img" src={entity.data.url} alt={entity.data.caption}></img>);
        break;
      case 'video':
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
                  <td key={index+i} className="preview-td">{parseHTMLToReact(data)}</td>
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
          <blockquote className="preview-blockqoute" title={parseHTMLToReact(entity.data.caption)}>{ parseHTMLToReact(entity.data.text) }</blockquote>
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