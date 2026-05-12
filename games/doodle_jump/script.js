const gameWidth = 400;
const gameHeight = 600;
let player = {
    x: 175,
    y:450,
    width:50,
    height:50,
    velocityY:0,
    velocityX:5,
    jumpPower:-12,
};
let score = 0;
let gameRunning = false;
let platforms = []
let camera = 0;
let platformGap = 90;
let maxPlatformGap = 110;
let gravityStrength = .10;
let platformCount = 7;


let moveLeft = false;
let moveRight = false;


const playerElement = document.getElementById('player');
const scoreElement =  document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const startScreenElement = document.getElementById('startscreen');
const gameContainer = document.getElementById('gameContainer');
const jumpscare = document.getElementById('zombo');

const jumpSound = new Audio("../../sound/jumpEffect.mp3");




function createPlatform(x,y) {
        


    const isBreakable = Math.random() < .05;
    const isBounce = Math.random() < 0.21;
    const isDeath = Math.random() <.02;
    const platform = {
        x:x,
        y: y,
        width: Math.random() * 40 + 50,
        height: 15,
        element:null,
        isBreakable: isBreakable,
        isBounce: isBounce,
        isBroken: false,
        isDeath: isDeath,
    };

    const platformElement = document.createElement('div'); 
    platformElement.className = 'platform';
    if(platform.isBreakable) {
        platformElement.classList.add('breaking-platform');
    }
    if(platform.isBounce) {
        platformElement.classList.add('bouncy-platform');
    }
    if(platform.isDeath) {
        platformElement.classList.add('death-platform')
    }
    platformElement.style.left = platform.x + "px";
    platformElement.style.top = platform.y + "px";
    platformElement.style.width = platform.width + "px";

    gameContainer.appendChild(platformElement);
    platform.element = platformElement;
    return platform;
}

function initializePlatforms() {
    platforms = [];

    // for(let i = 0; i < 3; i++) {
    //     const x = Math.random() * (gameWidth - 70);
    //     const y = i * 90 + 50;
    //     let newPlatform = createPlatform(x,y);
    //     newPlatform.width = 70;
    //     newPlatform.element.width = width;
    //     platforms.push(newPlatform);
    // }
    for(let i = 0; i < platformCount; i++) {
        const x = Math.random() * (gameWidth - 70);
        const y = i * platformGap + 50;
        platforms.push(createPlatform(x,y));
    }

    platforms.push(createPlatform(player.x - 10, player.y + player.height));
}




function checkCollisions() {
    if(player.velocityY <= 0) return;


    for(let i = platforms.length - 1; i >= 0; i--) {
        let platform=platforms[i];

        if(player.x < platform.x + platform.width && player.x + player.width > platform.x && player.y+player.height > platform.y && player.y + player.height < platform.y + platform.height + 10) {
            if(platform.isBreakable && !platform.isBroken){
                score += 10;
            }else{
                score += 1;
            }
            if(score % 10 == 0 && platformGap < maxPlatformGap){
                platformGap += 1;
                console.log("alama rules");
            }
            scoreElement.textContent = 'Score: ' + score;


            
            if (platform.isBreakable && !platform.isBroken) {
                platform.isBroken = true; 
                platform.element.classList.add('breaking'); 
                                
            //platforms.splice(i, 1);


                //  setTimeout(() => {
                //     platform.element.remove();
                // }, 300);
            }


            if(platform.isBounce){
                player.velocityY = player.jumpPower * 2.6;
            }else{
                player.velocityY = player.jumpPower;
            }

            if(platform.isDeath) {
                gameOver();
            }

            jumpSound.play();


            if(score > 999 && score < 1020) {
                jumpscare.style.display = "block";
                setTimeout(() => {
                    jumpscare.style.width = 0;
                }, 100);
            }

        }
        


    }


}

function startGame() {
    console.log("fart");

    startScreenElement.hidden=true;
    gameOverElement.style.display = 'none';
    score = 0;
    player.x= 175;
    player.y = 450;
    player.velocityY = 0;
    score = 0;
    camera = 0;
    scoreElement.textContent = "Score: 0";

    document.querySelectorAll('.platform').forEach(p => p.remove());
    initializePlatforms();
    
    gameRunning = true;
    gameloop();
}


document.addEventListener('keydown', function (e) {
    const key = e.key;
    if(!gameRunning) return;

    if(key == 'ArrowLeft' || key == 'a') {
        moveLeft = true;
    }
    else if(key == 'ArrowRight' || key == 'd') {
        moveRight = true;
    }

});

document.addEventListener('keyup', function (e) {
    const key = e.key;

    if(key == 'ArrowLeft' || key == 'a') {
        moveLeft = false;
    }
    else if(key == 'ArrowRight' || key == 'd') {
        moveRight = false;
    }

});

function updatePlayer() {
    player.velocityY += gravityStrength;
    player.y += player.velocityY;
    if(moveLeft) {
        player.x -= 5;
    }
    if(moveRight) {
        player.x += 5;
    }

    if(player.x < -player.width) {
        player.x = gameWidth;
    }
    else if(player.x > gameWidth) {
        player.x = -player.width;
    }
    console.log("player x" + player.x);
    playerElement.style.left = player.x +'px';
    playerElement.style.top = player.y +'px';

}

function gameloop() {
    if(!gameRunning) return;
    console.log("MovingLeft" + moveLeft);

    updatePlayer();
    checkCollisions();
    updateCamera();
    checkGameOver();
    console.log(platforms.length + "alama")
    requestAnimationFrame(gameloop);



}

function updateCamera() {
    if (player.y < 200) {
        const scrollAmount = 200 - player.y;
        player.y = 200;
        camera += scrollAmount;

        for(let i = platforms.length - 1; i >= 0; i--) {
            platforms[i].y += scrollAmount
            platforms[i].element.style.top = platforms[i].y + 'px';

            if(platforms[i].y > gameHeight) {
                platforms[i].element.remove();
                platforms.splice(i, 1);

                const newX = Math.random() * (gameWidth - 70);
                const newY = -10;
                platforms.push(createPlatform(newX, newY));
            }
            
        }
    }
}

function checkGameOver() {
    if(player.y > gameHeight) {
        gameOver();
    }

}

function gameOver() {
    gameRunning = false;

    //finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}
