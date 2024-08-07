// make a working project in the console first with foundations laid out
// foundations -> gameboard, cell, gamecontroller


/* gameboard first
** gameboard is the representation of the state of the board
** and some other things
*/
let gameboard = (function() {
    let rows = 3;
    let columns = 3;
    let board = [];

    // this array represents the state of the gameboard,
    // since state shouldn't be stored in the dom since that's not what its for
    function createBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                // cell is an object that we will create later
                board[i].push(cell());
            }
        }
    }

    createBoard();

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

    return {createBoard, getBoard, getBoardMarkers};
}) ();

// cell stores the state of the particular cell
function cell() {
    let mark = null;
    setMark = (myMark) => {
        mark = myMark;
    }
    getMark = () => mark;

    return {getMark, setMark};
}

// player should be a new object controlled by gameController but not accessible by anyone else
function createPlayer(name, marker) {
    let getName = () => name;
    let getMarker = () => marker;
    return {name, marker, getName, getMarker};
}

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
        let cell = board[rowNumber][cellNumber];
        cell.setMark(activePlayer.getMarker());
        

        // check to see the winner
        if (checkWinner()){
            console.log(`Winner: ${activePlayer.getName()}`)
        };

        displayController.displayBoard();
        changeActivePlayer();
        console.log(`Turn: ${activePlayer.getName()} Marker: ${activePlayer.getMarker()}`);
    }
    
    return {playRound, checkWinner, changeActivePlayer};
}) ();

let displayController = (function() {
    // this we should probably get form the gameBoard rather than drawing it here
    function displayBoard() {
        let boardMarkers = gameboard.getBoardMarkers();
        boardMarkers.forEach(marker => {
            console.log(marker);
        })
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
    return {displayBoard, displayPositions, getPositions};
}) ();

// and everything begins with playGame
function playGame() {
    let count = 0;
    let position;
    console.log(gameboard.createBoard());
    while(true && count < 9) {
        count++;
        do {
            displayController.displayPositions();
            position = Number(prompt("Position (one from the console): "))
            
            // if user presses cancel, prompt returns null
            if (position === null) {
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
            gameController.changeActivePlayer()
            
            // TODO: activePlayer changes after invoking above, so it doesn't check the winner in *that* round
        } else { /* if position null dincha bhane */
            break;
        }
    }
    console.log("Thanks for playing");
}

// TODO: prevent users from reentering the already entered positions
// TODO: end the game after winning
//       asking them for the replay isn't necessary cause we'll do that with the ui
// i can't change the position of changeactiveplayer() yet, but in the future, will do