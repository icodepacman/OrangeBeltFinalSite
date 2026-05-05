const birdElement = document.getElementById("bird");
const startscreenElement=document.getElementById("startscreen"); 
const gameOverElement=document.getElementById("gameOver"); 
const gameContainer=document.getElementById("gameContainer"); 
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const highScoreDisplay = document.getElementById('highScoreDisplay');


const gameWidth = 400;
const gameHeight = 600;


let bird = {
    x: 50, 
    y: 300, 
    width: 20,
    height: 15, 
    velocityY: 0,
    flapPower: -4,
    gravity: 0.1
}

let gameRunning = false;
let score = 0;
let highScore = 0;
let pipes = [];
let frameCount = 0;

const pipeWidth = 60;
const pipeGap = 150; // The vertical gap between pipes
const pipeSpeed = 2; // How fast pipes move to the left
const pipeSpawnInterval = 120; // Spawn a new pipe every 120 frames

document.addEventListener('keydown', function(e) {
    if(e.code === 'Space' && gameRunning) {
        bird.velocityY = bird.flapPower;
    }
})

function updateBird(){
    bird.velocityY+= bird.gravity;
    bird.y += bird.velocityY;

    birdElement.style.top = bird.y + 'px';
}

function updatePipes() {
    // Move and update all pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        p.x -= pipeSpeed;
        p.topElement.style.left = p.x + 'px';
        p.bottomElement.style.left = p.x + 'px';


        // Check for scoring
        if (!p.passed && p.x + pipeWidth < bird.x) {
            p.passed = true;
            score++;
            //scoreElement.textContent = score;
        }


        // Remove pipes that are off-screen
        if (p.x + pipeWidth < 0) {
            p.topElement.remove();
            p.bottomElement.remove();
            pipes.splice(i, 1);
        }
    }


    // Spawn new pipes periodically
    if (frameCount % pipeSpawnInterval === 0) {
        createPipes();
    }
}



function createPipes() {
    // Calculate a random position for the gap
    const gapTop = Math.random() * (gameHeight - pipeGap - 100) + 50;


    // Create top pipe element
    const topPipe = document.createElement('div');
    topPipe.className = 'pipe';
    topPipe.style.height = gapTop + 'px';
    topPipe.style.top = '0px';
    topPipe.style.left = gameWidth + 'px';
   
    // Create bottom pipe element
    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'pipe';
    bottomPipe.style.height = gameHeight - gapTop - pipeGap + 'px';
    bottomPipe.style.top = (gapTop + pipeGap) + 'px';
    bottomPipe.style.left = gameWidth + 'px';


    gameContainer.appendChild(topPipe);
    gameContainer.appendChild(bottomPipe);


    // Add pipes to our array for tracking
    pipes.push({
        x: gameWidth,
        topElement: topPipe,
        bottomElement: bottomPipe,
        passed: false
    });
}


function checkCollisions() {
    // Collision with top/bottom of the screen
    if (bird.y < 0 || bird.y + bird.height > gameHeight) {
        gameOver();
        return;
    }


    // Collision with pipes
    for (let p of pipes) {
        const pipeTopHeight = parseFloat(p.topElement.style.height);
        const pipeBottomTop = parseFloat(p.bottomElement.style.top);


        const birdCollidesWithPipe =
            bird.x < p.x + pipeWidth &&
            bird.x + bird.width > p.x &&
            (bird.y < pipeTopHeight || bird.y + bird.height > pipeBottomTop);


        if (birdCollidesWithPipe) {
            gameOver();
            return;
        }
    }
}


function gameOver() {
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
    }
    finalScoreElement.textContent = score;
    //highScoreDisplay.textContent = highScore;
    gameOverElement.style.display = 'block';
}


function gameLoop() {
    if (!gameRunning) {return;}
    frameCount++;

    updateBird();
    updatePipes();
    checkCollisions();
    requestAnimationFrame(gameLoop);

}





function startGame() {
    startscreenElement.style.display = 'none';
   gameOverElement.style.display = 'none';
    // Reset game variables
    bird.y = 300;
    bird.velocityY = 0;
    score = 0;
    frameCount = 0;
    //scoreElement.textContent = '0';
   
    // Clear old pipes
    document.querySelectorAll('.pipe').forEach(p => p.remove());
    pipes = [];
   
    // Start the game
    gameRunning = true;
    gameLoop();
}

//test stuff

