// global variables
let sideLength;
let grid;
// const token_side_length = 70; // side length in pixels
let token_side_length;
const grid_gap_width = 5; // in pixels
let score = 0;
let score_backup;
let score_value = document.getElementById("score-value");
let busy = false;
const animation_move_distance = 5;
const animation_move_interval = 5;
const token_spawn_delay = 100;

const chooseGameAreaSize = [
  "img/3x3.png",
  "img/4x4.png",
  "img/5x5.png",
  "img/6x6.png"
];
let sizeHelper = 0;
let chooseGameAreaSizeImg = document.getElementById("choose-game-area-img");
const sizeTextArray = [
  "Small - 3x3",
  "Classic - 4x4",
  "Large - 5x5",
  "Big - 6x6"
];
let sizeText = document.getElementById("size-text");

const colorObject = {
  2: "#eee4da",
  4: "#ece0ca",
  8: "#eab78a",
  16: "#ec8d53",
  32: "#f57c5f",
  64: "#e95839",
  128: "#f4d86d",
  256: "#f1d04b",
  512: "#e4c02a",
  1024: "#e1bb12",
  2048: "#ecc400",
  4096: "#5eda92",
  8096: "#26ba64",
  16192: "#238c51",
  32384: "#238c51",
  64768: "#238c53"
};

let movement = {
  xOrigin: [],
  yOrigin: [],
  xDestination: [],
  yDestination: [],
  merge: []
};

const clearMovements = () => {
  movement.xOrigin = [];
  movement.yOrigin = [];
  movement.xDestination = [];
  movement.yDestination = [];
  movement.merge = [];
};

class MyGrid {
  constructor(size = 3) {
    this.size = size;
    this.array = [];
    // backupArray for undo function
    this.backupArray = [];
  }
  initialize() {
    let tempArray = [];

    for (let i = 0; i < this.size; i++) {
      tempArray.push(0);
    }

    for (let i = 0; i < this.size; i++) {
      this.array.push([...tempArray]);
    }
  }

  mergeTokensUp(x, yTop, yBottom) {
    this.array[yBottom][x] = 0;
    this.array[yTop][x] = this.array[yTop][x] * 2;
    score += this.array[yTop][x];

    movement.xOrigin.push(x);
    movement.yOrigin.push(yBottom);
    movement.xDestination.push(x);
    movement.yDestination.push(yTop);
    movement.merge.push(true);
  }

  moveTokenUp(x, yTop, yBottom) {
    this.array[yTop][x] = this.array[yBottom][x];
    this.array[yBottom][x] = 0;

    movement.xOrigin.push(x);
    movement.yOrigin.push(yBottom);
    movement.xDestination.push(x);
    movement.yDestination.push(yTop);
    movement.merge.push(false);
  }

  findMoveTokensUp() {
    clearMovements();
    for (let x = 0; x < this.size; x++) {
      for (let yTop = 0; yTop < this.size; yTop++) {
        for (let yBottom = yTop + 1; yBottom < this.size; yBottom++) {
          if (this.array[yTop][x] != 0) {
            break;
          }
          if (this.array[yBottom][x] != 0) {
            this.moveTokenUp(x, yTop, yBottom);
            break;
          }
        }
      }
    }
  }

  // if this function is called with checkGameStatus == true it returns
  // true if a merge is possible
  findMergeTokensUp(checkGameStatus = false) {
    clearMovements();
    // check if tokens can be merged
    for (let x = 0; x < this.size; x++) {
      for (let yTop = 0; yTop < this.size; yTop++) {
        for (let yBottom = yTop + 1; yBottom < this.size; yBottom++) {
          if (this.array[yTop][x] == 0) {
            break;
          }

          if (this.array[yBottom][x] == 0) {
            continue;
          }

          if (this.array[yBottom][x] != this.array[yTop][x]) {
            break;
          }

          if (checkGameStatus) {
            return true;
          } else {
            this.mergeTokensUp(x, yTop, yBottom);
            break;
          }
        }
      }
    }
    return false;
  }

