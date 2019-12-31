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

    console.log(movement);
  }
  buttonLeft() {
    clearMovements();
    let count = 0;
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

  buttonRight() {
    clearMovements();
  }
  buttonUp() {
    clearMovements();
  }
  buttonDown() {
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

let userInput = 3;
const token_side_length = 70; // side length in pixels
const grid_gap_width = 5; // in pixels

const initializeGameArea = () => {
  let scale_string = "";
  for (let i = 0; i < userInput; i++) {
    scale_string += "1fr ";
  }

  const game_area_side_length =
    grid.size * token_side_length + (grid.size - 1) * grid_gap_width;
  const string_side_length = `width: ${game_area_side_length}px; height: ${game_area_side_length}px`;

  let game_area = document.getElementsByClassName("game-area")[0];
  game_area.style.cssText = string_side_length;
  game_area.style.gridTemplateRows = scale_string;
  game_area.style.gridTemplateColumns = scale_string;

  for (let i = 0; i < userInput * userInput; i++) {
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
  token.id = `${coordinates[0]}-${coordinates[1]}`;
  game_area.appendChild(token);
};

let grid = new MyGrid(userInput);

const start_game = () => {
  // grid.initialize();
  let token_1 = grid.createNewToken();
  let token_2 = grid.createNewToken();
  initializeGameArea();
  createNewToken(token_1);
  createNewToken(token_2);
};

const moveLeft = () => {
  const numberOfMovements = movement.xOrigin.length;

  let token = document.getElementById(
    `${movement.yOrigin}-${movement.xOrigin}`
  );
  token.style.cssText += `position: absolute;`;

  const requestedMoveDistance =
    (movement.xOrigin - movement.xDestination) *
    (token_side_length + grid_gap_width);
  let actualMoveDistance = 0;
  const token_style_right = token.style.right;
  console.log(token_style_right);

  let id = setInterval(frame, 10);
  function frame() {
    if (actualMoveDistance == requestedMoveDistance) {
      clearInterval(id);
    } else {
      actualMoveDistance++;
      token.style.right = actualMoveDistance + "px";
    }
  }

  setTimeout(() => {
    if (movement.merge) {
      let tokenDestination = document.getElementById(
        `${movement.yDestination}-${movement.xDestination}`
      );
      tokenDestination.innerHTML *= 2;
      token.remove();
    }
  }, 2500);
};

const check_key = keyName => {
  if (keyName === "ArrowUp") {
    console.log("---------- up ----------");
  } else if (keyName === "ArrowDown") {
    console.log("---------- down ----------");
  } else if (keyName === "ArrowLeft") {
    console.log("---------- left ----------");
    grid.buttonLeft();
    moveLeft();
  } else if (keyName === "ArrowRight") {
    console.log("---------- right ----------");
  }
};

document.addEventListener("keydown", event => {
  const keyName = event.key;
  check_key(keyName);
});
