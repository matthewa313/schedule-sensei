import React from 'react'
import { useState, useEffect } from 'react';

import {
  Container,
  LinearProgress,

} from '@mui/material';

const CountdownTimer = ({ targetUTC }: { targetUTC: number }) => {
  const calculateTimeLeft = () => {
    const offset = new Date().getTimezoneOffset() * 60 * 1000;
    const now = Date.now() - offset //accounting for local timezones;
    const target = targetUTC;
    const difference = target - now;
    

    //when Master Schedule comes out; a reference point for progress bar calculations
    const start = Date.UTC(2025, 3, 2);


    if (difference <= 0) {
      return { goal:1, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      goal: ((now-start)/(target-start)),
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (


    <>
      <div className='timer'>
        <div className='timerSection'>
          <span>
            {timeLeft.days}
          </span>
          <span className='small'>
            Days
          </span>
        </div>

        <h2>:</h2>

        <div className='timerSection'>
          <span>
            {timeLeft.hours}
          </span>
          <span className='small'>
            Hours
          </span>
        </div>

        <h2>:</h2>
        

        <div className='timerSection'>
          <span>
            {timeLeft.minutes}
          </span>
          <span className='small'>
            Minutes
          </span>
        </div>

        <h2>:</h2>


        <div className='timerSection'>
          <span>
            {timeLeft.seconds}
          </span>
          <span className='small'>
            Seconds
          </span>
        </div>


      </div>
      
      <LinearProgress variant='determinate' value={timeLeft.goal*100}/>
    </>

  );
};

export default CountdownTimer;
