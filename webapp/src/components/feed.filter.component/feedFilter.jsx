import React, { Component, createRef } from 'react';
import './feedFilter.scss';
import arrowLeft from '../../images/arrow-left.svg';
class FeedFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: 1,
      hideNextBtn: false,
      hidePrevBtn: true,
    };
    this.offset = 2;
    this.sliderRef = createRef(null);
    this.pointerPosition = null;
    this.totalItemsWidth = 0;
    this.filterList = [
      {
        name: "National",
        id: 1,
      },{
        name: "Local",
        id: 2,
      },{
        name: "Worldwide",
        id: 3,
      },{
        name: "Business",
        id: 4,
      },{
        name: "Technology",
        id: 5,
      },{
        name: "Sports",
        id: 6,
      },{
        name: "Science",
        id: 7,
      },{
        name: "Health",
        id: 8,
      },{
        name: "Opinion",
        id: 9,
      },{
        name: "Historical",
        id: 10,
      },{
        name: "Entertainment",
        id: 11,
      },{
        name: "Stocks",
        id: 12,
      },{
        name: "Apple",
        id: 13,
      },{
        name: "Microsoft",
        id: 14,
      },
    ]
  }
  
  componentDidMount() {
    const dom = this.sliderRef.current;
    const children = Array.from(dom.children);
    let totalItemsWidth = 0;
    children.forEach(i => {
      totalItemsWidth += i.getBoundingClientRect().width
    });
    this.totalItemsWidth = totalItemsWidth;
  }
  onFilterSelect = (e) => {
    const filterId = e.target.classList.contains("feed-pill-wrapper") ? 
      +e.target.dataset.filterId : +e.target.parentElement.dataset.filterId;
    this.setState({
      selectedFilter: filterId
    });
  }
  onPrevClick = () => {
    const dom = this.sliderRef.current;
    const rootRect = dom.parentElement.getBoundingClientRect();
    const children = Array.from(dom.children);
    /**
     * 1. get current next outof view element
     * 2. add translate of from i, i+1, half of i+2
     */
    let i = 0;
    let transformVal = 0;
    for(i = children.length - 1; i >= 0; i--) {
      const elRect = children[i].getBoundingClientRect();
      if (rootRect.left > elRect.right) {
        break;
      }
    }
    let offset = this.offset;
    while(offset >= 0 && i >= 0) {
      const elRect = children[i].getBoundingClientRect();
      if (offset > 0) {
        transformVal = (rootRect.left - elRect.left);  
      } else {
        transformVal += (elRect.width / 2);
      }
      i--;
      offset--;
    }
    const newState = {};
    if (this.state.hideNextBtn) {
      newState.hideNextBtn = false;
    }
    if (i < 0) {
      newState.hidePrevBtn = true;
    }
    if (Object.keys(newState).length) {
      this.setState(newState);
    }
    dom.style.transform = `translateX(${this.getTranslateX(dom.style.transform) + transformVal}px)`;
  }
  onNextClick = () => {
    const dom = this.sliderRef.current;
    const rootRect = dom.parentElement.getBoundingClientRect();
    const children = Array.from(dom.children);
    /**
     * 1. get current next outof view element
     * 2. add translate of from i, i+1, half of i+2
     */
    let i = 0;
    let transformVal = 0;
    for(i = 0; i < children.length; i++) {
      const elRect = children[i].getBoundingClientRect();
      if (elRect.left > rootRect.right) {
        break;
      }
    }
    let offset = this.offset;
    while(offset >= 0 && i < children.length) {
      const elRect = children[i].getBoundingClientRect();
      if (offset > 0) {
        transformVal = (elRect.right - rootRect.right);  
      } else {
        transformVal += (elRect.width / 2);
      }
      i++;
      offset--;
    }
    const newState = {};
    if (this.state.hidePrevBtn) {
      newState.hidePrevBtn = false;
    }
    if (i === children.length) {
      newState.hideNextBtn = true;
    }
    if (Object.keys(newState).length) {
      this.setState(newState);
    }
    dom.style.transform = `translateX(-${-1 * this.getTranslateX(dom.style.transform) + transformVal}px)`;
  }
  getTranslateX(str) {
    if (!str) return 0;
    return +str.split("(")[1].split("px")[0];
  }
  onPointerDown = (e) => {
    this.pointerPosition = {
      clientX : e.clientX,
    }
  }
  onPointerUp = (e) => {
    this.pointerPosition = null;
  }
  onPointerMove = (e) => {
    if (!this.pointerPosition) return;
    const diff = (e.clientX - this.pointerPosition.clientX);
    const dom = this.sliderRef.current;
    const rootRect = dom.parentElement.getBoundingClientRect();
    const currTransform = this.getTranslateX(dom.style.transform);
    const transformVal = diff < 0 ? Math.max((rootRect.width - this.totalItemsWidth), (currTransform + diff)) : Math.min(0, (currTransform + diff));
    dom.style.transform = `translateX(${transformVal}px)`;
    this.pointerPosition = {
      clientX: e.clientX
    }
  }
  onWheel = (e) => {
    const diff = -1 * e.deltaX;
    const dom = this.sliderRef.current;
    const rootRect = dom.parentElement.getBoundingClientRect();
    const currTransform = this.getTranslateX(dom.style.transform);
    const transformVal = diff < 0 ? Math.max((rootRect.width - this.totalItemsWidth), (currTransform + diff)) : Math.min(0, (currTransform + diff));
    dom.style.transform = `translateX(${transformVal}px)`;
  }
  render() {
    return (
      <div className='feed-filter'>
        <div className='feed-filter-wrapper flex-row-nowrap'>
          <div className={"arrow-left position-relative" + (this.state.hidePrevBtn ? " visibility-hidden" : "")} 
          onClick={this.onPrevClick}>
            <img className='icon-img icon-left' src={arrowLeft}/>
          </div>
          <div className='flex-grow-1 position-relative overflow-hidden'>
            <div className='flex-row-nowrap feed-list-wrapper w-100 position-absolute'
            ref={this.sliderRef}
            onPointerDown={this.onPointerDown}
            onPointerUp={this.onPointerUp}
            onWheel={this.onWheel}
            onPointerMove={this.onPointerMove}>
              {
                this.filterList.map(i => {
                  return (
                    <div className='feed-pill-wrapper'
                    key={i.id}
                    data-filter-id={i.id}
                    onClick={this.onFilterSelect}>
                      <div 
                      className={`feed-pill font-roboto cursor-pointer${i.id === this.state.selectedFilter ? " feed-selected" : ""}`}>
                        {i.name}
                      </div>
                    </div>
                    
                  );
                })
              }
            </div>
          </div>
          <div className={"arrow-right position-relative" + (this.state.hideNextBtn ? " visibility-hidden" : "")} 
          onClick={this.onNextClick}>
            <img className='icon-img icon-right' src={arrowLeft}/>
          </div>
        </div>
      </div>
    );
  }
}
export default FeedFilter;