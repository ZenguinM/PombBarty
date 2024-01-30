//This is the format for a comment
/* 
    or this
    for multiline
    comments
*/  
let playername;
let startTimerId = 5;
let inGameTimerId = 10;
var lives = 3;
var inGameLives = lives;
let score = 0;
var maxTime = 10;
var minTime = 5;
let highScore = 0;
let wppV = 20000 - document.getElementById("wppValue").value;
import wordOccur from './dictoccur.json' assert {type : 'json'};
import wordDict from './dict.json' assert {type : 'json'};
var wordInput = document.getElementById("inputSpace");
let usedWords = [];
let letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
let wordDetails = {};
let validWords = {};
var startTimer;
var gameTimer;
var bombSFX = document.querySelector('#bomb-audio');
var tickSFX = document.querySelector('#tick-audio');
var validSFX = document.querySelector('#valid-audio');
var invalidSFX;
var usedSFX;
var clickSFX;


document.getElementById("joinButton").onclick = function(){
    if(document.getElementById("myPlayername").value){
        playername = document.getElementById("myPlayername").value;
        document.getElementById("playernameError").innerHTML = "";
        joinGame();
        countWords();
        startGame();
    }
    else{
        document.getElementById("playernameError").innerHTML = "Please enter a player name in the input above!";
        document.getElementById("logoBP").style.display = "initial";
    } 
}
document.getElementById("leaveButton").onclick = function(){
    document.getElementById("gameTimer").innerHTML = "Start";
    leaveGame();
}
document.getElementById("editRules").onclick = function(){
    openRules();
}
document.getElementById("closeRules").onclick = function(){
    closeRules();
}

function joinGame(){
    document.getElementById("logoBar").style.display = "none";
    document.getElementById("bombBar").style.display = "flex";
    document.getElementById("startBar").style.display = "none";
    document.getElementById("leaveBar").style.display = "flex";
    document.getElementById("scoreBar").style.display = "flex";
    document.getElementById("score").innerHTML = "Score: "+score.toString();
    document.getElementById("livesBar").innerHTML = ("❤️").repeat(inGameLives);
    document.getElementById("letterLives").style.display = "grid";
}

function countWords(){
    for (let i in wordOccur){
        if (wordOccur[i] >= wppV) {
            validWords[i] = wordOccur[i]
        }
    }
    console.log(validWords)
    console.log("Number of valid prompts: " + Object.keys(validWords).length)
}

