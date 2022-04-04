import React from 'react';
import { parseHTMLToReact } from '../../helpers/jsontohtml';
import './news.template.component.scss';

const getEmbed = (embed, index) => {
  switch(embed.service) {
    case 'youtube':
      return (
        <iframe
        height={embed.height}
        scrolling='on' 
        key={index}
        frameBorder="0" 
        src={embed.embed} 
        className="w-100">
        </iframe>
      );
    case 'twitter':
      return (
        <iframe 
        key={index}
        scrolling='on' 
        height={embed.height}
        frameBorder="0" 
        allowtransparency="true"
        src={embed.embed} 
        className="w-100">
        </iframe>
      );
    case 'facebook':
      return (
        <iframe 
        key={index}
        scrolling='on' 
        height={embed.height}
        frameBorder="0"
        allowtransparency="true"
        src={embed.embed} 
        className="w-100">
        </iframe>
      );
    case 'instagram':
      return (
        <iframe 
        key={index}
        height={embed.height}
        scrolling='on' 
        frameBorder="0" 
        allowtransparency="true"
        src={embed.embed} 
        className="w-100">
        </iframe>
      );
  }
}



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
        layout.push(<img key={index} className="template-img" src={entity.data.file.url} alt={entity.data.file.caption}></img>);
        break;
      case 'video':
        layout.push(
          <video key={index} className="template-video" loop preload="metadata" controls>
            <source src={entity.data.file.url} type="video/mp4"></source>
          </video>
        );
        break;
      case 'quote':
        layout.push(
          <blockquote key={index} className="template-blockqoute" title={parseHTMLToReact(entity.data.caption)}>{ parseHTMLToReact(entity.data.text) }</blockquote>
        );
        break;
      case 'delimiter':
        layout.push(
          <div key={index} className="template-delimiter"></div>
        )
        break;
      case 'embed':
        layout.push(getEmbed(entity.data, index));
        break;
      default:
        break;
    }
  });
  return layout;
};