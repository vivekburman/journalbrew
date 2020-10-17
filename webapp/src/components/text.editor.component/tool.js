import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import Delimiter from '@editorjs/delimiter';
import SimpleVideo from '../../_internal/simple-video/dist/bundle';
import SimpleImage from '../../_internal/simple-image/dist/bundle';
// import Table from '../../_internal/table/dist/bundle';


export const EDITOR_JS_TOOLS = {
  embed: Embed,
  // table: {
  //   class: Table,
  //   inlineToolbar: true,
  //   shortcut: 'CMD+ALT+T',
  // },
  marker: {
    class: Marker,
    shortcut: 'CMD+ALT+T',
  },
  image: SimpleImage,
  video: SimpleVideo,
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a blockquote...',
      captionPlaceholder: 'Quote\'s Author',
    },
    shortcut: 'CMD+ALT+Q',
  },
  delimiter: Delimiter,
};
