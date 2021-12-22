const wrapper           = document.getElementById("wrapper");
let tetrisEntitySize    = getStyle(document.body, '--cellSize');
let mapWidth            = Math.floor((getStyle(wrapper, 'width') / tetrisEntitySize)); // 16;
let mapHeight           = Math.floor((getStyle(wrapper, 'height') / tetrisEntitySize) - 2);

if(mapWidth > 16)       mapWidth = 16;
if(mapHeight > 32)      mapHeight = 32;

const map               = [];
const keyboard          = {};
let pause               = true;
let initTime            = Date.now();
let currentTime         = Date.now();
let deltaTime           = currentTime - initTime;
// let showDeltaTime       = true;
// let count               = 0;
// let frameCount          = 0;
let initialFPS          = 2;
let FPS                 = initialFPS;
let fpsInterval         = 1000 / FPS;

let moveInitialFPS      = FPS * 4;
let moveFPS             = moveInitialFPS;
let moveFpsInterval     = 1000 / moveFPS;
let moveInitTime        = Date.now();
let moveCurrentTime     = Date.now();
let moveDeltaTime       = moveCurrentTime - moveInitTime;

let lastEntity          = null;
let newEntity           = false;
let entity              = null;

let leftRotation        = false;
let rightRotation       = false;

// let rowCompleted        = { isCompleted: false, row: 0 };
// let canCreateNewEntity  = false;

let score               = 0;
let maxScore            = 0;
let level               = 0;
let checkGameOver       = false;
let isGameOver          = false;
const maxNumberOfRowsCompletedToIncreaseLevel = 20;
let rowsCompleted       = 0;

function normalizeAngle(angle) {
  if (angle === 360)  angle = 0;
  if (angle < 0)      angle = 360 + angle;
  return angle;
}

function renderMap(i, j) {
  const element         = document.createElement("div");
  element.id            = `${j}_${i}`;
  element.style.width   = `${tetrisEntitySize}px`;
  element.style.height  = `${tetrisEntitySize}px`;

  if (map[i][j] === 1 || map[i][j] === 2 || map[i][j] === 3) {
    element.style.outline         = "1px solid #000000";
    element.style.backgroundColor = "#777777";
  } else element.style.outline    = "1px solid #ffffff11";
  return element;
}

function createMap() {
  const gameContainer           = document.createElement("div");
  gameContainer.style.position  = "relative";
  gameContainer.style.display   = "flex";
  gameContainer.style.flexWrap  = "wrap";
  gameContainer.setAttribute('id', 'game-container');
  wrapper.appendChild(gameContainer);
  
  for (let    i = 0; i < mapHeight + 2; i++) {
    map.push([]);
    for (let  j = 0; j < mapWidth;      j++) {
      if (i === 0)                          map[i][j] = 3;
      else if (i === mapHeight + 1)         map[i][j] = 2;
      else {
        if (j === 0 || j === mapWidth - 1)  map[i][j] = 1;
        else                                map[i][j] = 0;
      }

      gameContainer.appendChild(renderMap(i, j));
    }
  }
}

function resetMap() {
  for (let    i = 0; i < map.length - 1;    i++) {
    for (let  j = 1; j < map[0].length - 1; j++) {
      if (i === 0) {
        map[i][j]                   = 3;
        let cell                    = document.getElementById(`${j}_${i}`);
        cell.style.backgroundColor  = "#777777";
        cell.style.outline          = "1px solid #000000";
      } else {
        map[i][j]                   = 0;
        let cell                    = document.getElementById(`${j}_${i}`);
        cell.style.backgroundColor  = "#00000000";
        cell.style.outline          = "1px solid #ffffff11";
      }
    }
  }
}

function clear(x, y) {
  let pos                         = getMapPosition(x, y);
  map[pos.y][pos.x]               = 0;
  let cell                        = document.getElementById(`${pos.x}_${pos.y}`);

  cell.style.backgroundColor      = "#00000000";
  cell.style.outline              = "1px solid #ffffff11";

  let firstRow                    = document.getElementById(`${pos.x}_${0}`);
  firstRow.style.outline          = "1px solid #000000";
  firstRow.style.backgroundColor  = "#777777";
}

function render(x, y, color) {
  let pos                     = getMapPosition(x, y);
  map[pos.y][pos.x]           = 4;
  let cell                    = document.getElementById(`${pos.x}_${pos.y}`);
  cell.style.backgroundColor  = `${color}`;
  cell.style.outline          = "1px solid #ffffff";
}

