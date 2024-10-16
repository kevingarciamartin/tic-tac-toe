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

const game = ((playerOneName = "Player One", playerTwoName = "Player Two") => {
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
    console.log(
      `${players[0].name} ${players[0].points}-${players[1].points} ${players[1].name}`
    );
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

    let row, column;
    let roundWon = false;
    let roundTied = false;
    do {
      row = prompt("Select a row from 0-2.");
      column = prompt("Select a column from 0-2.");

      playTurn(row, column);

      roundWon = isWin(row, column);
      roundTied = isTie();

      if (!(roundWon || roundTied)) {
        switchPlayerTurn();
        printNewTurn();
      } else board.printBoard();
    } while (!(roundWon || roundTied));

    if (roundWon) {
      console.log(`${getActivePlayer().name.toUpperCase()} WINS!`);
      increasePlayerPoints(getActivePlayer());
    } else if (roundTied) {
      console.log("IT'S A TIE");
    }
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
  };

  const isWin = (row, column) => {
    const isAllEqual = (arr) => arr.every((val) => val === arr[0]);

    // Check horizontal
    if (isAllEqual(board.getBoard()[row].map((cell) => cell.getValue())))
      return true;

    // Check vertical
    const columnArray = [];
    for (let i = 0; i < board.getRows(); i++) {
      columnArray.push(board.getBoard()[i][column].getValue());
    }
    if (isAllEqual(columnArray)) return true;

    // Check diagonal
    const diagonalArray = [];
    if ((row == 0 && column == 0) || (row == 2 && column == 2)) {
      for (let i = 0; i < board.getRows(); i++) {
        diagonalArray.push(board.getBoard()[i][i].getValue());
      }
    } else if ((row == 0 && column == 2) || (row == 2 && column == 0)) {
      for (let i = 0; i < board.getRows(); i++) {
        diagonalArray.push(board.getBoard()[i][2 - i].getValue());
      }
    } else if (row == 1 && column == 1) {
      diagonalArray[0] = [];
      diagonalArray[1] = [];
      for (let i = 0; i < board.getRows(); i++) {
        diagonalArray[0].push(board.getBoard()[i][i].getValue());
        diagonalArray[1].push(board.getBoard()[i][2 - i].getValue());
      }
    }
    if (diagonalArray.length === 0) return false;
    else if (diagonalArray.length === 2) {
      diagonalArray.forEach((array) => {
        if (isAllEqual(array)) return true;
      });
    } else if (isAllEqual(diagonalArray)) return true;

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

  initGame();

  return {
    initGame,
    playRound,
    playTurn,
    getActivePlayer,
  };
})();

const ui = (() => {
  const uiInfo = document.querySelector("#info");
  const uiBoard = document.querySelector("#board");

  const updateScreen = () => {
    uiBoard.textContent = "";

    const currentBoard = board.getBoard();
    const activePlayer = game.getActivePlayer();

    uiInfo.textContent = `${activePlayer.name}'s turn...`;

    currentBoard.forEach((row) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        uiBoard.appendChild(cellButton);
      });
    });
  };

  updateScreen();
})();
