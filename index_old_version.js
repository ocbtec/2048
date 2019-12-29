// initializing game
let first_run = true;

// selected token
let selected_field = "sort";

// can move token or not
let can_move = true;

// id variable
let token = 0;

// field on board which are occupyed by a token
let place_taken = [];

// setting direction: sort / reverse
let sort_direction = "";

const rand = () => {
  return Math.floor(Math.random() * (9 - 1 + 1)) + 1;
};

const create_new_token = pos => {
  place_taken.push(pos);
  // place_taken.sort((a, b) => a - b);
  // place_taken.sort().reverse();
  console.log(first_run);

  place_taken = remove_double(place_taken);
  console.log("PLACE TAKEN: " + place_taken);

  // id variable
  token++;
  // get token-container
  let token_container = document.getElementById("token-container");

  // create dom elements
  let token_item = document.createElement("div");
  let label = document.createElement("p");

  // add nodes
  token_container.appendChild(token_item).appendChild(label);

  // set position
  token_item.id = `pos-${pos}`;

  // set number
  label.innerHTML = "2";

  // set className and id
  token_item.className = "token-div";
  label.id = `token-label-${pos}`;
  label.className = `label-class`;
};

let token_element = "";
const delete_token = () => {
  // document.getElementById(`pos-${pos}`).remove();
  token_element = document.querySelectorAll(".token-div");

  console.log("TOKEN ELEMENT:");
  console.log(token_element);
  console.log(token_element.length);

  // token_element[0].remove();

  let delete_array = [];
  for (let i = 0; i < token_element.length; i++) {
    // console.log(token_element[i].id.slice(4, 5));

    delete_array.push(token_element[i].id.slice(4, 5));

    // let delete_id = [];
    // delete_id.push(token_element[i].id.slice(4, 5));
    // console.log(" --- DELETE ID: --- ");
    // console.log(delete_id);

    // token_element[delete_id - 1].remove();
  }
  console.log(token_element);
  console.log(delete_array);

  const get_double = delete_array.filter(function(a) {
    return delete_array.indexOf(a) !== delete_array.lastIndexOf(a);
  });
  const remove_double = values =>
    values.filter((v, i) => values.indexOf(v) === i);
  let new_array = remove_double(get_double);

  console.log(new_array[0]);

  console.log(get_double.length);
  // delete html element
  for (let i = 0; i < get_double.length; i++) {
    document.getElementById(`pos-${new_array[0]}`).remove();
  }

  console.log(new_array);

  // place_taken = new_array;

  //   return data.filter(function(a){
  //     return data.indexOf(a) !== data.lastIndexOf(a)
  // });

  // token_element = remove_double();
  // console.log(new_array);

  // const remove_double = token_element =>
  //   token_element.filter((v, i) => token_element.indexOf(v) === i);
  // remove_double(token_element);
};

const check_spawn = pos => {
  if (first_run === true) {
    create_new_token(pos);
  } else {
    console.log("Before EL creation: " + place_taken);
    // place_taken.sort();
    remove_double(place_taken);
    place_taken.forEach(element => {
      // if (element === pos) {
      while (pos === element) {
        pos = rand();
      }
      console.log(place_taken);

      if (sort_direction === "sort") {
        place_taken.sort();
      } else if (sort_direction === "reverse") {
        place_taken.sort().reverse();
      }

      create_new_token(pos);

      // } else {
      //   create_new_token(pos);
      // }
    });
  }
  first_run = false;
};

const remove_double = values =>
  values.filter((v, i) => values.indexOf(v) === i);

const start_game = () => {
  check_spawn(rand());
  check_spawn(rand());
  console.log("SORT PLACE_TAKEN");
  place_taken.sort();
  console.log(place_taken);
};

// let array1 = [1, 2, 3, 4, 6, 8, 45, 2];
// array1.shift();
// console.log(array1);

