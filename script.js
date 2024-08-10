// make a working project in the console first with foundations laid out
// foundations -> gameboard, cell, gamecontroller

const container = document.querySelector('.container');
const ticTacBoard = document.createElement('div');
ticTacBoard.classList.add('tictactoe-board');
const buttonsContainer = document.querySelector('.buttons');
const startButton = document.createElement('button');
startButton.classList.add('start');
startButton.textContent = 'Start';
const resetButton = document.createElement('button');
resetButton.classList.add('reset');
resetButton.textContent = 'Reset';
let markerContainers;
const winnerDialog = document.querySelector('.winner-dialog');
const playerFormDialog = document.querySelector('.player-form-container');
const currentPlayerDialog = document.querySelector('.current-player-dialog');

/* gameboard first
** gameboard is the representation of the state of the board
** and some other things
*/
let gameboard = (function() {
    let rows = 3;
    let columns = 3;
    // this array represents the state of the gameboard,
    // since state shouldn't be stored in the dom since that's not what its for
    let board = [];

    // initializing the gameboard
    function createBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                // cell is an object that we will create later
                let newCell = cell();
                newCell.setPosition(3 * i + j + 1);
                board[i].push(newCell);
            }
        }
        displayController.displayBoard();
    }

    function getBoard() {
        return board;
    }

    function resetBoard() {
        board.forEach(row => {
            row.forEach(cell => {
                cell.resetMark();
            })
        });
        
        displayController.displayBoard();
        // we need to reset the counter that we've been using to keep track of how many boxes have been marked
        gameController.resetCheckWinnerCount();
    }

    let positions = [];
    for (let i = 0; i < 3; i++) {
        let row = [];
        for (let j = 0; j < 3; j++) {
            row.push(3 * i + j + 1);
        }
        positions.push(row);
    } 

    function getPositions() {
        return positions;
    }

    return {getBoard, createBoard, resetBoard, getPositions};
}) ();

// cell stores the state of the particular cell
function cell() {
    let mark = null;
    let position = null;
    let setMark = (myMark) => {
        if (!mark) {
            mark = myMark;
        }
    }
    
    let resetMark = () => {
        mark = null;
    }
    
    let setPosition = (x) => {
        position = x;
    }
    
    let getPosition = () => position;

    let getMark = () => mark;
    
    let isMarked = () => mark ? true : false;

    return {getMark, setMark, isMarked, resetMark, setPosition, getPosition};
}

// player should be a new object controlled by gameController but not accessible by anyone else
function createPlayer(name, marker) {
    let getName = () => name;
    let getMarker = () => marker;
    return {name, marker, getName, getMarker};
}

let displayController = (function() {
    // this we should probably get form the gameBoard rather than drawing it here
    function displayBoard() {
        // second time the child is appended, nothing significant change happens to the node
        container.appendChild(ticTacBoard);
        let board = gameboard.getBoard();
        
        // clear the board first
        let currentMarkers = Array.from(document.querySelectorAll('.tictactoe-board div'));
        currentMarkers.forEach(div => {
            ticTacBoard.removeChild(div);
        });

        board.forEach(row => {
            row.forEach(cell => {
                let markerContainer = document.createElement('div');
                markerContainer.classList.add('marker-container');
                markerContainer.setAttribute('id', `${3 * board.indexOf(row) + row.indexOf(cell) + 1}`)
                
                if (!cell.isMarked()) {
                    markerContainer.textContent = ' ';
                } else {
                    mark = cell.getMark();
                    if (mark === 'x') {
                        markerContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                                    </svg>`
                    } else {
                        markerContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                                                    </svg>`
                    }
                }
                ticTacBoard.appendChild(markerContainer);
            })
        });
    }
    
    // swaps the start and reset buttons
    function swapButtons() {
        let button = buttonsContainer.querySelector('button');
        if (button.getAttribute('class') === 'start') {
            buttonsContainer.appendChild(resetButton);
            buttonsContainer.removeChild(startButton);
        } else { /* if swappedbutton === resetbutton */
            buttonsContainer.appendChild(startButton);
            buttonsContainer.removeChild(resetButton);
        }
        console.log(button);
        console.log(buttonsContainer);
        console.log('buttons swapped')
    }

    function displayWinner(player) {
        message = winnerDialog.querySelector('.message');
        message.textContent = `Winner: ${player.getName()}`;
        winnerDialog.showModal();
    }
    
    function displayDraw() {
        message = winnerDialog.querySelector('.message');
        message.textContent = `Draw`;
        winnerDialog.showModal();
    }

    function showPlayer(player, TIMEOUT_PERIOD) {
        currentPlayerDialog.textContent = `Current player: ${player}`;
        currentPlayerDialog.showModal();
        
        // settimeout can't be called directly like settimeout(currentplayerdialog.close, timeout)
        // cause it changes the context of close execution
        setTimeout(() => currentPlayerDialog.close(), TIMEOUT_PERIOD);
    }

    // now, changing these functions to display in the DOM
    return {displayBoard, swapButtons, displayWinner, displayDraw, showPlayer};
}) ();

