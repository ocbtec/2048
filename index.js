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

  mergeTokensLeft(y, xLeft, xRight) {
    this.array[y][xRight] = 0;
    this.array[y][xLeft] = this.array[y][xLeft] * 2;

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
          if (this.array[y][xLeft] == this.array[y][xRight]) {
            this.mergeTokensLeft(y, xLeft, xRight);
            if (xRight != this.size - 1) {
              xLeft = xRight + 1;
            }
            break;
          }
        }
      }
    }
  }

  findMergeTokensRight() {
    clearMovements();
  }
  findMergeTokensUp() {
    clearMovements();
  }
  findMergeTokensDown() {
    clearMovements();
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
    console.log(yCoordinate, xCoordinate);

    return [yCoordinate, xCoordinate];
  }
}

// global variables
let sideLength;
let grid;

const token_side_length = 70; // side length in pixels
const grid_gap_width = 5; // in pixels

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

const createNewToken = coordinates => {
  let game_area = document.getElementsByClassName("game-area")[0];
  let token = document.createElement("div");

  let left = coordinates[1] * (token_side_length + grid_gap_width);
  let top = coordinates[0] * (token_side_length + grid_gap_width);

  token.style.cssText = `position: absolute; top: ${top}px; left: ${left}px ;background-color: #efefef; border-radius: 5px; width: ${token_side_length}px; height: ${token_side_length}px`;
  token.innerHTML = "2";
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
const updateHtmlLeft = () => {
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

const deepCopy = array => {
  let outputArray = [];
  for (let i = 0; i < array.length; i++) {
    outputArray[i] = [...array[i]];
  }
  return outputArray;
};

const undoLastMove = () => {
  let tokens = document.querySelectorAll(".tokens");
  // let tokens2 = document.getElementsByClassName("tokens");
  // console.log(tokens2);
  // console.log(tokens);

  for (let i = 0; i < tokens.length; i++) {
    tokens[i].remove();
  }
  console.log(grid.backupArray);

  for (let y = 0; y < sideLength; y++) {
    for (let x = 0; x < sideLength; x++) {
      if (grid.backupArray[y][x] != 0) {
        createNewToken([y, x]);
      }
    }
  }
};

const check_key = keyName => {
  if (keyName === "ArrowUp") {
    console.log("---------- up ----------");
  } else if (keyName === "ArrowDown") {
    console.log("---------- down ----------");
  } else if (keyName === "ArrowLeft") {
    console.log("---------- left ----------");

    // create backup before first change to logical grid
    console.log(grid.backupArray);

    grid.backupArray = deepCopy(grid.array);

    console.log(grid.backupArray);

    grid.findMergeTokensLeft();
    let promiseArray = updateHtmlLeft();
    let numberOfMoves = movement.xDestination.length;
    Promise.all(promiseArray)
      .then(() => {
        grid.findMoveTokensLeft();
        let promiseArray2 = updateHtmlLeft();
        numberOfMoves += movement.xDestination.length;

        Promise.all(promiseArray2).then(() => {
          let token = grid.createNewToken();
          if (numberOfMoves > 0) {
            setTimeout(() => {
              createNewToken(token);
            }, 200);
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  } else if (keyName === "ArrowRight") {
    console.log("---------- right ----------");
  }
};

document.addEventListener("keydown", event => {
  const keyName = event.key;
  check_key(keyName);
});
