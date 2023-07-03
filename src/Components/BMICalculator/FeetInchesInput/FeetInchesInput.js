import React from 'react';
import { useState, useEffect } from 'react';
import './FeetInchesInput.css';

// Input: height in feet and inches
// Output: height in cm

const FeetInchesInput = ({ setOutput, description }) => {

    const [ftValue, setFtValue] = useState('');
    const [inValue, setInValue] = useState('');

    useEffect(() => {
        if (!!!ftValue || !!!inValue) {
            setOutput('');
            return;
        }
        // Convert to cm
        setOutput(Math.round((30.48 * ftValue) + (2.54 * inValue)));
    }, [ftValue, inValue])

    const updateFtValue = (e) => {
        console.log('updateFtValue');
        setFtValue(e.target.value);
    }

    const updateInValue = (e) => {
        console.log('updateInValue');
        setInValue(e.target.value);
    }

  return (
    <div className='fii-container'>
        <div className='fii-desc'>{description}</div>
        <div className='fii-stacked-inputs'>
            <input type='number' className='fii-input fii-top' value={ftValue} onChange={(e) => updateFtValue(e)}></input>
            <input type='number' className='fii-input fii-bot' value={inValue} onChange={(e) => updateInValue(e)}></input>
        </div>
        <div className='fii-stacked-units'>
            <div className='fii-unit fii-top'>{'( ft )'}</div>
            <div className='fii-unit fii-bot'>{'( in )'}</div>
        </div>
    </div>
  )
}

export default FeetInchesInput