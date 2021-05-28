//TREX GAme by **Moksh Koushik ** using JS


//Declare variables for game objects and behaviour indicators(FLAGS)
var trex, trex_running, trexCo;
var ground, groundImg, invGround;
var cloud, cloudImage, badalGroup;
var obstacle, obsGroup, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;
var gameOver, reset, resetImg, gameOverImg;
var score, hiScore, displayHS;
var PLAY, END, gameState;
var jumpSound, dieSound, checkPointSound;


//Create Media library and load to use it during the course of the software
//executed only once at the start of the program
function preload() {
  trexRun = loadAnimation("run1.png", "run2.png", "run3.png");
  trexDead = loadImage("trex_collided.png");

  groundImg = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");

  cactus1 = loadImage("obst1-100x100.png");
  cactus2 = loadImage("obst2-100x100.jpg   ");
  cactus3 = loadImage("obst3-100x100.png");
  cactus4 = loadImage("obst4-100x100.png");
  cactus5 = loadImage("obst5-50x50-100x100.png");
  cactus6 = loadImage("obst6-100x100.png");

  resetImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

//define the intial environment of the software(before it is used)
//by defining the declared variables with default values
//executed only once at the start of the program
function setup() {
  createCanvas(windowWidth,windowHeight);

  //create a trex sprite
  trex = createSprite(50, height - 150, 20, 10);
  trex.addAnimation("trexRun", trexRun);
  trex.addAnimation("trexDead", trexDead);
  trex.scale = 0.6;
  
 
  trex.setCollider("rectangle", 0, 0, 70, 100);

  //creating the ground sprite 
  ground = createSprite(width / 2, height - 150, 600, 4);
  ground.addAnimation("moving", groundImg);
  ground.x = ground.width / 2;
  ground.debug = false;
  //creating the invisible ground sprite
  invGround = createSprite(50, height - 125, 200, 4);
  invGround.visible = false;

  //variables for score, highscore values
  score = 0;
  hiScore = 0;
  //indicator to check if highscore should be displayed or not
  displayHS = false;
  
  //default value of Gamestate
  PLAY = 1;
  END = 0;
  gameState = PLAY;

  obsGroup = createGroup();
  badalGroup = createGroup();

  reset = createSprite(width / 2, (height / 2) + 50, 30, 30);
  reset.addImage("resetImg", resetImg);
  reset.scale = 0.5;

  gameOver = createSprite(width / 2, height / 2, 70, 10);
  gameOver.addImage("gameOverImg", gameOverImg);
  gameOver.scale = 0.9;
  
}

//All modifications, changes, conditions, manipulations, actions during the course of the program are written inside function draw.
//All commands to be executed and checked continously or applied throughout the program are written inside function draw.
//function draw is executed for every frame created since the start of the program.
function draw() {
  background("white");

  //display Score
  text("Score:" + score, width - 100, height - 210);
  //console.log(trex.y);

  if (gameState == PLAY) {  
    
   //making the visibility of the reset and game over variable false
    reset.visible = false;
    gameOver.visible = false;
    
    //Score Calculation
    score = score + round(getFrameRate() / 30);
    
    //display High Score or not
    if (displayHS == true) {
      fill("black");
      stroke("black");
      text("High Score:" + hiScore, width - 200, height - 210);
    }
    
    //score sound for addition of every 100 
    if(score % 100 == 0){
      checkPointSound.play();
    }
    
    //console.log(height);
    //console.log(trex.y);

    //trex behaviour
    if ((touches.length == 1 || keyDown("space")||keyDown(UP_ARROW)) && trex.y > height - 160) {
      trex.velocityY = -18;
      jumpSound.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8;

    //ground behaviour
    ground.velocityX = -(7 + score / 70);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //function call to create and move clouds
    spawnClouds();
    
    //function call to create and move obstacles
    spawnObstacles();
    
    if (obsGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
      //trex.velocityY = -6;
      //jumpSound.play();
    }
  
    
  }
  else if (gameState == END) {
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    trex.changeAnimation("trexDead", trexDead);

    obsGroup.setVelocityXEach(0);
    obsGroup.setLifetimeEach(-1);
    badalGroup.setVelocityXEach(0);
    badalGroup.setLifetimeEach(-1);
    
    reset.visible = true;
    gameOver.visible = true;
    
    if (hiScore < score) {
      hiScore = score;
    }
    fill("black");
    stroke("black");
    text("High Score:" + hiScore, width - 200, height - 210);
    
    if (mousePressedOver(reset)) {
      //function call to reset score and start over
      startOver();
    }
  }

  trex.collide(invGround);
  drawSprites();
}


//function definition to create and move clouds
function spawnClouds() {
  if (frameCount % 30 == 0) {
    cloud = createSprite(width, height - 200, 10, 10);
    cloud.velocityX = -4;
    cloud.y = random(height - 275, height - 200);
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.debug = false;
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.5;
    cloud.lifetime = -(width/cloud.velocityX);
    badalGroup.add(cloud);
  }
}

//function definition to create and move obstacles
function spawnObstacles() {
  if (frameCount % 60 == 0) {
    obstacle = createSprite(width, height - 160, 20, 50);
    obstacle.velocityX = -(7 + score / 70);
    obstacle.debug = false;
    
    obstacle.lifetime = (-1) *(width/obstacle.velocityX);

    var caseNumber = Math.round(random(1, 6));
    console.log(caseNumber);
    //switch case passes a single variable to match with cases
    switch (caseNumber) 
    {
      case 1:
        obstacle.addImage("cactus1", cactus1);
        obstacle.scale = 0.9; 
        break;
      case 2:
        obstacle.addImage("cactus2", cactus2);
        obstacle.scale = 0.9; 
        break;
      case 3:
        obstacle.addImage("cactus3", cactus3);
        obstacle.scale = 0.85; 
        break;
      case 4:
        obstacle.addImage("cactus4", cactus4);
        obstacle.scale = 0.75; 
        break;
      case 5:
        obstacle.addImage("cactus5", cactus5);
        obstacle.scale = 0.7; 
        break;
      case 6:
        obstacle.addImage("cactus6", cactus6);
        obstacle.scale = 0.7; 
        break;
      default:
        obstacle.addImage("cactus1", cactus1);
        obstacle.scale = 0.9; 
        break;
    }
    obsGroup.add(obstacle);
  }
}

//function definition to reset score and startOver the game
function startOver() {
  gameState = PLAY;

  badalGroup.destroyEach();
  obsGroup.destroyEach();

  displayHS = true;
  trex.changeAnimation("trexRun", trexRun);
  
  score = 0;
}