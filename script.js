function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  
  const getBoard = () => board;

  const selectCell  = (row, column, player) => {
    board[row][column].getValue() === '' && board[row][column].addToken(player);
  };

  const printBoard = () => {
    board.map((row) => row.map((cell) => cell.getValue()))
  };

  return { getBoard, selectCell, printBoard };
}

function Cell() {
  let value = '';

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 'X'
    },
    {
      name: playerTwoName,
      token: 'O'
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const buttons = document.querySelectorAll('button')
  const disableButtons = () => {
    buttons.forEach(element => {
        element.disabled = true
    })
}

const checkWinner = () => {
 
  const currentBoard = board.getBoard();

  for (let i = 0; i < currentBoard.length; i++) {

      const topLeft = currentBoard[0][0].getValue();
      const topMiddle = currentBoard[0][1].getValue();
      const topRight = currentBoard[0][2].getValue();
      const middleLeft = currentBoard[1][0].getValue();
      const middleMiddle = currentBoard[1][1].getValue();
      const middleRight = currentBoard[1][2].getValue();
      const bottomLeft = currentBoard[2][0].getValue();
      const bottomMiddle = currentBoard[2][1].getValue();
      const bottomRight = currentBoard[2][2].getValue();

      if (topLeft !== '') { // checks left vertical, top hori, and left to right diag \ 
        if (
          (topLeft === topMiddle && topMiddle === topRight) ||
          (topLeft === middleLeft && middleLeft === bottomLeft) ||
          (topLeft === middleMiddle && middleMiddle === bottomRight)
        ) {
          return true
        }}

      if (middleMiddle !== '') { // checks cross and right to left diag /
        if (
          (middleMiddle === topMiddle && topMiddle === bottomMiddle) ||
          (middleMiddle === middleLeft && middleLeft === middleRight) ||
          (middleMiddle === topRight && topRight === bottomLeft)
        ) {
          return true
          }}

      if (bottomRight !== '') { // checks 
        if (
          (bottomRight === middleRight && middleRight === topRight) ||
          (bottomRight === bottomMiddle && bottomMiddle === bottomLeft)
        ) {
          return true
        }}
      }
  return false;
} 

  let counter = 0;

  const playRound = (row, column) => {

    counter++

    console.log(`${getActivePlayer().name} selected row ${row} column ${column}`);

    const move = board.selectCell(row, column, getActivePlayer().token);
    console.log(counter);

    if (move == true) {
      const result = checkWinner();
      if (result == true) {
        disableButtons();
        alert("Game Over!")
      } else if (result == true && counter == 9) {
        disableButtons();
        alert("Tie Game!")
        return -1
      } else {
        switchPlayerTurn();
        printNewRound();

      }
    } else if (move == false) {
      counter--
      printNewRound();
      return false
    }

    switchPlayerTurn();
    printNewRound();
  };
  
  return {
    playRound,
    getActivePlayer,
    checkWinner,
    getBoard: board.getBoard
  };
 
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  
  const updateScreen = () => {
    // Clear the boardDiv before updating
    boardDiv.innerHTML = '';
    
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // Loop through rows and columns to render cells visually
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue()
        boardDiv.appendChild(cellButton);
      });
    });
  }
  
  function clickHandlerBoard(e) {
    // console.log('clickHandlerBoard invoked');
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    if (row === undefined || column === undefined) return;
    
    game.playRound(row, column);
    updateScreen();
  }
  
  // Listen for clicks on the board
  boardDiv.addEventListener("click", clickHandlerBoard);
  
  // Initial screen update
  updateScreen();
}

ScreenController();