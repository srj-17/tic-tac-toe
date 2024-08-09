// make a working project in the console first with foundations laid out
// foundations -> gameboard, cell, gamecontroller

const container = document.querySelector('.container');
const ticTacBoard = document.createElement('div');
ticTacBoard.classList.add('tictactoe-board');
const buttonsContainer = document.querySelector('.buttons');
const startButton = document.querySelector('.start');
const resetButton = document.createElement('button');
resetButton.classList.add('reset');
resetButton.textContent = 'Reset';
let markerContainers;
const winnerDialog = document.querySelector('.winner-dialog');

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
                    markerContainer.textContent = cell.getMark();
                }
                ticTacBoard.appendChild(markerContainer);
            })
        });
    }

    // swaps the start and reset buttons
    function swapButtons() {
        buttonsContainer.replaceChild(resetButton, startButton);
    }

    function displayWinner(player) {
        winnerDialog.textContent = `Winner: ${player.getName()}`;
        winnerDialog.showModal();
    }

    // now, changing these functions to display in the DOM
    return {displayBoard, swapButtons, displayWinner};
}) ();

let gameController = (function() {
    let playerOne = createPlayer("PlayerOne", "x");
    let playerTwo = createPlayer("PlayerTwo", "o");
    let activePlayer = playerOne;    
    let board = gameboard.getBoard();

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
            if (checkWinner()){
                displayController.displayWinner(activePlayer);
            };
            
            displayController.displayBoard();

            changeActivePlayer();
        }
        console.log(`Turn: ${activePlayer.getName()} Marker: ${activePlayer.getMarker()}`);
    }

    // and everything begins with playGame
    function playGame() {
        let count = 0;
        gameboard.createBoard();
        displayController.swapButtons();
    }
    
    return {playRound, checkWinner, changeActivePlayer, playGame};
}) ();

startButton.addEventListener('click', () => {
    displayController.displayBoard();
    gameController.playGame();
});

resetButton.addEventListener('click', () => {
    gameboard.resetBoard();
})

ticTacBoard.addEventListener('click', (e) => {
    let markerContainers = Array.from(ticTacBoard.querySelectorAll('.marker-container'));
    let markerContainer = e.target;
    if (markerContainers.includes(markerContainer)) {
        let id = markerContainer.getAttribute('id');
        gameController.playRound(+ id);
    }
});