function getNodePosition(x, y) {
  return { x: x * tetrisEntitySize, y: y * tetrisEntitySize };
}

function getMapPosition(x, y) {
  return { x: x / tetrisEntitySize, y: y / tetrisEntitySize };
}

function checkMapPosition(element, x1, y1, x2, y2, x3, y3, x4, y4) {
  let result  = false;
  let cell1   = getMapPosition(element.one.x    + x1, element.one.y     + y1);
  let cell2   = getMapPosition(element.two.x    + x2, element.two.y     + y2);
  let cell3   = getMapPosition(element.three.x  + x3, element.three.y   + y3);
  let cell4   = getMapPosition(element.four.x   + x4, element.four.y    + y4);
  result      =
    map[cell1.y][cell1.x]       ||
    map[cell1.y][cell1.x] === 2 ||
    map[cell2.y][cell2.x]       ||
    map[cell2.y][cell2.x] === 2 ||
    map[cell3.y][cell3.x]       ||
    map[cell3.y][cell3.x] === 2 ||
    map[cell4.y][cell4.x]       ||
    map[cell4.y][cell4.x] === 2;
  return result;
}

function createInfo() {
  const gameContainer           = document.getElementById('game-container');
  const element                 = document.createElement("div");
  element.id                    = "info";
  element.style.position        = "absolute";
  element.style.left            = "50%";
  element.style.top             = "50%";
  element.style.transform       = "translate(-50%, -50%)";
  element.style.width           = "100%";
  element.style.textAlign       = "center";
  element.style.fontWeight      = "bold";
  element.style.color           = "white";
  element.style.padding         = "1rem";
  element.style.backgroundColor = "#66666666";

  const paraghrap1              = document.createElement("p");
  paraghrap1.innerHTML          = 'Press <span>"A"</span> for move left';
  paraghrap1.style.marginBottom = ".5rem";
  const paraghrap2              = document.createElement("p");
  paraghrap2.innerHTML          = 'Press <span>"D"</span> for move right';
  paraghrap2.style.marginBottom = ".5rem";
  const paraghrap3              = document.createElement("p");
  paraghrap3.innerHTML          = 'Press <span>"S"</span> for move down';
  paraghrap3.style.marginBottom = ".5rem";
  const paraghrap4              = document.createElement("p");
  paraghrap4.innerHTML          = 'Press <span>"arrowLeft"</span> for rotate left';
  paraghrap4.style.marginBottom = ".5rem";
  const paraghrap5              = document.createElement("p");
  paraghrap5.innerHTML          = 'Press <span>"arrowRight"</span> for rotate right';
  paraghrap5.style.marginBottom = ".5rem";
  const paraghrap6              = document.createElement("p");
  paraghrap6.innerHTML          = 'Press <span>"space"</span> for pause/play game';

  element.appendChild(paraghrap1);
  element.appendChild(paraghrap2);
  element.appendChild(paraghrap3);
  element.appendChild(paraghrap4);
  element.appendChild(paraghrap5);
  element.appendChild(paraghrap6);
  gameContainer.appendChild(element);
}

function createGameOver() {
  const gameContainer         = document.getElementById('game-container');
  const element               = document.createElement("div");
  element.id                  = "gameover";
  element.style.position      = "absolute";
  element.style.left          = "50%";
  element.style.top           = "50%";
  element.style.transform     = "translate(-50%, -50%)";
  element.style.textAlign     = "center";
  element.style.fontWeight    = "bold";
  element.style.color         = "white";
  element.style.borderRadius  = "7px";
  element.style.display       = "none";

  gameContainer.appendChild(element);
}

function hideGameover() {
  let gameover            = document.getElementById("gameover");
  gameover.style.display  = "none";
}

