const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const computerHandEl = document.getElementById('computer-hand');
const playerHandEl = document.getElementById('player-hand');
const playerHandImg = playerHandEl.querySelector('img');
const computerHandImg = computerHandEl.querySelector('img');
const resultText = document.querySelector('.result p');
const optionButtons = document.querySelectorAll('.options .choice-btn');
const gameContainer = document.querySelector('.game-container');

let playerScore=0;
let computerScore=0;
const choices = ['rock', 'paper', 'scissors'];

optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.dataset.choice;
        playRound(playerChoice);

    })
});

function toggleButton(disabled){
    optionButtons.forEach(button => {
        button.disabled = disabled;
    });
}


function playRound(playerChoice){
    // Disable buttons to prevent spamming during animation
    toggleButton(true);


    resultText.textContent = "Rock, Paper, Scissors...";


    // Reset hands to logo for the shake animation
    playerHandImg.src = './images/default.jpg';
    computerHandImg.src = './images/default.jpg';


    // Add shake animation class
    //[add shake css class to computerhand and player
playerHandEl.classList.add('shake');
computerHandEl.classList.add('shake');

    setTimeout(() => {
        // Remove shake animation class
        playerHandEl.classList.remove('shake');
        computerHandEl.classList.remove('shake');


        // Get computer's choice
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
	//how does this math work^ ? Think about what Math.random() does. 


        // Update hand images to show the actual choice
        playerHandImg.src = `images/${playerChoice}.png`;
        computerHandImg.src = `images/${computerChoice}.png`;


        // Determine the winner and update the UI
        const winner = determineWinner(playerChoice, computerChoice);


        updateScoreboard(winner);


      
        toggleButton(false);
    }, 1600)
}


function determineWinner(player, computer){
    if (player === computer) {
            return 'tie';
        }
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        return 'player';
    }
    return 'computer';
}


function updateScoreboard(winner){
    // Clear previous win/loss effects
    gameContainer.classList.remove('player-wins-transform');


    if (winner === 'player') {
        resultText.textContent = "You Win! 🎉";
        playerScore++;
        playerScoreEl.textContent = playerScore;


        // Trigger score bounce and card transform animations
        //[add score-updated and player-wins-transform css classes to playerScoreEl and gameContainer]
        playerScoreEl.classList.add('score-updated');
        gameContainer.classList.add('player-wins-transform');
    } else if (winner == 'computer'){
        resultText.textContent = "You Lose!";
        computerScore++;
        computerScoreEl.textContent = computerScore;


        // Trigger score bounce animation
        computerScoreEl.classList.add('score-updated');
    } else{
        resultText.textContent = "It's a Tie! 🤝";
    }


    // Remove animation classes after they finish so they can be re-triggered
    setTimeout(() => {
        playerScoreEl.classList.remove('score-updated');
        computerScoreEl.classList.remove('score-updated');
    }, 500);


    setTimeout(() => {
         gameContainer.classList.remove('player-wins-transform');
    }, 600);
}




