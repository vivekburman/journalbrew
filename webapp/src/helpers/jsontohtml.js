import ReactHtmlParser from 'react-html-parser';

export const parseHTMLToReact = (text) => {
  return ReactHtmlParser(text);
};