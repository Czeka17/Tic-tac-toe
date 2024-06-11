import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]);
  const [score,setScore] = useState({X:0, O:0})
  const [Xturn,setXturn] = useState(true)
  const [winner,setWinner] = useState('')
  const [level,setLevel] = useState('easy')
  function click(row:number,col:number,turn:boolean){
    if(board[row][col] === '' && winner === ''){
    const newBoard = [...board]

    if(turn){
      newBoard[row][col] = 'X'
      setXturn(false)
      setBoard(newBoard)
    }else{
      newBoard[row][col] = 'O'
      setXturn(true)
      setBoard(newBoard)
    }
  }else if(winner != ''){
    console.log('Game is ended')
  }else{
    console.log('you cant do that')
  }
}
function checkWinner(player: string, board: string[][]): boolean {
  for (let i = 0; i < 3; i++) {
      if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
      if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
  }
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;

  return false;
}

function isBoardFull(board: string[][]): boolean {
  for (let row of board) {
      for (let cell of row) {
          if (cell === '') {
              return false;
          }
      }
  }
  return true;
}

const EMPTY = '';
const PLAYER = 'X';
const BOT = 'O';

interface Move {
    row: number;
    col: number;
}

function makeBestMove(board: string[][]): Move | null {
    let bestMove: Move | null = null;
    let bestScore = -Infinity;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === EMPTY) {
                board[i][j] = BOT;
                let score = minimax(board, 0, false);
                board[i][j] = EMPTY;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }

    return bestMove;
}

function minimax(board: string[][], depth: number, isMaximizing: boolean): number {
    if (checkWinner(BOT, board)) {
        return 10 - depth;
    } else if (checkWinner(PLAYER, board)) {
        return depth - 10;
    } else if (isBoardFull(board)) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === EMPTY) {
                    board[i][j] = BOT;
                    bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                    board[i][j] = EMPTY;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === EMPTY) {
                    board[i][j] = PLAYER;
                    bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                    board[i][j] = EMPTY;
                }
            }
        }
        return bestScore;
    }
}
function makeEasyMove(board: string[][]): Move | null {
  const emptyCells: Move[] = [];

  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (board[i][j] === EMPTY) {
              emptyCells.push({ row: i, col: j });
          }
      }
  }
  if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      return emptyCells[randomIndex];
  } else {
      return null;
  }
}
function makeMediumMove(board: string[][], player: string): Move | null {
  const opponent = (player === BOT) ? PLAYER : BOT;

  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (board[i][j] === EMPTY) {
              board[i][j] = player;
              if (checkWinner(player, board)) {
                  board[i][j] = EMPTY;
                  return { row: i, col: j };
              }
              board[i][j] = EMPTY;
          }
      }
  }

  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (board[i][j] === EMPTY) {
              board[i][j] = opponent;
              if (checkWinner(opponent, board)) {
                  board[i][j] = EMPTY;
                  return { row: i, col: j };
              }
              board[i][j] = EMPTY;
          }
      }
  }

  return makeEasyMove(board);
}




useEffect(() => {
  if (checkWinner('X', board)) {
    setWinner('X');
    setScore(prevScore => ({ ...prevScore, X: prevScore.X + 1 }));
    return;
}
if (checkWinner('O', board)) {
    setWinner('O');
    setScore(prevScore => ({ ...prevScore, O: prevScore.O + 1 }));
    return;
}
if (isBoardFull(board) && !winner) {
    setWinner('Remis');
}
  if (!Xturn && winner === '') {
      let botMove: Move | null;
      switch (level) {
          case "easy":
              botMove = makeEasyMove(board);
              break;
          case "medium":
              botMove = makeMediumMove(board, BOT);
              break;
          case "hard":
              botMove = makeBestMove(board);
              break;
          default:
              botMove = makeEasyMove(board);
              break;
      }
      
      if (botMove && winner === '') {
          const { row, col } = botMove;
          click(row, col, Xturn);
      }
  }
}, [board]);



function resetBoard(){
  setBoard([['', '', ''],
    ['', '', ''],
    ['', '', '']])
    setXturn(true)
    setWinner('')
}
const changeDifficulty = (difficulty:string) => {
    setLevel(difficulty)
    resetBoard()
}
  const renderBoard = () => {
    return (
        <div style={{ width:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row" style={{backgroundColor:'gray', display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} className="row" style={{backgroundColor:'white', width:"100px",height:"100px",display:"flex",alignItems:"center",justifyContent:"center",margin:'10px',borderRadius:'10px', fontSize:"2rem"}} onClick={() => click(rowIndex, colIndex,Xturn)}>
                            {cell}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

return (
    <div style={{width:'100%',height:"100vh"}}>
        <h1>Kółko i krzyżyk</h1>
        <h2>Wybierz poziom</h2>
        <button className={`btn ${level === 'easy' && 'active'}`} onClick={() => changeDifficulty('easy')}>Łatwy</button>
        <button className={`btn ${level === 'medium' && 'active'}`} onClick={() => changeDifficulty('medium')}>Średni</button>
        <button className={`btn ${level === 'hard' && 'active'}`} onClick={() => changeDifficulty('hard')}>Trudny</button>
        {renderBoard()}
        <button className='btn' onClick={resetBoard}>RESET</button>
        {winner && <p>Wygrał {winner}</p>}
        <p> GRACZ {score.X} : {score.O} BOT </p>
    </div>
);
}

export default App;
