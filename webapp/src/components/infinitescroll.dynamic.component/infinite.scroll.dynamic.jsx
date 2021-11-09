import React, { Component, createRef } from 'react';
import Proptypes from 'prop-types';
import './infinite.scroll.dynamic.component.scss';
const N = 15;
class InfiniteScroll extends Component {
  constructor(props) {
    super(props);
    /**
     * topRef: Reference to top list item
     * bottomRef: Reference to bottom list item
     * rootRef: Reference to wrapper of list
     * wrapperOffset: Wrapper starting point location when first rendered
     * sliderSize: Number of elements to visible at any point of time
     * boundary: internal variable to point to current subset location of actual data which is shown
     * snapshot: Before update capture the current state
     * elementsSwapped: Count of how many elements needs to be swapped
     * reducedHeight: In case of remove height reduced
     */
    this.topRef = createRef();
    this.bottomRef = createRef();
    this.rootRef = createRef();
    this.wrapperOffset = null;
    this.sliderSize = this.props.sliderSize || N;
    this.boundary = {
      start: 0,
      end: this.sliderSize
    };
    this.state = {
      data: [],
      loading: true,
      isEmpty: false
    };
    this.SCROLL_MODES = {
      'TOP': "top",
      'BOTTOM': "bottom"
    };
    this.observer = null;
    this.currentScrollMode = this.SCROLL_MODES.BOTTOM;
    this.elementsSwapped = this.sliderSize;
    this.removedItemInfo = null;
    this.removeItem = this.removeItem.bind(this);
  }
  
  shouldAddInlineLoader = () => {
    return this.state.loading && this.state.data.length != 0;
  }

  renderList = () => {
    const list = []
    const {data} = this.state;
    for(let i =0 ; i < data.length; i++) {
      if (data[i]) {
        list.push(
          <li
          key={data[i][this.props.uniqueId]} 
          id={i === 0 ? this.SCROLL_MODES.TOP : i === (data.length - 1) ? this.SCROLL_MODES.BOTTOM : ''}
          className="list-item-wrapper position-absolute visible-hidden w-100"
          data-item-id={data[i][this.props.uniqueId]}
          ref={this.getReference(i)}>
            {
              this.props.getListItemDOM(data[i], i, this.removeItem)
            }
          </li>
        ); 
      }
    }
    if (this.shouldAddInlineLoader()) {
      const el = <li key="loading" id="loader" className="list-item-wrapper">
        {
          this.props.getLoadingUI()
        }
      </li>;
      this.currentScrollMode === this.SCROLL_MODES.BOTTOM ? list.push(el) : list.unshift(el);
    }
    return list;
  }
  positionElementsBottom = (childrenNodes) => {
    let wrapperNewHeight = 0;
    childrenNodes.forEach((el, index, arr) => {
      if (this.sliderSize - this.elementsSwapped <= index) {
        const {selfHeight, offset} = this.getPosition(arr, index);
        el.style.transform = `translateY(${offset}px)`;
        wrapperNewHeight = selfHeight + offset;
        el.classList.remove("visible-hidden");
      }
    });
    return wrapperNewHeight;
  }

  positionElementsTop = (childrenNodes) => {
    let  i = childrenNodes.length - 1;
    while (i >= 0) {
      if (this.elementsSwapped > i) {
        const el = childrenNodes[i];
        const {offset} = this.getPosition(childrenNodes, i);
        el.style.transform = `translateY(${offset}px)`;
        el.classList.remove("visible-hidden");
      }
      i--;
    }
  }

  shiftElements = (childrenNodes) => {
    const {reducedHeight, index} = this.removedItemInfo;
    this.removedItemInfo = null;
    let wrapperNewHeight = 0;
    childrenNodes.forEach((el, _index) => {
      const _reducedHeight = this.getTransformY(el) - reducedHeight;
      if (_index >= index) {
        el.style.transform = `translateY(${_reducedHeight}px)`;
        el.classList.remove("visible-hidden");
      }
      if (_index === childrenNodes.length - 1) {
        wrapperNewHeight = _reducedHeight + el.offsetHeight;
      }
    });
    return wrapperNewHeight;
  }

  positionElements = () => {
    if (this.rootRef.current) {
      const rootRef = this.rootRef.current;
      const currentScrollMode = this.currentScrollMode;
      requestAnimationFrame(() => {
        const childrenNodes = Array.from(rootRef.children);
        if (currentScrollMode === this.SCROLL_MODES.BOTTOM) {
          const wrapperNewHeight = this.positionElementsBottom(childrenNodes);  
          rootRef.style.height = wrapperNewHeight + "px";
        } else if (currentScrollMode === this.SCROLL_MODES.TOP) {
          this.positionElementsTop(childrenNodes);
        } else {
          // delete lifecycle
          const wrapperNewHeight = this.shiftElements(childrenNodes);
          rootRef.style.height = wrapperNewHeight + "px";
        }
        this.attachObserver();
      });
    }
  }
  async componentDidMount() {
    try {
      const {data, isLast} = await this.props.getRangeData(this.boundary.start, this.boundary.end);
      this.setDynamicDataToState(data, isLast);
    } catch(e) {
      // nothing found empty
      this.setState({
        data: [], 
        loading: false,
        isEmpty: true
      });
    }
  }

