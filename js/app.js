'use strict';
// Enemies our player must avoid
var allEnemies=[];
// lives lost by player
var lifeLost = 0;
// Counting collisions
var countCollide=0;
// Chances player has to play
var allLives = [];
// for displaying message on screen
var message = $(".message");
// for pausing the game
var paused = false;
// Enemy function for initalizing position and speed
class Enemy {
    constructor(x,y,sprite= 'images/enemy-bug.png') {
        this.x = x;
        this.y = y;
        this.speed = Math.floor((Math.random()*200)+50);

        this.sprite = sprite;
    };

    // This helps in updating the postion of the enemy with the paramete dt
    update(dt) {
       'use strict';
        if(this.x <= 505) {
        this.x = this.x + this.speed *dt;
        }

        else {
        this.x = -100;
        }

    };

    // This draws the enemies on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

}

// Initializing player to play
class Player extends Enemy {
    constructor(x = 200, y = 400, sprite = 'images/char-boy.png'){
        super(x,y,sprite);
    }

    // Updates player postiion and checks the actions
    update(dt){
        'use strict';
        var self = this;
        allEnemies.forEach(function(enemy) {
          if(self.x >= enemy.x - 50   && self.x <= enemy.x + 50) {
            if(self.y >= enemy.y - 50 && self.y <= enemy.y + 50){
                $(".attacked").show().fadeOut();
                allLives.pop();
                self.reset();
                lifeLost++;
            }
          }
        });
        if(lifeLost === 3){
          message.append("<h1>Game Over</h1>");
          resetGame();
        }
    };

    // Draws player on the canvas
    render() {
        'use strict';
        ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
    }

    // Taking user input for playee movements
    handleInput(e) {
        'use strict';
        this.keyPressed = e;
        if(this.keyPressed === 'left' && this.x > 0){
          this.x = this.x - 100;
        }
        if(this.keyPressed === 'right' && this.x < 400){
          this.x = this.x + 100;
        }
        if(this.keyPressed === 'up' && this.y > 0){
          this.y = this.y - 90;
        }
        if(this.keyPressed === 'down' && this.y <400){
          this.y = this.y + 90;
        }
        this.keyPressed = null;
        if(this.y < 0){
          message.append("<h1>Congratulations! You reached the river! You have won!");
          resetGame();
          this.reset();
        }
    }

    // Resetting player position
    reset(){
        'use strict';
        this.x = 200;
        this.y = 400;
    }

}

// Introducing the live count
class Life extends Enemy {
        constructor(x ,y ,sprite = 'images/small-heart.png') {
        super(x,y,sprite);
    }

// Updates life count according to collisions
    update(dt) {
        'use strict';

        if(countCollide===0) {
        this.x = 140;
        this.y = 10;
        }

        if(countCollide===1){
        this.x = 170;
        this.y = 10;
        }

        if(countCollide===2){
        this.x = 200;
        this.y = 10;
        }

        countCollide++;
    }

//draws the lives and life status on canvas
    render() {
      ctx.drawImage(Resources.get(this.sprite),this.x, this.y);
      ctx.fillStyle = 'rgba(0,160,0,10)';
      ctx.fillText('Lives Left :',0,30);
      ctx.font = '20pt sans-serif';
    }

}

// Introduces number of lives in an array
var addingLives = function() {
         'use strict';
         for(var i=0;i<3;i++){
              var lives = new Life();
              allLives.push(lives);
         }
}

// Adds lives to an array to be displayed
addingLives();

// Introducing player object
var player = new Player();

// Instantiating all enemies and calling them on screen
var callEnemies = function(){
        'use strict';
        for(var i=0;i<5;i++){
          var enemies= new Enemy((Math.random()*100) - 100, Math.floor(Math.random()*250));
          allEnemies.push(enemies);
        }
}

// Calling Enemies
callEnemies();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if(paused!=true){
    player.handleInput(allowedKeys[e.keyCode]);
  }
});

// For getting a restart input
var modal = document.getElementById("simpleModal");
// Get open modal button
var modalBtn= document.getElementById("modalBtn");
// Get close modal button
var closeBtn= document.getElementById("closeBtn");
// Get restartgame button
var restartBtn= document.getElementById("restartBtn");
// For getting input for resetting the game
modalBtn.addEventListener("click",resetGame);
// listen for click for close
restartBtn.addEventListener("click",restartGame);
// listen for outside click
window.addEventListener("click",outsideClick);
// Resetting game when one finishes the game or gets eaten 3 times or restarts the game
function resetGame(){
  modal.style.display = 'block';
  allLives = [];
  addingLives();
  lifeLost = 0;
  allEnemies = [];
  callEnemies();
  paused = true;
}
//Function to close modalBtn
function closeModal(){
  modal.style.display = 'none';
  message.empty();
  lifeLost=0;
}
//Function for outside click
function outsideClick(e){
  if(e.target == modal){
        modal.style.display = 'none';
        message.empty();
  }
}
//function for restart button functionality
function restartGame(){
  modal.style.display= 'none';
  countCollide=0;
  message.empty();
  paused = false;
}
