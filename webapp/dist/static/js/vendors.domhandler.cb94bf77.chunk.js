(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{352:function(t,e,n){var i=n(322),a=/\s+/g,o=n(353),r=n(438);function s(t,e,n){"object"===typeof t?(n=e,e=t,t=null):"function"===typeof e&&(n=e,e=h),this._callback=t,this._options=e||h,this._elementCB=n,this.dom=[],this._done=!1,this._tagStack=[],this._parser=this._parser||null}var h={normalizeWhitespace:!1,withStartIndices:!1,withEndIndices:!1};s.prototype.onparserinit=function(t){this._parser=t},s.prototype.onreset=function(){s.call(this,this._callback,this._options,this._elementCB)},s.prototype.onend=function(){this._done||(this._done=!0,this._parser=null,this._handleCallback(null))},s.prototype._handleCallback=s.prototype.onerror=function(t){if("function"===typeof this._callback)this._callback(t,this.dom);else if(t)throw t},s.prototype.onclosetag=function(){var t=this._tagStack.pop();this._options.withEndIndices&&t&&(t.endIndex=this._parser.endIndex),this._elementCB&&this._elementCB(t)},s.prototype._createDomElement=function(t){if(!this._options.withDomLvl1)return t;var e;for(var n in e="tag"===t.type?Object.create(r):Object.create(o),t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},s.prototype._addDomElement=function(t){var e=this._tagStack[this._tagStack.length-1],n=e?e.children:this.dom,i=n[n.length-1];t.next=null,this._options.withStartIndices&&(t.startIndex=this._parser.startIndex),this._options.withEndIndices&&(t.endIndex=this._parser.endIndex),i?(t.prev=i,i.next=t):t.prev=null,n.push(t),t.parent=e||null},s.prototype.onopentag=function(t,e){var n={type:"script"===t?i.Script:"style"===t?i.Style:i.Tag,name:t,attribs:e,children:[]},a=this._createDomElement(n);this._addDomElement(a),this._tagStack.push(a)},s.prototype.ontext=function(t){var e,n=this._options.normalizeWhitespace||this._options.ignoreWhitespace;if(!this._tagStack.length&&this.dom.length&&(e=this.dom[this.dom.length-1]).type===i.Text)n?e.data=(e.data+t).replace(a," "):e.data+=t;else if(this._tagStack.length&&(e=this._tagStack[this._tagStack.length-1])&&(e=e.children[e.children.length-1])&&e.type===i.Text)n?e.data=(e.data+t).replace(a," "):e.data+=t;else{n&&(t=t.replace(a," "));var o=this._createDomElement({data:t,type:i.Text});this._addDomElement(o)}},s.prototype.oncomment=function(t){var e=this._tagStack[this._tagStack.length-1];if(e&&e.type===i.Comment)e.data+=t;else{var n={data:t,type:i.Comment},a=this._createDomElement(n);this._addDomElement(a),this._tagStack.push(a)}},s.prototype.oncdatastart=function(){var t={children:[{data:"",type:i.Text}],type:i.CDATA},e=this._createDomElement(t);this._addDomElement(e),this._tagStack.push(e)},s.prototype.oncommentend=s.prototype.oncdataend=function(){this._tagStack.pop()},s.prototype.onprocessinginstruction=function(t,e){var n=this._createDomElement({name:t,data:e,type:i.Directive});this._addDomElement(n)},t.exports=s},353:function(t,e){var n=t.exports={get firstChild(){var t=this.children;return t&&t[0]||null},get lastChild(){var t=this.children;return t&&t[t.length-1]||null},get nodeType(){return a[this.type]||a.element}},i={tagName:"name",childNodes:"children",parentNode:"parent",previousSibling:"prev",nextSibling:"next",nodeValue:"data"},a={element:1,text:3,cdata:4,comment:8};Object.keys(i).forEach((function(t){var e=i[t];Object.defineProperty(n,t,{get:function(){return this[e]||null},set:function(t){return this[e]=t,t}})}))},438:function(t,e,n){var i=n(353),a=t.exports=Object.create(i),o={tagName:"name"};Object.keys(o).forEach((function(t){var e=o[t];Object.defineProperty(a,t,{get:function(){return this[e]||null},set:function(t){return this[e]=t,t}})}))}}]);