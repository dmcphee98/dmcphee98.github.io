import React from 'react'
import { useState, useEffect } from 'react';

import NextButton from '../Common/NextButton/NextButton';
import ProjectionForm from './ProjectionForm/ProjectionForm';

import './WeightProjector.css';

import dataImg from './data.svg'

const WeightProjector = ({ healthData, goalData, setGoalData, projectionData, setProjectionData, activePageIndex, setActivePageIndex }) => {

  const [isDailyCalsMode, setDailyCalsMode] = useState(false);
  const [deficitSeverity, setDeficitSeverity] = useState('');
  const [isWeightLoss, setIsWeightLoss] = useState(true);
  const [projectionWillDiverge, setProjectionWillDiverge] = useState(false);

  /*
   *  'Daily cals' mode calculation
   */
  useEffect(() => {
    if (isDailyCalsMode) {
      let {initialWeight, tdee} = healthData;
      let {goalWeight, startDate, dailyCals} = goalData;

      // Do not calculate if form is not fully complete
      if (!!!goalWeight || startDate === '' || dailyCals === '') {
        setProjectionData('');
        return;
      }

      // Do not calculate if specified daily cals result in projection divergence
      const isLoss = goalWeight <= initialWeight;
      setIsWeightLoss(isLoss);
      if ((isLoss && dailyCals >= tdee) || (!isLoss && dailyCals <= tdee)) {
        setProjectionData('');
        setProjectionWillDiverge(true);
        return;
      }

      setProjectionWillDiverge(false);

      console.log('Projecting weight in DailyCals Mode...');
      const totalDays = projectWeight(initialWeight, goalWeight, startDate, dailyCals, true);

      console.log('Determining end date...');
      const finishDate = addDaysToDate(startDate, totalDays-1);

      setGoalData({...goalData, finishDate, totalDays});
      getDeficitSeverity(tdee, dailyCals);
    }
  }, [healthData, goalData.goalWeight, goalData.startDate, goalData.dailyCals])

  /*
   *  'Finish date' mode calculation
   */
  useEffect(() => {
    if (!isDailyCalsMode) {
      let {initialWeight, tdee} = healthData;
      let {goalWeight, startDate, finishDate} = goalData;

      // Do not calculate if form is not fully complete
      if (!!!goalWeight || startDate === '' || finishDate === '') {
        setProjectionData('');
        return;
      }

      setIsWeightLoss(goalWeight <= initialWeight);

      console.log('Determining daily calorie allowance...');
      const totalDays = getDaysBetweenDates(startDate, finishDate)+1;
      const dailyCals = getDailyCalsFromDeadline(tdee, initialWeight, goalWeight, startDate, totalDays);

      console.log('Projecting weight in Deadline Mode...');
      projectWeight(initialWeight, goalWeight, startDate, dailyCals, true);

      setGoalData({...goalData, dailyCals, totalDays});
      getDeficitSeverity(tdee, dailyCals);
    }
  }, [healthData, goalData.goalWeight, goalData.startDate, goalData.finishDate])

  /**
   * Calculate daily calorie allowance required to meet a given deadline
   * @param {Number} tdee - Total Daily Energy Expenditure (TDEE) of user
   * @param {Number} initialWeight - Weight of user, in kg, on start date
   * @param {Number} goalWeight - Weight of user, in kg, on end date
   * @param {Number} startDate - Start date
   * @param {Number} totalDays - Days between (and including) start and end dates
   * @returns {Number} Daily calorie allowance
   */ 
  const getDailyCalsFromDeadline = (tdee, initialWeight, goalWeight, startDate, totalDays) => {
    const startTdee = tdee;
    const finishTdee = recalculateTDEE(goalWeight);
    // Get TDEE at 40% and 60%
    const upperTdee = startTdee - 0.4 * (startTdee - finishTdee);
    const lowerTdee = startTdee - 0.6 * (startTdee - finishTdee);

    // Get required average daily caloric deficit 
    const deficit = 7700 * (initialWeight - goalWeight) / totalDays;
    
    // Get upper and lower bound for daily calorie allowance
    let upper = upperTdee - deficit;
    let lower = lowerTdee - deficit;

    // Binary search to hone in on an accurate daily calorie allowance
    let days, dailyCalsEstimate, depth = 0;
    for (depth = 0; depth < 20; depth++) {
      dailyCalsEstimate = (upper + lower) / 2.0;
      // Get number of days to reach goal weight
      days = projectWeight(initialWeight, goalWeight, startDate, dailyCalsEstimate, false);

      // Tweak daily calorie allowance so resulting number of days exactly meets deadline
      if (days === totalDays) break;
      if (days < totalDays) {
        lower = dailyCalsEstimate;
      } else {
        upper = dailyCalsEstimate;
      }
    }
    // Return refined daily calorie allowance
    return dailyCalsEstimate;
  }

  /**
   * Project weight over time given start weight, end weight, and daily calories 
   * @param {Number} initialWeight - Weight of user, in kg, on start date
   * @param {Number} goalWeight - Weight of user, in kg, on end date
   * @param {Number} startDate - Start date
   * @param {Number} dailyCals - Daily calorie allowance
   * @param {Boolean} enableDataCapture - Enable capture of time series data
   * @returns {Number} Daily calorie allowance
   */ 
   const projectWeight = (initialWeight, goalWeight, startDate, dailyCals, enableDataCapture) => {
    let numDays = 1;
    let currentWeight = initialWeight;

    // Initialise chart data
    let xyData = [];
    if (enableDataCapture) xyData.push({x: 0, y: Number(initialWeight)});

    // Perform day-by-day weight projection
    const isLoss = goalWeight <= initialWeight;
    while ((isLoss && currentWeight > goalWeight) || (!isLoss && currentWeight < goalWeight)) {
      currentWeight -= (recalculateTDEE(currentWeight) - dailyCals) / 7700;
      if (enableDataCapture) xyData.push({x: numDays, y: currentWeight});
      numDays++;
    }
    // Optionally save projection data 
    if (enableDataCapture) {
      setProjectionData({
        xy: xyData,
        xMax: xyData.length,
        yMin: Math.min(initialWeight, goalWeight),
        yMax: Math.max(initialWeight, goalWeight),
        startDate
      });
    }
    return numDays;
  }

  /**
   * 
   * @param {String} startDate - Start date string in YYYY-MM-DD format
   * @param {Number} daysToAdd - Number of days to add to start date
   * @returns Date object representing finish date
   */
  const addDaysToDate = (startDate, daysToAdd) => {
    const finishDate = new Date(startDate.getTime() + daysToAdd * 86400000);
    console.log('Finish date is ' + finishDate);
    return finishDate;
  }
  
  /**
   * 
   * @param {String} startDate - Start date string in YYYY-MM-DD format
   * @param {String} endDate - End date string in YYYY-MM-DD format
   * @returns Number of days between start and end date
   */
  const getDaysBetweenDates = (startDate, endDate) => {
    const dt = endDate.getTime() - startDate.getTime();
    return dt / (1000 * 3600 * 24);
  } 

  /**
   * Appends ordinal suffix to given day of month
   * @param {Number} dayOfMonth - The day of the month (0-31)
   * @returns Ordinal day of month as string
   */
  const getOrdinalNum = (dayOfMonth) => {
    if (dayOfMonth < 1 || dayOfMonth > 31) throw new RangeError("Day of month must be between 1 and 31, inclusive");
    let selector;
    if (dayOfMonth <= 0) {
      selector = 4;
    } else if ((dayOfMonth > 3 && dayOfMonth < 21) || dayOfMonth % 10 > 3) {
      selector = 0;
    } else {
      selector = dayOfMonth % 10;
    }
    return dayOfMonth + ['th', 'st', 'nd', 'rd', ''][selector];
  };  

  const recalculateTDEE = (currentWeight) => {
    const { isMale, height, age, activityLvl } = healthData;
    let bmr;
    if (isMale) {
      bmr = (88.362 + (13.397 * currentWeight) + (479.9 * height) - (5.677 * age));
    } else {
      bmr = (447.593 + (9.247 * currentWeight) + (309.8 * height) - (4.330 * age));
    }
    const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    return bmr * multipliers[activityLvl-1];
  }

    /**
   * Calculates caloric deficit and determines how healthy it is
   * @param {Number} tdee
   * @param {Number} dailyCals
   * @returns String indicating how healthy the calorie deficit is
   */
  const getDeficitSeverity = (tdee, dailyCals) => {
    // Assign a health severity to the daily calorie allowance
    const caloricDeficit = tdee - dailyCals;
    if (caloricDeficit > 1000) {
      setDeficitSeverity('severe');
    } else if (caloricDeficit > 500) {
      setDeficitSeverity('unhealthy');
    } else {
      setDeficitSeverity('healthy');
    }
  }
  
  return (
    <div>
      <div className='page-container proj-page-container'>
        <div className='proj-content'>
          <div className='img-container proj-img-container'>
            <img className='proj-img' src={dataImg} alt="My Happy SVG"/>
          </div>
          <div className='form-container'>
            <div className='proj-info-container'>
              <p className='proj-info'>
                <span>Now, let's work out your goals.</span>
              </p>
            </div>
            <div className='proj-form'>
              <ProjectionForm 
                goalData={goalData}
                setGoalData={setGoalData}
                isDailyCalsMode={isDailyCalsMode}
                setDailyCalsMode={setDailyCalsMode}
                setProjectionData={setProjectionData}
              />
            </div>
          </div>
        </div>
        { !projectionWillDiverge && 
          <div className='proj-warning'>
            <i className='fa-solid fa-circle-info proj-warning-icon'/>
            <span className='proj-warning-bold'>Tip: </span>
            { isWeightLoss && 
              <span><i>A deficit of 500-750 calories is the general recommendation for healthy weight loss.</i></span>
            }
            { !isWeightLoss && 
              <span><i>A surplus of 250-500 calories is the general recommendation for healthy weight gain.</i></span>
            }
          </div>
        }
        { projectionWillDiverge && 
          <div className='proj-warning'>
            <i className='fa-solid fa-circle-exclamation proj-warning-icon'/>
            <span className='proj-warning-bold'> Error: </span>
            <span><i>To reach your goal weight, your daily calories must be {isWeightLoss ? 'less' : 'greater'} than your TDEE.</i></span>
          </div>
        }
      </div>
      <div className='page-spacer'>
        <NextButton 
          pageIndex={3} 
          enabled={!!projectionData}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}/>
      </div>
    </div>
  )
}

export default WeightProjector