  componentDidUpdate() {
    this.positionElements();
    if (!this.observer) {
      this.initiateObserver();
      this.setWrapperOffset(); 
    }
  }
  setWrapperOffset = () => {
    this.wrapperOffset = this.rootRef.current ? this.rootRef.current.getBoundingClientRect().top : 0;
  }

  getPosition = (arr, index) => {
    const res = {
      selfHeight: arr[index].getBoundingClientRect().height,
      offset: 0
    };
    const isBottomScroll = this.SCROLL_MODES.BOTTOM === this.currentScrollMode;
    if (isBottomScroll && index < 1) return res;
    const i = isBottomScroll ? index - 1 : index + 1;
    const style = arr[i].style.transform;
    if (!style || !style.length) return res;
    res.offset = (+style.split("(")[1].trim().slice(0, -3)) + 
      (isBottomScroll ?  arr[i].getBoundingClientRect().height : -arr[index].getBoundingClientRect().height);
    return res;
  }

  getTransformY = (dom) => {
    const style = dom.style.transform;
    if (!style || !style.length) return 0;
    return +style.split("(")[1].trim().slice(0, -3);
  }
  initiateObserver = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0
    }
    this.observer = new IntersectionObserver(this.callback, options);
  }

  attachObserver = () => {
    this.topRef.current && this.observer.observe(this.topRef.current);
    this.bottomRef.current && this.observer.observe(this.bottomRef.current);
  }

  getTopNextElements = async (elementsToBeSwapped) => {
    const self = this;
    if (this.boundary.start == 0) return;
    this.elementsSwapped = 1;
    this.setCurrentScrollMode(this.SCROLL_MODES.TOP);
    this.setState({loading: true});
    elementsToBeSwapped -= 1;
    const dataIndex = this.props.dataIndex;
    const _stateData = this.state.data;
    const _fetchEnd = _stateData[0][dataIndex];
    const _fetchStart = Math.max(0, _fetchEnd - elementsToBeSwapped - (this.sliderSize - _stateData.length));
    try {
      let {data} = await this.props.getRangeData(_fetchStart, _fetchEnd);
      if (data.length === 0) {
        this.setState({loading: false});
        this.elementsSwapped = 0;
      } else {
          const isFirst = data[0][dataIndex] === 0;
          if (isFirst) {
            elementsToBeSwapped = data.length;
          }
          data = [...data, ...this.state.data.slice(0, _stateData.length - elementsToBeSwapped)];
          const {start: _start, end: _end} = this.getStartEnd(data);
          if (this.isUpdateNeeded(_start, _end)) {
            this.elementsSwapped = elementsToBeSwapped + (this.sliderSize - _stateData.length); 
            this.sliderSize = this.props.sliderSize;           
            this.updateState(_start, _end, data);
          }
      }
    } catch(e) {
      this.setState({loading: false});
      this.elementsSwapped = 0;
    }
  }
  getOutOfViewportElementsTop = () => {
    if(this.rootRef.current) {
      let i = 0;
      const thresholdHeight = document.scrollingElement.scrollTop - this.rootRef.current.clientTop + window.innerHeight - this.wrapperOffset;
      const children = Array.from(this.rootRef.current.children);
      for (i = children.length - 1; i >=0; i--) {
        if (thresholdHeight >= this.getTransformY(children[i])) {
          break;
        } 
      }
      i > 0 && this.getTopNextElements(children.length - i);
    }
  }

  getBottomNextElements = async (elementsToBeSwapped) => {
    this.setCurrentScrollMode(this.SCROLL_MODES.BOTTOM);
    this.elementsSwapped = 0;
    this.setState({loading: true});
    const dataIndex = this.props.dataIndex;
    const _stateData = this.state.data;
    elementsToBeSwapped -= 1;
    const _fetchStart = _stateData[_stateData.length - 1][dataIndex] + 1;
    const _fetchEnd = _fetchStart + elementsToBeSwapped + (this.sliderSize - _stateData.length);

    let {data, isLast} = await this.props.getRangeData(_fetchStart, _fetchEnd);
    if (data.length === 0) {
      this.setState({loading: false});
      this.elementsSwapped = 0;
    } else {
      if (isLast) {
        elementsToBeSwapped = data.length;
      }
      data = [...this.state.data.slice(elementsToBeSwapped), ...data];
      const { start: _start, end: _end } = this.getStartEnd(data);

      if (this.isUpdateNeeded(_start, _end)) {
        this.elementsSwapped = elementsToBeSwapped + (this.sliderSize - _stateData.length);
        this.sliderSize = this.props.sliderSize;
        this.updateState(_start, _end, data);
      }
    }
  }

  getStartEnd = (data) => {
    return {
      start: data[0][this.props.dataIndex],
      end: data[data.length - 1][this.props.dataIndex] + 1
    };
  }

  getOutOfViewportElementsBottom = () => {
    if(this.rootRef.current) {
      let i = 0;
      const thresholdHeight = document.scrollingElement.scrollTop - this.wrapperOffset;
      const children = Array.from(this.rootRef.current.children);
      for (i=0; i < children.length; i++) {
        if (thresholdHeight <= this.getTransformY(children[i]) + children[i].getBoundingClientRect().height) {
          break;
        } 
      }
      i > 0 && this.getBottomNextElements(i);
    }
  }

  getOutOfViewportElements = (mode) => {
    if (mode === this.SCROLL_MODES.TOP) {
      this.getOutOfViewportElementsTop(mode);
    } else if (mode === this.SCROLL_MODES.BOTTOM) {
      this.getOutOfViewportElementsBottom(mode);
    }
  }

  isUpdateNeeded = (start, end) => {
    if (start < 0 || start > end || end < start || 
      (start === this.boundary.start && end === this.boundary.end)) return false; 
    return true;
  }

  setCurrentScrollMode = (mode) => this.currentScrollMode = mode;
  resetCurrentScrollMode = () => this.currentScrollMode = null;

  updateState = (start, end, dynamicData) => {
    this.resetObservation();
    this.boundary = {
      start: start,
      end: end
    };
    this.setState({data: dynamicData, loading: false});
  }
  callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id === this.SCROLL_MODES.BOTTOM) {
        this.getOutOfViewportElements(this.SCROLL_MODES.BOTTOM);
      }
      if (entry.isIntersecting && entry.target.id === this.SCROLL_MODES.TOP) {
        this.getOutOfViewportElements(this.SCROLL_MODES.TOP);
      }
    }); 
  }
  resetObservation = () => {
    this.observer.unobserve(this.bottomRef.current);
    this.observer.unobserve(this.topRef.current);
    this.bottomRef = createRef();
    this.topRef = createRef();
  }
  getReference = (index) => {
    if (index === 0) return this.topRef;
    else if (index === this.state.data.length - 1) return this.bottomRef;
  }

  setDynamicDataToState = (data, isLast) => {
    this.setState({data: data, loading: false, isLast, addNewHeight: true, isEmpty: data.length == 0});
  }

  removeItem (postID) {
    const oldData = this.state.data;
    const dataIndex = this.props.dataIndex;
    // 1. find the item exists
    const removePostIndex = oldData.findIndex(i => i.id === postID);
    if (removePostIndex != -1) {
      this.resetCurrentScrollMode();
      this.elementsSwapped = 0;
      this.removedItemInfo = {
        reducedHeight: Array.from(this.rootRef.current.children).find(i => +i.dataset.itemId === postID).offsetHeight,
        index: removePostIndex
      };
      const deletedData = oldData.splice(removePostIndex, 1)[0];
      const newData = oldData.map(i => {
        return {
          ...i,
          totalCount: i.totalCount - 1,
          [dataIndex]: deletedData[dataIndex] < i[dataIndex] ? i[dataIndex] - 1 : i[dataIndex]
        }
      });
      const {start, end} = this.getStartEnd(newData);
      this.updateState(start, end, newData);
    }
  }

  render () {
    const {data, loading, isEmpty} = this.state;
    return (
      <div className="infinte-scroll-wrapper">
        {
          data.length === 0 && loading ?
          this.props.getLoadingUI() : 
          isEmpty ? 
          <div className="empty-state-wrapper flex-row-wrap justify-content-center">
            {
              this.props.emptyStateUI()
            }
          </div>
          :
          <ul className="ul-default position-relative"
          ref={this.rootRef}>
            {
              this.renderList()
            }
          </ul>
        }
        
      </div>
    );
  }
}

InfiniteScroll.propTypes = {
  sliderSize: Proptypes.number,
  emptyStateUI: Proptypes.func,
  dataIndex: Proptypes.string,
  getRangeData: Proptypes.func,
  getListItemDOM: Proptypes.func,
  getLoadingUI: Proptypes.func,
  uniqueId: Proptypes.string,
}

export default InfiniteScroll;