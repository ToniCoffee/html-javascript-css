// Gets wrapper values
const container                   = document.getElementById('container');
const headerOptions               = document.getElementById('headerOptions');
const wrapper                     = document.getElementById('wrapper');
const web                         = document.getElementById('web');
let wrapperWidth                  = getStyle(wrapper, 'width');
let wrapperHeight                 = getStyle(wrapper, 'height');
let halfWrapperWidth              = Math.round(wrapperWidth / 2);
let halfWrapperHeight             = Math.round(wrapperHeight / 2);
let headerOptionsHeight           = 0;

// Gets and sets ball values
const ball                        = document.getElementById('ball');
ball.radius                       = getStyle(ball, '--ballRadius');
ball.initialX                     = getStyle(ball, 'left') + ball.radius;
ball.initialY                     = getStyle(ball, 'top') + ball.radius;
ball.initialSpeed                 = 4;
ball.x                            = ball.initialX;
ball.y                            = ball.initialY;
ball.speed                        = ball.initialSpeed;
ball.horizontalDirection          = -1;
ball.verticalDirection            = 0;

// Gets and sets initial player scores
const playerLeftScore             = document.getElementById('playerLeftScore');
playerLeftScore.points            = 0;
const playerRightScore            = document.getElementById('playerRightScore');
playerRightScore.points           = 0;

// Gets and sets player left values
const playerLeft                  = document.getElementById('playerLeft');
playerLeft.initialX               = getStyle(playerLeft, 'left');
playerLeft.initialY               = getStyle(playerLeft, 'top');
playerLeft.initialSpeed           = ball.initialSpeed * 2;
playerLeft.x                      = playerLeft.initialX;
playerLeft.y                      = playerLeft.initialY;
playerLeft.speed                  = playerLeft.initialSpeed;
playerLeft.verticalDirection      = 0;
playerLeft.score                  = 0;

// Gets and sets player right values
const playerRight                 = document.getElementById('playerRight');
playerRight.initialX              = getStyle(playerRight, 'left');
playerRight.initialY              = getStyle(playerRight, 'top');
playerRight.initialSpeed          = ball.initialSpeed * 2;
playerRight.x                     = playerRight.initialX;
playerRight.y                     = playerRight.initialY;
playerRight.speed                 = playerRight.initialSpeed;
playerRight.verticalDirection     = 0;
playerRight.score                 = 0;

// Gets player width and height, and sets max players position y (min players position y is zero).
const playerWidth                 = getStyle(playerLeft, '--playerWidth');
const playerHeight                = getStyle(playerLeft, '--playerHeight');
let maxPlayerPositionY            = wrapperHeight - playerHeight;
let maxBallPositionY              = wrapperHeight;

// Keyboard and loopType objects. 
const keyboard                    = {};
const loopType                    = {
  interval: 'interval',
  limitedFPS: 'limitedFPS',
  noLimitedFPS: 'noLimitedFPS'
};

// Sets variables for FPS and delta time
let initTime                      = Date.now();
let currentTime                   = Date.now();
let delta                         = currentTime - initTime;
let initialFPS                    = 60;
let FPS                           = initialFPS;
let fpsInterval                   = 1000 / FPS;
let framesCount                   = 0;

// Sets variables for increase level speed
const increaseSpeedAfterFrames    = FPS * 30;
const speedIncrement              = 1;