  mergeTokensDown(x, yTop, yBottom) {
    this.array[yTop][x] = 0;
    this.array[yBottom][x] = this.array[yBottom][x] * 2;
    score += this.array[yBottom][x];

    movement.xOrigin.push(x);
    movement.yOrigin.push(yTop);
    movement.xDestination.push(x);
    movement.yDestination.push(yBottom);
    movement.merge.push(true);
  }

  moveTokenDown(x, yTop, yBottom) {
    this.array[yBottom][x] = this.array[yTop][x];
    this.array[yTop][x] = 0;

    movement.xOrigin.push(x);
    movement.yOrigin.push(yTop);
    movement.xDestination.push(x);
    movement.yDestination.push(yBottom);
    movement.merge.push(false);
  }

  findMoveTokensDown() {
    clearMovements();
    for (let x = 0; x < this.size; x++) {
      for (let yBottom = this.size - 1; yBottom >= 0; yBottom--) {
        for (let yTop = yBottom - 1; yTop >= 0; yTop--) {
          if (this.array[yBottom][x] != 0) {
            break;
          }
          if (this.array[yTop][x] != 0) {
            this.moveTokenDown(x, yTop, yBottom);
            break;
          }
        }
      }
    }
  }

  findMergeTokensDown(checkGameStatus = false) {
    clearMovements();
    // check if tokens can be merged
    for (let x = 0; x < this.size; x++) {
      for (let yBottom = this.size - 1; yBottom >= 0; yBottom--) {
        for (let yTop = yBottom - 1; yTop >= 0; yTop--) {
          if (this.array[yBottom][x] == 0) {
            break;
          }

          if (this.array[yTop][x] == 0) {
            continue;
          }

          if (this.array[yBottom][x] != this.array[yTop][x]) {
            break;
          }
          if (checkGameStatus) {
            return true;
          } else {
            this.mergeTokensDown(x, yTop, yBottom);
            break;
          }
        }
      }
    }
    return false;
  }

  mergeTokensLeft(y, xLeft, xRight) {
    this.array[y][xRight] = 0;
    this.array[y][xLeft] = this.array[y][xLeft] * 2;
    score += this.array[y][xLeft];

    movement.xOrigin.push(xRight);
    movement.yOrigin.push(y);
    movement.xDestination.push(xLeft);
    movement.yDestination.push(y);
    movement.merge.push(true);
  }

  moveTokenLeft(y, xLeft, xRight) {
    this.array[y][xLeft] = this.array[y][xRight];
    this.array[y][xRight] = 0;

    movement.xOrigin.push(xRight);
    movement.yOrigin.push(y);
    movement.xDestination.push(xLeft);
    movement.yDestination.push(y);
    movement.merge.push(false);
  }

  findMoveTokensLeft() {
    clearMovements();
    for (let y = 0; y < this.size; y++) {
      for (let xLeft = 0; xLeft < this.size; xLeft++) {
        for (let xRight = xLeft + 1; xRight < this.size; xRight++) {
          if (this.array[y][xLeft] != 0) {
            break;
          }
          if (this.array[y][xRight] != 0) {
            this.moveTokenLeft(y, xLeft, xRight);
            break;
          }
        }
      }
    }
  }

  findMergeTokensLeft(checkGameStatus = false) {
    clearMovements();
    // check if tokens can be merged
    for (let y = 0; y < this.size; y++) {
      for (let xLeft = 0; xLeft < this.size; xLeft++) {
        for (let xRight = xLeft + 1; xRight < this.size; xRight++) {
          if (this.array[y][xLeft] == 0) {
            break;
          }

          if (this.array[y][xRight] == 0) {
            continue;
          }

          if (this.array[y][xRight] != this.array[y][xLeft]) {
            break;
          }

          if (checkGameStatus) {
            return true;
          } else {
            this.mergeTokensLeft(y, xLeft, xRight);
            break;
          }
        }
      }
    }
    return false;
  }

