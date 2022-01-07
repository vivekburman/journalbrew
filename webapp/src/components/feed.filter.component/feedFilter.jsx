import React, { Component } from 'react';
import './feedFilter.scss';

import arrowLeft from '../../images/arrow-left.svg';

class FeedFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: 1
    };
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
      },
    ]
  }
  onFilterSelect = (e) => {
    const filterId = +e.target.dataset.filterId;
    this.setState({
      selectedFilter: filterId
    });
  }
  render() {
    return (
      <div className='feed-filter'>
        <div className='feed-filter-wrapper flex-row-nowrap'>
          <div className="arrow-left position-relative">
            <img className='icon-img icon-left' src={arrowLeft}/>
          </div>
          <div className='flex-grow-1 position-relative overflow-hidden'>
            <div className='flex-row-nowrap feed-list-wrapper position-absolute w-100 ts--top-align-4'>
              {
                this.filterList.map(i => {
                  return (
                    <div className={`feed-pill font-roboto cursor-pointer${i.id === this.state.selectedFilter ? " feed-selected" : ""}`} 
                    data-filter-id={i.id} 
                    onClick={this.onFilterSelect}>
                      {i.name}
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="arrow-right position-relative">
            <img className='icon-img icon-right' src={arrowLeft}/>
          </div>
        </div>
      </div>
    );
  }
}
export default FeedFilter;