// Other variables 
let handler                       = null; // Handler for setInterval
let handlerAnimationFrame         = null; // Handler for requestAnimationFrame
let pause                         = true; // Sets game paused or not paused
let nextCollisionWithPlayerLeft   = true; // Variable for check if the collision between ball and player left is allowed
let nextCollisionWithPlayerRight  = true; // Variable for check if the collision between ball and player right is allowed
let canIncreaseSpeed              = false; // Variable for check if can increase speed level
let loopToUse                     = loopType.interval; // Sets the loop type to use
let loopFunction                  = null; // Sets the function that will be used in main loop
let requestAnimationFrame         = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let cancelAnimationFrame          = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function drawHeaderOptions() {
  container.appendChild(headerOptions);

  const inputColorWrapper = document.createElement('div');
  inputColorWrapper.id = 'inputColorWrapper';
  inputColorWrapper.style.display = 'flex';
  inputColorWrapper.style.flexGrow = '1';
  inputColorWrapper.style.backgroundColor = '#333333';
  inputColorWrapper.style.border = '1px solid #ffffff';
  inputColorWrapper.style.padding = '.25rem .25rem';
  headerOptions.appendChild(inputColorWrapper);

  const inputColorLeft = document.createElement('input');
  inputColorLeft.id = 'inputColorLeft';
  inputColorLeft.type = 'color';
  inputColorLeft.value = '#ffffff';
  inputColorLeft.style.border = 'none';
  inputColorLeft.style.outline = 'none';
  inputColorLeft.style.backgroundColor = '#00000000';
  inputColorLeft.style.width = '33%';
  inputColorWrapper.appendChild(inputColorLeft);

  const inputColorBall = document.createElement('input');
  inputColorBall.id = 'inputColorBall';
  inputColorBall.type = 'color';
  inputColorBall.value = '#ffffff';
  inputColorBall.style.border = 'none';
  inputColorBall.style.outline = 'none';
  inputColorBall.style.backgroundColor = '#00000000';
  inputColorBall.style.width = '33%';
  inputColorWrapper.appendChild(inputColorBall);

  const inputColorRight = document.createElement('input');
  inputColorRight.id = 'inputColorRight';
  inputColorRight.type = 'color';
  inputColorRight.value = '#ffffff';
  inputColorRight.style.border = 'none';
  inputColorRight.style.outline = 'none';
  inputColorRight.style.backgroundColor = '#00000000';
  inputColorRight.style.width = '33%';
  inputColorWrapper.appendChild(inputColorRight);

  inputColorLeft.addEventListener("input", function(e) {
    playerLeft.style.backgroundColor = e.target.value;
    playerLeftScore.style.color = e.target.value;
  }, false);

  inputColorRight.addEventListener("input", function(e) {
    playerRight.style.backgroundColor = e.target.value;
    playerRightScore.style.color = e.target.value;
  }, false);

  inputColorBall.addEventListener("input", function(e) {
    ball.style.backgroundColor = e.target.value;
  }, false);

  const optionsWrapper = document.createElement('div');
  optionsWrapper.style.display = 'flex';
  optionsWrapper.style.justifyContent = 'space-between';
  optionsWrapper.style.fontWeight = 'bold';
  optionsWrapper.style.fontSize = '75%';
  optionsWrapper.style.backgroundColor = '#333333';
  optionsWrapper.style.color = '#ffffff';
  optionsWrapper.style.border = '1px solid #ffffff';
  optionsWrapper.style.flexGrow = '5';
  headerOptions.appendChild(optionsWrapper);

  const radioIntervalWrapper = document.createElement('div');
  radioIntervalWrapper.style.display = 'flex';
  radioIntervalWrapper.style.flexWrap = 'wrap';
  radioIntervalWrapper.style.alignItems = 'center';
  radioIntervalWrapper.style.textAlign = `center`;
  radioIntervalWrapper.style.width = `100%`;
  optionsWrapper.appendChild(radioIntervalWrapper);

  const radioInterval = document.createElement('input');
  radioInterval.type = 'radio';
  radioInterval.id = 'interval';
  radioInterval.name = 'loopFunction';
  radioInterval.value = `${useInterval}`;
  radioInterval.checked = true;
  radioInterval.style.width = `100%`;
  radioIntervalWrapper.appendChild(radioInterval);

  const radioIntervalLabel = document.createElement('label');
  radioIntervalLabel.htmlFor = 'interval';
  radioIntervalLabel.innerHTML = 'Interval';
  radioIntervalLabel.style.display = 'block';
  radioIntervalLabel.style.width = `100%`;
  radioIntervalWrapper.appendChild(radioIntervalLabel);

  const radioLimitedFPSWrapper = document.createElement('div');
  radioLimitedFPSWrapper.style.display = 'flex';
  radioLimitedFPSWrapper.style.flexWrap = 'wrap';
  radioLimitedFPSWrapper.style.alignItems = 'center';
  radioLimitedFPSWrapper.style.textAlign = `center`;
  radioLimitedFPSWrapper.style.width = `100%`;
  optionsWrapper.appendChild(radioLimitedFPSWrapper);

  const radioLimitedFPS = document.createElement('input');
  radioLimitedFPS.type = 'radio';
  radioLimitedFPS.id = 'limitedFPS';
  radioLimitedFPS.name = 'loopFunction';
  radioLimitedFPS.value = `${useLimitedFPSLoop}`;
  radioLimitedFPS.style.width = `100%`;
  radioLimitedFPSWrapper.appendChild(radioLimitedFPS);

  const radioLimitedFPSLabel = document.createElement('label');
  radioLimitedFPSLabel.htmlFor = 'limitedFPS';
  radioLimitedFPSLabel.innerHTML = 'LimitedFPS';
  radioLimitedFPSLabel.style.display = 'block';
  radioLimitedFPSLabel.style.width = `100%`;
  radioLimitedFPSWrapper.appendChild(radioLimitedFPSLabel);

  const radioNoLimitedFPSWrapper = document.createElement('div');
  radioNoLimitedFPSWrapper.style.display = 'flex';
  radioNoLimitedFPSWrapper.style.flexWrap = 'wrap';
  radioNoLimitedFPSWrapper.style.alignItems = 'center';
  radioNoLimitedFPSWrapper.style.textAlign = `center`;
  radioNoLimitedFPSWrapper.style.width = `100%`;
  optionsWrapper.appendChild(radioNoLimitedFPSWrapper);

  const radioNoLimitedFPS = document.createElement('input');
  radioNoLimitedFPS.type = 'radio';
  radioNoLimitedFPS.id = 'noLimitedFPS';
  radioNoLimitedFPS.name = 'loopFunction';
  radioNoLimitedFPS.value = `${useNoLimitedFPSLoop}`;
  radioNoLimitedFPS.style.width = `100%`;
  radioNoLimitedFPSWrapper.appendChild(radioNoLimitedFPS);

  const radioNoLimitedFPSLabel = document.createElement('label');
  radioNoLimitedFPSLabel.htmlFor = 'noLimitedFPS';
  radioNoLimitedFPSLabel.innerHTML = 'NoLimitedFPS';
  radioNoLimitedFPSLabel.style.display = 'block';
  radioNoLimitedFPSLabel.style.width = `100%`;
  radioNoLimitedFPSWrapper.appendChild(radioNoLimitedFPSLabel);

  const buttonWrapper = document.createElement('div');
  buttonWrapper.style.flexGrow = '.1';
  headerOptions.appendChild(buttonWrapper);

  const btnInit = document.createElement('button');
  btnInit.innerHTML = 'INIT';
  btnInit.style.width = `100%`;
  btnInit.style.height = `100%`;
  btnInit.style.backgroundColor = 'dodgerblue';
  btnInit.style.color = '#ffffff';
  btnInit.style.border = '1px solid #ffffff';
  btnInit.style.textShadow = '2px 2px 2px #000000';
  btnInit.style.padding = '.25rem 1rem';
  btnInit.style.fontWeight = 'bold';
  btnInit.style.cursor = 'pointer';
  buttonWrapper.appendChild(btnInit);

  btnInit.addEventListener('click', function(e) {
    const radioButtons = document.getElementsByName('loopFunction');
    for(let item of radioButtons) {
      if(item.checked) {
        loopToUse = item.id;
        cancelAnimationFrame(handlerAnimationFrame);
        clearInterval(handler);
        handler = null;
        reset();
        checkLoopFunction();
      }
    }
  });

  headerOptionsHeight = getStyle(headerOptions, 'height');
  maxPlayerPositionY  = (wrapperHeight - headerOptionsHeight) - playerHeight;
  maxBallPositionY    = wrapperHeight - headerOptionsHeight;
}