function createScore() {
  const gameContainer       = document.getElementById('game-container');
  const container           = document.createElement("div");
  container.style.position  = "absolute";
  container.style.left      = "100%";
  container.style.top       = "0px";
  container.style.width     = "160px";
  container.style.height    = "160px";
  container.setAttribute('id', 'score-container');

  for (let    i = 0; i < 8; i++) {
    for (let  j = 0; j < 8; j++) {
      const element           = document.createElement("div");
      element.style.position  = "absolute";
      element.style.left      = `${j * tetrisEntitySize}px`;
      element.style.top       = `${i * tetrisEntitySize}px`;
      element.style.width     = `${tetrisEntitySize}px`;
      element.style.height    = `${tetrisEntitySize}px`;

      if (i === 0 || j === 0 || i === 7 || j === 7) {
        element.style.backgroundColor = "#777777";
        element.style.outline         = "1px solid #000000";
      } else {
        element.style.backgroundColor = "#000000";
        element.style.outline         = "1px solid #000000";
      }
      container.appendChild(element);
    }
  }

  const element                 = document.createElement("div");
  element.id                    = "scoreFlex";
  element.style.position        = "absolute";
  element.style.display         = "flex";
  element.style.flexWrap        = "wrap";
  element.style.alignItems      = "center";
  element.style.left            = "20px";
  element.style.top             = "20px";
  element.style.width           = "120px";
  element.style.height          = "120px";
  element.style.textAlign       = "center";
  element.style.fontWeight      = "bold";
  element.style.color           = "white";
  element.style.padding         = "1rem";
  element.style.backgroundColor = "#000000";

  const scoreElement            = document.createElement("p");
  scoreElement.id               = "score";
  scoreElement.innerHTML        = `Score: <span>${score}</span>`;
  scoreElement.style.width      = "100%";
  scoreElement.style.flexGrow   = 1;
  const levelElement            = document.createElement("p");
  levelElement.id               = "level";
  levelElement.innerHTML        = `Level: <span>${level}</span>`;
  levelElement.style.width      = "100%";
  levelElement.style.flexGrow   = 1;

  element.appendChild(scoreElement);
  element.appendChild(levelElement);
  container.appendChild(element);
  gameContainer.appendChild(container);
}

function createMaxScore() {
  const gameContainer         = document.getElementById('game-container');
  const container             = document.createElement("div");
  container.style.position    = "absolute";
  container.style.left        = "100%";
  container.style.top         = "160px";
  container.style.width       = "160px";
  container.style.height      = "160px";
  container.setAttribute('id', 'maxscore-container');

  for (let    i = 0; i < 8; i++) {
    for (let  j = 0; j < 8; j++) {
      const element           = document.createElement("div");
      element.style.position  = "absolute";
      element.style.left      = `${j * tetrisEntitySize}px`;
      element.style.top       = `${i * tetrisEntitySize}px`;
      element.style.width     = `${tetrisEntitySize}px`;
      element.style.height    = `${tetrisEntitySize}px`;

      if (i === 0 || j === 0 || i === 7 || j === 7) {
        element.style.backgroundColor = "#777777";
        element.style.outline         = "1px solid #000000";
      } else {
        element.style.backgroundColor = "#000000";
        element.style.outline         = "1px solid #000000";
      }
      container.appendChild(element);
    }
  }

  const element                   = document.createElement("div");
  element.id                      = "scoreFlex";
  element.style.position          = "absolute";
  element.style.display           = "flex";
  element.style.flexWrap          = "wrap";
  element.style.left              = "20px";
  element.style.top               = "20px";
  element.style.width             = "120px";
  element.style.height            = "120px";
  element.style.textAlign         = "center";
  element.style.alignItems        = "center";
  element.style.justifyContent    = "center";
  element.style.fontWeight        = "bold";
  element.style.color             = "white";
  element.style.padding           = "1rem";
  element.style.backgroundColor   = "#000000";

  const maxScoreElement           = document.createElement("p");
  maxScoreElement.id              = "maxScore";
  maxScoreElement.innerHTML       = `Max Score: <span>${maxScore}</span>`;
  maxScoreElement.style.width     = "100%";
  maxScoreElement.style.flexGrow  = 1;

  element.appendChild(maxScoreElement);
  container.appendChild(element);
  gameContainer.appendChild(container);
}

function increaseScore(value) {
  score                   += value;
  const scoreElement      = document.getElementById("score");
  scoreElement.innerHTML  = `Score: <span>${score}</span>`;
}

function increaseLevel(value) {
  level                   += value;
  const levelElement      = document.getElementById("level");
  levelElement.innerHTML  = `Level: <span>${level}</span>`;
}

function increaseFPS(value) {
  initialFPS += value;
  FPS         = initialFPS;
  fpsInterval = 1000 / FPS;
}

