class MyGrid {
  constructor(size = 3) {
    this.size = size;
    this.array = [];
  }
  initialize() {
    // for (let y = 0; y < this.size; y++) {
    //   for (let x = 0; x < this.size; x++) {
    //     this.array[y][x] = 0;
    //   }
    // }
    let tempArray = [];
    for (let i = 0; i < this.size; i++) {
      tempArray.push(0);
    }
    for (let i = 0; i < this.size; i++) {
      this.array.push(tempArray);
    }
  }
  mergeTokens(y, xLeft, xRight) {
    this.array[y][xRight] = 0;
    this.array[y][xLeft] *= 2;
    console.log(this.array);
  }
  buttonLeft() {
    for (let y = 0; y < this.size; y++) {
      for (let xLeft = 0; xLeft < this.size; xLeft++) {
        for (let xRight = xLeft + 1; xRight < this.size; xRight++) {
          if (
            this.array[y][xLeft] == this.array[y][xRight] &&
            this.array[y][xLeft] != 0
          ) {
            this.mergeTokens(y, xLeft, xRight);
            if (xRight != this.size - 1) {
              xLeft = xRight + 1;
            }
            break;
          }
        }
      }
    }
  }
  buttonRight() {}
  buttonUp() {}
  buttonDown() {}
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

const initializeGameArea = () => {
  let scale_string = "";
  for (let i = 0; i < userInput; i++) {
    scale_string += "1fr ";
  }

  let game_area = document.getElementsByClassName("game-area")[0];
  game_area.style.gridTemplateRows = scale_string;
  game_area.style.gridTemplateColumns = scale_string;

  let token_container = document.getElementById("token-container");
  token_container.style.gridTemplateRows = scale_string;
  token_container.style.gridTemplateColumns = scale_string;

  for (let i = 0; i < userInput * userInput; i++) {
    let game_field = document.createElement("div");
    game_field.style.cssText = "background-color: #4d4d4d; border-radius: 5px;";
    game_area.appendChild(game_field);
  }
};

const createNewToken = coordinates => {
  console.log(coordinates);

  let token_container = document.getElementById("token-container");
  let token = document.createElement("div");

  // grid-row and grid-column starts counting at 1
  // thats why 1 needs to be added to the coordinates
  let y = coordinates[0] + 1;
  let x = coordinates[1] + 1;

  token.style.cssText = `background-color: #efefef; border-radius: 5px; grid-row: ${y}; grid-column: ${x}`;
  token.innerHTML = "2";
  token_container.appendChild(token);
};

let grid = new MyGrid(userInput);

const start_game = () => {
  grid.initialize();
  let token_1 = grid.createNewToken();
  let token_2 = grid.createNewToken();
  initializeGameArea();
  createNewToken(token_1);
  createNewToken(token_2);
};

const check_key = keyName => {
  if (keyName === "ArrowUp") {
    console.log("---------- up ----------");
    sort_direction = "sort";
    place_taken.sort();
    arrow_up();
  } else if (keyName === "ArrowDown") {
    console.log("---------- down ----------");
    sort_direction = "reverse";
    place_taken.sort().reverse();
    arrow_down();
  } else if (keyName === "ArrowLeft") {
    console.log("---------- left ----------");
    grid.buttonLeft();
  } else if (keyName === "ArrowRight") {
    console.log("---------- right ----------");
    sort_direction = "reverse";
    place_taken.sort().reverse();
    arrow_right();
  }
};

document.addEventListener("keydown", event => {
  const keyName = event.key;
  check_key(keyName);
});