function startGame(){
    document.getElementById("waitingText").innerHTML = "⏱️ Round will start in "+startTimerId.toString()+"s!";
    inGameLives = lives;
    startTimer = setInterval(function(){
        if (startTimerId == 1){
            clearInterval(startTimer);
            startTimerId = 5;
            inGame();
            newWord();
            startInGame();
        } else {
            startTimerId--;
            document.getElementById("waitingText").innerHTML = "⏱️ Round will start in "+startTimerId.toString()+"s!";
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
    document.getElementById("livesBar").style.display = "flex";
    document.getElementById("inputSpace").focus();
    //tickSFX.play();
}

function startInGame(){
    gameTimer = setInterval(function(){
        inGameTimerId = Math.round((inGameTimerId - 0.1) * 10)/10
        document.getElementById("gameTimer").innerHTML = inGameTimerId.toString()+"s";
        document.getElementById("livesBar").innerHTML = ("❤️").repeat(inGameLives);
        if (inGameTimerId <= 0){
            wordDetails[Object.keys(validWords)[randomIndex]] = "-";
            inGameLives -= 1;
            bombSFX.play();
            if (inGameLives > 0) {
                newWord();
                document.getElementById("inputSpace").value = '';
            } else {
                leaveGame();
            }
        }
    }, 100)
    
}

let randomIndex;

function newWord(){
    inGameTimerId = maxTime;
    if(maxTime > minTime){
        maxTime -= 0.1;
    }
    randomIndex = Math.floor(Math.random() * (Object.keys(validWords).length));
    document.getElementById("promptLetters").innerHTML = Object.keys(validWords)[randomIndex];
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
    if (document.getElementById("inputSpace").value.toUpperCase().includes(Object.keys(validWords)[randomIndex]) && wordDict.includes(document.getElementById("inputSpace").value.toUpperCase()) && !usedWords.includes(document.getElementById("inputSpace").value.toUpperCase())){
        usedWords.push(document.getElementById("inputSpace").value.toUpperCase());
        wordDetails[Object.keys(validWords)[randomIndex]] = document.getElementById("inputSpace").value.toUpperCase();
        score += 1;
        //document.getElementById("bgRes").style.backgroundImage = "radial-gradient(rgba(0, 0, 0, 0) 50%, rgb(40, 151, 48, 0.7))";
        document.getElementById("score").innerHTML = "Score: "+score.toString();
        inGameTimerId = maxTime;
        let oldInput = document.getElementById("inputSpace").value.toUpperCase();
        let oldPrompt = Object.keys(validWords)[randomIndex];
        let newInput = oldInput.replace(oldPrompt,"");;
        document.getElementById("inputSpace").value = '';
        for (let j = 0; j < newInput.length; j++){
            if (letters.includes(newInput[j])){
                letters.splice(letters.indexOf(newInput[j]),1);
                document.getElementById(`letter${newInput[j]}`).style.backgroundColor = "rgb(88, 88, 83)";
            }
        }
        if (letters.length === 0){
            letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
            for (let k = 0; k < letters.length; k++){
                document.getElementById(`letter${letters[k]}`).style.backgroundColor = "rgb(230, 211, 118)";
            }
            inGameLives += 1
            document.getElementById("livesBar").innerHTML = ("❤️").repeat(inGameLives);
        }
        //document.body.style.backgroundImage = "radial-gradient(rgb(57, 53, 50) 70%, rgb(40, 151, 48, 0.7))";
        validSFX.play();
        newWord();
    }
}


function leaveGame(){
    clearInterval(startTimer);
    clearInterval(gameTimer);
    document.getElementById("logoBar").style.display = "block";
    document.getElementById("bombBar").style.display = "none";
    document.getElementById("startBar").style.display = "flex";
    document.getElementById("leaveBar").style.display = "none";
    document.getElementById("waitingBar").style.display = "flex";
    document.getElementById("difficultyBar").style.top = "90px";
    document.getElementById("editRules").style.display = "flex";
    document.getElementById("inputBar").style.display = "none";
    document.getElementById("promptLetters").style.display = "none";
    document.getElementById("livesBar").style.display = "none";
    document.getElementById("gameTimer").style.display = "none";
    document.getElementById("waitingText").innerHTML = "⏳ Waiting for 1 more player...";
    document.getElementById("inputSpace").value = '';
    document.getElementById("letterLives").style.display = "none";
    letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    for (let k = 0; k < letters.length; k++){
        document.getElementById(`letter${letters[k]}`).style.backgroundColor = "rgb(230, 211, 118)";
    }
    startTimerId = 5;
    inGameTimerId = 10;
    maxTime = 10;
    if(score > highScore){
        highScore = score;
    }
    document.getElementById("score").innerHTML = "Your score: "+score.toString()+"  |  Highest score: "+highScore.toString();
    score = 0;
    console.log("Game details below: ")
    console.log(wordDetails);
    wordDetails = {}
    usedWords = [];
    validWords = {};
    inGameLives = lives;
    tickSFX.pause();
}

function openRules(){
    document.getElementById("ruleSidepanel").style.left = "0px";
}

function closeRules(){
    document.getElementById("ruleSidepanel").style.left = "-260px";
    wppV = 20000 - document.getElementById("wppValue").value;
    document.getElementById("wppLine").innerHTML = "English (min. " + wppV.toString() + " wpp)"
}

var wppSlider = document.getElementById("wppValue")
var livesSlider = document.getElementById("livesValue")
var maxSlider = document.getElementById("maxValue")
var minSlider = document.getElementById("minValue")

wppSlider.oninput = function(){
    document.getElementById("rulesWpp").innerHTML = "Words per prompt: " + (20000 - wppSlider.value)
    if (20000 - wppSlider.value > 19400) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 45"
    } else if (20000 - wppSlider.value > 16300) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 50"
    } else if (20000 - wppSlider.value > 14700) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 55"
    } else if (20000 - wppSlider.value > 13800) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 60"
    } else if (20000 - wppSlider.value > 13200) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 65"
    } else if (20000 - wppSlider.value > 12600) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 70"
    } else if (20000 - wppSlider.value > 11300) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 80"
    } else if (20000 - wppSlider.value > 10200) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 90"
    } else if (20000 - wppSlider.value > 9500) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 100"
    } else if (20000 - wppSlider.value > 8700) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 110"
    } else if (20000 - wppSlider.value > 8000) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 120"
    } else if (20000 - wppSlider.value > 7100) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 130"
    } else if (20000 - wppSlider.value > 6400) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 140"
    } else if (20000 - wppSlider.value > 5900) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 150"
    } else if (20000 - wppSlider.value > 5000) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 175"
    } else if (20000 - wppSlider.value > 4200) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 200"
    } else if (20000 - wppSlider.value > 3400) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 250"
    } else if (20000 - wppSlider.value > 2800) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 300"
    } else if (20000 - wppSlider.value > 2000) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 400"
    } else if (20000 - wppSlider.value > 1600) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 500"
    } else if (20000 - wppSlider.value > 1000) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 750"
    } else if (20000 - wppSlider.value > 700) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 1000"
    } else if (20000 - wppSlider.value > 400) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 1500"
    } else if (20000 - wppSlider.value > 200) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 2000"
    } else if (20000 - wppSlider.value > 100) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 2500"
    } else if (20000 - wppSlider.value > 0) {
        document.getElementById("promptsValid").innerHTML = "Number of prompts: < 3500"
    }
}

livesSlider.oninput = function(){
    document.getElementById("rulesLives").innerHTML = "Number of lives: " + livesSlider.value;
    lives = livesSlider.value;
}
maxSlider.oninput = function(){
    document.getElementById("rulesMax").innerHTML = "Starting time: " + (30 - maxSlider.value) + " seconds";
    maxTime = 30 - maxSlider.value;
}
minSlider.oninput = function(){
    document.getElementById("rulesMin").innerHTML = "Minimum time: " + (30 - minSlider.value) + " seconds";
    minTime = 30 - minSlider.value;
}
/*-----------------------------
let TEMParr = {};
let TEMPnum = 0;
let j = 0

for (let TEMPwpp = 20000 ;TEMPwpp < 50000; TEMPwpp += 100) {
    for (let j in wordOccur){
        if (wordOccur[j] >= TEMPwpp) {
            TEMPnum++;
        }
    }
    TEMParr[TEMPwpp] = TEMPnum;
    console.log(TEMPwpp + " : " + TEMPnum)
    TEMPnum = 0;
    j = 0;
}
/*-----------------------------*/