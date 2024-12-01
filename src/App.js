import { useState, useEffect } from 'react';
import './App.css';

// Square component to create buttons on the board displaying a given value on click
function Square({ value, onSquareClick, isWinner }) {
    return (
        <button className={`square ${isWinner ? 'winner' : ''}`} onClick={onSquareClick}>
            {value}
        </button>
    );
}

// Board component to handle moves and board status
function Board({ xIsNext, squares, onPlay }) {
    const [winningSquares, setWinningSquares] = useState([]);

    // If there is a winner, set the winning squares for animation
    useEffect(() => {
        const winner = calculateWinner(squares);
        if (winner) {
            setWinningSquares(winner.line);
        } else {
            setWinningSquares([]);
        }
    }, [squares]);

    function handleClick(i) {
        // On each click of the square, check if someone has won or if the square is already filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        // Otherwise, fill the square with the player whose turn it currently is
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        }
        else {
            nextSquares[i] = 'O';
        }
        // Call the onPlay prop function with the new board status
        onPlay(nextSquares);
    }

    // Check if there is a winner or tie and update game status accordingly
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner.player;
    }
    else if (squares.every(square => square !== null)) {
        status = 'It\'s a tie!';
    }
    else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                {[0, 1, 2].map(i => (
                    <Square
                        key={i}
                        value={squares[i]}
                        onSquareClick={() => handleClick(i)}
                        isWinner = {winningSquares.includes(i)}
                    />
                ))}
            </div>
            <div className="board-row">
                {[3, 4, 5].map(i => (
                    <Square
                        key={i}
                        value={squares[i]}
                        onSquareClick={() => handleClick(i)}
                        isWinner = {winningSquares.includes(i)}
                    />
                ))}
            </div>
            <div className="board-row">
                {[6, 7, 8].map(i => (
                    <Square
                        key={i}
                        value={squares[i]}
                        onSquareClick={() => handleClick(i)}
                        isWinner = {winningSquares.includes(i)}
                    />
                ))}
            </div>
        </>
    );
}

// Game component to manage all moves and game history and to display status, board, and history
export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    // Given an array of Square states, update game history and current move
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    // Give users the option to set the game to any given move in game history
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    // Display all moves in game history in a list with buttons to reset to those moves
    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        }
        else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <h1 className="header">Tic-Tac-Toe</h1>
            <div className="game-content">
                <div className="game-board">
                    <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>
        </div>
    );
}

// Calculate the winner by checking all horizontal and vertical lines of the board
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { player: squares[a], line: [a, b, c] };
        }
    }
    return null;
}
