console.log("GAME SCRIPT LOADED")

let shuffleCount = 0
let maxShuffle = 4
let gamesPlayed = parseInt(localStorage.getItem("gamesPlayed")) || 0
let gamesWon = parseInt(localStorage.getItem("gamesWon")) || 0

let level = 1

let timer = 0
let timerInterval

let moves = 0

let currentLevel = 1
let maxLevel = 5

let puzzleSize = 3
let tiles = []
let emptyIndex




function unlockNextLevel(){

level++

setCookie("level",level,7)

alert("Level "+level+" unlocked!")

}



function startTimer(){

let diff = getDifficulty()

let timeLimit = 60

if(diff==="medium") timeLimit = 90
if(diff==="hard") timeLimit = 120

timer = timeLimit

clearInterval(timerInterval)

timerInterval = setInterval(()=>{

timer--

let timerElement = document.getElementById("timer")

if(timerElement){
timerElement.innerText = timer
}

if(timer<=0){

clearInterval(timerInterval)

alert("⏰ Time Up!")

location.reload()

}

},1000)

}




function unlockNextLevel(){

if(currentLevel < maxLevel){

currentLevel++

localStorage.setItem("level", currentLevel)

alert("🔓 Level "+currentLevel+" Unlocked!")

}

}




window.onload = function(){

let user = getCookie("player")
document.getElementById("stats").innerHTML =
"Games Played: "+gamesPlayed+" | Wins: "+gamesWon

if(user){

document.getElementById("loginScreen").style.display="none"

document.getElementById("gameMenu").style.display="block"

}
let users = getCookie("player")

if(users){

document.getElementById("playerInfo").innerText = "Player: " + user

}

}



function logoutUser(){

setCookie("player","",-1)
setCookie("difficulty","",-1)

location.reload()

}




function openPuzzle(type){

const area = document.getElementById("gameArea")
gamesPlayed++
localStorage.setItem("gamesPlayed",gamesPlayed)

moves = 0
let moveEl = document.getElementById("moves")
if(moveEl){
moveEl.innerText = 0
}

startTimer()

if(type==="sliding") loadSliding()

if(type==="memory") loadMemory()

if(type==="logic") loadLogic()

if(type==="word") loadWordScramble()

}

function loadSliding(){
    shuffleCount = 0

const area = document.getElementById("gameArea")

let diff = getDifficulty()

if(diff === "easy") puzzleSize = 3
if(diff === "medium") puzzleSize = 4
if(diff === "hard") puzzleSize = 5

area.innerHTML = `

<h2>Sliding Puzzle</h2>

<div class="game-info">
<span>⏱ Time: <span id="timer">0</span></span>
<span>🧩 Moves: <span id="moves">0</span></span>
</div>

<div id="puzzleBoard"></div>

<button onclick="shufflePuzzle()">Shuffle</button>

`

createPuzzle()

}



function createPuzzle(){

const board = document.getElementById("puzzleBoard")

board.innerHTML=""

tiles=[]

let totalTiles = puzzleSize * puzzleSize

for(let i=1;i<totalTiles;i++){
tiles.push(i)
}

tiles.push(0)

emptyIndex = tiles.length-1

board.style.gridTemplateColumns = `repeat(${puzzleSize},100px)`

tiles.forEach((num,index)=>{

let tile = document.createElement("div")
tile.classList.add("tile")

if(num===0){
tile.classList.add("empty")
}else{
tile.innerText=num
}

tile.dataset.index=index
tile.onclick = moveTile

board.appendChild(tile)

})
shufflePuzzle()

}

function shufflePuzzle(){

if(shuffleCount >= maxShuffle){

alert("⚠ You can shuffle only 3 times!")

return

}

shuffleCount++

for(let i = tiles.length - 1; i > 0; i--){

let j = Math.floor(Math.random() * (i + 1))

let temp = tiles[i]
tiles[i] = tiles[j]
tiles[j] = temp

}

emptyIndex = tiles.indexOf(0)

renderPuzzle()

}

function renderPuzzle(){

const board = document.getElementById("puzzleBoard")

board.innerHTML=""

tiles.forEach((num,index)=>{

let tile = document.createElement("div")
tile.classList.add("tile")

if(num===0){
tile.classList.add("empty")
}else{
tile.innerText=num
}

tile.dataset.index=index

tile.onclick=moveTile

board.appendChild(tile)

})

}


