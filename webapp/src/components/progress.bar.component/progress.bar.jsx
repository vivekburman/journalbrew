import React, { forwardRef, useImperativeHandle } from 'react';
import './progress.bar.component.scss';
import { useRef } from 'react';

export const ProgressBar = forwardRef((props, ref) => {
  let timer = null;
  let width = 0;
  const _ref = useRef(null);
  useImperativeHandle(ref, () => {
    return {
      animationStart: (callback) => {
        // start the animation
        const animate = () => {
          if (width >= 100) {
            clearInterval(timer);
            callback();
          } else {
            _ref.current && (_ref.current.style.width = `${width++}%`); 
          }
        }
        timer = setInterval(animate, 10);
      },
      animationPause: () => {
        clearInterval(timer);
      },
      animationReset: () => {
        _ref.current.style.width = '0%';
        width = 0;
      }
    }
  });
  
  return(
    <div className="progress-track">
      <div className="thumb" ref={el => {
        _ref.current = el;
      }}></div>
    </div>
  );
});