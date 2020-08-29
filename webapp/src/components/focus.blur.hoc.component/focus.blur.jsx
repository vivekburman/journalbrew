import React, { useState, useEffect } from 'react';
import './focus.blur.component.scss';
import triangle from '../../images/triangle.svg';

const withFocusBlur = (WrappedComponent) => {
  const WithFocusBlur = (props) => {
    const [isFocused=false, setFocus] = useState(null);
    const [ref, setRef] = useState(null);
    let timer;
    let condition = true;
    const _onBlur = () => {
      timer = setTimeout(() => {
        if (ref && isFocused) {
          props.hideFunc(props.location);
        }
      }, 100)
    };
  
    const _onFocus = () => {
      clearTimeout(timer);
      if (!isFocused) {
        setFocus({ isFocused: true });
      }
    };
  
    useEffect(() => {
      ref && ref.focus();
    }, [ref]);
    if (props.checkCondition) {
      condition = props.checkCondition();
    }
    return (
      <>
        { condition && props.isOpen && <div
        onClick={props.hideFunc}
        onBlur={_onBlur}
        tabIndex={0}
        onFocus={_onFocus}
        ref={setRef}
        className="outline-none focus-blur-container">
        <WrappedComponent {...props}/>
        {!props.hidePointer && <img src={triangle} alt="pointer" className="focus-blur-pointer"/> }
      </div>  }
      </>
    );
  }
  return WithFocusBlur;
}
export default withFocusBlur;