//This is the format for a comment
/* 
    or this
    for multiline
    comments
*/  
let playername;
let startTimerId = 5;
let inGameMaxTimer = 10;
let inGameTimerId = 10;
var wpp = 1000;
let lives = 3;
let score = 0;
let minTime = 3;
let highScore = 0;
import wordOccur from './dictoccur.json' assert {type : 'json'};
import wordDict from './dict.json' assert {type : 'json'};
var wordInput = document.getElementById("inputSpace");
let usedWords = []

document.getElementById("joinButton").onclick = function(){
    if(document.getElementById("myPlayername").value){
        playername = document.getElementById("myPlayername").value;
        document.getElementById("playernameError").innerHTML = "";
        joinGame();
        startGame();
    }
    else{
        document.getElementById("playernameError").innerHTML = "Please enter a player name in the input above!";
        document.getElementById("logoBP").style.display = "initial";
    } 
}
document.getElementById("leaveButton").onclick = function(){
    leaveGame();
}

function joinGame(){
    document.getElementById("logoBar").style.display = "none";
    document.getElementById("bombBar").style.display = "flex";
    document.getElementById("startBar").style.display = "none";
    document.getElementById("leaveBar").style.display = "flex";
    document.getElementById("scoreBar").style.display = "flex";
    document.getElementById("score").innerHTML = "Score: "+score.toString()
}

function startGame(){
    document.getElementById("waitingText").innerHTML = "⏱️ Round will start in "+startTimerId.toString()+"s!";
    let startTimer = setInterval(function(){
        startTimerId -= 1;
        document.getElementById("waitingText").innerHTML = "⏱️ Round will start in "+startTimerId.toString()+"s!";
        if (startTimerId == 0){
            clearTimeout(startTimer);
            startTimerId = 5;
            inGame();
            newWord();
        }
    }, 1000);
}

function inGame(){
    document.getElementById("waitingBar").style.display = "none";
    document.getElementById("difficultyBar").style.top = "40px";
    document.getElementById("editRules").style.display = "none";
    document.getElementById("inputBar").style.display = "flex";
    document.getElementById("leaveBar").style.display = "none";
    document.getElementById("promptLetters").style.display = "flex";
    document.getElementById("gameTimer").style.display = "flex";
    document.getElementById("inputSpace").focus();
    let gameTimer = setInterval(function(){
        inGameTimerId = Math.round((inGameTimerId - 0.1) * 10) / 10;
        document.getElementById("gameTimer").innerHTML = inGameTimerId.toString()+"s";
        if (inGameTimerId <= 0){
            lives -= 1;
            if (lives = 0){
                document.getElementById("gameTimer").innerHTML = "Start";
                clearTimeout(gameTimer);
                leaveGame();
            }
        }
    }, 100);
}

var count = Object.keys(wordOccur).length;
let randomIndex;

function newWord(){
    inGameTimerId = inGameMaxTimer - 0.1;
    if(inGameMaxTimer > minTime){
        inGameMaxTimer -= 0.1;
    }
    randomIndex = Math.floor(Math.random() * count);
    while (wordOccur[(Object.keys(wordOccur)[randomIndex])] < wpp){
        randomIndex = Math.floor(Math.random() * count);
    }
    document.getElementById("promptLetters").innerHTML = Object.keys(wordOccur)[randomIndex];
    document.addEventListener("keypress", function(event){
        if (event.key === "Enter"){
            checkWord();
        }
    });
    /*console.log(wordOccur[(Object.keys(wordOccur)[randomIndex])]);
    console.log(Object.keys(wordOccur)[randomIndex]);
    console.log(randomIndex);
    console.log(count);*/
}

function checkWord(){
    if (document.getElementById("inputSpace").value.toUpperCase().includes(Object.keys(wordOccur)[randomIndex]) && wordDict.includes(document.getElementById("inputSpace").value.toUpperCase()) && !usedWords.includes(document.getElementById("inputSpace").value.toUpperCase())){
        //console.log("It is a word!");
        usedWords.push(document.getElementById("inputSpace").value.toUpperCase());
        //console.log(usedWords);
        document.getElementById("inputSpace").value = '';
        score += 1;
        document.getElementById("score").innerHTML = "Score: "+score.toString()
        //document.getElementById("bg").classList.add('bg-change');
        newWord();
    }
    else {
        //console.log("It is not a word!")
        invalidWord();
    }
}

function leaveGame(){
    document.getElementById("logoBar").style.display = "block";
    document.getElementById("bombBar").style.display = "none";
    document.getElementById("startBar").style.display = "flex";
    document.getElementById("leaveBar").style.display = "none";
    document.getElementById("waitingBar").style.display = "flex";
    document.getElementById("difficultyBar").style.top = "90px";
    document.getElementById("editRules").style.display = "flex";
    document.getElementById("inputBar").style.display = "none";
    document.getElementById("promptLetters").style.display = "none";
    document.getElementById("gameTimer").style.display = "none";
    document.getElementById("waitingText").innerHTML = "⏳ Waiting for 1 more player...";
    document.getElementById("inputSpace").value = '';
    clearTimeout(startTimerId);
    startTimerId = 5;
    inGameTimerId = 10;
    inGameMaxTimer = 10;
    if(score > highScore){
        highScore = score;
    }
    document.getElementById("score").innerHTML = "Your score: "+score.toString()+"  |  Highest score: "+highScore.toString();
    score = 0;
    console.log(usedWords);
    usedWords = [];
    lives = 3;
}