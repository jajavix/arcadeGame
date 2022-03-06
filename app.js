//1. addEvenlistener for window to load the game app
window.addEventListener("load", gameArcade);

let gameBoard = ["", "", "", "", "", "", "", "", ""]; // 3 x 3 board
let turn = 0; // Keeps track if X or O player's turn
let winner = false;

//2.  CREATE PLAYER
const player = (name) => {
  name = name;
  return { name };
};

let playerX = player("");
let playerY = player("");

//3. INITIALIZE Game
function gameArcade() {
  //input-field is return
  let inputField = document.querySelector(".input-field").focus();
  // player -form return
  const addPlayerForm = document.getElementById("player-form");
  // AddEventlistener to listen to submit button actions
  addPlayerForm.addEventListener("submit", addPlayers);
  //AddEventlisterner for clear board button
  let clearButton = document.querySelector(".clear-btn");
  clearButton.addEventListener("click", resetBoard);
}

//5. Add PLAYERS
// input field
function addPlayers(event) {
  //preventDefault is use to have user input their name
  //need to fill out to move forward, a alert will pop up when no name is inputted
  event.preventDefault();
  //if no name is inputted, alert will show prompting user to input a name
  if (this.player1.value === "" || this.player2.value === "") {
    alert("You Must Enter a Name for Each Field");
    return;
  }
  //.enter-player, .board_main is returned
  const playerFormContainer = document.querySelector(".enter-players");
  const boardMain = document.querySelector(".board__main");

  //player name value
  playerX.name = this.player1.value;
  playerY.name = this.player2.value;
  buildBoard();
}
// 6. RETURN CURRENT PLAYER
function currentPlayer() {
  return turn % 2 === 0 ? "X" : "O";
}

/*******Board Resize*********************/
//7. I want to hide the board until player infor are inputed and start Game button is click
// After the Start Game button is clicked, the Resize squares in event browser is resized to gameboard size.
window.addEventListener("resize", onResize);
function onResize() {
  let allCells = document.querySelectorAll(".board__cell");
  let cellHeight = allCells[0].offsetWidth;

  allCells.forEach((cell) => {
    cell.style.height = `${cellHeight}px`;
  });
}
//8. Hide the board until player hit Start Game Button
//gameboard is resize
function buildBoard() {
  let resetContainer = document.querySelector(".reset");
  resetContainer.classList.remove("reset--hidden");

  onResize();
  addCellClickListener();
  changeBoardHeaderNames();
}

/*************Player Move Event*****************/
//9. Cell click event for player move
function makeMove(event) {
  console.log(turn);

  let currentCell = parseInt(event.currentTarget.firstElementChild.dataset.id);
  let cellToAddToken = document.querySelector(`[data-id='${currentCell}']`);

  if (cellToAddToken.innerHTML !== "") {
    return;
  } else {
    if (currentPlayer() === "X") {
      cellToAddToken.textContent = currentPlayer();
      gameBoard[currentCell] = "X";
    } else {
      cellToAddToken.textContent = currentPlayer();
      gameBoard[currentCell] = "O";
    }
  }

  /*********Check for the Winner**********/
  //1. Check if we have a winner
  isWinner();

  //2. Update turn count so next player can choose
  turn++;

  //3. change the players name on "whos next"
  changeBoardHeaderNames();
}

//4. check for tie and alert will show!
function checkIfTie() {
  if (turn > 7) {
    alert("Game Over A Tie");
  }
}

//5. checking winner combinations
function isWinner() {
  const winningSequences = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  winningSequences.forEach((winningCombos) => {
    let cell1 = winningCombos[0];
    let cell2 = winningCombos[1];
    let cell3 = winningCombos[2];
    if (
      gameBoard[cell1] === currentPlayer() &&
      gameBoard[cell2] === currentPlayer() &&
      gameBoard[cell3] === currentPlayer()
    ) {
      const cells = document.querySelectorAll(".board__cell");
      let letterId1 = document.querySelector(`[data-id='${cell1}'`);
      let letterId2 = document.querySelector(`[data-id='${cell2}'`);
      let letterId3 = document.querySelector(`[data-id='${cell3}'`);

      cells.forEach((cell) => {
        let cellId = cell.firstElementChild.dataset.id;

        if (cellId == cell1 || cellId == cell2 || cellId == cell3) {
          cell.classList.add("board__cell--winner");
        }
      });
      let currentPlayerText = document.querySelector(".board___player-turn");
      if (currentPlayer() === "X") {
        currentPlayerText.innerHTML = `
          <div class="congratulations">Congratulations ${playerX.name}!</div><br>
          <div class="u-r-winner">You are our winner! </div>
        `;
        winner = true;
        removeCellClickListener();
        return true;
      } else {
        currentPlayerText.innerHTML = `
          <div class="congratulations">Congratulations ${playerY.name}!</div><br>
          <div class="u-r-winner">You are our winner! </div>
        `;
        winner = true;
        removeCellClickListener();
        return true;
      }
    }
  });

  if (!winner) {
    checkIfTie();
  }

  return false;
}
//6. Change Player Name
function changeBoardHeaderNames() {
  if (!winner) {
    let currentPlayerText = document.querySelector(".board___player-turn");
    if (currentPlayer() === "X") {
      currentPlayerText.innerHTML = `
        <span class="name--style">${playerX.name} , <center> You are up! </center></span>
        <div class="u-r-winner"></div>
      `;
    } else {
      currentPlayerText.innerHTML = `
        <span class="name--style1">${playerY.name} , <center> You are up! </center></span>
        <div class="u-r-winner"></div>
      `;
    }
  }
}
//7. resetBoard
function resetBoard() {
  console.log("resetting");

  gameBoard = ["", "", "", "", "", "", "", "", ""];

  let cellToAddToken = document.querySelectorAll(".letter");
  cellToAddToken.forEach((square) => {
    square.textContent = "";
    square.parentElement.classList.remove("board__cell--winner");
  });

  turn = 0;
  winner = false;

  let currentPlayerText = document.querySelector(".board___player-turn");
  currentPlayerText.innerHTML = `
    <span class="name--style">${playerX.name}, <center> You are up! </center></span>
    <div class="u-r-winner"></div>
  `;

  addCellClickListener();
}

/*********Event Listener for Player moves****/
//1. AddCellClickListener
function addCellClickListener() {
  const cells = document.querySelectorAll(".board__cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", makeMove);
  });
}

function removeCellClickListener() {
  let allCells = document.querySelectorAll(".board__cell");
  allCells.forEach((cell) => {
    cell.removeEventListener("click", makeMove);
  });
}

//remove liveserver insert script
document.body.querySelector("script").style.display = "none";
