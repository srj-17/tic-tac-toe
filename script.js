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
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            // cell is an object that we will create later
            board[i].push(cell());
        }
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

    return {getBoard, getBoardMarkers};
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
        console.log(`Turn: ${activePlayer.getName()} Marker: ${activePlayer.getMarker()}`);
    }

    function checkWinner() {
        let marker = activePlayer.getMarker();
        let boardMarkers = gameboard.getBoardMarkers();

        // for the rows 
        function rowCheck() {
            boardMarkers.forEach(row => {
                // resets for each row
                let markerCount = 0;
                row.forEach(pos => {
                    if(marker === pos) {
                        markerCount++;
                    }
                });
                if (markerCount === 3) {
                    return true;
                } 
            });
            return false;
        }

        // for the columns
        function columnCheck() {
            let colCount = [0, 0, 0];
            boardMarkers.forEach(row => {
                row.forEach(pos => {
                    if (pos === marker) {
                        colCount[row.indexOf(pos)]++;
                    }
                });
            });
            if (colCount.includes(3)) {
                console.log(colCount);
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
        console.log(`${rowCheck()} ${columnCheck()} ${diagonalCheck()}`)
        return rowCheck() || columnCheck() || diagonalCheck();
    }
    
    function playRound(position) {
        // only for the console, I'spose
        let board = gameboard.getBoard();
        let positions = displayController.getPositions();
        let rowNumber = null;
        let cellNumber = null;
        positions.forEach(row => {
            if (row.includes(position)) {
                rowNumber = positions.indexOf(row);
                cellNumber = position - 3 * rowNumber - 1;
            }
        });
        
        let cell = board[rowNumber][cellNumber];
        cell.setMark(activePlayer.getMarker());
        
        
        // check to see the winner
        if (checkWinner()){
            console.log(`Winner: ${activePlayer.getName()}`)
        };

        displayController.displayBoard();
        changeActivePlayer();
    }
    
    return {playRound};
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
    let position
    while(true) {
        count++;
        do {
            position = Number(prompt("Position (one from the console): "))
            displayController.displayPositions();
        } while (position > 9 || position < 0);
        gameController.playRound();
    }
}