const arrow_up = () => {
  console.log(" ------ UP ------ ");

  let check = 0;
  const move = () => {
    place_taken.forEach(element => {
      let current_el = document.getElementById(`pos-${element}`);
      let previous_el = document.getElementById(`pos-${element - 3}`);

      // let tmp_array = place_taken.filter(pos => pos !== element);
      let tmp_array = place_taken;

      let token_label = document.getElementById(`token-label-${element}`);

      if (element === 1 || element === 2 || element === 3) {
        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);
        // delete_token();

        check++;
      } else if (previous_el === null) {
        // left field is empty, token can move there
        tmp_array = place_taken.filter(pos => pos !== element);
        tmp_array.push(element - 3);
        place_taken = tmp_array;
        current_el.id = `pos-${element - 3}`;
        token_label.id = `token-label-${element - 3}`;

        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        token_element = document.querySelectorAll(".token-div");
        delete_token();
        // current_el.remove();
        // console.log("removed element:");
        // console.log(current_el);

        console.log("1. " + place_taken);
      } else if (
        // tokens get merged
        previous_el.innerText != null &&
        current_el.innerText != null &&
        previous_el.innerText === current_el.innerText
      ) {
        // current_el.remove();
        // console.log("removed element:");
        // console.log(current_el);

        tmp_array = place_taken.filter(pos => pos !== element);
        place_taken = tmp_array;

        console.log("____ELEMENT___: " + element);

        // let real_label = element - 3;

        token_label = document.getElementById(`token-label-${element - 3}`);

        let number = document.getElementById(`token-label-${element - 3}`);
        // let label = parseInt((element - 3).innerText, 10) * 2;
        console.log(parseInt(number.innerText, 10) * 2);

        // console.log(label);

        token_label.innerText = parseInt(number.innerText, 10) * 2;

        tmp_array.push(element - 3);
        place_taken = tmp_array;

        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        return;
      } else {
        // token can't move

        check++;
      }
    });
  };

  while (check < 8) {
    move();
  }
  check_spawn(rand());
  place_taken = remove_double(place_taken);
  delete_token();
};
const arrow_down = () => {
  console.log(" ------ DOWN ------ ");
  let check = 0;
  const move = () => {
    place_taken.forEach(element => {
      let current_el = document.getElementById(`pos-${element}`);
      let previous_el = document.getElementById(`pos-${element + 3}`);

      // let tmp_array = place_taken.filter(pos => pos !== element);
      let tmp_array = place_taken;

      let token_label = document.getElementById(`token-label-${element}`);

      if (element === 7 || element === 8 || element === 9) {
        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        // delete_token();

        check++;
      } else if (previous_el === null) {
        // left field is empty, token can move there
        tmp_array = place_taken.filter(pos => pos !== element);
        tmp_array.push(element + 3);
        place_taken = tmp_array;
        current_el.id = `pos-${element + 3}`;
        token_label.id = `token-label-${element + 3}`;

        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        token_element = document.querySelectorAll(".token-div");
        delete_token();

        // current_el.remove();
        // console.log("removed element:");
        // console.log(current_el);

        console.log("1. " + place_taken);
      } else if (
        // tokens get merged
        previous_el.innerText != null &&
        current_el.innerText != null &&
        previous_el.innerText === current_el.innerText
      ) {
        current_el.remove();
        console.log("removed element:");
        console.log(current_el);
        tmp_array = place_taken.filter(pos => pos !== element);
        place_taken = tmp_array;

        console.log("____ELEMENT___: " + element);

        // let real_label = element + 3;

        token_label = document.getElementById(`token-label-${element + 3}`);

        let number = document.getElementById(`token-label-${element + 3}`);
        // let label = parseInt((element + 3).innerText, 10) * 2;
        console.log(parseInt(number.innerText, 10) * 2);

        // console.log(label);

        token_label.innerText = parseInt(number.innerText, 10) * 2;

        tmp_array.push(element + 3);
        place_taken = tmp_array;

        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        return;
      } else {
        // token can't move

        check++;
      }
    });
  };

  while (check < 8) {
    move();
  }
  check_spawn(rand());
  place_taken = remove_double(place_taken);
  delete_token();
};
const arrow_left = () => {
  console.log(" ------ LEFT ------ ");
  let check = 0;
  const move = () => {
    place_taken.forEach(element => {
      let current_el = document.getElementById(`pos-${element}`);
      let previous_el = document.getElementById(`pos-${element - 1}`);

      // let tmp_array = place_taken.filter(pos => pos !== element);
      let tmp_array = place_taken;

      let token_label = document.getElementById(`token-label-${element}`);

      if (element === 1 || element === 4 || element === 7) {
        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        // delete_token();

        check++;
      } else if (previous_el === null) {
        // left field is empty, token can move there
        tmp_array = place_taken.filter(pos => pos !== element);
        tmp_array.push(element - 1);
        place_taken = tmp_array;
        current_el.id = `pos-${element - 1}`;
        token_label.id = `token-label-${element - 1}`;

        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        token_element = document.querySelectorAll(".token-div");
        delete_token();

        // current_el.remove();
        // console.log("removed element:");
        // console.log(current_el);

        console.log("1. " + place_taken);
      } else if (
        // tokens get merged
        previous_el.innerText != null &&
        current_el.innerText != null &&
        previous_el.innerText === current_el.innerText
      ) {
        current_el.remove();
        console.log("removed element:");
        console.log(current_el);

        tmp_array = place_taken.filter(pos => pos !== element);
        place_taken = tmp_array;

        console.log("____ELEMENT___: " + element);

        // let real_label = element - 1;

        token_label = document.getElementById(`token-label-${element - 1}`);

        let number = document.getElementById(`token-label-${element - 1}`);
        // let label = parseInt((element - 1).innerText, 10) * 2;
        console.log(parseInt(number.innerText, 10) * 2);

        // console.log(label);

        token_label.innerText = parseInt(number.innerText, 10) * 2;

        tmp_array.push(element - 1);
        place_taken = tmp_array;

        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        return;
      } else {
        // token can't move

        check++;
      }
    });
  };

  let x = 1;
  while (check < 8) {
    console.log(x);
    x++;
    move();
  }
  check_spawn(rand());
  place_taken = remove_double(place_taken);
  delete_token();
};

