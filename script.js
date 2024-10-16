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
  const emptyCellValue = "";
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

  const getPlayers = () => players;

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

  const initRound = () => {
    board.resetBoard();
    increaseRound();
    setPlayerTurn();
    printNewRound();
    printNewTurn();
  };

  const playRound = (row, column) => {
    board.resetBoard();
    increaseRound();
    setPlayerTurn();
    printNewRound();
    printNewTurn();

    let roundWon = false;
    let roundTied = false;
    do {
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

    switchPlayerTurn();
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
    initRound,
    playRound,
    playTurn,
    getActivePlayer,
    getPlayers,
  };
})();

const ui = (() => {
  const uiMainContent = document.querySelector("main");

  const renderMainMenu = () => {
    uiMainContent.textContent = "";

    const playButton = document.createElement("button");

    playButton.classList.add("play");
    playButton.textContent = "Play";

    uiMainContent.appendChild(playButton);
  };

  const renderGame = () => {
    uiMainContent.textContent = "";

    const uiInfo = document.createElement("section");
    const uiBoard = document.createElement("section");
    const uiGameButtons = document.createElement("section");

    const currentBoard = board.getBoard();
    const activePlayer = game.getActivePlayer();

    uiInfo.id = "game-info";

    const playerOneInfo = document.createElement("article");
    const turnInfo = document.createElement("article");
    const playerTwoInfo = document.createElement("article");
    const playerOneName = document.createElement("p");
    const playerOnePoints = document.createElement("p");
    const turnInfoTitle = document.createElement("p");
    const turnPlayer = document.createElement("p");
    const playerTwoName = document.createElement("p");
    const playerTwoPoints = document.createElement("p");

    playerOneName.textContent = `${game.getPlayers()[0].name}`;
    playerOnePoints.textContent = `${game.getPlayers()[0].points}`;
    turnInfoTitle.textContent = "Now Playing";
    turnPlayer.textContent = `${activePlayer.name}`;
    playerTwoName.textContent = `${game.getPlayers()[1].name}`;
    playerTwoPoints.textContent = `${game.getPlayers()[1].points}`;

    uiInfo.appendChild(playerOneInfo);
    uiInfo.appendChild(turnInfo);
    uiInfo.appendChild(playerTwoInfo);
    playerOneInfo.appendChild(playerOneName);
    playerOneInfo.appendChild(playerOnePoints);
    turnInfo.appendChild(turnInfoTitle);
    turnInfo.appendChild(turnPlayer);
    playerTwoInfo.appendChild(playerTwoName);
    playerTwoInfo.appendChild(playerTwoPoints);

    uiBoard.id = "board";

    currentBoard.forEach((row) => {
      row.forEach((cell) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = cell.getRow();
        cellButton.dataset.column = cell.getColumn();
        cellButton.textContent = cell.getValue();
        uiBoard.appendChild(cellButton);
      });
    });

    uiGameButtons.id = "game-buttons";

    const uiQuitButton = document.createElement("button");
    uiQuitButton.classList.add("quit");
    uiQuitButton.textContent = "Quit";
    uiGameButtons.appendChild(uiQuitButton);

    uiMainContent.appendChild(uiInfo);
    uiMainContent.appendChild(uiBoard);
    uiMainContent.appendChild(uiGameButtons);
  };

  uiMainContent.addEventListener("click", (event) => {
    if (event.target.classList.contains("play")) {
      game.initGame();
      game.initRound();
      renderGame();
    } else if (event.target.classList.contains("cell")) {
      game.playTurn(event.target.dataset.row, event.target.dataset.column);
      renderGame();
    } else if (event.target.classList.contains("quit")) {
      renderMainMenu();
    }
  });

  renderMainMenu();
})();
