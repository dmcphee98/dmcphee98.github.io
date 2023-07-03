import React from 'react';
import { useState, useEffect } from 'react';
import './DateInput.css';

const DateInput = ({ number, setNumber, description, isEnabled, callback }) => {

    const handleChange = (e) => {
        setNumber(new Date(e.target.value));
    }

    const formatToString = (date) => {
      if (!!!date) return date;
      const options = { day: '2-digit', month: '2-digit', year: 'numeric'};
      const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
      const parts = dateTimeFormat.formatToParts(date);
      return (`${parts[4].value}-${parts[0].value}-${parts[2].value}`);
    }

  return (
    <div 
      className={`di-container ${isEnabled === undefined ? 'di-active' : (isEnabled ? 'di-active' : 'di-inactive')}`} 
      onClick={callback === undefined ? undefined : () => callback(true)}
    >
      <div className='di-desc'>{description}</div>
      <div className='di-input-div'>
        <input className="di-input" type='date' value={formatToString(number)} onChange={(e) => handleChange(e)}></input>
      </div>
    </div>
  )
}

export default DateInput