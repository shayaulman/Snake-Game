 // copyright (©) 17/02/2019, Shaye Ulman { shayeulman@gmail.com } 

let container = document.getElementById('game-container');
let snakeContainer = document.getElementById('snake-container');
let foodContainer = document.getElementById('food-container');

let snakeBody = snakeContainer.children;    
let containerSize = getComputedStyle(container);
let containerWidth = parseFloat(containerSize.width, 10);
let containerHeight = parseFloat(containerSize.height, 10);


// snakes initial position
for (let i = 0, left = 180; i < snakeBody.length; i++, left += 10) {
    snakeBody[i].style.top = `${containerHeight - ((containerHeight / 2) + 20)}px`;
    snakeBody[i].style.left = `${left}px`;
}
designSnake();

// directions
let gameRuning = false;
let goingLeft = true, goingRight, goingUp, goingDown;   // starts with left direction

let runSpeed = 80;
let score = 0;
let scoreCounter = 0;
let level = 1;

getScores();
function startGame(){
    if (foodContainer.children[0]) { removeFood(); location.reload(); }
    
    gameRuning = true;
    moveSnake();
    createFood();
    document.getElementById("snake-speed").innerHTML = `${((1000 / runSpeed) * 10).toFixed()}px / sec`;
}

function moveSnake(){
    setTimeout( () => {
        if (!didCollide()) { newHead(); };
        designSnake();
        didEatFood() && gameRuning ? createFood() : removeTail();
        levelController();
        if (gameRuning) { moveSnake() };
    }, runSpeed);
}
    
function newHead() {    
    let headTop = parseFloat(snakeBody[0].style.top, 10);
    let headLeft = parseFloat(snakeBody[0].style.left, 10);
    let newHead = document.createElement('div');
    newHead.className = "snake-body";
    if (goingLeft){
        newHead.style.top = `${headTop}px`;
        newHead.style.left = parseFloat(snakeBody[0].style.left) === 0 ?
        `${containerWidth -30}px` : `${headLeft - 10}px`;
    }
    if (goingRight){
        newHead.style.top = `${headTop}px`;
        newHead.style.left = parseFloat(snakeBody[0].style.left) === containerWidth - 30 ?
        `${containerWidth - containerWidth}px` : `${headLeft + 10}px`;
    }
    if (goingDown){
        newHead.style.top = parseFloat(snakeBody[0].style.top) === containerHeight - 30 ?
        containerHeight - containerHeight : `${headTop + 10}px`;
        newHead.style.left = `${headLeft}px`;
    }
    if (goingUp){
        newHead.style.top = parseFloat(snakeBody[0].style.top) === 0 ?
        `${containerHeight -30}px` : `${headTop - 10}px`;
        newHead.style.left = `${headLeft}px`;
    }
    snakeContainer.insertBefore(newHead, snakeBody[0]);
}

function removeTail() {
    snakeBody[snakeBody.length-1].remove();
}

function createFood() {
    var newFood = document.createElement('div');
    newFood.className = "food";
    foodContainer.append(newFood);
    newFood.style.top = `${randomNumber10()}px`;
    newFood.style.left = `${randomNumber10()}px`;
}

function removeFood() {
    foodContainer.children[0].remove();
}


function didEatFood() {
    if (snakeBody[0].style.top === foodContainer.children[0].style.top
        && snakeBody[0].style.left === foodContainer.children[0].style.left){
        foodContainer.children[0].remove();
        score += level * 2;
        scoreCounter += level * 2;
        document.getElementById('score').innerHTML = score;
        let snakeLength = 0;
        for (let i = 0; i < snakeBody.length; i++) {
            snakeLength +=1;
        }
        document.getElementById("snake-length").innerHTML = snakeLength;
        return true;
    }
}

function didCollide() {
    let gameOver = document.getElementById("game-over");
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i].style.top === snakeContainer.children[0].style.top
        && snakeBody[i].style.left === snakeContainer.children[0].style.left) {
        console.log("game-over...");
        gameRuning = false;
        snakeContainer.children[0].remove();
        designSnake();
        localStorage.lastScore = score;
        localStorage.highScore = score > localStorage.highScore ? score : localStorage.highScore;
        gameOver.style.display = "block";
        setInterval (() => {
            gameOver.style.display = "none";
            location.reload();
            }, 3000);
        
        }
    }
}

function levelController(){
    if (scoreCounter > 14) {
        scoreCounter = 0;
        level += 1;
        document.getElementById('level').innerHTML = level;
    }
}

function randomNumber10() {
    return Math.floor(Math.random() * (containerWidth -20) / 10) * 10;
}

function designSnake() {
    for (let i = 0; i < snakeBody.length; i++) {
        i % 2 === 0 ? snakeBody[i].style.backgroundColor = '#003300' :
        snakeBody[i].style.backgroundColor = 'green';
    }
}
document.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("start-game").click();
    }
});

document.addEventListener("keydown", snakeDirection);
function snakeDirection(event) { 
    event.preventDefault(); 
    if (event.keyCode === 37 && !goingRight) { // left-key
        goingRight = false; goingDown = false; goingUp = false;
        goingLeft = true; 
    }  
    if (event.keyCode === 39 && !goingLeft) { // right-key
        goingLeft = false;  goingDown = false; goingUp = false;
        goingRight = true;
    }  
    if (event.keyCode === 38 && !goingDown) { // up-key
        event.preventDefault();
        goingLeft = false; goingRight = false; goingDown = false;
        goingUp = true;
    }
    if (event.keyCode === 40 && !goingUp) { // down-key
        goingLeft = true;
        goingLeft = false; goingRight = false; goingUp = false;
        goingDown = true;
    }     
}

let startPauseButton = document.getElementById("pause-game");
startPauseButton.addEventListener('click', () => {
    if (gameRuning) { 
        gameRuning = false;
        removeFood();
        startPauseButton.innerHTML = "Continue";
    } else {
        // gameRuning = true;
        startGame();
        startPauseButton.innerHTML = "Pause";
    }
});

function getScores(){
    if(localStorage.highScore === undefined) { localStorage.highScore = '0' };
    if(localStorage.lastScore === undefined) { localStorage.lastScore = '0' };
    document.getElementById('high-score').innerHTML = localStorage.highScore;
    document.getElementById('last-score').innerHTML = localStorage.lastScore;
  }

  function resetScores(){
    localStorage.clear();
    document.getElementById('high-score').innerHTML = 0;
    document.getElementById('last-score').innerHTML = 0;
  }

  document.addEventListener("keyup", function (event) {
    if (event.keyCode === 32) {
        event.preventDefault();
        document.getElementById("pause-game").click();
    }
});

    

