function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < columns; c++) {
      board[r].push(Cell());
    }
  }
  
  const getBoard = () => board;

  const selectCell  = (row, column, player) => {
    if (board[row][column].getValue() === '') {
      board[row][column].addToken(player);
      return true;
    }
    return false;
  };

  const printBoard = () => {
    const values = board.map((row) => row.map((cell) => cell.getValue() || ' '));
    return values;
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
  };

  const disableButtons = () => {
    const boardDiv = document.querySelector('.board');
    boardDiv.classList.add('game-over');
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

    const move = board.selectCell(row, column, getActivePlayer().token);
    const result = checkWinner();

    if (move) {
      if (result) {
        board.printBoard();
        return {status: 'win', player: getActivePlayer().name};
      } else if (counter == 9) {
        disableButtons();
        return {status: 'tie'};
      } else {
        switchPlayerTurn();
        printNewRound();
        return {status: 'continue', player: getActivePlayer().name};
      }
    } else if (move == false) {
      counter--
      printNewRound();
      return {status: 'invalid'};
    }

  };
  
  return {
    playRound,
    getActivePlayer,
    checkWinner,
    getBoard: board.getBoard,
    disableButtons
  };
 
}

function ScreenController() {
  let game = GameController();
  const boardDiv = document.querySelector('.board');
  const playerTurnDiv = document.querySelector('.turn');
  const startButton = document.querySelector('#start-game');

  const player1Input = document.querySelector('#player1');
  const player2Input = document.querySelector('#player2');

  // Function to handle start game
  const handleStartGame = () => {
    const player1Name = player1Input.value || "Player One";
    const player2Name = player2Input.value || "Player Two";
    
    game = GameController(player1Name, player2Name);
    boardDiv.classList.remove('game-over');
    playerTurnDiv.textContent = `${player1Name}'s Turn...`;
    updateScreen();
  };

  // Click event for button
  startButton.addEventListener('click', handleStartGame);

  // Enter key events for input fields
  player1Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      startButton.click();
    }
  });

  player2Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      startButton.click();
    }
  });

  const updateScreen = () => {
    boardDiv.innerHTML = '';
    
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    

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
  
  const clickHandlerBoard = (e) => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    if (row === undefined || column === undefined) return;
    
    const result = game.playRound(row, column);

    if (result.status === 'win') {
      playerTurnDiv.textContent = `${result.player} Wins!`;
      game.disableButtons();
    } else if (result.status === 'tie') {
      playerTurnDiv.textContent = `Tie Game!`;
      game.disableButtons();
    } else if (result.status === 'continue') {
      playerTurnDiv.textContent = `${result.player}'s Turn...`;
    }

    updateScreen();
  }
  
  // Store the event listener reference
  boardDiv.addEventListener("click", clickHandlerBoard);
  
  // Initial screen update
  updateScreen();
  
}



ScreenController();