const arrow_right = () => {
  console.log(" ------ RIGHT ------ ");
  let check = 0;
  const move = () => {
    place_taken.forEach(element => {
      let current_el = document.getElementById(`pos-${element}`);
      let previous_el = document.getElementById(`pos-${element + 1}`);

      // let tmp_array = place_taken.filter(pos => pos !== element);
      let tmp_array = place_taken;

      let token_label = document.getElementById(`token-label-${element}`);

      if (element === 3 || element === 6 || element === 9) {
        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        // delete_token();

        check++;
      } else if (previous_el === null) {
        // left field is empty, token can move there
        tmp_array = place_taken.filter(pos => pos !== element);
        tmp_array.push(element + 1);
        place_taken = tmp_array;
        current_el.id = `pos-${element + 1}`;
        token_label.id = `token-label-${element + 1}`;

        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        token_element = document.querySelectorAll(".token-div");
        delete_token();

        // current_el.remove();
        // console.log("removed element:");
        // console.log(current_el);

        console.log("1. " + place_taken);
      } else if (
        // tokens get merged
        previous_el.innerText != null &&
        current_el.innerText != null &&
        previous_el.innerText === current_el.innerText
      ) {
        current_el.remove();
        console.log("removed element:");
        console.log(current_el);

        tmp_array = place_taken.filter(pos => pos !== element);
        place_taken = tmp_array;

        console.log("____ELEMENT___: " + element);

        // let real_label = element + 1;

        token_label = document.getElementById(`token-label-${element + 1}`);

        let number = document.getElementById(`token-label-${element + 1}`);
        // let label = parseInt((element + 1).innerText, 10) * 2;
        console.log(parseInt(number.innerText, 10) * 2);

        // console.log(label);

        token_label.innerText = parseInt(number.innerText, 10) * 2;

        tmp_array.push(element + 1);
        place_taken = tmp_array;

        // place_taken =>
        //   place_taken.filter((v, i) => place_taken.indexOf(v) === i);

        place_taken = remove_double(place_taken);

        return;
      } else {
        // token can't move

        check++;
      }
    });
  };

  while (check < 8) {
    move();
  }
  check_spawn(rand());
  place_taken = remove_double(place_taken);
  delete_token();
};

const check_key = keyName => {
  // place_taken.sort((a, b) => a - b);

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
    sort_direction = "sort";
    place_taken.sort();
    arrow_left();
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

// const arrow_up = () => {
//   // console.log(selected_field);
//   console.log(place_taken);

//   // <= 3
//   if (selected_field <= 3) {
//     can_move = false;
//     console.log("can't move");
//   } else if (selected_field <= 6) {
//     // <= 6
//     let active_token = document.getElementById(`token-label-${selected_field}`)
//       .innerHTML;
//     // console.log(active_token);

//     place_taken.forEach(element => {
//       console.log(element);
//       let other_token = "";
//       if (element === selected_field) {
//         // other_token = document.getElementById(`token-label-${element}`)
//         //   .innerHTML;
//         console.log(element + " = " + selected_field);
//         console.log("compared to itself");
//         place_taken.shift();
//         console.log(place_taken);
//       } else if (
//         selected_field - 3 === element &&
//         active_token === other_token
//       ) {
//         delete_token(selected_field);
//         element.innerHTML = "23";
//         console.log(other_token.innerHTML);
//         return;
//       }

//       // if (
//       //   // selected_field - 3 === element &&
//       //   document.getElementById(`token-label-${element}`).innerHTML ===
//       //   document.getElementById(`token-label-${element}`).innerHTML
//       // ) {
//       //   console.log("4");
//       // }
//     });
//   } else if (selected_field <= 9) {
//     // <= 9
//     place_taken.forEach(element => {
//       console.log("selected field, element: " + selected_field, element);

//       console.log("SELECTED FIELD : " + selected_field);

//       if (selected_field - 3 === element) {
//         console.log("SELECTED FIELD : " + selected_field);
//         if (
//           document.getElementById(`token-label-${selected_field}`).innerHTML ===
//           document.getElementById(`token-label-${element}`).innerHTML
//         ) {
//           console.log("move to line 2");
//           can_move = true;
//           console.log(element.innerHTML);

//           // let pos_1 = selected_field - 3 != element;
//           // let pos_2 = selected_field - 6 != element;

//           // selected_field != element && (pos_1 = element);
//         }
//         // return;
//       } else if (selected_field - 6 === element) {
//         console.log("move to line 3");
//       } else {
//         console.log("can't move");
//         can_move = false;
//       }
//       // return;
//     });
//   }
//   can_move === true ? move() : console.log("can't move");
// };
