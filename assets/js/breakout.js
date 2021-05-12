// defines the canvas and sets the context, which is 2d

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//used in functions to determine positioning and movement

var x = canvas.width / 2;
var y = canvas.height - 30;

//variables for the direction, used by the ball movement calculations

var dx = 2;
var dy = -2;

//defines size of the ball

var ballRadius = 5;

//defines the paddle

var paddleHeight = 8 ;
var paddleWidth = 30;
var paddleX = (canvas.width - paddleWidth) / 2;

//used for paddle controls, start at false as user hasn't pressed the relevant keys yet

var rightPressed = false;
var leftPressed = false;

//used to define the bricks

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 30;
var brickHeight = 10;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//creates an array to hold the bricks and to add columns and rows if these valkues are at 0

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1 //if status is 1, brick is drawn. if not, brick disappears
        };
    }
}

//creates the score and life variables

var score = 0;
var lives = 3;



//tells js to listen for the relevant key presses

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//creates a ball

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.closePath();
}

//creates the paddle, using definitions from above

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//function to create the bricks, incrmenting the number of rows and columns, and positioning them using offset left and top

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#808000";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//moves the ball and makes it bounce. this function is the most important, as it basically is the game

function draw() {
    //clears the canvas, as the next code repaints the ball

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //creates the field of bricks
    drawBricks();

    //creates the ball (see above for definition)
    drawBall();

    //creates the paddle (see above for definition)
    drawPaddle();

    //displays the score (see below for definition)
    drawScore();

    //displays lives (see below for definition)
    drawLives();

    //allows bricks to be hit
    collisionDetection();

    //modifies direction x and y
    x += dx;
    y += dy;

    //collision detetction. thsi tells the ball to bounce off the walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    /*collision detetction. this tells the ball to bounce of the paddle, 
    and also to trigger game over or lives lost when the ball goes to the bottom*/

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval); 
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    //moves the paddle if left or right buttons are pressed

    if (rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
}

//these functions tell js to set right and left key presses to true once those keys are pressed

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

/*If the following are true, it means the ball has hit a brick:
ball x  is greater than the x position of the brick PLUS
ball x is less than the x position of the brick plus its width PLUS
ball y  is greater than the y position of the brick PLUS
ball y  is less than the y position of the brick plus its height.
When a brick is hit, the variable  b (starting with the value from the draw bricks function) has  
status set to 0, meaning when draw bricks is called, the affected brick is not rendered
this also updates the score, and triggers the win message*/

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}

//update the score
function drawScore() {
    ctx.font = "12px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20); //the last 2 numbers are xy coordinates for where to display the score
}

//update the number of lives
function drawLives() {
    ctx.font = "12px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

//sets the speed of the game animation

var interval = setInterval(draw, 30);