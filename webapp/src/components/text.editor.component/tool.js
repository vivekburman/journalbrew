import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleVideo from '../../_internal/simple-video/dist/bundle';
import SimpleImage from "@editorjs/simple-image";
export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: Table,
  marker: Marker,
  list: List,
  code: Code,
  linkTool: LinkTool,
  image: SimpleImage,
  video: SimpleVideo,
  header: Header,
  quote: Quote,
  delimiter: Delimiter,
  inlineCode: InlineCode
};
