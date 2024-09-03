(function() {

let startTime;
let elapsedTime = 0;
let timerInterval;
const elementsMap = new Map();

function timeToString(time , mode=":") {
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

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        document.getElementById("Timer").textContent = timeToString(elapsedTime);
    }, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById("Timer").textContent = "00:00:00:00";
    elapsedTime = 0;
    document.getElementById("StartStopButton").textContent = "Start";
}

document.getElementById("StartStopButton").addEventListener("click", function() {
    const button=document.getElementById("StartStopButton");
    const buttonText = button.textContent;
    if( buttonText === "Start"){
        button.textContent="Stop";
        startTimer();
    }else if(buttonText === "Stop"){
        button.textContent="Start";
        stopTimer();
    }else{
        button.textContent="ERROR";
    }
});

document.getElementById("ResetButton").addEventListener("click", resetTimer);

//******async/await functions******
async function sendData(url, formData, processResponse) {
    try {
        const options = formData 
            ? { method: "POST", body: formData }
            : { method: "GET" };
        const response = await fetch(url, options);

        const data = await response.json();
        processResponse(data);

    } catch (error) {
        console.error("Error:", error);
    }
}

//*****addEventListener*****

document.addEventListener("DOMContentLoaded", function() {
    sendData("/api", undefined , function(subjects) {
        subjects.forEach(function(subject) {
            const subjectOption = document.createElement("option");
            subjectOption.textContent = subject.subject;
            subjectOption.value = subject.subject;
            const subjectSelect = document.getElementById("Subject");
            subjectSelect.appendChild(subjectOption);

            const dayP = document.createElement("p");
            dayP.innerHTML=`&nbsp;&nbsp;&nbsp;${subject.subject}: <span>${timeToString(subject.day_time,"ja")}</span>`;
            const dayDiv = document.getElementById("DayStudy");
            dayDiv.appendChild(dayP);

            const totalP = document.createElement("p");
            totalP.innerHTML=`&nbsp;&nbsp;&nbsp;${subject.subject}: <span>${timeToString(subject.total_time,"ja")}</span>`;
            const totalDiv = document.getElementById("TotalStudy");
            totalDiv.appendChild(totalP);

            elementsMap.set(subject.subject, {
                day: dayP,
                total: totalP
            });
        });

//////////////////////////////////
        fetch('/set', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Session Test' })
        })
        .then(response => response.text())
        .then(() => {
            // メッセージを取得するリクエスト
            return fetch('/set/set');
        })
        .then(response => response.json())
        .then(data => {
            // 取得したメッセージを表示
            document.getElementById('message').textContent = data.message;
        })
        .catch(error => {
            console.error('Error:', error);
        });


/////////////////////////


    });


});

document.getElementById("TimerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("elapsedTime",elapsedTime);

    sendData("/api/timeChange", formData , function(subject) {
        //console.log(subject[0]["subject"]);
        //console.log(elementsMap.get(subject["subject"]).day.querySelector("span").textContent);
        const submitSubject = elementsMap.get(subject[0].subject);
        submitSubject.day.querySelector("span").textContent = timeToString(subject[0].day_time, "ja");
        submitSubject.total.querySelector("span").textContent = timeToString(subject[0].total_time, "ja");
    });
    
    resetTimer();
});

document.getElementById("DayReset").addEventListener("submit", function(event) {
    event.preventDefault();

    sendData("/api/dayReset", undefined , function(subjects) {
        //console.log(subjects);
        
        subjects.forEach(function(subject){
            //console.log(subject)
            //console.log(subject.subject);
            const changeSubject = elementsMap.get(subject.subject);
            changeSubject.day.querySelector("span").textContent = timeToString(subject.day_time, "ja");
        });
    });

    resetTimer();
});

})();