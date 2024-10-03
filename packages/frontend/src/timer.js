let startTime;
let elapsedTime=0;
let timerInterval;

export function timeToString(time , mode=":") {
  const diffInHrs = time / 3600000;
  const hh = Math.floor(diffInHrs);

  const diffInMin = (diffInHrs - hh) * 60;
  const mm = Math.floor(diffInMin);

  const diffInSec = (diffInMin - mm) * 60;
  const ss = Math.floor(diffInSec);

  const diffInMs = (diffInSec - ss) * 100;
  const ms = Math.floor(diffInMs);

  const formattedHH = hh.toString().padStart(2, "0");
  const formattedMM = mm.toString().padStart(2, "0");
  const formattedSS = ss.toString().padStart(2, "0");
  const formattedMS = ms.toString().padStart(2, "0");
  if(mode === "ja"){
      return `${formattedHH}時間${formattedMM}分${formattedSS}.${formattedMS}秒`;
  }else{
      return `${formattedHH}:${formattedMM}:${formattedSS}:${formattedMS}`;
  }
}

export function getElapsedTime(){
  return elapsedTime;
}

export function startTimer(setElapsedTime) {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      setElapsedTime(timeToString(elapsedTime));
  }, 10);
}

export function stopTimer() {
  clearInterval(timerInterval);
}

export function resetTimer() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  return timeToString(elapsedTime);
}

export async function sendData(url, sendedData, processResponse) {
  try {
    const options = {
      method: "POST",
      headers: {},
    };
    
    if (sendedData) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(sendedData);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    processResponse(data);

  } catch (error) {
      console.error("Error:", error);
  }
}