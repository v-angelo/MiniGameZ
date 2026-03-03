// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// cactus
let cactusArray = [];

let cactus01Width = 34;
let cactus02Width = 69;
let cactus03Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus01Img;
let cactus02Img;
let cactus03Img;

// game mechanics
let velocityX = -8; // cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let animationId;
let cactusInterval;

let gameOver = true;
let score = 0;

const startGame = document.querySelector("#startGame");
let gameStarted = false;

const dinoResult = document.querySelector("#dinoResult");
const player = document.querySelector("#playerName");
let playerName;
let playerScore = {
    name: null,
    score: null
}
let scoreboard = JSON.parse(localStorage.getItem("dinoScore"));
if (!scoreboard) scoreboard = [];

startGame.addEventListener("submit", function (e) {
    e.preventDefault();

    if (gameStarted) {
        stopGame();
    }

    resetGame();
    gameStarted = true;
    dinoGame();

    playerName = player.value.trim();
    player.value = "";

});

function dinoGame() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;

    context = board.getContext("2d");

    // context.fillStyle = "green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "../img/dinoJump/dino.png";

    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus01Img = new Image();
    cactus01Img.src = "../img/dinoJump/cactus1.png";

    cactus02Img = new Image();
    cactus02Img.src = "../img/dinoJump/cactus2.png";

    cactus03Img = new Image();
    cactus03Img.src = "../img/dinoJump/cactus3.png";

    animationId = requestAnimationFrame(update);
    cactusInterval = setInterval(placeCactus, 1000);

    document.addEventListener("keydown", moveDino);

}

function stopGame() {
    cancelAnimationFrame(animationId);
    clearInterval(cactusInterval);
    document.removeEventListener("keydown", moveDino);
}

function resetGame() {
    // reset game state
    gameOver = false;
    score = 0;
    playerScore = {
        name: null,
        score: null
    }

    // reset dino
    dino.y = dinoY;
    velocityY = 0;

    // reset cactus
    cactusArray = [];

    // clear canvas if it exists
    if (context) {
        context.clearRect(0, 0, board.width, board.height);
    }

    // reset results
    dinoResult.innerHTML = "";
    playerName = "";
}

function update() {
    animationId = requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); // apply gravity to current dino.y making sure it does not execeed the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "../img/dinoJump/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }

            // Recording Score
            playerScore.name = playerName;
            playerScore.score = score + 1;
            scoreboard.push(playerScore);
            scoreboard.sort((a, b) => b.score - a.score);
            if (scoreboard.length > 10) scoreboard.pop();

            localStorage.setItem("dinoScore", JSON.stringify(scoreboard));

            dinoResult.innerHTML = `
                <h3 class="text-5xl">Game Over!</h3>
                <h3 class="text-xl"><span class="text-purple-600">${playerScore.name}</span> scored - <span class="text-amber-500">${playerScore.score}</span> points</h3>
            `;
        }
    }

    // score
    context.fillStyle = "black";
    context.font = "25px courier";
    score++;
    context.fillText(score, 5, 25);
}

// jump function
function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        // jump
        velocityY = -10;
    }
}

// prevent spacebar from re-submiting the form
document.addEventListener("keydown", function (e) {
    if (!gameOver) {
        if (e.code === "Space") {
            e.preventDefault();
        }
    }
});

function placeCactus() {

    if (gameOver) {
        return;
    }

    // place cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random();

    if (placeCactusChance > 0.90) { // 10% chance you get cactus3
        cactus.img = cactus03Img;
        cactus.width = cactus03Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > 0.70) { // 20% chance you get cactus2
        cactus.img = cactus02Img;
        cactus.width = cactus02Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > 0.40) { // 30% chance you get cactus1
        cactus.img = cactus01Img;
        cactus.width = cactus01Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 7) {
        cactusArray.shift(); // remove cactus from array if the array has more than 7 cactuses
    }
}

// detect collision
function detectCollision(a, b) {
    return (a.x < b.x + b.width) &&   // a's top left corner doesn't reach b's top right corner
        (a.x + a.width > b.x) &&      // a's top right corner passes b's top left corner
        (a.y < b.y + b.height) &&     // a's top left corner doesn't reach b's bottom left corner
        (a.y + a.height > b.y);        // a's bottom left corner passes b's top left corner
}
