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
    console.log(this.array);

    this.spawn();
    this.spawn();
  }
  buttonLeft() {}
  buttonRight() {}
  buttonUp() {}
  buttonDown() {}
  spawn() {
    let index = Math.floor(Math.random() * (this.size * this.size - 1));
    let yCoordinate = Math.floor(index / this.size);
    let xCoordinate = index % this.size;
    console.log(yCoordinate, xCoordinate);

    if (this.array[yCoordinate][xCoordinate] === 0) {
      this.array[yCoordinate][xCoordinate] = 2;
    } else {
      this.spawn();
    }
  }
}

let userInput = 4;

const initializeHMTL = () => {
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

const start_game = () => {
  let grid = new MyGrid(userInput);
  grid.initialize();
  initializeHMTL();
};
