(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{477:function(t,e,n){"use strict";n.r(e),function(t){n.d(e,"Doughnut",(function(){return b})),n.d(e,"Pie",(function(){return I})),n.d(e,"Line",(function(){return C})),n.d(e,"Bar",(function(){return w})),n.d(e,"HorizontalBar",(function(){return P})),n.d(e,"Radar",(function(){return D})),n.d(e,"Polar",(function(){return O})),n.d(e,"Bubble",(function(){return A})),n.d(e,"Scatter",(function(){return j})),n.d(e,"defaults",(function(){return k}));var r=n(0),a=n.n(r),o=n(12),s=n.n(o),i=n(365),c=n.n(i);n.d(e,"Chart",(function(){return c.a}));var p=n(478),u=n.n(p),h=n(540),f=n.n(h),d=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t};function l(t,e){var n={};for(var r in t)e.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n}function y(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function v(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==typeof e&&"function"!==typeof e?t:e}function m(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var g="undefined"!==typeof t&&{}&&"production",E=function(t){function e(){y(this,e);var n=v(this,t.call(this));return n.handleOnClick=function(t){var e=n.chartInstance,r=n.props,a=r.getDatasetAtEvent,o=r.getElementAtEvent,s=r.getElementsAtEvent,i=r.onElementsClick;a&&a(e.getDatasetAtEvent(t),t),o&&o(e.getElementAtEvent(t),t),s&&s(e.getElementsAtEvent(t),t),i&&i(e.getElementsAtEvent(t),t)},n.ref=function(t){n.element=t},n.chartInstance=void 0,n}return m(e,t),e.prototype.componentDidMount=function(){this.renderChart()},e.prototype.componentDidUpdate=function(){if(this.props.redraw)return this.destroyChart(),void this.renderChart();this.updateChart()},e.prototype.shouldComponentUpdate=function(t){var e=this.props,n=(e.redraw,e.type),r=e.options,a=e.plugins,o=e.legend,s=e.height,i=e.width;if(!0===t.redraw)return!0;if(s!==t.height||i!==t.width)return!0;if(n!==t.type)return!0;if(!u()(o,t.legend))return!0;if(!u()(r,t.options))return!0;var c=this.transformDataProp(t);return!u()(this.shadowDataProp,c)||!u()(a,t.plugins)},e.prototype.componentWillUnmount=function(){this.destroyChart()},e.prototype.transformDataProp=function(t){var e=t.data;return"function"==typeof e?e(this.element):e},e.prototype.memoizeDataProps=function(){if(this.props.data){var t=this.transformDataProp(this.props);return this.shadowDataProp=d({},t,{datasets:t.datasets&&t.datasets.map((function(t){return d({},t)}))}),this.saveCurrentDatasets(),t}},e.prototype.checkDatasets=function(t){var n="production"!==g&&"prod"!==g,r=this.props.datasetKeyProvider!==e.getLabelAsKey,a=t.length>1;if(n&&a&&!r){var o=!1;t.forEach((function(t){t.label||(o=!0)})),o&&console.error('[react-chartjs-2] Warning: Each dataset needs a unique key. By default, the "label" property on each dataset is used. Alternatively, you may provide a "datasetKeyProvider" as a prop that returns a unique key.')}},e.prototype.getCurrentDatasets=function(){return this.chartInstance&&this.chartInstance.config.data&&this.chartInstance.config.data.datasets||[]},e.prototype.saveCurrentDatasets=function(){var t=this;this.datasets=this.datasets||{},this.getCurrentDatasets().forEach((function(e){t.datasets[t.props.datasetKeyProvider(e)]=e}))},e.prototype.updateChart=function(){var t=this,e=this.props.options,n=this.memoizeDataProps(this.props);if(this.chartInstance){e&&(this.chartInstance.options=c.a.helpers.configMerge(this.chartInstance.options,e));var r=this.getCurrentDatasets(),a=n.datasets||[];this.checkDatasets(r);var o=f()(r,this.props.datasetKeyProvider);this.chartInstance.config.data.datasets=a.map((function(e){var n=o[t.props.datasetKeyProvider(e)];if(n&&n.type===e.type&&e.data){n.data.splice(e.data.length),e.data.forEach((function(t,r){n.data[r]=e.data[r]}));e.data;var r=l(e,["data"]);return d({},n,r)}return e}));n.datasets;var s=l(n,["datasets"]);this.chartInstance.config.data=d({},this.chartInstance.config.data,s),this.chartInstance.update()}},e.prototype.renderChart=function(){var t=this.props,n=t.options,r=t.legend,a=t.type,o=t.plugins,s=this.element,i=this.memoizeDataProps();"undefined"===typeof r||u()(e.defaultProps.legend,r)||(n.legend=r),this.chartInstance=new c.a(s,{type:a,data:i,options:n,plugins:o})},e.prototype.destroyChart=function(){if(this.chartInstance){this.saveCurrentDatasets();var t=Object.values(this.datasets);this.chartInstance.config.data.datasets=t,this.chartInstance.destroy()}},e.prototype.render=function(){var t=this.props,e=t.height,n=t.width,r=t.id;return a.a.createElement("canvas",{ref:this.ref,height:e,width:n,id:r,onClick:this.handleOnClick})},e}(a.a.Component);E.getLabelAsKey=function(t){return t.label},E.propTypes={data:s.a.oneOfType([s.a.object,s.a.func]).isRequired,getDatasetAtEvent:s.a.func,getElementAtEvent:s.a.func,getElementsAtEvent:s.a.func,height:s.a.number,legend:s.a.object,onElementsClick:s.a.func,options:s.a.object,plugins:s.a.arrayOf(s.a.object),redraw:s.a.bool,type:function(t,e,n){if(!c.a.controllers[t[e]])return new Error("Invalid chart type `"+t[e]+"` supplied to `"+n+"`.")},width:s.a.number,datasetKeyProvider:s.a.func},E.defaultProps={legend:{display:!0,position:"bottom"},type:"doughnut",height:150,width:300,redraw:!1,options:{},datasetKeyProvider:E.getLabelAsKey},e.default=E;var b=function(t){function e(){return y(this,e),v(this,t.apply(this,arguments))}return m(e,t),e.prototype.render=function(){var t=this;return a.a.createElement(E,d({},this.props,{ref:function(e){return t.chartInstance=e&&e.chartInstance},type:"doughnut"}))},e}(a.a.Component),I=function(t){function e(){return y(this,e),v(this,t.apply(this,arguments))}return m(e,t),e.prototype.render=function(){var t=this;return a.a.createElement(E,d({},this.props,{ref:function(e){return t.chartInstance=e&&e.chartInstance},type:"pie"}))},e}(a.a.Component),C=function(t){function e(){return y(this,e),v(this,t.apply(this,arguments))}return m(e,t),e.prototype.render=function(){var t=this;return a.a.createElement(E,d({},this.props,{ref:function(e){return t.chartInstance=e&&e.chartInstance},type:"line"}))},e}(a.a.Component),w=function(t){function e(){return y(this,e),v(this,t.apply(this,arguments))}return m(e,t),e.prototype.render=function(){var t=this;return a.a.createElement(E,d({},this.props,{ref:function(e){return t.chartInstance=e&&e.chartInstance},type:"bar"}))},e}(a.a.Component),P=function(t){function e(){return y(this,e),v(this,t.apply(this,arguments))}return m(e,t),e.prototype.render=function(){var t=this;return a.a.createElement(E,d({},this.props,{ref:function(e){return t.chartInstance=e&&e.chartInstance},type:"horizontalBar"}))},e}(a.a.Component),D=function(t){function e(){return y(this,e),v(this,t.apply(this,arguments))}return m(e,t),e.prototype.render=function(){var t=this;return a.a.createElement(E,d({},this.props,{ref:function(e){return t.chartInstance=e&&e.chartInstance},type:"radar"}))},e}(a.a.Component),O=function(t){function e(){return y(this,e),v(this,t.apply(this,arguments))}return m(e,t),e.prototype.render=function(){var t=this;return a.a.createElement(E,d({},this.props,{ref:function(e){return t.chartInstance=e&&e.chartInstance},type:"polarArea"}))},e}(a.a.Component),A=function(t){function e(){return y(this,e),v(this,t.apply(this,arguments))}return m(e,t),e.prototype.render=function(){var t=this;return a.a.createElement(E,d({},this.props,{ref:function(e){return t.chartInstance=e&&e.chartInstance},type:"bubble"}))},e}(a.a.Component),j=function(t){function e(){return y(this,e),v(this,t.apply(this,arguments))}return m(e,t),e.prototype.render=function(){var t=this;return a.a.createElement(E,d({},this.props,{ref:function(e){return t.chartInstance=e&&e.chartInstance},type:"scatter"}))},e}(a.a.Component),k=c.a.defaults}.call(this,n(146))}}]);