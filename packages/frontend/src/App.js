import React, { useState,useEffect } from 'react';
import { timeToString, startTimer, stopTimer, resetTimer ,sendData, getElapsedTime } from './timer';
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

function SelectComponent({ setSelectedValue,subjects,selectedValue}) {
  const option_list = subjects.map((subject) =>{
    return <option key={subject.id} value={subject.id}>{subject.subject}</option>; 
  });

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  }
  
  return (
    <select name="select" id="Subject" onChange={handleSelectChange}>{option_list}</select>
  )
}

function App() {
  const [subjects,setSubjects]=useState([]);
  const [elapsedTime,setElapsedTime]=useState("00:00:00:00"); //タイマー用に変換された文字列
  const [isStart,setIsStart] = useState(true);
  const [selectedValue,setSelectedValue] = useState();

  useEffect(() => {
    sendData("/api", undefined , function(data) {
      console.log(data);
      setSubjects(data);
      setSelectedValue(data[0].id);
    });
  },[]);

  const day_study_list = subjects.map((subject) => {
    return <DayStusy key={subject.id} subject={subject.subject} day_study={subject.day_time} />;
  });

  const total_study_list = subjects.map((subject) => {
    return <TotalStudy key={subject.id} subject={subject.subject} total_study={subject.total_time} />;
  });


  const handleOnStartStop = () =>{
    if(isStart){
      setIsStart(false);
      startTimer(setElapsedTime);
    }else{
      setIsStart(true);
      stopTimer();
    }
  };

  const handleOnSubmit = (event) =>{
    event.preventDefault();
    const data = {
      "selectedSubjectId":selectedValue,
      "elapsedTime":getElapsedTime()
    };

    sendData("/api/timeChange", data , function(updatedSubject) {
      setSubjects((prevSubjects) => {
        return prevSubjects.map((subject) => {
          if (subject.id === updatedSubject.id) {
            return updatedSubject;
          }
          return subject;
        });
      });
    });
    setElapsedTime(resetTimer());
  }

  const handleOnDayReset = (event) =>{
    event.preventDefault();
    sendData("/api/dayReset", undefined , function(updatedSubjects) {
      setSubjects((prevSubjects) => {
        return prevSubjects.map((subject)=> {
          const foundUpdatedSubject = updatedSubjects.find(usubject => subject.id === usubject.id);
          if (foundUpdatedSubject) {
            return { ...subject, day_time: foundUpdatedSubject.day_time };
          }
          return subject;
        });
      });
    });
    setElapsedTime(resetTimer());
  }

  return (
    <div id="container">
      <form onSubmit={handleOnSubmit}>
        <SelectComponent setSelectedValue={setSelectedValue} subjects={subjects} selectedValue={selectedValue}/>
        <button id="StartStopButton" type="button" onClick={handleOnStartStop}>{isStart ? 'Start': 'Stop' }</button>
        <p id="Timer">{elapsedTime}</p>
        <div>
            <button type="submit">記録</button>
            <button type="button" onClick={ () => setElapsedTime(resetTimer())}>取消</button>
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