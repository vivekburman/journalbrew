// import Embed from '@editorjs/embed';
import Marker from '@editorjs/marker';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import Image from '../../_internal/image/dist/bundle';
import Video from '../../_internal/editorjs-video/dist/bundle';
import Embed from '../../_internal/embed/dist/bundle';
// import Link from '@editorjs/link';
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
    config: {
      types: '.jpg,.png,.jpeg'
    },
    shortcut: 'CMD+ALT+I',
  },
  video: {
    class: Video,
    inlineToolbar: true,
    config: {
      types: '.mp4',
      autoplay: true,
      mute: true,
      loop: true,
    },
    shortcut: 'CMD+ALT+V',
  },
  // link: {
  //   class: Link,
  //   inlineToolbar: true,
  //   shortcut: 'CMD+ALT+A',
  // },
  list: {
    class: List,
    inlineToolbar: true,
    shortcut: 'CMD+ALT+L',
  },
  embed: {
    class: Embed,
    inlineToolbar: false,
    shortcut: 'CMD+ALT+E',
    config: {
      services: {
        youtube: true,
        twitter: true,
        facebook: true,
        instagram: true,
      }
    }
  },
  delimiter: {
    class: Delimiter,
    inlineToolbar: false,
    shortcut: 'CMD+ALT+D',
  },
};