  mergeTokensRight(y, xLeft, xRight) {
    this.array[y][xLeft] = 0;
    this.array[y][xRight] = this.array[y][xRight] * 2;
    score += this.array[y][xRight];

    movement.xOrigin.push(xLeft);
    movement.yOrigin.push(y);
    movement.xDestination.push(xRight);
    movement.yDestination.push(y);
    movement.merge.push(true);
  }

  moveTokenRight(y, xLeft, xRight) {
    this.array[y][xRight] = this.array[y][xLeft];
    this.array[y][xLeft] = 0;

    movement.xOrigin.push(xLeft);
    movement.yOrigin.push(y);
    movement.xDestination.push(xRight);
    movement.yDestination.push(y);
    movement.merge.push(false);
  }

  findMoveTokensRight() {
    clearMovements();
    for (let y = 0; y < this.size; y++) {
      for (let xRight = this.size - 1; xRight >= 0; xRight--) {
        for (let xLeft = xRight - 1; xLeft >= 0; xLeft--) {
          if (this.array[y][xRight] != 0) {
            break;
          }
          if (this.array[y][xLeft] != 0) {
            this.moveTokenRight(y, xLeft, xRight);
            break;
          }
        }
      }
    }
  }

  findMergeTokensRight(checkGameStatus = false) {
    clearMovements();
    // check if tokens can be merged
    for (let y = 0; y < this.size; y++) {
      for (let xRight = this.size - 1; xRight >= 0; xRight--) {
        for (let xLeft = xRight - 1; xLeft >= 0; xLeft--) {
          if (this.array[y][xRight] == 0) {
            break;
          }

          if (this.array[y][xLeft] == 0) {
            continue;
          }

          if (this.array[y][xRight] != this.array[y][xLeft]) {
            break;
          }
          if (checkGameStatus) {
            return true;
          } else {
            this.mergeTokensRight(y, xLeft, xRight);
            break;
          }
        }
      }
    }
    return false;
  }

  createTokenCoordinates() {
    let yCoordinate;
    let xCoordinate;

    do {
      let index = Math.round(Math.random() * (this.size * this.size - 1));
      yCoordinate = Math.floor(index / this.size);
      xCoordinate = index % this.size;
    } while (this.array[yCoordinate][xCoordinate] != 0);

    this.array[yCoordinate][xCoordinate] = 2;

    return [yCoordinate, xCoordinate];
  }

  checkGameOver() {
    let gridFull = true;
    for (let i = 0; i < sizeHelper + 3; i++) {
      const result = this.array[i].find(value => value == 0);
      if (result == 0) {
        gridFull = false;
        break;
      }
    }
    if (!gridFull) {
      return;
    }
    if (this.findMergeTokensUp(true)) return;
    if (this.findMergeTokensDown(true)) return;
    if (this.findMergeTokensLeft(true)) return;
    if (this.findMergeTokensRight(true)) return;
    console.log("Game Over!!!!");
  }
}

const chooseLeft = () => {
  if (sizeHelper == 0) {
    sizeHelper = 4;
  }
  chooseGameAreaSizeImg.src = chooseGameAreaSize[--sizeHelper];
  sizeText.innerHTML = `${sizeTextArray[sizeHelper]}`;
};
const chooseRight = () => {
  if (sizeHelper == 3) {
    sizeHelper = -1;
  }
  chooseGameAreaSizeImg.src = chooseGameAreaSize[++sizeHelper];
  sizeText.innerHTML = `${sizeTextArray[sizeHelper]}`;
};

const backToChooseSize = () => {
  document.getElementsByClassName(
    "score-and-buttons-container"
  )[0].style.display = "none";
  document.getElementsByClassName("game-area")[0].style.display = "none";
  document.getElementsByClassName(
    "choose-game-area-container"
  )[0].style.display = "grid";
  score = 0;
  score_value.innerHTML = "0";
};

