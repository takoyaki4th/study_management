import React, { useState } from 'react';
import { timeToString, startTimer, stopTimer, resetTimer } from './timer';
import './App.css';

function DayStusy({subject,day_study}) {
  return (
    <p>&nbsp;&nbsp;&nbsp;{subject}: 
      <span>{timeToString(day_study,'ja')}</span>
    </p>
  );
}

function TotalStudy({subject,total_study}){
  return (
    <p>&nbsp;&nbsp;&nbsp;{subject}: 
      <span>{timeToString(total_study,'ja')}</span>
    </p>
  );
}

function App() {
  const subjects = [
    {id:1 ,subject:'insi',day_study:1000*60*60,total_study:1000*60*60*6},
    {id:2 ,subject:'toeic',day_study:1000*60,total_study:1000*10*6*60},
    {id:3 ,subject:'programing',day_study:1000,total_study:10*60*6*60}
  ];
  const option_list = subjects.map((subject) =>{
    return <option key={subject.id}>{subject.subject}</option>; 
  });

  const day_study_list = subjects.map((subject) => {
    return <DayStusy key={subject.id} subject={subject.subject} day_study={subject.day_study} />;
  });

  const total_study_list = subjects.map((subject) => {
    return <TotalStudy key={subject.id} subject={subject.subject} total_study={subject.total_study} />;
  });

  const [isStart,setIsStart] = useState(true);

  const handleOnStartStop = () =>{
    if(isStart){
      setIsStart(false);
      startTimer();
    }else{
      setIsStart(true);
      stopTimer();
    }
  };

  const handleOnReset = resetTimer;

  const handleOnSubmit = () =>{
    resetTimer();
  }

  const handleOnDayReset = () =>{
    resetTimer();
  }

  return (
    <div id='container'>
      <form action="api.php">
        <select name="select" id="Subject">{option_list}</select>
        <button id="StartStopButton" type="button" onClick={handleOnStartStop}>{isStart ? 'Start': 'Stop' }</button>
        <p id="Timer">00:00:00:00</p>
        <div>
            <button type="submit" onSubmit={handleOnSubmit}>記録</button>
            <button type="button" onClick={handleOnReset}>取消</button>
        </div>
      </form>
      
      <div id="DayStudy">
          <p>今日の勉強時間</p>
          {day_study_list}
      </div>
      <form action="api.php">
          <button type="submit" onSubmit={handleOnDayReset}>
            今日の勉強を始める/終わる
          </button>
      </form>
      <div id="TotalStudy">
          <p>合計の勉強時間</p>
          {total_study_list}
      </div>
    </div>
  );
}

export default App;
