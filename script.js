// making the game first playable in the terminal 

let gameBoard = (function() {
    let board = [];
    let height = 3;
    let width = 3;

    let positions = []

    for (let i = 0; i < width; i++) {
        board[i] = [];
        for (let j = 0; j < height; j++) {
            board[i] = board[i].concat(' '); 
        }
    }

    for (let i = 0; i < width; i++) {
        positions[i] = [];
        for (let j = 0; j < height; j++) {
            positions[i] = positions[i].concat(3 * i+j+1); 
        }
    }

    function getBoard() {
        return board;
    }

    function getPositions() {
        return positions;
    }

    function updateBoard(board) {

    }

    return {getBoard, getPositions};
}) ();  

let playerControl = (function() {
    let playerOne, playerTwo;

    createPlayer = function(name, mark) {
        // player is active by default
        let active = null;

        getMark = function() {
            return this.mark;
        }
        isActive = function() {
            return this.active;
        }
        toggleActive = function() {
            this.active = true ? false : true;
        }
        return {name, mark, getMark, isActive};
    }
    
    // setPlayerName should be able to handle situtations in which it doesn't get player name
    // and it must be called later cause we haven't set the playerOneName outside function
    function initializePlayers(firstPlayer, secondPlayer) {
        // gives 'x' or 'o' mark randomly
        playerOneMark = (Math.floor(Math.random() * 2) === 1)?
                        'x' : 'o'; 

        playerTwoMark = (playerOneMark === 'x') ? 'o' : 'x';
        playerOne = createPlayer(playerOne | "player1", playerOneMark);
        playerTwo = createPlayer(playerTwo | "player2", playerTwoMark);

        // set playerOne as active player and playerTwo as inactive player
        playerOne.toggleActive();
        playerTwo.toggleActive().toggleActive();
    }

    function changeActivePlayer() {
        playerOne.toggleActive();
        playerTwo.toggleActive();
    }

    function getActivePlayer() {
        if (playerOne.isActive()) {
            return playerOne;
        } else {
            return playerTwo;
        }
    }
    // first return what we want the player module
    return {getActivePlayer, changeActivePlayer, setPlayersName}
}) ();

let gameController = (function() {
    function setPlayers(player1, player2) {
        player1 = prompt("Whose player 1?");
        player2 = prompt("whose player 2?");
        playerControl.setPlayersName(player1, player2);
    }

    function playRound() {
        gameBoard.getPositions();
        do {
            position = prompt(`position for playing : ${playerControl.getActivePlayer().getMark()} 1-9`);
        } while (!position || ((position > 9) || (position < 0)));

        // TODO
        gameBoard.setMark(position);
    }
    return {setPlayers, setMark, drawBoard}
})

let displayController = (function() {
    function displayBoard() {
        let board = gameBoard.getBoard();
        for (let i = 0; i < 3; i++) {
            console.table(board[i].join(' '));
        }
    }
    return {displayBoard}
}) ();


// this is the "master" button that plays game
function playGame() {

}