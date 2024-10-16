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

  return {
    getRows,
    getColumns,
    getBoard,
    resetBoard,
    placeMarker,
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

  const initGame = () => {
    resetPlayerPoints();
    resetRound();
  };

  const initRound = () => {
    board.resetBoard();
    increaseRound();
    setPlayerTurn();
  };

  const playTurn = (row, column) => {
    const isAvailableCell = board.placeMarker(
      row,
      column,
      getActivePlayer().marker
    );

    if (!isAvailableCell) return;

    if (isWin(row, column)) {
      increasePlayerPoints(getActivePlayer());
      return;
    } else if (isTie()) return;

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
    playTurn,
    setPlayerTurn,
    getActivePlayer,
    getPlayers,
    isWin,
    isTie,
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
    const playerOneName = document.createElement("div");
    const playerOnePoints = document.createElement("div");
    const turnInfoTitle = document.createElement("div");
    const turnPlayer = document.createElement("div");
    const playerTwoName = document.createElement("div");
    const playerTwoPoints = document.createElement("div");

    playerOneName.textContent = `${game.getPlayers()[0].name} (${game.getPlayers()[0].marker})`;
    playerOnePoints.textContent = `${game.getPlayers()[0].points}`;
    turnInfoTitle.textContent = "Now Playing:";
    turnPlayer.textContent = `${activePlayer.name}`;
    playerTwoName.textContent = `${game.getPlayers()[1].name} (${game.getPlayers()[1].marker})`;
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

    const uiRestartRoundButton = document.createElement("button");
    const uiQuitButton = document.createElement("button");
    uiRestartRoundButton.classList.add("small-btn");
    uiRestartRoundButton.textContent = "Restart Round";
    uiRestartRoundButton.addEventListener('click', () => { 
      board.resetBoard(); 
      game.setPlayerTurn();
      renderGame();
    })
    uiQuitButton.classList.add("quit", 'small-btn');
    uiQuitButton.textContent = "Quit";
    uiGameButtons.appendChild(uiRestartRoundButton);
    uiGameButtons.appendChild(uiQuitButton);

    uiMainContent.appendChild(uiInfo);
    uiMainContent.appendChild(uiBoard);
    uiMainContent.appendChild(uiGameButtons);
  };

  const renderModal = (message) => {
    const modal = document.querySelector("dialog");
    const modalMessage = document.createElement("p");
    const modalButtons = document.createElement("div");
    const modalPlayAgainButton = document.createElement("button");
    const modalQuitButton = document.createElement("button");

    modal.textContent = "";
    modal.style.display = "grid";

    modalMessage.textContent = message;

    modalButtons.classList.add("modal-buttons");

    modalPlayAgainButton.textContent = "Play Again";
    modalPlayAgainButton.classList.add('small-btn');

    modalQuitButton.textContent = "Quit";
    modalQuitButton.classList.add("quit", 'small-btn');

    modal.appendChild(modalMessage);
    modal.appendChild(modalButtons);
    modalButtons.appendChild(modalPlayAgainButton);
    modalButtons.appendChild(modalQuitButton);

    modalPlayAgainButton.addEventListener("click", () => {
      game.initRound();
      renderGame();
      modal.style.display = "none";
    });

    modalQuitButton.addEventListener("click", () => {
      renderMainMenu();
      modal.style.display = "none";
    });
  };

  uiMainContent.addEventListener("click", (event) => {
    if (event.target.classList.contains("play")) {
      game.initGame();
      game.initRound();
      renderGame();
    } else if (event.target.classList.contains("cell")) {
      const row = event.target.dataset.row;
      const column = event.target.dataset.column;
      game.playTurn(row, column);
      renderGame();
      if (game.isWin(row, column)) {
        renderModal(`${game.getActivePlayer().name} is the winner!`);
      } else if (game.isTie()) {
        renderModal("It's a tie!");
      }
    } else if (event.target.classList.contains("quit")) {
      renderMainMenu();
    }
  });

  renderMainMenu();
})();
