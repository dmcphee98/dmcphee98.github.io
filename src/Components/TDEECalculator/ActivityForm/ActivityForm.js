import React from 'react'
import { useState, useEffect } from 'react';
import SubmitButton from '../../Common/SubmitButton/SubmitButton';
import './ActivityForm.css';

const ActivityForm = ({ healthData, setHealthData, callback }) => {

    const [activityLvlNum, setActivityLvlNum] = useState('3');

    const activityLvl = [
        'Sedentary',
        'Lightly active',
        'Moderately active',
        'Very active', 
        'Extremely active'
    ];

    const activityLvlDesc = [
        'Little to no exercise',
        'Light exercise / 1-3 days per week',
        'Moderate exercise / 3-5 days per week',
        'Heavy exercise / 6-7 days per week',
        'Very heavy exercise / Twice daily'
    ]

    const onValueChange = (e) => {
        setActivityLvlNum(e.target.value);
        
        // Add to health data
        setHealthData({...healthData, 'activityLvl':e.target.value});
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        callback();
      }

    return (
        <form className='TDEE-form' onSubmit={handleSubmit}>
            <div className='radio-row'>
            <div className={`radio radio-left ${activityLvlNum === '1' ? 'radio-selected-outer' : ''}`}>
                <label className={`radio-lbl ${activityLvlNum === '1' ? 'radio-selected-inner' : ''}`}>
                        1
                        <input                        
                            className="radio-btn"
                            type="radio"
                            value="1"
                            checked={activityLvlNum === "Male"}
                            onChange={onValueChange}
                        />
                    </label>
                </div>
                <div className={`radio radio-center ${activityLvlNum === '2' ? 'radio-selected-outer' : ''}`}>
                    <label className={`radio-lbl ${activityLvlNum === '2' ? 'radio-selected-inner' : ''}`}>
                        <input
                            className="radio-btn"
                            type="radio"
                            value="2"
                            checked={activityLvlNum === "Female"}
                            onChange={onValueChange}
                        />
                        2
                    </label>
                </div>
                <div className={`radio radio-center ${activityLvlNum === '3' ? 'radio-selected-outer' : ''}`}>
                    <label className={`radio-lbl ${activityLvlNum === '3' ? 'radio-selected-inner' : ''}`}>
                        <input
                            className="radio-btn"
                            type="radio"
                            value="3"
                            checked={activityLvlNum === "Other"}
                            onChange={onValueChange}
                        />
                        3
                    </label>
                </div>
                <div className={`radio radio-center ${activityLvlNum === '4' ? 'radio-selected-outer' : ''}`}>
                    <label className={`radio-lbl ${activityLvlNum === '4' ? 'radio-selected-inner' : ''}`}>
                        <input
                            className="radio-btn"
                            type="radio"
                            value="4"
                            checked={activityLvlNum === "Other"}
                            onChange={onValueChange}
                        />
                        4
                    </label>
                </div>
                <div className={`radio radio-right ${activityLvlNum === '5' ? 'radio-selected-outer' : ''}`}>
                   <label className={`radio-lbl ${activityLvlNum === '5' ? 'radio-selected-inner' : ''}`}>
                        <input
                            className="radio-btn"
                            type="radio"
                            value="5"
                            checked={activityLvlNum === "Other"}
                            onChange={onValueChange}
                        />
                        5
                    </label>
                </div>
            </div>

                <div className='activity-lvl-container'>
                <div className='activity-lvl-title'>{activityLvl[activityLvlNum-1]}</div>
                <div className='activity-lvl-desc'>{activityLvlDesc[activityLvlNum-1]}</div>
                </div>
        </form>
    );
}

export default ActivityForm