// global variables
let sideLength;
let grid;
const token_side_length = 70; // side length in pixels
const grid_gap_width = 5; // in pixels
let score = 0;
let score_backup;
let score_value = document.getElementById("score-value");
let busy = false;

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

    this.array3 = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.array4 = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    this.array5 = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];
    this.array6 = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];

    if (this.size == 3) {
      this.array = this.array3;
    } else if (this.size == 4) {
      this.array = this.array4;
    } else if (this.size == 5) {
      this.array = this.array5;
    } else if (this.size == 6) {
      this.array = this.array6;
    }

    // backupArray for undo function
    this.backupArray = [];
  }
  // initialize() {
  //   // for (let y = 0; y < this.size; y++) {
  //   //   for (let x = 0; x < this.size; x++) {
  //   //     this.array[y][x] = 0;
  //   //   }
  //   // }

  //   let tempArray = [];

  //   for (let i = 0; i < this.size; i++) {
  //     tempArray.push(0);
  //     // tempArray[i] = 0;
  //   }

  //   for (let i = 0; i < this.size; i++) {
  //     // this.array.push(tempArray);
  //     this.array[i] = [];
  //     this.array[i] = tempArray;
  //   }
  // }

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

  findMergeTokensUp() {
    clearMovements();
    // check if tokens can be merged
    // TODO: only first match gets merged
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

          this.mergeTokensUp(x, yTop, yBottom);
          break;
        }
      }
    }
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

  findMergeTokensDown() {
    clearMovements();
    // check if tokens can be merged
    // TODO: only first match gets merged
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

          this.mergeTokensDown(x, yTop, yBottom);
          break;
        }
      }
    }
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

  findMergeTokensLeft() {
    clearMovements();
    // check if tokens can be merged
    // TODO: only first match gets merged
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

          this.mergeTokensLeft(y, xLeft, xRight);
          break;
        }
      }
    }
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

  findMergeTokensRight() {
    clearMovements();
    // check if tokens can be merged
    // TODO: only first match gets merged
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

          this.mergeTokensRight(y, xLeft, xRight);
          break;
        }
      }
    }
  }

  createNewToken() {
    let yCoordinate;
    let xCoordinate;

    do {
      // let index = Math.floor(
      //   Math.random() * (this.size * this.size - 1 - 0) + 0
      // );

      let index = Math.round(Math.random() * (this.size * this.size - 1));
      yCoordinate = Math.floor(index / this.size);
      xCoordinate = index % this.size;
    } while (this.array[yCoordinate][xCoordinate] != 0);

    this.array[yCoordinate][xCoordinate] = 2;

    return [yCoordinate, xCoordinate];
  }
}

const initializeGameArea = () => {
  let scale_string = "";
  for (let i = 0; i < sideLength; i++) {
    scale_string += "1fr ";
  }

  const game_area_side_length =
    grid.size * token_side_length + (grid.size - 1) * grid_gap_width;
  const string_side_length = `width: ${game_area_side_length}px; height: ${game_area_side_length}px`;

  let game_area = document.getElementsByClassName("game-area")[0];
  game_area.style.cssText = string_side_length;
  game_area.style.gridTemplateRows = scale_string;
  game_area.style.gridTemplateColumns = scale_string;

  for (let i = 0; i < sideLength * sideLength; i++) {
    let game_field = document.createElement("div");
    game_field.style.cssText = "background-color: #4d4d4d; border-radius: 5px;";
    game_field.className = "background-tile";
    game_area.appendChild(game_field);
  }
};

const createNewToken = (coordinates, value = 2) => {
  let game_area = document.getElementsByClassName("game-area")[0];
  let token = document.createElement("div");

  let left = coordinates[1] * (token_side_length + grid_gap_width);
  let top = coordinates[0] * (token_side_length + grid_gap_width);

  token.style.cssText = `position: absolute; top: ${top}px; left: ${left}px ;background-color: #efefef; border-radius: 5px; width: ${token_side_length}px; height: ${token_side_length}px`;
  token.innerHTML = value;
  token.className = "tokens";
  token.id = `${coordinates[0]}-${coordinates[1]}`;
  game_area.appendChild(token);
};

