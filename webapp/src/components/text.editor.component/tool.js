import Embed from '@editorjs/embed';
import Marker from '@editorjs/marker';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import Link from '@editorjs/link';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    shortcut: 'CMD+ALT+P',
  },
  header: {
    class: Header,
    inlineToolbar: true,
    shortcut: 'CMD+ALT+H',
  },
  marker: {
    class: Marker,
    inlineToolbar: true,
    shortcut: 'CMD+ALT+M',
  },
  image: {
    class: Image,
    inlineToolbar: true,
    shortcut: 'CMD+ALT+I',
  },
  link: {
    class: Link,
    inlineToolbar: true,
    shortcut: 'CMD+ALT+A',
  },
  list: {
    class: List,
    inlineToolbar: true,
    shortcut: 'CMD+ALT+L',
  },
  embed: {
    class: Embed,
    inlineToolbar: false,
    shortcut: 'CMD+ALT+E',
  },
  delimiter: {
    class: Delimiter,
    inlineToolbar: false,
    shortcut: 'CMD+ALT+D',
  },
};