function drawBallCenter(x, y) {
  const element = document.createElement('div');
  element.style.position = 'absolute';
  element.style.left = `${x - 5}px`;
  element.style.top = `${y - 5}px`;
  element.style.width = '10px';
  element.style.height = '10px';
  element.style.backgroundColor = 'red';
  element.style.borderRadius = '50%';
  return element;
}

function updateBallCenter(ballCenter) {
  ballCenter.style.left = `${ball.x - 5}px`;
  ballCenter.style.top = `${ball.y - 5}px`;
}

function movePlayerLeft() {
  if(keyboard.KeyW) playerLeft.verticalDirection = 1;
  if(keyboard.KeyS) playerLeft.verticalDirection = -1;
  if(!keyboard.KeyW && !keyboard.KeyS) playerLeft.verticalDirection = 0;

  playerLeft.y = playerLeft.y - (playerLeft.speed * playerLeft.verticalDirection * (1 - delta));
  playerLeft.y = clamp(playerLeft.y, 0, maxPlayerPositionY);
  playerLeft.style.top = `${playerLeft.y}px`;
}

function movePlayerRight() {
  if(keyboard.ArrowUp) playerRight.verticalDirection = 1;
  if(keyboard.ArrowDown) playerRight.verticalDirection = -1;
  if(!keyboard.ArrowUp && !keyboard.ArrowDown) playerRight.verticalDirection = 0;

  playerRight.y -= playerRight.speed * playerRight.verticalDirection * (1 - delta);
  playerRight.y = clamp(playerRight.y, 0, maxPlayerPositionY);
  playerRight.style.top = `${playerRight.y}px`;
}

