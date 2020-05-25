import React from 'react';
import { parseHTMLToReact } from '../../helpers/jsontohtml';
import './news.template.component.scss';

export const renderTemplate = (blocks=[]) => {
  const layout = [];
  blocks.forEach((entity, index) => {
    switch(entity.type) {
      case 'header':
        switch (entity.data.level) {
          case 1:
            layout.push(<h1 key={index} className="template-header">{parseHTMLToReact(entity.data.text)}</h1>);
            break;
          case 3:
            layout.push(<h3 key={index} className="template-header">{parseHTMLToReact(entity.data.text)}</h3>);
            break;
          case 4:
            layout.push(<h4 key={index} className="template-header">{parseHTMLToReact(entity.data.text)}</h4>);
            break;
          case 5:
            layout.push(<h5 key={index} className="template-header">{parseHTMLToReact(entity.data.text)}</h5>);
            break;
          case 6:
            layout.push(<h6 key={index} className="template-header">{parseHTMLToReact(entity.data.text)}</h6>);
            break;
          default:
            layout.push(<h2 key={index} className="template-header">{parseHTMLToReact(entity.data.text)}</h2>);
            break;
        }
        break;
      case 'paragraph':
        layout.push(<p key={index} className="template-paragraph">{parseHTMLToReact(entity.data.text)}</p>);
        break;
      case 'list':
        layout.push(<ul key={index} className="template-ul">{
          entity.data.items.map((item, i) => {
            return (<li key={index+i} className="template-li">{parseHTMLToReact(item)}</li>);
          })
        }
        </ul>);
        break;
      case 'image':
        layout.push(<img key={index} className="template-img" src={entity.data.url} alt={entity.data.caption}></img>);
        break;
      case 'video':
        layout.push(
          <video key={index} className="template-video" loop preload="metadata" controls>
            <source src={entity.data.url} type="video/mp4"></source>
          </video>
        );
        break;
      case 'table':
        const temp = entity.data.content.map((rows, i) => {
          return (
            <tr key={index+i} className="template-tr">
            {
              rows.map((data, i) => {
                return(
                  <td key={index+i} className="template-td">{parseHTMLToReact(data)}</td>
                );
              })
            }
            </tr>
            );
        });
        layout.push(
          <table className="template-table">
            <tbody>
              { temp }
            </tbody>
          </table>
        );
        break;
      case 'quote':
        layout.push(
          <blockquote className="template-blockqoute" title={parseHTMLToReact(entity.data.caption)}>{ parseHTMLToReact(entity.data.text) }</blockquote>
        );
        break;
      case 'delimiter':
        layout.push(
          <div className="template-delimiter"></div>
        )
        break;
      default:
        break;
    }
  });
  return layout;
};