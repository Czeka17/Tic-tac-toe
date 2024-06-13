import React, { useEffect, useState } from 'react';
import './App.css';
import Board from './components/board';
import Controls from './components/controls';
import GameStatus from './components/gameStatus';
import { click, checkWinner, isBoardFull, makeBestMove, makeMediumMove, makeEasyMove, expandBoard } from './components/gameLogic';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');
const App: React.FC = () => {
  const [board, setBoard] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);
  const [score, setScore] = useState<{ X: number, O: number }>({ X: 0, O: 0 });
  const [Xturn, setXturn] = useState<boolean>(true);
  const [winner, setWinner] = useState<string>('');
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard' | ''>('');
  const [isLevelSelected,setIsLevelSelected] = useState(false)
  const [room, setRoom] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isWaitingForPlayer, setIsWaitingForPlayer] = useState(false);
  const [wasExpanded, setWasExpanded] = useState(false)

  useEffect(() => {
    console.log('effect')
    if(level !== ''){
      const pointsX = checkWinner('X',board);
      const pointsO = checkWinner('O',board);
      if(pointsX > 0 || pointsO){
        setScore(prevScore => ({
          X: prevScore.X + pointsX,
          O: prevScore.O + pointsO
        }));
      }

      if (isBoardFull(board) && !wasExpanded) {
        setBoard(expandBoard(board));
        setWasExpanded(true)
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
          setTimeout(() => {
              click(row, col, Xturn, board, setBoard, setXturn, winner);
          
            }, 200);
        }
      }
    }
  }, [board, Xturn, level,wasExpanded,winner]);

  useEffect(() => {
    socket.on('roomCreated', (roomId) => {
      setRoomId(roomId);
      setIsWaitingForPlayer(true);
      setIsGameStarted(true)
    });

    socket.on('updateRoom', (game) => {
      setBoard(game.board);
      setXturn(game.Xturn);
      setWinner(game.winner);
    });

    socket.on('startGame', () => {
      setIsGameStarted(true);
      setIsWaitingForPlayer(false);
    });

    socket.on('roomFull', () => {
      alert('Pokój jest pełny');
    });

    socket.on('roomNotFound', () => {
      alert('Pokój nie został znaleziony');
    });
    socket.on('opponentDisconnected', () => {
      alert('Twój przeciwnik się rozłączył');
      setRoom('');
      setRoomId('');
      setIsGameStarted(false);
      resetBoard();
    });

    return () => {
      socket.off('roomCreated');
      socket.off('updateRoom');
      socket.off('startGame');
      socket.off('roomFull');
      socket.off('roomNotFound');
      socket.off('opponentDisconnected');
    };
  }, []);

  const resetBoard = () => {
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    setXturn(true);
    setWinner('');
    setWasExpanded(false)
  };

  const resetRoomBoard = (roomId:string) => {
    socket.emit('resetRoomBoard', roomId)
    setBoard([
      ["","",""],
      ["","",""],
      ["","",""]
    ])
  }

  const createRoom = () => {
    socket.emit('createRoom');
  };

  const joinRoom = (roomId: string) => {
    socket.emit('joinRoom', roomId);
    setRoomId(roomId);
  };

  const Playerclick = (row: number, col: number) => {
    if (board[row][col] === '' && winner === '') {
      socket.emit('makeMove', { roomId, row, col });
    }
  };
  const changeDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setLevel(difficulty);
    resetBoard();
    setIsLevelSelected(true)
  };
  const changeDifficultyScreen = () =>{
    setIsLevelSelected(false)
    setScore({X:0,O:0})
  }


  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <h1>Kółko i krzyżyk</h1>
      {isLevelSelected || isWaitingForPlayer || roomId ? <div>
        <h2>Level: {level}</h2>
        <p>X:{Xturn ? "x" : "o"}</p>
        {roomId && <p>{roomId}</p>}
      <Board board={board} click={roomId ? Playerclick : click} Xturn={Xturn} winner={winner} setBoard={setBoard} setXturn={setXturn} />
      <GameStatus winner={winner} score={score} />
      <button className="btn" onClick={() =>resetRoomBoard(roomId)}>RESET</button>
      <button className="btn" onClick={changeDifficultyScreen}>Change difficulty</button>
      </div> : <Controls level={level} changeDifficulty={changeDifficulty} resetBoard={resetRoomBoard} room={room} setRoom={setRoom} createRoom={createRoom} joinRoom={joinRoom} roomId={roomId} />}
    </div>
  );
}

export default App;
