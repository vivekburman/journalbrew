(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{151:function(e,n,t){"use strict";function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var t=[],r=!0,i=!1,o=void 0;try{for(var a,c=e[Symbol.iterator]();!(r=(a=c.next()).done)&&(t.push(a.value),!n||t.length!==n);r=!0);}catch(e){i=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(i)throw o}}return t}}(e,n)||function(e,n){if(e){if("string"==typeof e)return c(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?c(e,n):void 0}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}t.r(n);var s="undefined"!=typeof window,u=s&&window.cordova&&window.cordova.require&&window.cordova.require("cordova/modulemapper"),l=s&&(u&&u.getOriginalSymbol(window,"File")||File),A=s&&(u&&u.getOriginalSymbol(window,"FileReader")||FileReader),m=s&&new Promise((function(e,n){var t,r,i,o;return g("data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==","test.jpg",Date.now()).then((function(a){try{return w(t=a).then((function(a){try{return y(r=a[1],t.type,t.name,t.lastModified).then((function(t){try{return i=t,C(r),h(i).then((function(t){try{return d(t).then((function(t){try{return e(1===(o=t).width&&2===o.height)}catch(e){return n(e)}}),n)}catch(e){return n(e)}}),n)}catch(e){return n(e)}}),n)}catch(e){return n(e)}}),n)}catch(e){return n(e)}}),n)}));function h(e){return new Promise((function(n,t){var r=new A;r.onload=function(){return n(r.result)},r.onerror=function(e){return t(e)},r.readAsDataURL(e)}))}function g(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Date.now();return new Promise((function(r){for(var i=e.split(","),o=i[0].match(/:(.*?);/)[1],a=window.atob(i[1]),c=a.length,s=new Uint8Array(c);c--;)s[c]=a.charCodeAt(c);var u=new Blob([s],{type:o});u.name=n,u.lastModified=t,r(u)}))}function d(e){return new Promise((function(n,t){var r=new Image;r.onload=function(){return n(r)},r.onerror=function(e){return t(e)},r.src=e}))}function p(e){var n=a(B(e.width,e.height),2),t=n[0];return n[1].drawImage(e,0,0,t.width,t.height),t}function w(e){return new Promise((function(n,t){var r,i,o=function(){try{return i=p(r),n([r,i])}catch(e){return t(e)}},a=function(n){try{return h(e).then((function(e){try{return d(e).then((function(e){try{return r=e,o()}catch(e){return t(e)}}),t)}catch(e){return t(e)}}),t)}catch(e){return t(e)}};try{return createImageBitmap(e).then((function(e){try{return r=e,o()}catch(e){return a()}}),a)}catch(e){a()}}))}function y(e,n,t,r){var i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1;return new Promise((function(o,a){var c;return"function"==typeof OffscreenCanvas&&e instanceof OffscreenCanvas?e.convertToBlob({type:n,quality:i}).then(function(e){try{return(c=e).name=t,c.lastModified=r,s.call(this)}catch(e){return a(e)}}.bind(this),a):g(e.toDataURL(n,i),t,r).then(function(e){try{return c=e,s.call(this)}catch(e){return a(e)}}.bind(this),a);function s(){return o(c)}}))}function v(e){return new Promise((function(n,t){var r=new A;r.onload=function(e){var t=new DataView(e.target.result);if(65496!=t.getUint16(0,!1))return n(-2);for(var r=t.byteLength,i=2;i<r;){if(t.getUint16(i+2,!1)<=8)return n(-1);var o=t.getUint16(i,!1);if(i+=2,65505==o){if(1165519206!=t.getUint32(i+=2,!1))return n(-1);var a=18761==t.getUint16(i+=6,!1);i+=t.getUint32(i+4,a);var c=t.getUint16(i,a);i+=2;for(var s=0;s<c;s++)if(274==t.getUint16(i+12*s,a))return n(t.getUint16(i+12*s+8,a))}else{if(65280!=(65280&o))break;i+=t.getUint16(i,!1)}}return n(-1)},r.onerror=function(e){return t(e)},r.readAsArrayBuffer(e)}))}function E(e,n){var t,r=e.width,i=e.height,o=n.maxWidthOrHeight,c=e;if(isFinite(o)&&(r>o||i>o)){var s=a(B(r,i),2);c=s[0],t=s[1],r>i?(c.width=o,c.height=i/r*o):(c.width=r/i*o,c.height=o),t.drawImage(e,0,0,c.width,c.height),C(e)}return c}function b(e,n){var t=e.width,r=e.height,i=a(B(t,r),2),o=i[0],c=i[1];switch(4<n&&n<9?(o.width=r,o.height=t):(o.width=t,o.height=r),n){case 2:c.transform(-1,0,0,1,t,0);break;case 3:c.transform(-1,0,0,-1,t,r);break;case 4:c.transform(1,0,0,-1,0,r);break;case 5:c.transform(0,1,1,0,0,0);break;case 6:c.transform(0,1,-1,0,r,0);break;case 7:c.transform(0,-1,-1,0,r,t);break;case 8:c.transform(0,-1,1,0,0,t)}return c.drawImage(e,0,0,t,r),C(e),o}function B(e,n){var t,r;try{if(null===(r=(t=new OffscreenCanvas(e,n)).getContext("2d")))throw new Error("getContext of OffscreenCanvas returns null")}catch(e){r=(t=document.createElement("canvas")).getContext("2d")}return t.width=e,t.height=n,[t,r]}function C(e){e.width=0,e.height=0}function Q(e,n){return new Promise((function(t,r){var i,o,c,s,u,f,l,A,h,g,d,p,Q,O,I,F,M,U;function P(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:5;i+=e,n.onProgress(Math.min(i,100))}function x(e){i=Math.min(Math.max(e,i),100),n.onProgress(i)}return i=0,o=n.maxIteration||10,c=1024*n.maxSizeMB*1024,P(),w(e).then(function(i){try{var w=a(i,2);return w[0],s=w[1],P(),u=E(s,n),P(),new Promise((function(t,r){var i;if(!(i=n.exifOrientation))return v(e).then(function(e){try{return i=e,o.call(this)}catch(e){return r(e)}}.bind(this),r);function o(){return t(i)}return o.call(this)})).then(function(i){try{return f=i,P(),m.then(function(i){try{return l=i?u:b(u,f),P(),A=n.initialQuality||1,h=n.fileType||e.type,y(l,h,e.name,e.lastModified,A).then(function(n){try{{if(g=n,P(),d=g.size>c,p=g.size>e.size,!d&&!p)return x(100),t(g);var i;function f(){if(o--&&(I>c||I>Q)){var n,t,i=a(B(n=d?.95*U.width:U.width,t=d?.95*U.height:U.height),2);return M=i[0],i[1].drawImage(U,0,0,n,t),A*=.95,y(M,"image/jpeg",e.name,e.lastModified,A).then((function(e){try{return F=e,C(U),U=M,I=F.size,x(Math.min(99,Math.floor((O-I)/(O-c)*100))),f}catch(e){return r(e)}}),r)}return[1]}return Q=e.size,O=g.size,I=O,U=l,(i=function(e){for(;e;){if(e.then)return void e.then(i,r);try{if(e.pop){if(e.length)return e.pop()?m.call(this):e;e=f}else e=e.call(this)}catch(e){return r(e)}}}.bind(this))(f);function m(){return"image/jpeg"!==h&&((F=new Blob([F],{type:h})).name=e.name,F.lastModified=e.lastModified),C(U),C(M),C(u),C(l),C(s),x(100),t(F)}}}catch(e){return r(e)}}.bind(this),r)}catch(e){return r(e)}}.bind(this),r)}catch(e){return r(e)}}.bind(this),r)}catch(e){return r(e)}}.bind(this),r)}))}s&&(Number.isInteger=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e});var O,I,F=0;function M(e,n){return new Promise((function(t,r){var i,a,c;if(n.maxSizeMB=n.maxSizeMB||Number.POSITIVE_INFINITY,a="boolean"!=typeof n.useWebWorker||n.useWebWorker,delete n.useWebWorker,void 0===n.onProgress&&(n.onProgress=function(){}),!(e instanceof Blob||e instanceof l))return r(new Error("The file given is not an instance of Blob or File"));if(!/^image/.test(e.type))return r(new Error("The file given is not an image"));if(c="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope,!a||"function"!=typeof Worker||c)return Q(e,n).then(function(e){try{return i=e,A.call(this)}catch(e){return r(e)}}.bind(this),r);var s=function(){try{return A.call(this)}catch(e){return r(e)}}.bind(this),u=function(t){try{return Q(e,n).then((function(e){try{return i=e,s()}catch(e){return r(e)}}),r)}catch(e){return r(e)}};try{return function(e,n){return new Promise((function(t,r){return new Promise((function(i,a){var c=F++;return O||(O=function(e){return URL.createObjectURL(new Blob([e],{type:"application/javascript"}))}("\n    function imageCompression (){return (".concat(M,").apply(null, arguments)}\n\n    imageCompression.getDataUrlFromFile = ").concat(M.getDataUrlFromFile,"\n    imageCompression.getFilefromDataUrl = ").concat(M.getFilefromDataUrl,"\n    imageCompression.loadImage = ").concat(M.loadImage,"\n    imageCompression.drawImageInCanvas = ").concat(M.drawImageInCanvas,"\n    imageCompression.drawFileInCanvas = ").concat(M.drawFileInCanvas,"\n    imageCompression.canvasToFile = ").concat(M.canvasToFile,"\n    imageCompression.getExifOrientation = ").concat(M.getExifOrientation,"\n    imageCompression.handleMaxWidthOrHeight = ").concat(M.handleMaxWidthOrHeight,"\n    imageCompression.followExifOrientation = ").concat(M.followExifOrientation,"\n    imageCompression.cleanupMemory = ").concat(M.cleanupMemory,"\n\n    getDataUrlFromFile = imageCompression.getDataUrlFromFile\n    getFilefromDataUrl = imageCompression.getFilefromDataUrl\n    loadImage = imageCompression.loadImage\n    drawImageInCanvas = imageCompression.drawImageInCanvas\n    drawFileInCanvas = imageCompression.drawFileInCanvas\n    canvasToFile = imageCompression.canvasToFile\n    getExifOrientation = imageCompression.getExifOrientation\n    handleMaxWidthOrHeight = imageCompression.handleMaxWidthOrHeight\n    followExifOrientation = imageCompression.followExifOrientation\n    cleanupMemory = imageCompression.cleanupMemory\n\n    getNewCanvasAndCtx = ").concat(B,"\n    \n    CustomFileReader = FileReader\n    \n    CustomFile = File\n    \n    function _slicedToArray(arr, n) { return arr }\n    \n    function _typeof(a) { return typeof a }\n\n    function compress (){return (").concat(Q,").apply(null, arguments)}\n    "))),I||(I=function(e){return"function"==typeof e&&(e="(".concat(f,")()")),new Worker(URL.createObjectURL(new Blob([e])))}("\n    let scriptImported = false\n    self.addEventListener('message', async (e) => {\n      const { file, id, imageCompressionLibUrl, options } = e.data\n      options.onProgress = (progress) => self.postMessage({ progress, id })\n      try {\n        if (!scriptImported) {\n          // console.log('[worker] importScripts', imageCompressionLibUrl)\n          self.importScripts(imageCompressionLibUrl)\n          scriptImported = true\n        }\n        // console.log('[worker] self', self)\n        const compressedFile = await imageCompression(file, options)\n        self.postMessage({ file: compressedFile, id })\n      } catch (e) {\n        // console.error('[worker] error', e)\n        self.postMessage({ error: e.message + '\\n' + e.stack, id })\n      }\n    })\n  ")),I.addEventListener("message",(function e(i){if(i.data.id===c){if(void 0!==i.data.progress)return void n.onProgress(i.data.progress);I.removeEventListener("message",e),i.data.error&&r(new Error(i.data.error)),t(i.data.file)}})),I.addEventListener("error",r),I.postMessage({file:e,id:c,imageCompressionLibUrl:O,options:o(o({},n),{},{onProgress:void 0})}),i()}))}))}(e,n).then((function(e){try{return i=e,s()}catch(e){return u()}}),u)}catch(e){u()}function A(){try{i.name=e.name,i.lastModified=e.lastModified}catch(e){}return t(i)}}))}M.getDataUrlFromFile=h,M.getFilefromDataUrl=g,M.loadImage=d,M.drawImageInCanvas=p,M.drawFileInCanvas=w,M.canvasToFile=y,M.getExifOrientation=v,M.handleMaxWidthOrHeight=E,M.followExifOrientation=b,M.cleanupMemory=C,M.version="1.0.13",n.default=M}}]);