function checkScore(maxFPSValue) {
  increaseScore(10);

  if (localStorage.getItem("maxScore")) {
    maxScore                    = localStorage.getItem("maxScore");
    if (score > maxScore) {
      localStorage.setItem("maxScore", score.toString());
      maxScore                  = localStorage.getItem("maxScore");
      const maxScoreElement     = document.getElementById("maxScore");
      maxScoreElement.innerHTML = `Max Score: <span>${maxScore}</span>`;
    }
  }

  if (rowsCompleted >= maxNumberOfRowsCompletedToIncreaseLevel) {
    rowsCompleted = 0;
    increaseLevel(1);
    if (initialFPS < maxFPSValue) {
      increaseFPS(1);
    }
  }
}

function resetScore() {
  score                   = 0;
  const scoreElement      = document.getElementById("score");
  scoreElement.innerHTML  = `Score: <span>${score}</span>`;
}

function resetLevel() {
  level                   = 0;
  const levelElement      = document.getElementById("level");
  levelElement.innerHTML  = `Level: <span>${level}</span>`;
}

function resetFps() {
  initialFPS  = 2;
  FPS         = initialFPS;
  fpsInterval = 1000 / FPS;
}

function realocateMap(i) {
  for (   let ii = i; ii > 1                ; ii--) {
    for ( let jj = 1; jj < map[0].length - 1; jj++) {
      let upCell      = document.getElementById(`${jj}_${ii - 1}`);
      let currentCell = document.getElementById(`${jj}_${ii}`);
      let bgColor     = getComputedStyle(upCell).getPropertyValue("background-color");

      if (map[ii - 1][jj] === 0) {
        currentCell.style.backgroundColor = "#00000000";
        currentCell.style.outline         = `1px solid #ffffff11`;
      } else {
        currentCell.style.backgroundColor = `${bgColor}`;
        currentCell.style.outline         = `1px solid #ffffff`;
      }

      map[ii][jj] = map[ii - 1][jj];
    }
  }
}

function onCheckGameover() {
  if (checkGameOver) {
    for (let i = 1; i < map[0].length - 1; i++) {
      if (map[0][i] === 4) {
        pause       = true;
        isGameOver  = true;
      }
    }

    if(isGameOver) {
      let btnStyle            = `
        background-color: dodgerblue;
        font-weight: bold;
        width: 100%;
        padding: .5rem;
        border: none;
      `;
      let gameover            = document.getElementById("gameover");
      gameover.style.display  = "block";
      gameover.innerHTML      = `
        <div style="background-color:#333333">Game Over</div>
        <div style="background-color:#777777">
          Score: <span>${score}</span><br/>
          Level: <span>${level}</span><br/>
          Max Score: <span>${maxScore}</span><br/>
        </div>
        <div style="${btnStyle}">
          Press "L" for restart
        </div>
      `;
    }
    
    checkGameOver = false;
  }
}