function moveBall() {
  let newX = ball.x + (ball.speed * ball.horizontalDirection * (1 - delta));
  let newY = ball.y + (ball.speed * ball.verticalDirection * (1 - delta));

  if(checkCollisionWithLeftPlayer(newX, newY)) {
    ball.horizontalDirection *= -1;
    if(playerLeft.verticalDirection === 1) ball.verticalDirection = -1;
    if(playerLeft.verticalDirection === -1) ball.verticalDirection = 1;
    if(canIncreaseSpeed) increaseSpeed();
  }

  if(checkCollisionWithRightPlayer(newX, newY)) {
    ball.horizontalDirection *= -1;
    if(playerRight.verticalDirection === 1) ball.verticalDirection = -1;
    if(playerRight.verticalDirection === -1) ball.verticalDirection = 1;
    if(canIncreaseSpeed) increaseSpeed();
  }

  ball.x = newX;
  ball.y = newY;
  ball.style.left = `${ball.x - ball.radius}px`;
  ball.style.top = `${ball.y - ball.radius}px`;
}

function resetElement(element) {
  let halfWrapperHeight = getStyle(wrapper, 'height') / 2;
  element.initialY = halfWrapperHeight - (getStyle(playerLeft, 'height') / 2);
  element.x = element.initialX;
  element.y = element.initialY;
  element.verticalDirection = 0;
  element.speed = element.initialSpeed;
  ball.initialY = halfWrapperHeight - ball.radius;
  ball.y = ball.initialY;
}

function reset() {
  resetElement(playerRight);
  resetElement(playerLeft);
  resetElement(ball);
}

function increasePlayerPoints(playerScore) {
  playerScore.points        += 1;
  playerScore.innerHTML     = playerScore.points;
  reset();
  ball.horizontalDirection  *= -1;
}

function checkPlayerPoint() {
  wrapperWidth            = getStyle(wrapper, 'width');
  const playerLeftPoint   = (ball.x - ball.radius) >  (wrapperWidth + ball.radius * 2);
  const playerRightPoint  = (ball.x - ball.radius) <= -(ball.radius * 2);
  if(playerLeftPoint)     increasePlayerPoints(playerLeftScore);
  if(playerRightPoint)    increasePlayerPoints(playerRightScore);
}

function info(title, text, buttonText) {
  const infoWrapper = document.createElement('div');
  infoWrapper.style.display = 'flex';
  infoWrapper.style.alignItems = 'center';
  infoWrapper.style.justifyContent = 'center';
  infoWrapper.style.position = 'absolute';
  infoWrapper.style.left = '50%';
  infoWrapper.style.top = '50%';
  infoWrapper.style.transform = 'translate(-50%, -50%)';
  infoWrapper.style.width = '100%';
  infoWrapper.style.height = '100%';
  infoWrapper.style.maxWidth = '400px';
  infoWrapper.style.padding = '1rem';
  infoWrapper.style.backgroundColor = '#000000cc';

  const element = document.createElement('div');
  element.style.display = 'flex';
  element.style.alignItems = 'center';
  element.style.justifyContent = 'center';
  element.style.flexWrap = 'wrap';
  element.style.width = '100%';
  element.style.color = '#ffffff';
  element.style.fontWeight = 'bold';
  element.style.fontSize = '80%';

  const elementH2 = document.createElement('h2');
  elementH2.innerHTML = title;
  elementH2.style.width = '100%';
  elementH2.style.textAlign = 'center';
  elementH2.style.padding = '.5rem 1rem';

  const elementInfo = document.createElement('p');
  elementInfo.innerHTML = text;
  elementInfo.style.width = '100%';
  elementInfo.style.textAlign = 'center';
  elementInfo.style.padding = '.5rem 1rem';

  const btn = document.createElement('button');
  btn.innerHTML = buttonText;
  btn.style.padding = '.5rem 1rem';
  btn.style.margin = '.5rem 1rem';
  btn.style.width = 'fit-content';
  btn.style.backgroundColor = '#1772cc';
  btn.style.color = 'white';
  btn.style.fontWeight = 'bold';
  btn.style.fontSize = '80%';
  btn.style.border = 'none';
  btn.style.textShadow = '2px 2px 2px black';
  btn.style.boxShadow = '2px 2px 2px black';
  btn.style.borderRadius = '5px';
  btn.style.border = '2px solid #00000000';
  btn.style.cursor = 'pointer';

  btn.onclick = () => {
    infoWrapper.style.display = 'none';
    pause = !pause;
  }

  element.appendChild(elementH2);
  element.appendChild(elementInfo);
  element.appendChild(btn);
  infoWrapper.appendChild(element);
  wrapper.appendChild(infoWrapper);
}

