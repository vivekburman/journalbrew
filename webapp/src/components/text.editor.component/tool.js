import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import SimpleVideo from '../../_internal/simple-video/src/index';
import SimpleImage from '../../_internal/simple-image/src/index';
import Table from "../../_internal/table/dist/bundle";

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: {
    class: Table,
    inlineToolbar: true,
    shortcut: 'CMD+ALT+T'
  },
  marker: {
    class: Marker,
    shortcut: 'CMD+ALT+T'
  },
  list: {
    class: List,
    inlineToolbar: true,
    shortcut: 'CMD+ALT+L'
  },
  image: SimpleImage,
  video: SimpleVideo,
  header: {
    class: Header,
    inlineToolbar: ['link'],
    config: {
      placeholder: 'Header'
    },
    shortcut: 'CMD+ALT+H'
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a blockquote...',
      captionPlaceholder: 'Quote\'s Author'
    },
    shortcut: 'CMD+ALT+Q'
  },
  delimiter: Delimiter,
};
