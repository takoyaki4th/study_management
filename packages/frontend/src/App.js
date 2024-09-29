import React, { useState,useEffect } from 'react';
import { timeToString, startTimer, stopTimer, resetTimer } from './timer';
import './App.css';

async function sendData(url, formData, processResponse) {
  try {
      const options = formData 
          ? { method: "POST", body: formData }
          : { method: "POST" };
      const response = await fetch(url, options);
      const data = await response.json();

      processResponse(data);

  } catch (error) {
      console.error("Error:", error);
  }
}

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
  const [subjects,setSubjects]=useState([]);
  useEffect(() => {
    sendData("/api", undefined , function(data) {
      console.log(data);
      setSubjects(data);
    });
  },[]);

  const option_list = subjects.map((subject) =>{
    return <option key={subject.id}>{subject.subject}</option>; 
  });

  const day_study_list = subjects.map((subject) => {
    return <DayStusy key={subject.id} subject={subject.subject} day_study={subject.day_time} />;
  });

  const total_study_list = subjects.map((subject) => {
    return <TotalStudy key={subject.id} subject={subject.subject} total_study={subject.total_time} />;
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

  const handleOnSubmit = (event) =>{
    event.preventDefault();
    resetTimer();
  }

  const handleOnDayReset = (event) =>{
    event.preventDefault();
    resetTimer();
  }

  return (
    <div id='container'>
      <form onSubmit={handleOnSubmit}>
        <select name="select" id="Subject">{option_list}</select>
        <button id="StartStopButton" type="button" onClick={handleOnStartStop}>{isStart ? 'Start': 'Stop' }</button>
        <p id="Timer">00:00:00:00</p>
        <div>
            <button type="submit">記録</button>
            <button type="button" onClick={handleOnReset}>取消</button>
        </div>
      </form>
      
      <div id="DayStudy">
          <p>今日の勉強時間</p>
          {day_study_list}
      </div>
      <form onSubmit={handleOnDayReset}>
          <button type="submit">
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