let gameController = (function() {
    let playerOne;
    let playerTwo;
    let activePlayer; 
    let board = gameboard.getBoard();
    const TIMEOUT_PERIOD = 1000;
    // required later in the draw case
    let checkWinnerCount = 0;
    // prevent the default behaviour of submit, we're gonna do that
    let playerNameSubmit = playerFormDialog.querySelector('.player-name-submit');
    playerNameSubmit.addEventListener('click', (e) => {
        e.preventDefault();

        // board is only created after the players have given their names
        displayController.displayBoard();
        gameboard.createBoard();
        displayController.swapButtons();
        
        let player1 = playerFormDialog.querySelector('#player-one-name').value;
        let player2 = playerFormDialog.querySelector('#player-one-name').value;
        setPlayerNames(player1, player2);
        playerFormDialog.close();

        // show the first player for TIMEOUT_PERIOD and then create the board 
        displayController.showPlayer(activePlayer.getName(), TIMEOUT_PERIOD);
    });

    function resetCheckWinnerCount() {
        checkWinnerCount = 0;
    }
    
    function setPlayerNames(playerOneN, playerTwoN) {
        let playerOneName = playerOneN || "PlayerOne";
        let playerTwoName = playerTwoN || "PlayerTwo";
        playerOne = createPlayer(playerOneName, "x");
        playerTwo = createPlayer(playerTwoName, "o");
        activePlayer = playerOne;    
    }

    function changeActivePlayer() {
        activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
    }

    function checkWinner() {
        let marker = activePlayer.getMarker();
        let boardMarkers = [];
        board.forEach((row, i) => {
            boardMarkers[i] = [];
            row.forEach(cell => {
                boardMarkers[i].push(cell.getMark());
            });
        });

        // for the rows 
        function rowCheck() {
            for (let i = 0; i < boardMarkers.length; i++) {
                // reset marker count for each row
                let markerCount = 0;
                for (let j = 0; j < boardMarkers.length; j++) {
                    if (boardMarkers[i][j] === marker) {
                        markerCount++;
                    }
                }
                // check marker count for each row, after it finishes checking
                if (markerCount === 3) {
                    return true;
                }
            }
            return false;
        }

        // for the columns
        // this freaking thing is not working
        function columnCheck() {
            let colCount = [0, 0, 0];
            for (let i = 0; i < boardMarkers.length; i++) {
                for (let j = 0; j < boardMarkers.length; j++) {
                    if (boardMarkers[i][j] === marker) {
                        colCount[j] ++;
                    }
                }
            }
            if (colCount.includes(3)) {
                return true;
            } else {
                return false;
            }
        }

        // for main and cross diagonals
        function diagonalCheck() {
            let mainDiagonalCount = 0, crossDiagonalCount = 0;
            for (let i = 0; i < boardMarkers.length; i++) {
                if (marker === boardMarkers[i][i]) {
                    mainDiagonalCount++;
                } 
                if (marker === boardMarkers.at(i).at(boardMarkers.length - i - 1)) {
                    crossDiagonalCount++;
                }
            }
            if (mainDiagonalCount === 3 || crossDiagonalCount === 3) {
                return true;
            } else {
                return false;
            }
        }

        // checkwinner returns true if any of them return true
        return rowCheck() || columnCheck() || diagonalCheck();
    }
    
    function playRound(position) {
        // only for the console, I'spose
        let board = gameboard.getBoard();
        let positions = gameboard.getPositions();
        let rowNumber;
        let cellNumber;
        positions.forEach(row => {
            if (row.includes(position)) {
                rowNumber = positions.indexOf(row);
                cellNumber = position - 3 * rowNumber - 1;
            }
        });

        let cell = board[rowNumber][cellNumber];

        if (!cell.isMarked()) {
            cell.setMark(activePlayer.getMarker());
            
            // check to see the winner
            checkWinnerCount++;
            if (checkWinner()){
                displayController.displayWinner(activePlayer);
                console.log('working')
            };
            
            displayController.displayBoard();
            
            changeActivePlayer();
        }
        if (checkWinnerCount === 9) {
            displayController.displayDraw();
        }
        console.log(`Turn: ${activePlayer.getName()} Marker: ${activePlayer.getMarker()}`);
    }

    // and everything begins with playGame
    function playGame() {
        playerFormDialog.showModal();
        // rest of the work is done by modal button's event listener
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function getTimeOutTime() {
        return TIMEOUT_PERIOD;
    }
    
    return {playRound, checkWinner, changeActivePlayer, 
            playGame, setPlayerNames, resetCheckWinnerCount, 
            getActivePlayer, getTimeOutTime};
}) ();

startButton.addEventListener('click', () => {
    gameController.playGame();
});

resetButton.addEventListener('click', () => {
    gameboard.resetBoard();
    displayController.showPlayer(gameController.getActivePlayer().getName(), gameController.getTimeOutTime());
})

ticTacBoard.addEventListener('click', (e) => {
    let markerContainers = Array.from(ticTacBoard.querySelectorAll('.marker-container'));
    let markerContainer = e.target;
    if (markerContainers.includes(markerContainer)) {
        let id = markerContainer.getAttribute('id');
        gameController.playRound(+ id);
    }
});

winnerDialog.addEventListener('click', (e) => {
    if (Array.from(e.target.classList).includes('play-again-button')) {
        gameboard.resetBoard();
        winnerDialog.close();
        displayController.showPlayer(gameController.getActivePlayer().getName(), gameController.getTimeOutTime());
    } else if (Array.from(e.target.classList).includes('end-game-button')) {
        gameboard.resetBoard();
        container.removeChild(ticTacBoard);
        displayController.swapButtons();
        winnerDialog.close();
    }
})

document.addEventListener('DOMContentLoaded', () => {
    buttonsContainer.appendChild(startButton);
})

// TODO: winnerDialog is not closing, unexpectedly, idk what's wrong