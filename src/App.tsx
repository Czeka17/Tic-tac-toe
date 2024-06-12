import React, { useEffect, useState } from 'react';
import './App.css';
import Board from './components/board';
import Controls from './components/controls';
import GameStatus from './components/gameStatus';
import { click, checkWinner, isBoardFull, makeBestMove, makeMediumMove, makeEasyMove } from './components/gameLogic';

const App: React.FC = () => {
  const [board, setBoard] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);
  const [score, setScore] = useState<{ X: number, O: number }>({ X: 0, O: 0 });
  const [Xturn, setXturn] = useState<boolean>(true);
  const [winner, setWinner] = useState<string>('');
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');

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
      let botMove = null;
      switch (level) {
        case 'easy':
          botMove = makeEasyMove(board);
          break;
        case 'medium':
          botMove = makeMediumMove(board, 'O');
          break;
        case 'hard':
          botMove = makeBestMove(board);
          break;
      }

      if (botMove && winner === '') {
        const { row, col } = botMove;
        click(row, col, Xturn, board, setBoard, setXturn, winner);
      }
    }
  }, [board, Xturn, level, winner]);

  const resetBoard = () => {
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    setXturn(true);
    setWinner('');
  };

  const changeDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setLevel(difficulty);
    resetBoard();
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <h1>Kółko i krzyżyk</h1>
      <Controls level={level} changeDifficulty={changeDifficulty} resetBoard={resetBoard} />
      <Board board={board} click={click} Xturn={Xturn} winner={winner} setBoard={setBoard} setXturn={setXturn} />
      <GameStatus winner={winner} score={score} />
      <button className="btn" onClick={resetBoard}>RESET</button>
    </div>
  );
}

export default App;
