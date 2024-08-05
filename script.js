// making the game first playable in the terminal 

let gameboard = (function() {
    board = [];
    height = 3;
    width = 3;

    for (let i = 0; i < width; i++) {
        board[i] = [];
        for (let j = 0; j < height; j++) {
            board[i] = board[i].concat("*"); 
        }
    }

    function getBoard() {
        return board;
    }

    return {getBoard};
}) ();  

