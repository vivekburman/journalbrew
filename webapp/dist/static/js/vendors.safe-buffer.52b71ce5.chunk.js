/*! For license information please see vendors.safe-buffer.52b71ce5.chunk.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{456:function(r,e,n){var o=n(360),t=o.Buffer;function f(r,e){for(var n in r)e[n]=r[n]}function u(r,e,n){return t(r,e,n)}t.from&&t.alloc&&t.allocUnsafe&&t.allocUnsafeSlow?r.exports=o:(f(o,e),e.Buffer=u),u.prototype=Object.create(t.prototype),f(t,u),u.from=function(r,e,n){if("number"===typeof r)throw new TypeError("Argument must not be a number");return t(r,e,n)},u.alloc=function(r,e,n){if("number"!==typeof r)throw new TypeError("Argument must be a number");var o=t(r);return void 0!==e?"string"===typeof n?o.fill(e,n):o.fill(e):o.fill(0),o},u.allocUnsafe=function(r){if("number"!==typeof r)throw new TypeError("Argument must be a number");return t(r)},u.allocUnsafeSlow=function(r){if("number"!==typeof r)throw new TypeError("Argument must be a number");return o.SlowBuffer(r)}}}]);