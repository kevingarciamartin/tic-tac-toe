const board = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell(i, j));
    }
  }

  const getRows = () => rows;
  const getColumns = () => columns;
  const getBoard = () => board;

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i].forEach((cell) => cell.placeMarker(cell.getEmptyCellValue()));
    }
  };

  const placeMarker = (row, column, marker) => {
    const isAvailableCell =
      board[row][column].getValue() === board[row][column].getEmptyCellValue();

    if (!isAvailableCell) return false;

    board[row][column].placeMarker(marker);

    return true;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return {
    getRows,
    getColumns,
    getBoard,
    resetBoard,
    placeMarker,
    printBoard,
  };
})();

function Cell(cellRow, cellColumn) {
  const row = cellRow;
  const column = cellColumn;
  const emptyCellValue = "_";
  let value = emptyCellValue;

  const placeMarker = (marker) => {
    value = marker;
  };

  const getRow = () => row;
  const getColumn = () => column;
  const getEmptyCellValue = () => emptyCellValue;
  const getValue = () => value;

  return {
    placeMarker,
    getRow,
    getColumn,
    getEmptyCellValue,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const players = [
    {
      name: playerOneName,
      marker: "X",
      points: 0,
    },
    {
      name: playerTwoName,
      marker: "O",
      points: 0,
    },
  ];

  let round = 0;
  let activePlayer = players[0];

  const increaseRound = () => round++;
  const resetRound = () => (round = 0);

  const increasePlayerPoints = (player) => player.points++;
  const resetPlayerPoints = () => {
    players.forEach((player) => (player.points = 0));
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const setPlayerTurn = () => {
    activePlayer = round % 2 === 0 ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    console.log("--------------");
    console.log(`Round ${round}`);
    console.log("--------------");
  };

  const printNewTurn = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const initGame = () => {
    resetPlayerPoints();
    resetRound();
  };

  const playRound = () => {
    board.resetBoard();
    increaseRound();
    setPlayerTurn();
    printNewRound();
    printNewTurn();
  };

  const playTurn = (row, column) => {
    console.log(
      `Placing ${
        getActivePlayer().name
      }'s marker into cell (${row},${column})...`
    );

    const isAvailableCell = board.placeMarker(
      row,
      column,
      getActivePlayer().marker
    );

    if (!isAvailableCell) {
      printNewTurn();
      return;
    }

    const isWin = () => {
      const isAllEqual = (arr) => arr.every((val) => val === arr[0]);

      // Check horizontal
      if (isAllEqual(board.getBoard()[row].map((cell) => cell.getValue()))) {
        console.log("HORIZONTAL");
        return true;
      }

      // Check vertical
      const columnArray = [];
      for (let i = 0; i < board.getRows(); i++) {
        columnArray.push(board.getBoard()[i][column].getValue());
      }
      if (isAllEqual(columnArray)) {
        console.log("VERTICAL");
        return true;
      }

      // Check diagonal
      const diagonalArray = [];
      if (
        (row === 0 && column === 0) ||
        (row === 1 && column === 1) ||
        (row === 2 && column === 2)
      ) {
        for (let i = 0; i < board.getRows(); i++) {
          diagonalArray.push(board.getBoard()[i][i].getValue());
        }
      } else if (
        (row === 0 && column === 2) ||
        (row === 1 && column === 1) ||
        (row === 2 && column === 0)
      ) {
        for (let i = 0; i < board.getRows(); i++) {
          diagonalArray.push(board.getBoard()[i][2 - i].getValue());
        }
      }
      if (diagonalArray.length === 0) {
        return false;
      } else if (isAllEqual(diagonalArray)) {
        console.log("DIAGONAL");
        return true;
      }

      return false;
    };

    const isTie = () => {
      for (let i = 0; i < board.getRows(); i++) {
        for (let j = 0; j < board.getColumns(); j++) {
          if (
            board.getBoard()[i][j].getValue() ===
            board.getBoard()[i][j].getEmptyCellValue()
          )
            return false;
        }
      }
      return true;
    };

    if (isWin()) console.log(`${getActivePlayer().name} wins!`);
    if (isTie()) console.log("It's a tie");

    switchPlayerTurn();
    printNewTurn();
  };

  return {
    initGame,
    playRound,
    playTurn,
    getActivePlayer,
  };
}

const game = GameController();
