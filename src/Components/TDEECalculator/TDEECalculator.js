import React from 'react'
import { useState, useEffect } from 'react';

import NextButton from '../Common/NextButton/NextButton';
import ActivityForm from './ActivityForm/ActivityForm';
import './TDEECalculator.css';

import soccerImg from './soccer.svg'

const TDEECalculator = ({ healthData, setHealthData, activePageIndex, setActivePageIndex }) => {

  useEffect(() => {
    const {bmr, activityLvl} = healthData;
    // Update TDEE
    if (bmr !== '' && activityLvl !== '') {
      console.log('Calculating TDEE...')
      const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
      const tdee = bmr * multipliers[activityLvl-1];
      setHealthData({...healthData, 'tdee':tdee.toFixed(0)}); 
    }
  }, [healthData.activityLvl, healthData.bmr])
    
  return (
    <div>
      <div className='page-container'>
        <div className='img-container'>
          <img className='tdee-img' src={soccerImg} alt="My Happy SVG"/>
        </div>
        <div className='form-container'>
          <div className='tdee-info-container'>
            <p className='tdee-info'>
              <span>Next, let's find your activity level.</span>
            </p>
          </div>
          <div className='tdee-form'>
            <ActivityForm 
              healthData={healthData}
              setHealthData={setHealthData}
            />
          </div>
          <div className='tdee-result-container'>
            <div>TDEE</div>
            <div className='tdee-result'>{healthData.tdee}</div>
            <div className='tdee-definition'>
              Your Total Daily Energy Expenditure (TDEE) is the average number of calories your body burns each day.
            </div>
          </div>
        </div>
      </div>
      <div className='page-spacer'>
        <NextButton 
          pageIndex={2} 
          enabled={true}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}/>
      </div>
    </div>
  )
}

export default TDEECalculator