function checkBoundingCollision() {
  if( (ball.y - ball.radius) <= 0 || (ball.y + ball.radius) >= wrapperHeight) {
    ball.verticalDirection *= -1;
  }
}

function checkCollisionWithLeftPlayer(x, y) {
  let xCollision = (
    x <= (getStyle(playerLeft, 'left') + playerWidth) &&
    nextCollisionWithPlayerLeft
  );
  let yCollision = false;

  if(xCollision) {
    nextCollisionWithPlayerLeft = false;
    nextCollisionWithPlayerRight = true;
    yCollision = ((y + ball.radius) >= getStyle(playerLeft, 'top')) && 
                 ((y - ball.radius) <= (getStyle(playerLeft, 'top') + playerHeight));
  }
  return (xCollision && yCollision);
}

function checkCollisionWithRightPlayer(x, y) {
  let xCollision = (
    x >= getStyle(playerRight, 'left') &&
    nextCollisionWithPlayerRight
  );
  let yCollision = false;

  if(xCollision) {
    nextCollisionWithPlayerRight = false;
    nextCollisionWithPlayerLeft = true;
    yCollision = ((y + ball.radius) >= getStyle(playerRight, 'top')) && 
                 ((y - ball.radius) <= (getStyle(playerRight, 'top') + playerHeight));
  }

  return (xCollision && yCollision); 
}

function increaseSpeed() {
  playerLeft.speed    += speedIncrement;
  playerRight.speed   += speedIncrement;
  ball.speed          += speedIncrement;
  framesCount         = 0;
  canIncreaseSpeed    = false;
}

function useNoLimitedFPSLoop() {
  if(!pause) {
    currentTime = Date.now();
    delta = (currentTime - initTime) * 0.001;

    update();
    initTime = currentTime;
  }
}

function useLimitedFPSLoop() {
  if(!pause) {
    currentTime = Date.now();
    let interval = (currentTime - initTime);
    delta = interval * 0.001;

    if(interval > fpsInterval) {
      initTime = currentTime - (interval % fpsInterval);
      update();
    }
  }
}

function useInterval() {
  handler = setInterval(function() {
    if(!pause) {
      update();
    }
  }, fpsInterval);
}

function checkLoopFunction() {
  loopFunction = useLimitedFPSLoop;

  if(loopToUse === loopType.interval) {
    loopFunction = useInterval;
    gameLoop();
  } else if(loopToUse === loopType.noLimitedFPS) {
    loopFunction = useNoLimitedFPSLoop;
    handlerAnimationFrame = requestAnimationFrame(gameLoop);
  } else {
    loopFunction = useLimitedFPSLoop;
    handlerAnimationFrame = requestAnimationFrame(gameLoop);
  }
}

function update() {
  checkPlayerPoint();
  checkBoundingCollision();

  movePlayerLeft();
  movePlayerRight();
  moveBall();

  framesCount++;
  if(framesCount >= increaseSpeedAfterFrames) canIncreaseSpeed = true;
}

function gameLoop() {
  // try {
    if(loopToUse !== loopType.interval) handlerAnimationFrame = requestAnimationFrame(gameLoop);
    loopFunction();
  /* } catch(e) {
    console.log(e.message);
    clearInterval(handler);
    handler = null;
  } */
}

function start() {
  listeners();
  drawHeaderOptions();
  container.appendChild(wrapper);

  screen.orientation.addEventListener('change', function(e) {
    headerOptionsHeight = getStyle(headerOptions, 'height');
    wrapperHeight       = getStyle(wrapper, 'height');
    let newPlayerHeight = getStyle(playerLeft, 'height');
    maxPlayerPositionY  = wrapperHeight - newPlayerHeight;
    maxBallPositionY    = wrapperHeight;
    reset();
  });

  info(
    'INFO', 
    `Press "W" and "S" for move left player.
    <br/>Press "upArrow" and "downArrow" for move right player.
    <br/>Press "space" to pause/continue the game.`, 
    'PLAY!'
  );

  checkLoopFunction();
}

start();

let timer; 
new ResizeObserver(entries => {
  headerOptionsHeight = getStyle(headerOptions, 'height');
  wrapperHeight       = getStyle(wrapper, 'height');
  let newPlayerHeight = getStyle(playerLeft, 'height');
  maxPlayerPositionY  = wrapperHeight - newPlayerHeight;
  maxBallPositionY    = wrapperHeight;
  if(timer) clearTimeout(timer);
  timer = setTimeout(() => {
    for(let key in keyboard) {
      if(keyboard[key] === true) keyboard[key] = false;
    }
  }, 100);
}).observe(wrapper);