const chooseSize = () => {
  document.getElementsByClassName(
    "choose-game-area-container"
  )[0].style.display = "none";

  document.getElementsByClassName(
    "score-and-buttons-container"
  )[0].style.display = "grid";

  token_side_length =
    (295 - grid_gap_width * (sizeHelper + 2)) / (sizeHelper + 3);

  start_game();
};

const showHelp = () => {
  let how_to_play_box = document.getElementById("how-to-play-box");
  let help = document.getElementById("help");
  how_to_play_box.style.display = "block";
  help.style.display = "none";
};
const closeHelp = () => {
  let how_to_play_box = document.getElementById("how-to-play-box");
  let help = document.getElementById("help");
  how_to_play_box.style.display = "none";
  help.style.display = "block";
};

const disableBackButton = () => {
  let undo_button = document.getElementById("undo-last-move");
  undo_button.disabled = true;
  undo_button.style.cssText = `color: #a9a9a9; background-color: #ededed`;
};

const enableBackButton = () => {
  let undo_button = document.getElementById("undo-last-move");
  undo_button.disabled = false;
  undo_button.style.cssText = `color: #525252; background-color: #fdfbc1`;
};

disableBackButton();

const initializeGameArea = () => {
  let scale_string = "";
  for (let i = 0; i < sizeHelper + 3; i++) {
    scale_string += "1fr ";
  }

  let game_area_side_length =
    grid.size * token_side_length + (grid.size - 1) * grid_gap_width;

  game_area_side_length = `295`;

  let game_area = document.querySelector(".game-area");
  game_area.style.display = "grid";
  game_area.style.width = `${game_area_side_length}px`;
  game_area.style.height = `${game_area_side_length}px`;
  game_area.style.gridTemplateRows = scale_string;
  game_area.style.gridTemplateColumns = scale_string;

  for (let i = 0; i < (sizeHelper + 3) * (sizeHelper + 3); i++) {
    let game_field = document.createElement("div");
    game_field.style.cssText = `background-color: #4d4d4d; border-radius: 5px;`;
    game_field.className = "background-tile";
    game_area.appendChild(game_field);
  }
};

const createNewToken = (coordinates, value = 2) => {
  let game_area = document.getElementsByClassName("game-area")[0];
  let token = document.createElement("div");
  let tokenNumber = document.createElement("p");

  let left = coordinates[1] * (token_side_length + grid_gap_width);
  let top = coordinates[0] * (token_side_length + grid_gap_width);

  let colorHelper = "#665c52";
  if (value > 4) {
    colorHelper = "#fcfefd";
  }

  token.style.cssText = `position: absolute; top: ${top}px; left: ${left}px ;color: ${colorHelper}; background-color: ${colorObject[value]}; border-radius: 5px; width: ${token_side_length}px; height: ${token_side_length}px; line-height: ${token_side_length}px; text-align: center; font-size: 20pt`;
  token.innerHTML = value;
  token.className = "tokens";
  token.id = `${coordinates[0]}-${coordinates[1]}`;

  // tokenNumber.innerHTML = value;
  // tokenNumber.id = "token-number";
  // tokenNumber.style.cssText = ``;

  // token.appendChild(tokenNumber);
  game_area.appendChild(token);
};

const start_game = () => {
  let tokens = document.querySelectorAll(".tokens");
  if (tokens.length != 0) {
    for (let i = 0; i < tokens.length; i++) {
      tokens[i].remove();
    }
  }
  let background_tile = document.querySelectorAll(".background-tile");
  if (tokens.length != 0) {
    for (let i = 0; i < background_tile.length; i++) {
      background_tile[i].remove();
    }
  }

  score = 0;
  score_value.innerHTML = "0";

  disableBackButton();

  grid = new MyGrid(sizeHelper + 3);
  grid.initialize();

  let token_1 = grid.createTokenCoordinates();
  let token_2 = grid.createTokenCoordinates();

  initializeGameArea();
  createNewToken(token_1);
  createNewToken(token_2);

  document.addEventListener("keydown", event => {
    const keyName = event.key;
    check_key(keyName);
  });
};