function moveTile(){

let index = parseInt(this.dataset.index)

let validMoves = [
emptyIndex-1,
emptyIndex+1,
emptyIndex-puzzleSize,
emptyIndex+puzzleSize
]

if(validMoves.includes(index)){

[tiles[index],tiles[emptyIndex]] = [tiles[emptyIndex],tiles[index]]

emptyIndex = index

moves++
document.getElementById("moves").innerText=moves

renderPuzzle()

checkWin()

}

}

function checkWin(){
    shuffleCount = 0

let correct = true

for(let i=0;i<8;i++){

if(tiles[i]!==i+1){
correct=false
}

}

if(correct){

clearInterval(timerInterval)

alert("🎉 Puzzle Solved!")

unlockNextLevel()

saveScore()

}

}












function setCookie(name,value,days){

let expires = ""

if(days){

let date = new Date()

date.setTime(date.getTime() + (days*24*60*60*1000))

expires = "; expires=" + date.toUTCString()

}

document.cookie = name + "=" + value + expires + "; path=/"

}


function getCookie(name){

let nameEQ = name + "="

let ca = document.cookie.split(';')

for(let i=0;i<ca.length;i++){

let c = ca[i]

while(c.charAt(0)==' ') c = c.substring(1,c.length)

if(c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)

}

return null

}






function loginUser(){

let username = document.getElementById("username").value

let difficulty = document.getElementById("difficulty").value

if(username === ""){

alert("Enter username")

return

}

setCookie("player",username,7)

setCookie("difficulty",difficulty,7)

document.getElementById("loginScreen").style.display="none"

document.getElementById("gameMenu").style.display="block"

}


function getDifficulty(){

return getCookie("difficulty") || "easy"

}



let memoryPattern=[]
let playerPattern=[]


function loadMemory(){

const area=document.getElementById("gameArea")

area.innerHTML=`
<h2>Memory Pattern</h2>

<div id="memoryBoard"></div>

<button onclick="startMemory()">Start</button>
`

createMemoryBoard()

}



function createMemoryBoard(){

const board=document.getElementById("memoryBoard")

board.innerHTML=""

for(let i=0;i<9;i++){

let tile=document.createElement("div")

tile.classList.add("memoryTile")

tile.dataset.index=i

tile.onclick=playerClick

board.appendChild(tile)

}

}



function startMemory(){

memoryPattern=[]
playerPattern=[]

let diff = getDifficulty()

let patternLength = 5

if(diff==="medium") patternLength = 7
if(diff==="hard") patternLength = 9

for(let i=0;i<patternLength;i++){
memoryPattern.push(Math.floor(Math.random()*9))
}

let tiles = document.querySelectorAll(".memoryTile")

memoryPattern.forEach((index,i)=>{

setTimeout(()=>{

tiles[index].style.background="yellow"

setTimeout(()=>{
tiles[index].style.background="#444"
},500)

}, i*700)

})

}


function playerClick(){

let index = parseInt(this.dataset.index)

playerPattern.push(index)

// correct so far?
if(memoryPattern[playerPattern.length - 1] === index){

// GREEN feedback
this.style.background = "lime"

setTimeout(()=>{
this.style.background = "#444"
},300)

}else{

// WRONG CLICK → RED
this.style.background = "red"

clearInterval(timerInterval)

setTimeout(()=>{
alert("❌ Wrong Tile! Game Over")
location.reload()
},400)

return

}

// player completed pattern
if(playerPattern.length === memoryPattern.length){

clearInterval(timerInterval)

setTimeout(()=>{
alert("🎉 Correct Pattern!")
unlockNextLevel()
},300)

}

}


