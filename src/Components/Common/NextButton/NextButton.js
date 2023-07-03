import React from 'react'
import './NextButton.css'
import nextArrow from './next-arrow.svg'
import { useState, useEffect } from 'react';

const NextButton = ({ pageIndex, enabled, activePageIndex, setActivePageIndex, callback }) => {

    const [doPulseBorder, setPulseBorder] = useState(false);
    const [isUpArrow, setUpArrow] = useState(false);
    const [isEnabled, setEnabled] = useState(enabled);

    const buttonColors = [
      { top: '#a4e1ff', bottom: '#5af9c7' },
      { top: '#9487ec', bottom: '#0084ff' },
      { top: '#fc7e7a', bottom: '#dc60c1' },
      { top: '#c4e874', bottom: '#fec22f' },
    ]

    useEffect(() => {
      // Update arrow direction
      setUpArrow(activePageIndex > pageIndex); 
    },[activePageIndex])

    useEffect(() => {
      // Update arrow enabled / disabled appearance
      setEnabled(enabled);
      setPulseBorder(enabled);
    },[enabled])

    const handleClick = () => {
      if (isEnabled) {
        if (isUpArrow) {
          goPrevPage();
        } else {
          goNextPage();
        }
        setUpArrow(!isUpArrow);
        setPulseBorder(false);
        if (callback) callback();
      }
    }
  
  const goNextPage = () => {
    setActivePageIndex(activePageIndex + 1);
    // Scroll by window height -10vh (page spacer) -8vh (navbar) +4px (page-container borders) 
    window.scrollBy({
      top: (0.82 * window.innerHeight) + 4,
      behavior: 'smooth'
    });
  }

  const goPrevPage = () => {
    setActivePageIndex(activePageIndex - 1);
    // Scroll by window height -10vh (page spacer) -8vh (navbar) +4px (page-container borders) 
    window.scrollBy({
      top: (-0.82 * window.innerHeight) - 4,
      behavior: 'smooth'
    });
  }

  const getButtonColor = () => {
    if (activePageIndex <= pageIndex) return buttonColors[pageIndex-1].bottom;
    return buttonColors[pageIndex-1].top;
  }

  return (
    <div className='next-btn-container '>
      <button 
        className={`next-btn ${doPulseBorder ? 'pulse-border' : ''} ${isUpArrow ? 'up' : 'down'}`}
        onClick={handleClick}
        style={{
          borderColor: enabled && doPulseBorder && pageIndex === activePageIndex ? getButtonColor() : '#f1f1f1'
        }}>  
        <i 
          className={`fa-solid fa-circle-chevron-up fa-3x ${enabled ? 'enabled' : 'disabled'}`}
          style={{
            color: enabled ? getButtonColor() : '#e5e5e5'
          }}/>  
      </button>
    </div>
  )
}

export default NextButton