// use changes of logical grid to update HTML,
// move tokens left and merge if possible
const updateHtmlUp = () => {
  score_value.innerHTML = score;
  const numberOfMovements = movement.xOrigin.length;
  let promiseArray = [];

  for (let i = 0; i < numberOfMovements; i++) {
    let promise = new Promise(function(resolve, reject) {
      let token = document.getElementById(
        `${movement.yOrigin[i]}-${movement.xOrigin[i]}`
      );

      //token.style.zIndex = "1"; // TODO: is this necessary???

      const requestedMoveDistance =
        (movement.yOrigin[i] - movement.yDestination[i]) *
        (token_side_length + grid_gap_width);
      let actualMoveDistance = 0;
      let token_style_top = token.style.top;

      const topStart = parseInt(token_style_top, 10);

      let id = setInterval(move, animation_move_interval);
      function move() {
        if (actualMoveDistance >= requestedMoveDistance) {
          clearInterval(id);
          if (movement.merge[i]) {
            // merge tokens
            let tokenDestination = document.getElementById(
              `${movement.yDestination[i]}-${movement.xDestination[i]}`
            );
            tokenDestination.innerHTML *= 2;
            tokenDestination.style.backgroundColor =
              colorObject[tokenDestination.innerHTML];
            if (tokenDestination.innerHTML == 8) {
              tokenDestination.style.color = `#fcfefd`;
            }
            token.remove();
          } else {
            // set new ID for token after move
            token.id = `${movement.yDestination[i]}-${movement.xDestination[i]}`;
          }
          resolve();
        } else {
          // animate token move
          actualMoveDistance += animation_move_distance;
          let temp = topStart - actualMoveDistance;
          token.style.top = temp + "px";
        }
      }
    });
    promiseArray.push(promise);
  }
  return promiseArray;
};

// use changes of logical grid to update HTML,
// move tokens left and merge if possible
const updateHtmlDown = () => {
  score_value.innerHTML = score;
  const numberOfMovements = movement.xOrigin.length;
  let promiseArray = [];

  for (let i = 0; i < numberOfMovements; i++) {
    let promise = new Promise(function(resolve, reject) {
      let token = document.getElementById(
        `${movement.yOrigin[i]}-${movement.xOrigin[i]}`
      );

      token.style.zIndex = "1"; // TODO: is this necessary???

      const requestedMoveDistance =
        (movement.yOrigin[i] - movement.yDestination[i]) *
        (token_side_length + grid_gap_width) *
        -1;
      let actualMoveDistance = 0;
      let token_style_top = token.style.top;

      const topStart = parseInt(token_style_top, 10);

      let id = setInterval(move, animation_move_interval);
      function move() {
        if (actualMoveDistance >= requestedMoveDistance) {
          clearInterval(id);
          if (movement.merge[i]) {
            // merge tokens
            let tokenDestination = document.getElementById(
              `${movement.yDestination[i]}-${movement.xDestination[i]}`
            );
            tokenDestination.innerHTML *= 2;
            if (tokenDestination.innerHTML == 8) {
              tokenDestination.style.color = `#fcfefd`;
            }
            tokenDestination.style.backgroundColor =
              colorObject[tokenDestination.innerHTML];
            token.remove();
          } else {
            // set new ID for token after move
            token.id = `${movement.yDestination[i]}-${movement.xDestination[i]}`;
          }
          resolve();
        } else {
          // animate token move
          actualMoveDistance += animation_move_distance;
          let temp = topStart + actualMoveDistance;
          token.style.top = temp + "px";
        }
      }
    });
    promiseArray.push(promise);
  }
  return promiseArray;
};

