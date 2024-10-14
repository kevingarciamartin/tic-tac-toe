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

  const placeMarker = (row, column, player) => {
    const isAvailableCell =
      board[row][column].getValue() === board[row][column].emptyCellValue;

    if (!isAvailableCell) return false;

    board[row][column].placeMarker(player);

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
    placeMarker,
    printBoard,
  };
})();

/*
 ** A Cell represents one "square" on the board and can have one of
 ** 0: no marker is in the square,
 ** 1: Player 1's marker,
 ** 2: Player 2's marker
 */

function Cell(row, column) {
  const emptyCellValue = "_";
  let value = emptyCellValue;

  const placeMarker = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    row,
    column,
    emptyCellValue,
    placeMarker,
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
      marker: 1,
    },
    {
      name: playerTwoName,
      marker: 2,
    },
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

  const playRound = (row, column) => {
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
      printNewRound();
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
      }
      else if (isAllEqual(diagonalArray)) {
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
            board.getBoard()[i][j].emptyCellValue
          )
            return false;
        }
      }
      return true;
    };

    if (isWin()) console.log(`${getActivePlayer().name} wins!`);
    if (isTie()) console.log("It's a tie");

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