const start_game = () => {
  // grid.initialize();

  sideLength = document.getElementById("side-length").value;

  grid = new MyGrid(sideLength);

  let token_1 = grid.createNewToken();
  let token_2 = grid.createNewToken();
  // let token_3 = grid.createNewToken();
  // let token_4 = grid.createNewToken();
  initializeGameArea();
  createNewToken(token_1);
  createNewToken(token_2);
  // createNewToken(token_3);
  // createNewToken(token_4);
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

      token.style.zIndex = "1"; // TODO: is this necessary???

      const requestedMoveDistance =
        (movement.yOrigin[i] - movement.yDestination[i]) *
        (token_side_length + grid_gap_width);
      let actualMoveDistance = 0;
      let token_style_top = token.style.top;

      const topStart = parseInt(token_style_top, 10);

      let id = setInterval(move, 10);
      function move() {
        if (actualMoveDistance >= requestedMoveDistance) {
          clearInterval(id);
          if (movement.merge[i]) {
            // merge tokens
            let tokenDestination = document.getElementById(
              `${movement.yDestination[i]}-${movement.xDestination[i]}`
            );
            tokenDestination.innerHTML *= 2;
            token.remove();
          } else {
            // set new ID for token after move
            token.id = `${movement.yDestination[i]}-${movement.xDestination[i]}`;
          }
          resolve();
        } else {
          // animate token move
          actualMoveDistance += 5;
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

      let id = setInterval(move, 10);
      function move() {
        if (actualMoveDistance >= requestedMoveDistance) {
          clearInterval(id);
          if (movement.merge[i]) {
            // merge tokens
            let tokenDestination = document.getElementById(
              `${movement.yDestination[i]}-${movement.xDestination[i]}`
            );
            tokenDestination.innerHTML *= 2;
            token.remove();
          } else {
            // set new ID for token after move
            token.id = `${movement.yDestination[i]}-${movement.xDestination[i]}`;
          }
          resolve();
        } else {
          // animate token move
          actualMoveDistance += 5;
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
      console.log(`${movement.yOrigin[i]}-${movement.xOrigin[i]}`);

      token.style.zIndex = "1"; // TODO: is this necessary???

      const requestedMoveDistance =
        (movement.xOrigin[i] - movement.xDestination[i]) *
        (token_side_length + grid_gap_width);
      let actualMoveDistance = 0;
      let token_style_left = token.style.left;

      const leftStart = parseInt(token_style_left, 10);

      let id = setInterval(move, 10);
      function move() {
        if (actualMoveDistance >= requestedMoveDistance) {
          clearInterval(id);
          if (movement.merge[i]) {
            // merge tokens
            let tokenDestination = document.getElementById(
              `${movement.yDestination[i]}-${movement.xDestination[i]}`
            );
            tokenDestination.innerHTML *= 2;
            token.remove();
          } else {
            // set new ID for token after move
            token.id = `${movement.yDestination[i]}-${movement.xDestination[i]}`;
          }
          resolve();
        } else {
          // animate token move
          actualMoveDistance += 5;
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

      let id = setInterval(move, 10);
      function move() {
        if (actualMoveDistance >= requestedMoveDistance) {
          clearInterval(id);
          if (movement.merge[i]) {
            // merge tokens
            let tokenDestination = document.getElementById(
              `${movement.yDestination[i]}-${movement.xDestination[i]}`
            );
            tokenDestination.innerHTML *= 2;
            token.remove();
          } else {
            // set new ID for token after move
            token.id = `${movement.yDestination[i]}-${movement.xDestination[i]}`;
          }
          resolve();
        } else {
          // animate token move
          actualMoveDistance += 5;
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
  let tokens = document.querySelectorAll(".tokens");

  for (let i = 0; i < tokens.length; i++) {
    tokens[i].remove();
  }

  for (let y = 0; y < sideLength; y++) {
    for (let x = 0; x < sideLength; x++) {
      if (grid.backupArray[y][x] != 0) {
        createNewToken([y, x], grid.backupArray[y][x]);
      }
    }
  }

  grid.array = deepCopy(grid.backupArray);
  score_value.innerHTML = score_backup;
  score = score_backup;
};

const check_key = keyName => {
  if (keyName === "ArrowUp") {
    console.log("---------- up ----------");

    if (busy) return;
    busy = true;
    // create backup before first change to logical grid
    grid.backupArray = deepCopy(grid.array);
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
            let token = grid.createNewToken();
            setTimeout(() => {
              createNewToken(token);
              busy = false;
            }, 200);
          } else {
            busy = false;
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
    grid.backupArray = deepCopy(grid.array);
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
            let token = grid.createNewToken();
            setTimeout(() => {
              createNewToken(token);
              busy = false;
            }, 200);
          } else {
            busy = false;
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
    grid.backupArray = deepCopy(grid.array);
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
            let token = grid.createNewToken();
            setTimeout(() => {
              createNewToken(token);
              busy = false;
            }, 200);
          } else {
            busy = false;
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
    grid.backupArray = deepCopy(grid.array);
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
            let token = grid.createNewToken();
            setTimeout(() => {
              createNewToken(token);
              busy = false;
            }, 200);
          } else {
            busy = false;
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
};

document.addEventListener("keydown", event => {
  const keyName = event.key;
  check_key(keyName);
});
