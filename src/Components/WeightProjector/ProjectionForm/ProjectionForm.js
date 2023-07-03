import React from 'react'
import { useState, useEffect } from 'react';
import SubmitButton from '../../Common/SubmitButton/SubmitButton';
import NumInput from '../../Common/NumInput/NumInput';
import DateInput from '../../Common/DateInput/DateInput';
import './ProjectionForm.css';

const ProjectionForm = ({ goalData, setGoalData, isDailyCalsMode, setDailyCalsMode, setProjectionData}) => {

    const [goalWeight, setGoalWeight] = useState('');
    const [dailyCals, setDailyCals] = useState('');
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(0);

    useEffect(() => {
      setProjectionData('');
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(() => {
        setGoalData({
          ...goalData, 
          'goalWeight': goalWeight, 
          'startDate': startDate,
          'finishDate': finishDate,
          'dailyCals': dailyCals
        });
      }, 750));

    }, [goalWeight, startDate, finishDate, dailyCals])
  
    const setDeadlineMode = () => {
      console.log("Mode set to 'Deadline'.");
      setDailyCalsMode(false);
    };

    const setDailyMode = () => {
      console.log("Mode set to 'Daily'.");
      setDailyCalsMode(true);
    };

    return (
        <form className='proj-form'>
            <NumInput number={goalWeight} setNumber={setGoalWeight} units='kg' description='Goal Weight' color='purple'/>
            <DateInput number={startDate} setNumber={setStartDate} description='Start Date'/>
            <div className="proj-container">
                <div className="proj-desc-A">Enter a <em>finish date</em> to find<br></br>your daily calorie allowance</div>
                <DateInput number={finishDate} setNumber={setFinishDate} description='Finish Date' isEnabled={!isDailyCalsMode} callback={setDeadlineMode} />
                <div className="proj-or">OR</div>
                Enter a daily <em>calorie allowance</em> <br></br>to estimate your finish date
                <NumInput number={dailyCals} setNumber={setDailyCals} description='Daily Cals' units='Cal' isEnabled={isDailyCalsMode} callback={setDailyMode} color='purple'/>
            </div>
        </form>
    );
}

export default ProjectionForm