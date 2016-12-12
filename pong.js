var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var title = "PONG";
var titleYPos = 60;
var easy = "Easy";
var easyYPos = 140;
var easyXPos = c.width / 2 - ctx.measureText(easy).width / 2;
var medium = "Medium";
var mediumYPos = 190;
var mediumXPos = c.width / 2 - ctx.measureText(medium).width / 2;
var hard = "Hard";
var hardYPos = 240;
var hardXPos = c.width / 2 - ctx.measureText(hard).width / 2;

var ballDiam = 8;
var ballXPos = c.width / 2 - ballDiam / 2;
var ballYPos = c.height / 2 - ballDiam / 2;
var ballXVel = 10;
var ballYVel = 10;

var paddleHeight = 70;
var paddleWidth = 10;
var playerYPos = c.height / 2 - paddleHeight / 2;
var playerXPos = 0;

var computerYPos = c.height / 2 - paddleHeight / 2;
var computerXPos = c.width - paddleWidth;
var computerYVel = 5;

var fps = 1000/30;

var playerScore = 0;
var computerScore = 0;
var winThreshold = 5;

var playing = false;
var inIntro = true;
var inGameOver = false;

//EVENT LISTENERS
c.addEventListener('mousemove', function(e) {
	playerYPos = e.clientY - paddleHeight / 2;
	if (playerYPos > c.height - paddleHeight) {
		playerYPos = c.height - paddleHeight;
	}
	else if (playerYPos < 0) {
		playerYPos = 0;
	}
});

c.addEventListener('click', function(e) {
	if (inIntro) {
		onEasy(e.clientX, e.clientY);
		onMedium(e.clientX, e.clientY);
		onHard(e.clientX, e.clientY);
	}
	else if (inGameOver) {
		inGameOver = false;
		inIntro = true;
		playing = false;
	}
});

//MAIN
playloop();

//FUNCTIONS
function playloop() {
	setInterval(function() {
		if (inIntro) {
			intro();
		}
		if (playing) {
			update();
		}
		if (inGameOver) {
			gameOver();
		}
	}, fps);
}

function intro() {
	clear();
	playerScore = computerScore = 0;
	ctx.textBaseline = "top";
	ctx.font = "60px Arial";
	ctx.fillText(title, c.width / 2 - ctx.measureText(title).width  / 2, titleYPos);
	ctx.font = "30px Arial";
	ctx.fillText(easy, c.width / 2 - ctx.measureText(easy).width / 2, easyYPos);
	ctx.fillText(medium, c.width / 2 - ctx.measureText(medium).width / 2, mediumYPos);
	ctx.fillText(hard, c.width / 2 - ctx.measureText(hard).width / 2, hardYPos);
}

function onEasy (x, y) {
	if (x > c.width / 2 - ctx.measureText(easy).width / 2 && x < c.width / 2 - ctx.measureText(easy).width / 2 + ctx.measureText(easy).width + 20) {
		if (y > 150 && y < 185) {
			computerYVel = 5;
			playing = true;
			inIntro = false;
		}
	}
}

function onMedium (x, y) {
	if (x > c.width / 2 - ctx.measureText(medium).width / 2 && x < c.width / 2 - ctx.measureText(medium).width / 2 + ctx.measureText(medium).width + 20) {
		if (y > 200 && y < 235) {
			computerYVel = 7;
			playing = true;
			inIntro = false;
		}
	}
}

function onHard(x, y) {
	if (x > c.width / 2 - ctx.measureText(hard).width / 2 && x < c.width / 2 - ctx.measureText(hard).width / 2 + ctx.measureText(hard).width + 20) {
		if (y > 250 && y < 285) {
			computerYVel = 9;
			playing = true;
			inIntro = false;
		}
	}
}

function update() {
	if (playing) {
		clear();

		ballXPos += ballXVel;
		ballYPos += ballYVel;

		checkForCollision();
		computer();

		ctx.fillStyle = "black";
		ctx.fillRect(ballXPos, ballYPos, ballDiam, ballDiam);
		ctx.fillRect(playerXPos, playerYPos, paddleWidth, paddleHeight);
		ctx.fillRect(computerXPos, computerYPos, paddleWidth, paddleHeight);
		ctx.textBaseline = "top";
		ctx.fillText(playerScore, c.width / 2 - 50, 0);
		ctx.fillText(computerScore, c.width / 2 + 50, 0);

		checkForGameOver();
	}
}

function clear() {
	ctx.clearRect(0, 0, c.width, c.height);
}

function checkForGameOver() {
	if (playerScore >= winThreshold) {
		playing = false;
		inGameOver = true;
	}
	else if (computerScore >= winThreshold) {
		playing = false;
		inGameOver = true;
	}
}

function checkForCollision() {
	//check for top and bottom walls
	if (ballYPos < ballDiam) {
		ballYVel = -ballYVel;
	}
	else if (ballYPos > c.height - ballDiam) {
		ballYVel = -ballYVel;
	}

	//check for paddles
	if (ballXPos < playerXPos + ballDiam && (ballYPos > playerYPos && ballYPos < playerYPos + paddleHeight - ballDiam / 2) && ballXVel < 0) {
		ballXVel = -ballXVel;
	}
	if (ballXPos > computerXPos - ballDiam && (ballYPos > computerYPos && ballYPos < computerYPos + paddleHeight - ballDiam / 2) && ballXVel > 0) {
		ballXVel = -ballXVel;
	}

	//check for left and right walls
	if (ballXPos < 0) {
		computerScore++;
		reset();
	} 
	else if(ballXPos > c.width) {
		playerScore++;
		reset();
	}

}

function reset() {
	ballXPos = c.width / 2 - ballDiam / 2;
	ballYPos = c.height / 2 - ballDiam / 2;
	ballXVel *= -1;
}

function computer() {
	if (computerYPos + paddleHeight / 2 > ballYPos) {
		computerYPos -= computerYVel;
	}
	else {
		computerYPos += computerYVel;
	}

	if (computerYPos > c.height - paddleHeight) {
		computerYPos = c.height - paddleHeight;
	}
	else if (computerYPos < 0) {
		computerYPos = 0;
	}
}

function gameOver() {
	clear();
	ctx.textBaseline = "top";
	ctx.font = "60px Arial";
	if (playerScore >= winThreshold) {
		ctx.fillText("GG YOU WIN!", 0, 0);
	}
	else if (computerScore >= winThreshold) {
		ctx.fillText("GG YOU LOSE", 0, 0);
	}
}