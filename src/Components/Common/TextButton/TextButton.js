import React from 'react'
import './TextButton.css'
import { useState, useEffect } from 'react';

const TextButton = ({ text, icon, color, callback }) => {
  
  return (
    <div 
        className='text-btn-container'
        onClick={() => callback()}
        style={{backgroundColor: color}}
    >
        <i className={`text-btn-icon ${icon}`} style={{paddingRight: '0.5rem'}}/>
        {text}
    </div>
  )
}

export default TextButton