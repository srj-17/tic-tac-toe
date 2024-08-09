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
                board[i].push(cell());
            }
        }
        displayController.displayBoard();
    }

    function getBoard() {
        return board;
    }

    function getBoardMarkers() {
        let marks = [];
        board.forEach(row => {
            let rowMarks = [];
            row.forEach(cell => {
                rowMarks.push(cell.getMark());
            })
            marks.push(rowMarks);
        });
        return marks;
    }

    function resetBoard() {
        board.forEach(row => {
            row.forEach(cell => {
                cell.resetMark();
            })
        });

        displayController.displayBoard();
    }

    return {getBoard, getBoardMarkers, createBoard, resetBoard};
}) ();

// cell stores the state of the particular cell
function cell() {
    let mark = null;
    setMark = (myMark) => {
        if (!mark) {
            mark = myMark;
        }
    }
    resetMark = () => {
        mark = null;
    }
    getMark = () => mark;
    isMarked = () => mark ? true : false;

    return {getMark, setMark, isMarked, resetMark};
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
                
                console.log(cell.getMark());
            })
        });
    }

    // only for console version
    let positions = [];
    for (let i = 0; i < 3; i++) {
        let row = [];
        for (let j = 0; j < 3; j++) {
            row.push(3 * i + j + 1);
        }
        positions.push(row);
    } 

    function displayPositions() {
        positions.forEach(row => {
            console.log(row);
        });
    }

    function getPositions() {
        return positions;
    }

    // swaps the start and reset buttons
    function swapButtons() {
        buttonsContainer.replaceChild(resetButton, startButton);
    }

    // now, changing these functions to display in the DOM
    return {displayBoard, displayPositions, getPositions, swapButtons};
}) ();

let gameController = (function() {
    let playerOne = createPlayer("PlayerOne", "x");
    let playerTwo = createPlayer("PlayerTwo", "o");
    let activePlayer = playerOne;    

    function changeActivePlayer() {
        activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
    }

    function checkWinner() {
        let marker = activePlayer.getMarker();
        let boardMarkers = gameboard.getBoardMarkers();

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
        displayController.displayBoard();
        // only for the console, I'spose
        let board = gameboard.getBoard();
        let positions = displayController.getPositions();
        let rowNumber;
        let cellNumber;
        positions.forEach(row => {
            if (row.includes(position)) {
                rowNumber = positions.indexOf(row);
                cellNumber = position - 3 * rowNumber - 1;
            }
        });

        console.log(`${rowNumber}, ${cellNumber}`)
        console.log(board)
        let cell = board[rowNumber][cellNumber];

        if (!cell.isMarked()) {
            cell.setMark(activePlayer.getMarker());
            
    
            // check to see the winner
            if (checkWinner()){
                console.log(`Winner: ${activePlayer.getName()}`)
            };
    
            displayController.displayBoard();
            changeActivePlayer();
        }
        console.log(`Turn: ${activePlayer.getName()} Marker: ${activePlayer.getMarker()}`);
    }

    // and everything begins with playGame
    function playGame() {
        let count = 0;
        let position;
        gameboard.createBoard();
        displayController.swapButtons();
        
        while(true && count < 9) {
            do {
                displayController.displayPositions();
                
                // TODO: prompt is not allowing the displayBoard to display the content immediately
                position = Number(prompt("Position (one from the console): "))
                
                // if user presses cancel, prompt returns 0
                if (position === 0) {
                    break;
                }
            } while (position > 9 || position < 1 || (position === ''));
            if (position) {
                gameController.playRound(position);
                
                // activePlayer gets changed every round at the end, so if you want to checkWinner for this, round
                // you have to do this
                gameController.changeActivePlayer()
                if (gameController.checkWinner()) {
                    break;
                } 
                
                // count the number of marked cells each time
                count = 0;
                gameboard.getBoard().forEach(row => {
                    row.forEach(cell => {
                        if (cell.isMarked()) {
                            count++;
                        }
                    })
                })
                gameController.changeActivePlayer()
                
            } else { /* if position null dincha bhane */
                break;
            }
        }
        
        gameController.changeActivePlayer();
        if (count === 9 && !gameController.checkWinner()) {
            console.log("That was a draw!")
        }
        // if we've already broken out of the game, no need to change the active player again

        console.log("Thanks for playing");
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
//       asking them for the replay isn't necessary cause we'll do that with the ui
// i can't change the position of changeactiveplayer() yet, but in the future, will do