let logicQuestions = {

easy: [

{
question:"All roses are flowers. Some flowers fade quickly. Which statement is definitely true?",
options:[
"All roses fade quickly",
"Some roses may fade quickly",
"No roses fade quickly",
"Flowers are not roses"
],
answer:"Some roses may fade quickly"
},

{
question:"If today is Wednesday, what day will it be after 3 days?",
options:["Friday","Saturday","Sunday","Monday"],
answer:"Saturday"
},

{
question:"If every student in a class studies mathematics, which statement must be true?",
options:[
"Some students study mathematics",
"No students study mathematics",
"All students study mathematics",
"Only teachers study mathematics"
],
answer:"All students study mathematics"
},

{
question:"Which number comes next in the sequence: 2, 4, 6, 8, ?",
options:["9","10","12","14"],
answer:"10"
},

{
question:"If a square has 4 sides, how many sides do 3 squares have in total?",
options:["10","12","16","8"],
answer:"12"
}

],

medium: [

{
question:"If A is older than B, and B is older than C, who is the youngest?",
options:["A","B","C"],
answer:"C"
},

{
question:"Find the missing number: 3, 9, 27, 81, ?",
options:["162","243","324","729"],
answer:"243"
},

{
question:"In a race, Rahul finished before Aman but after Priya. Who finished first?",
options:["Rahul","Aman","Priya"],
answer:"Priya"
},

{
question:"A clock shows 3:00. What is the angle between hour and minute hand?",
options:["45°","60°","90°","120°"],
answer:"90°"
},

{
question:"If all programmers are logical thinkers and some logical thinkers are mathematicians, what can be concluded?",
options:[
"All programmers are mathematicians",
"Some programmers may be mathematicians",
"No programmers are mathematicians",
"Mathematicians are programmers"
],
answer:"Some programmers may be mathematicians"
}

],

hard: [

{
question:"Find the next number in the pattern: 1, 4, 9, 16, 25, ?",
options:["30","36","49","64"],
answer:"36"
},

{
question:"Five people A, B, C, D, E sit in a row. A sits left of B. C sits right of B. D sits left of A. Who sits at the extreme left?",
options:["A","B","C","D","E"],
answer:"D"
},

{
question:"If in a certain code COMPUTER is written as RFUVQNPC, how is SCIENCE written?",
options:[
"FNHJQHF",
"FHNJQHF",
"FHNJQEG",
"FHJQEG"
],
answer:"FHNJQHF"
},

{
question:"A man walks 10m north, then 5m east, then 10m south. How far is he from the start?",
options:["5m","10m","15m","20m"],
answer:"5m"
},

{
question:"Three boxes are labeled Apples, Oranges, and Apples & Oranges. All labels are wrong. If you pick one fruit from the box labeled 'Apples & Oranges', what is the correct label of that box?",
options:[
"Apples",
"Oranges",
"Apples & Oranges"
],
answer:"Oranges"
}

]

}
function loadLogic(){


const area=document.getElementById("gameArea")

let diff = getDifficulty()

let questions = logicQuestions[diff]

let randomQ = questions[Math.floor(Math.random()*questions.length)]

window.currentLogicAnswer = randomQ.answer

let optionsHTML = ""

randomQ.options.forEach(opt=>{
optionsHTML += `<option>${opt}</option>`
})

area.innerHTML=`

<h2>Logic Puzzle</h2>

<p>${randomQ.question}</p>

<select id="answer">

<option value="">Choose</option>

${optionsHTML}

</select>

<button onclick="checkLogic()">Submit</button>

`

}



function checkLogic(){

let ans=document.getElementById("answer").value

if(ans===currentLogicAnswer){

clearInterval(timerInterval)

alert("🎉 Correct!")

unlockNextLevel()

}else{

alert("❌ Wrong answer")

}

}


let words = [

"COMPUTER",
"PROGRAM",
"PUZZLE",
"ALGORITHM",
"DEVELOPER",
"JAVASCRIPT",
"DOCKER",
"SOFTWARE",
"NETWORK",
"DATABASE",
"PYTHON",
"VARIABLE",
"FUNCTION",
"COMPILER",
"FRAMEWORK"

]

let word = words[Math.floor(Math.random()*words.length)]
function loadWordScramble(){

let diff = getDifficulty()

let wordsEasy = ["CODE","JAVA","HTML","CSS"]

let wordsMedium = ["PROGRAM","PUZZLE","ALGORITHM"]

let wordsHard = ["DEVELOPER","JAVASCRIPT","FRAMEWORK"]

if(diff==="easy") words = wordsEasy
if(diff==="medium") words = wordsMedium
if(diff==="hard") words = wordsHard

// choose word AFTER difficulty selection
word = words[Math.floor(Math.random()*words.length)]

const area=document.getElementById("gameArea")

let scrambled = word.split('').sort(()=>0.5-Math.random()).join('')

area.innerHTML=`

<h2>Word Scramble</h2>

<h3>${scrambled}</h3>

<input id="wordInput">

<button onclick="checkWord()">Check</button>

`
}



function checkWord(){

let user=document.getElementById("wordInput").value

if(user.toUpperCase()===word){

clearInterval(timerInterval)

alert("🎉 Correct Word!")

unlockNextLevel()

}else{

alert("Try Again")

}

}

async function saveScore(){

let data = {

playerName:"Player1",
points:100,
timeTaken:30

}

await fetch("http://localhost:5257/api/score",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

})

}