// use changes of logical grid to update HTML,
// move tokens left and merge if possible
const updateHtmlLeft = () => {
  score_value.innerHTML = score;
  const numberOfMovements = movement.xOrigin.length;
  let promiseArray = [];

  for (let i = 0; i < numberOfMovements; i++) {
    let promise = new Promise(function(resolve, reject) {
      let token = document.getElementById(
        `${movement.yOrigin[i]}-${movement.xOrigin[i]}`
      );

      token.style.zIndex = "1"; // TODO: is this necessary???

      const requestedMoveDistance =
        (movement.xOrigin[i] - movement.xDestination[i]) *
        (token_side_length + grid_gap_width);
      let actualMoveDistance = 0;
      let token_style_left = token.style.left;

      const leftStart = parseInt(token_style_left, 10);

      let id = setInterval(move, animation_move_interval);
      function move() {
        if (actualMoveDistance >= requestedMoveDistance) {
          clearInterval(id);
          if (movement.merge[i]) {
            // merge tokens
            let tokenDestination = document.getElementById(
              `${movement.yDestination[i]}-${movement.xDestination[i]}`
            );
            tokenDestination.innerHTML *= 2;
            if (tokenDestination.innerHTML == 8) {
              tokenDestination.style.color = `#fcfefd`;
            }
            tokenDestination.style.backgroundColor =
              colorObject[tokenDestination.innerHTML];
            token.remove();
          } else {
            // set new ID for token after move
            token.id = `${movement.yDestination[i]}-${movement.xDestination[i]}`;
          }
          resolve();
        } else {
          // animate token move
          actualMoveDistance += animation_move_distance;
          let temp = leftStart - actualMoveDistance;
          token.style.left = temp + "px";
        }
      }
    });
    promiseArray.push(promise);
  }
  return promiseArray;
};

// use changes of logical grid to update HTML,
// move tokens right and merge if possible
const updateHtmlRight = () => {
  score_value.innerHTML = score;
  const numberOfMovements = movement.xOrigin.length;
  let promiseArray = [];

  for (let i = 0; i < numberOfMovements; i++) {
    let promise = new Promise(function(resolve, reject) {
      let token = document.getElementById(
        `${movement.yOrigin[i]}-${movement.xOrigin[i]}`
      );
      token.style.zIndex = "1"; // TODO: is this necessary???

      const requestedMoveDistance =
        (movement.xOrigin[i] - movement.xDestination[i]) *
        (token_side_length + grid_gap_width) *
        -1;
      let actualMoveDistance = 0;
      let token_style_left = token.style.left;

      const leftStart = parseInt(token_style_left, 10);

      let id = setInterval(move, animation_move_interval);
      function move() {
        if (actualMoveDistance >= requestedMoveDistance) {
          clearInterval(id);
          if (movement.merge[i]) {
            // merge tokens
            let tokenDestination = document.getElementById(
              `${movement.yDestination[i]}-${movement.xDestination[i]}`
            );
            tokenDestination.innerHTML *= 2;
            if (tokenDestination.innerHTML == 8) {
              tokenDestination.style.color = `#fcfefd`;
            }
            tokenDestination.style.backgroundColor =
              colorObject[tokenDestination.innerHTML];
            token.remove();
          } else {
            // set new ID for token after move
            token.id = `${movement.yDestination[i]}-${movement.xDestination[i]}`;
          }
          resolve();
        } else {
          // animate token move
          actualMoveDistance += animation_move_distance;
          let temp = leftStart + actualMoveDistance;
          token.style.left = temp + "px";
        }
      }
    });
    promiseArray.push(promise);
  }
  return promiseArray;
};

const deepCopy = array => {
  let outputArray = [];
  for (let i = 0; i < array.length; i++) {
    outputArray[i] = [...array[i]];
  }
  return outputArray;
};

const undoLastMove = () => {
  if (busy) return;
  let tokens = document.querySelectorAll(".tokens");

  for (let i = 0; i < tokens.length; i++) {
    tokens[i].remove();
  }

  for (let y = 0; y < sizeHelper + 3; y++) {
    for (let x = 0; x < sizeHelper + 3; x++) {
      if (grid.backupArray[y][x] != 0) {
        createNewToken([y, x], grid.backupArray[y][x]);
      }
    }
  }

  grid.array = deepCopy(grid.backupArray);
  score_value.innerHTML = score_backup;
  score = score_backup;
  disableBackButton();
};

