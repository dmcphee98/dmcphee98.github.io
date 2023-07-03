import React from 'react';
import './NumInput.css';


const NumInput = ({ number, setNumber, description, units, color, isEnabled, callback }) => {

    const handleChange = (e) => {
      const number = (e.target.value === '') ? '' : Math.abs(Number(e.target.value));
      setNumber(number);
    }

  return (
    <div 
      className={`di-container ${isEnabled === false ? 'ni-inactive' : 'ni-active-' + color}`}
      onClick={callback === undefined ? undefined : () => callback(true)}
    >
      <div className='ni-desc'>{description}</div>
        <div className='ni-input-div'>
          <input className="ni-input" type='number' min='0' value={number} onChange={(e) => handleChange(e)}></input>
        </div>
        <div className='ni-units'>{`( ${units} )`}</div>
    </div>
  )
}

export default NumInput