function piece(x1, y1, x2, y2, x3, y3, x4, y4, color = "white") {
  const element = {
    one:    { x: x1, y: y1 },
    two:    { x: x2, y: y2 },
    three:  { x: x3, y: y3 },
    four:   { x: x4, y: y4 },
    setPos: function (x1, y1, x2, y2, x3, y3, x4, y4) {
      element.one   = { x: element.one.x    + x1, y: element.one.y    + y1  };
      element.two   = { x: element.two.x    + x2, y: element.two.y    + y2  };
      element.three = { x: element.three.x  + x3, y: element.three.y  + y3  };
      element.four  = { x: element.four.x   + x4, y: element.four.y   + y4  };
    },
    setAngle: function (angle) { return normalizeAngle(angle); }
  };

  const actions = {
    element:        element,
    angle:          0,
    color:          color,
    rotationLeft:   {},
    rotationRight:  {},
    clear: function () {
      clear(element.one.x,    element.one.y   );
      clear(element.two.x,    element.two.y   );
      clear(element.three.x,  element.three.y );
      clear(element.four.x,   element.four.y  );
    },
    setPos: function (x1, y1, x2, y2, x3, y3, x4, y4) {
      element.setPos(x1, y1, x2, y2, x3, y3, x4, y4);
    },
    leftRotation: function (angle) {
      angle = normalizeAngle(angle);

      if (angle === 0) {
        actions.clear();
        if (
          !checkMapPosition(
            element,
            actions.rotationLeft.zero.x1,
            actions.rotationLeft.zero.y1,
            actions.rotationLeft.zero.x2,
            actions.rotationLeft.zero.y2,
            actions.rotationLeft.zero.x3,
            actions.rotationLeft.zero.y3,
            actions.rotationLeft.zero.x4,
            actions.rotationLeft.zero.y4
          )
        ) {
          actions.angle = element.setAngle(angle);
          actions.setPos(
            actions.rotationLeft.zero.x1,
            actions.rotationLeft.zero.y1,
            actions.rotationLeft.zero.x2,
            actions.rotationLeft.zero.y2,
            actions.rotationLeft.zero.x3,
            actions.rotationLeft.zero.y3,
            actions.rotationLeft.zero.x4,
            actions.rotationLeft.zero.y4
          );
        } else {
          actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        }
      }
      if (angle === 90) {
        actions.clear();
        if (
          !checkMapPosition(
            element,
            actions.rotationLeft.noventa.x1,
            actions.rotationLeft.noventa.y1,
            actions.rotationLeft.noventa.x2,
            actions.rotationLeft.noventa.y2,
            actions.rotationLeft.noventa.x3,
            actions.rotationLeft.noventa.y3,
            actions.rotationLeft.noventa.x4,
            actions.rotationLeft.noventa.y4
          )
        ) {
          actions.angle = element.setAngle(angle);
          actions.setPos(
            actions.rotationLeft.noventa.x1,
            actions.rotationLeft.noventa.y1,
            actions.rotationLeft.noventa.x2,
            actions.rotationLeft.noventa.y2,
            actions.rotationLeft.noventa.x3,
            actions.rotationLeft.noventa.y3,
            actions.rotationLeft.noventa.x4,
            actions.rotationLeft.noventa.y4
          );
        } else {
          actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        }
      }
      if (angle === 180) {
        actions.clear();
        if (
          !checkMapPosition(
            element,
            actions.rotationLeft.cientoOchenta.x1,
            actions.rotationLeft.cientoOchenta.y1,
            actions.rotationLeft.cientoOchenta.x2,
            actions.rotationLeft.cientoOchenta.y2,
            actions.rotationLeft.cientoOchenta.x3,
            actions.rotationLeft.cientoOchenta.y3,
            actions.rotationLeft.cientoOchenta.x4,
            actions.rotationLeft.cientoOchenta.y4
          )
        ) {
          actions.angle = element.setAngle(angle);
          actions.setPos(
            actions.rotationLeft.cientoOchenta.x1,
            actions.rotationLeft.cientoOchenta.y1,
            actions.rotationLeft.cientoOchenta.x2,
            actions.rotationLeft.cientoOchenta.y2,
            actions.rotationLeft.cientoOchenta.x3,
            actions.rotationLeft.cientoOchenta.y3,
            actions.rotationLeft.cientoOchenta.x4,
            actions.rotationLeft.cientoOchenta.y4
          );
        } else {
          actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        }
      }
      if (angle === 270) {
        actions.clear();
        if (
          !checkMapPosition(
            element,
            actions.rotationLeft.doscientosSetenta.x1,
            actions.rotationLeft.doscientosSetenta.y1,
            actions.rotationLeft.doscientosSetenta.x2,
            actions.rotationLeft.doscientosSetenta.y2,
            actions.rotationLeft.doscientosSetenta.x3,
            actions.rotationLeft.doscientosSetenta.y3,
            actions.rotationLeft.doscientosSetenta.x4,
            actions.rotationLeft.doscientosSetenta.y4
          )
        ) {
          actions.angle = element.setAngle(angle);
          actions.setPos(
            actions.rotationLeft.doscientosSetenta.x1,
            actions.rotationLeft.doscientosSetenta.y1,
            actions.rotationLeft.doscientosSetenta.x2,
            actions.rotationLeft.doscientosSetenta.y2,
            actions.rotationLeft.doscientosSetenta.x3,
            actions.rotationLeft.doscientosSetenta.y3,
            actions.rotationLeft.doscientosSetenta.x4,
            actions.rotationLeft.doscientosSetenta.y4
          );
        } else {
          actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        }
      }
      actions.render(actions.color);
    },
    rightRotation: function (angle) {
      angle = normalizeAngle(angle);

      if (angle === 0) {
        actions.clear();
        if (
          !checkMapPosition(
            element,
            actions.rotationRight.zero.x1,
            actions.rotationRight.zero.y1,
            actions.rotationRight.zero.x2,
            actions.rotationRight.zero.y2,
            actions.rotationRight.zero.x3,
            actions.rotationRight.zero.y3,
            actions.rotationRight.zero.x4,
            actions.rotationRight.zero.y4
          )
        ) {
          actions.angle = element.setAngle(angle);
          actions.setPos(
            actions.rotationRight.zero.x1,
            actions.rotationRight.zero.y1,
            actions.rotationRight.zero.x2,
            actions.rotationRight.zero.y2,
            actions.rotationRight.zero.x3,
            actions.rotationRight.zero.y3,
            actions.rotationRight.zero.x4,
            actions.rotationRight.zero.y4
          );
        } else {
          actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        }
      }
      if (angle === 90) {
        actions.clear();
        if (
          !checkMapPosition(
            element,
            actions.rotationRight.noventa.x1,
            actions.rotationRight.noventa.y1,
            actions.rotationRight.noventa.x2,
            actions.rotationRight.noventa.y2,
            actions.rotationRight.noventa.x3,
            actions.rotationRight.noventa.y3,
            actions.rotationRight.noventa.x4,
            actions.rotationRight.noventa.y4
          )
        ) {
          actions.angle = element.setAngle(angle);
          actions.setPos(
            actions.rotationRight.noventa.x1,
            actions.rotationRight.noventa.y1,
            actions.rotationRight.noventa.x2,
            actions.rotationRight.noventa.y2,
            actions.rotationRight.noventa.x3,
            actions.rotationRight.noventa.y3,
            actions.rotationRight.noventa.x4,
            actions.rotationRight.noventa.y4
          );
        } else {
          actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        }
      }
      if (angle === 180) {
        actions.clear();
        if (
          !checkMapPosition(
            element,
            actions.rotationRight.cientoOchenta.x1,
            actions.rotationRight.cientoOchenta.y1,
            actions.rotationRight.cientoOchenta.x2,
            actions.rotationRight.cientoOchenta.y2,
            actions.rotationRight.cientoOchenta.x3,
            actions.rotationRight.cientoOchenta.y3,
            actions.rotationRight.cientoOchenta.x4,
            actions.rotationRight.cientoOchenta.y4
          )
        ) {
          actions.angle = element.setAngle(angle);
          actions.setPos(
            actions.rotationRight.cientoOchenta.x1,
            actions.rotationRight.cientoOchenta.y1,
            actions.rotationRight.cientoOchenta.x2,
            actions.rotationRight.cientoOchenta.y2,
            actions.rotationRight.cientoOchenta.x3,
            actions.rotationRight.cientoOchenta.y3,
            actions.rotationRight.cientoOchenta.x4,
            actions.rotationRight.cientoOchenta.y4
          );
        } else {
          actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        }
      }
      if (angle === 270) {
        actions.clear();
        if (
          !checkMapPosition(
            element,
            actions.rotationRight.doscientosSetenta.x1,
            actions.rotationRight.doscientosSetenta.y1,
            actions.rotationRight.doscientosSetenta.x2,
            actions.rotationRight.doscientosSetenta.y2,
            actions.rotationRight.doscientosSetenta.x3,
            actions.rotationRight.doscientosSetenta.y3,
            actions.rotationRight.doscientosSetenta.x4,
            actions.rotationRight.doscientosSetenta.y4
          )
        ) {
          actions.angle = element.setAngle(angle);
          actions.setPos(
            actions.rotationRight.doscientosSetenta.x1,
            actions.rotationRight.doscientosSetenta.y1,
            actions.rotationRight.doscientosSetenta.x2,
            actions.rotationRight.doscientosSetenta.y2,
            actions.rotationRight.doscientosSetenta.x3,
            actions.rotationRight.doscientosSetenta.y3,
            actions.rotationRight.doscientosSetenta.x4,
            actions.rotationRight.doscientosSetenta.y4
          );
        } else {
          actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        }
      }
      actions.render(actions.color);
    },
    render: function () {
      render(element.one.x, element.one.y,      actions.color);
      render(element.two.x, element.two.y,      actions.color);
      render(element.three.x, element.three.y,  actions.color);
      render(element.four.x, element.four.y,    actions.color);
    },
    moveRight: function () {
      actions.clear();
      if (!checkMapPosition(element, 20, 0, 20, 0, 20, 0, 20, 0)) {
        actions.setPos(20, 0, 20, 0, 20, 0, 20, 0);
        actions.render(actions.color);
      } else {
        actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        actions.render(actions.color);
      }
    },
    moveLeft: function () {
      actions.clear();
      if (!checkMapPosition(element, -20, 0, -20, 0, -20, 0, -20, 0)) {
        actions.setPos(-20, 0, -20, 0, -20, 0, -20, 0);
        actions.render(actions.color);
      } else {
        actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        actions.render(actions.color);
      }
    },
    moveDown: function () {
      actions.clear();
      if (!checkMapPosition(element, 0, 20, 0, 20, 0, 20, 0, 20)) {
        actions.setPos(0, 20, 0, 20, 0, 20, 0, 20);
        actions.render(actions.color);
      } else {
        actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        actions.render(actions.color);
      }
    },
    moveDownx2: function () {
      actions.clear();
      if (!checkMapPosition(element, 0, 40, 0, 40, 0, 40, 0, 40)) {
        actions.setPos(0, 40, 0, 40, 0, 40, 0, 40);
        actions.render(actions.color);
      } else {
        actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        actions.render(actions.color);
      }
    },
    moveUp: function () {
      actions.clear();
      if (!checkMapPosition(element, 0, -20, 0, -20, 0, -20, 0, -20)) {
        actions.setPos(0, -20, 0, -20, 0, -20, 0, -20);
        actions.render(actions.color);
      } else {
        actions.setPos(0, 0, 0, 0, 0, 0, 0, 0);
        actions.render(actions.color);
      }
    }
  };

  actions.render(actions.color);

  return actions;
}

