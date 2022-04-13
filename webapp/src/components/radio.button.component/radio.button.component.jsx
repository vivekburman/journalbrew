import React, { useState } from 'react';
import './radio.button.scss';

const _orient = {
  'h': 0,
  'v': 1
};

const RadioButton = ({options, orientation=1, autoWrap = false,  isLazy=false, onChange}) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const handleChange = async (e) => {
    const val = +e.currentTarget.getAttribute('data-index');
    if (selectedOption == val) return;
    if (isLazy) {
      onChange(selectedOption).then(() => {
        setSelectedOption(val);
      });
    } else {
      setSelectedOption(val);
      onChange && onChange(selectedOption);
    }
  }
  return (
    <div className={"radio-btn-wrapper " + 
    (orientation == _orient.h ? `radio-h flex-row-${autoWrap ? 'wrap' : 'nowrap'}` : `radio-v flex-column-${autoWrap ? 'wrap' : 'nowrap'}`)}>
      {
        options.map((e, index) => {
          return (
          <div key={e.title} className="radio-btn-itemwrapper flex-row-nowrap align-items-center">
            <div className={"radio-btn-wrapper cursor-pointer flex-row-nowrap align-items-center justify-content-center " + (selectedOption == index ? "active" : "")} data-index={index} onClick={handleChange}>
              <div className="radio-btn">
                <div className="radio-btn-fill"></div>
              </div>
            </div>
            <div className="radio-btn-title">{e.title}</div>
          </div>
          );
        })
      }
    </div>
  );
}; 

export default RadioButton;