const check_key = keyName => {
  if (keyName === "ArrowUp") {
    console.log("---------- up ----------");

    if (busy) return;
    busy = true;
    // create backup before first change to logical grid
    let tempBackupArray = deepCopy(grid.array);
    score_backup = score;

    grid.findMergeTokensUp();
    let promiseArray = updateHtmlUp();
    let numberOfMoves = movement.xDestination.length;
    Promise.all(promiseArray)
      .then(() => {
        grid.findMoveTokensUp();
        let promiseArray2 = updateHtmlUp();
        numberOfMoves += movement.xDestination.length;

        Promise.all(promiseArray2).then(() => {
          if (numberOfMoves > 0) {
            grid.backupArray = deepCopy(tempBackupArray);
            let token = grid.createTokenCoordinates();
            setTimeout(() => {
              createNewToken(token);
              busy = false;
              enableBackButton();
              grid.checkGameOver();
            }, token_spawn_delay);
          } else {
            busy = false;
            enableBackButton();
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  } else if (keyName === "ArrowDown") {
    console.log("---------- down ----------");

    if (busy) return;
    busy = true;
    // create backup before first change to logical grid
    let tempBackupArray = deepCopy(grid.array);
    score_backup = score;

    grid.findMergeTokensDown();
    let promiseArray = updateHtmlDown();
    let numberOfMoves = movement.xDestination.length;
    Promise.all(promiseArray)
      .then(() => {
        grid.findMoveTokensDown();
        let promiseArray2 = updateHtmlDown();
        numberOfMoves += movement.xDestination.length;

        Promise.all(promiseArray2).then(() => {
          if (numberOfMoves > 0) {
            grid.backupArray = deepCopy(tempBackupArray);
            let token = grid.createTokenCoordinates();
            setTimeout(() => {
              createNewToken(token);
              busy = false;
              enableBackButton();
              grid.checkGameOver();
            }, token_spawn_delay);
          } else {
            busy = false;
            enableBackButton();
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  } else if (keyName === "ArrowLeft") {
    console.log("---------- left ----------");

    if (busy) return;
    busy = true;
    // create backup before first change to logical grid
    let tempBackupArray = deepCopy(grid.array);
    score_backup = score;

    grid.findMergeTokensLeft();
    let promiseArray = updateHtmlLeft();
    let numberOfMoves = movement.xDestination.length;
    Promise.all(promiseArray)
      .then(() => {
        grid.findMoveTokensLeft();
        let promiseArray2 = updateHtmlLeft();
        numberOfMoves += movement.xDestination.length;

        Promise.all(promiseArray2).then(() => {
          if (numberOfMoves > 0) {
            grid.backupArray = deepCopy(tempBackupArray);
            let token = grid.createTokenCoordinates();
            setTimeout(() => {
              createNewToken(token);
              busy = false;
              enableBackButton();
              grid.checkGameOver();
            }, token_spawn_delay);
          } else {
            busy = false;
            enableBackButton();
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  } else if (keyName === "ArrowRight") {
    console.log("---------- right ----------");

    if (busy) return;
    busy = true;
    // create backup before first change to logical grid
    let tempBackupArray = deepCopy(grid.array);
    score_backup = score;

    grid.findMergeTokensRight();
    let promiseArray = updateHtmlRight();
    let numberOfMoves = movement.xDestination.length;
    Promise.all(promiseArray)
      .then(() => {
        grid.findMoveTokensRight();
        let promiseArray2 = updateHtmlRight();
        numberOfMoves += movement.xDestination.length;

        Promise.all(promiseArray2).then(() => {
          if (numberOfMoves > 0) {
            grid.backupArray = deepCopy(tempBackupArray);
            let token = grid.createTokenCoordinates();
            setTimeout(() => {
              createNewToken(token);
              busy = false;
              enableBackButton();
              grid.checkGameOver();
            }, token_spawn_delay);
          } else {
            busy = false;
            enableBackButton();
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