function move() {
  if (keyboard.KeyD) { entity.moveRight();  }
  if (keyboard.KeyA) { entity.moveLeft();   }
  if (keyboard.KeyS) {
    FPS         = 20;
    fpsInterval = 1000 / FPS;
  }
  if (!keyboard.KeyS) {
    FPS         = initialFPS;
    fpsInterval = 1000 / FPS;
  }
}

function setRotation() {
  if (keyboard.key === "ArrowLeft")   { leftRotation = true;  }
  if (keyboard.key === "ArrowRight")  { rightRotation = true; }
}

function rotation() {
  if (leftRotation) {
    entity.leftRotation(entity.angle - 90);
    leftRotation = false;
  }
  if (rightRotation) {
    entity.rightRotation(entity.angle + 90);
    rightRotation = false;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomPiece(x, y) {
  let choice = getRandomInt(1, 8);
  if (choice === 1) { // L Piece
    const newPiece          = piece(x - 20, y, x - 20, y + 20, x - 20, y + 40, x, y + 40, "orange");
    newPiece.rotationLeft   = rotationLPiece.rotationLeft;
    newPiece.rotationRight  = rotationLPiece.rotationRight;
    return newPiece;
  }
  if (choice === 2) { // L Inverted Piece
    const newPiece          = piece(x, y, x, y + 20, x, y + 40, x - 20, y + 40, "blue");
    newPiece.rotationLeft   = rotationInvertedLPiece.rotationLeft;
    newPiece.rotationRight  = rotationInvertedLPiece.rotationRight;
    return newPiece;
  }
  if (choice === 3) { // Square Piece
    const newPiece          = piece(x - 20, y, x, y, x - 20, y + 20, x, y + 20, "yellow");
    newPiece.rotationLeft   = rotationSquarePiece.rotationLeft;
    newPiece.rotationRight  = rotationSquarePiece.rotationRight;
    return newPiece;
  }
  if (choice === 4) { // I Piece
    const newPiece          = piece(x, y, x, y + 20, x, y + 40, x, y + 60, "lightblue");
    newPiece.rotationLeft   = rotationIPiece.rotationLeft;
    newPiece.rotationRight  = rotationIPiece.rotationRight;
    return newPiece;
  }
  if (choice === 5) { // Z Piece
    const newPiece          = piece(x - 40, y, x - 20, y, x - 20, y + 20, x, y + 20, "red");
    newPiece.rotationLeft   = rotationZPiece.rotationLeft;
    newPiece.rotationRight  = rotationZPiece.rotationRight;
    return newPiece;
  }
  if (choice === 6) { // Z Inverted Piece
    const newPiece          = piece(x - 20, y + 20, x, y + 20, x, y, x + 20, y, "green");
    newPiece.rotationLeft   = rotationInvertedZPiece.rotationLeft;
    newPiece.rotationRight  = rotationInvertedZPiece.rotationRight;
    return newPiece;
  }
  if (choice === 7) { // T Piece
    const newPiece          = piece(x - 20, y, x, y, x + 20, y, x, y + 20, "darkviolet");
    newPiece.rotationLeft   = rotationTPiece.rotationLeft;
    newPiece.rotationRight  = rotationTPiece.rotationRight;
    return newPiece;
  }
}

function checkIdlePiece(element, x1, y1, x2, y2, x3, y3, x4, y4) {
  let result = {
    valid:  false,
    objs:   { "0": null, "1": null, "2": null, "3": null }
  };

  let cell1 = getMapPosition(element.one.x    + x1, element.one.y   + y1);
  let cell2 = getMapPosition(element.two.x    + x2, element.two.y   + y2);
  let cell3 = getMapPosition(element.three.x  + x3, element.three.y + y3);
  let cell4 = getMapPosition(element.four.x   + x4, element.four.y  + y4);

  result.valid =
    map[cell1.y][cell1.x] === 2 ||
    map[cell2.y][cell2.x] === 2 ||
    map[cell3.y][cell3.x] === 2 ||
    map[cell4.y][cell4.x] === 2;

  if (result.valid) {
    result.objs["0"] = cell1;
    result.objs["1"] = cell2;
    result.objs["2"] = cell3;
    result.objs["3"] = cell4;
  }

  return result;
}

function setIdlePiece(entity) {
  let cell1 = getMapPosition(entity.element.one.x,    entity.element.one.y    );
  let cell2 = getMapPosition(entity.element.two.x,    entity.element.two.y    );
  let cell3 = getMapPosition(entity.element.three.x,  entity.element.three.y  );
  let cell4 = getMapPosition(entity.element.four.x,   entity.element.four.y   );

  map[cell1.y][cell1.x] = 2;
  map[cell2.y][cell2.x] = 2;
  map[cell3.y][cell3.x] = 2;
  map[cell4.y][cell4.x] = 2;
}

function checkRowComplete() {
  let data  = { isCompleted: false, row: 0 };
  let count = 0;
  for (   let i = map.length - 2; i > 0                 ; i--) {
    for ( let j = 1             ; j < map[0].length - 1 ; j++) {
      if (map[i][j] !== 2) {
        count = 0;
        break;
      } else {
        count++;

        if (count === mapWidth - 2) {
          rowsCompleted++;
          checkScore(60);
          realocateMap(i);

          count = 0;
          i++;
        }
      }
    }
  }

  return data;
}

// https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
function update() {
  //try {
    requestAnimationFrame(update);

    if (!pause) {
      info.style.display  = "none";
      currentTime         = Date.now();
      deltaTime           = currentTime - initTime;

      moveCurrentTime     = Date.now();
      moveDeltaTime       = moveCurrentTime - moveInitTime;

      setRotation();

      if (moveDeltaTime > moveFpsInterval) {
        moveInitTime      = moveCurrentTime - (moveDeltaTime % moveFpsInterval);
        move();
      }

      if (deltaTime > fpsInterval) {
        initTime          = currentTime - (deltaTime % fpsInterval);

        onCheckGameover();

        if (newEntity.valid) {
          lastEntity      = entity;
          entity.clear();
          if (checkMapPosition(entity.element, 0, 20, 0, 20, 0, 20, 0, 20)) {
            lastEntity.render();
            setIdlePiece(lastEntity);
            checkRowComplete();
            entity        = randomPiece(160, 0);
            checkGameOver = true;
          }
        }

        rotation();
        entity.moveDown();
        newEntity         = checkIdlePiece(entity.element, 0, 20, 0, 20, 0, 20, 0, 20);
        keyboard.key      = null;
      }
    } else if (pause === true && isGameOver === false) {
      info.style.display  = "block";
    } else if (pause === true && isGameOver === true) {
      if (keyboard.KeyL) {
        hideGameover();
        resetMap();
        resetScore();
        resetLevel();
        resetFps();
        pause             = false;
        keyboard.key      = null;
        isGameOver        = false;
      }
    }
  /* } catch (e) {
    console.log(e.message);
  } */
}

function listeners() {
  document.addEventListener("keydown", function (e) {
    keyboard[e.code]  = true;
    keyboard.key      = e.code;
    if (e.code === "Space") pause = !pause;
  });

  document.addEventListener("keyup", function (e) {
    keyboard[e.code]  = false;
    keyboard.key      = null;
  });

  window.addEventListener("load", function () {
    if (!localStorage.getItem("maxScore")) {
      localStorage.setItem("maxScore", "0");
    }

    createInfo();
    createGameOver();
    createScore();
    createMaxScore(); 
  });

  window.addEventListener("unload", function () {
    if (localStorage.getItem("maxScore")) {
      localStorage.removeItem("maxScore");
    }
  });
}

function start() {
  listeners();
  createMap();
  entity = randomPiece(160, 0);
  requestAnimationFrame(update);
}

start();
