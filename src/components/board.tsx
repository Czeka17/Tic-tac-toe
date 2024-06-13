import React from 'react';
import Cell from './cell';

interface BoardProps {
  board: string[][];
  click: (row: number, col: number, turn: boolean, board: string[][], setBoard: React.Dispatch<React.SetStateAction<string[][]>>, setXturn: React.Dispatch<React.SetStateAction<boolean>>, winner: string) => void;
  Xturn: boolean;
  winner: string;
  setBoard: React.Dispatch<React.SetStateAction<string[][]>>;
  setXturn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Board: React.FC<BoardProps> = ({ board, click, Xturn, winner, setBoard, setXturn }) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {row.map((cell, colIndex) => (
            <Cell key={colIndex} value={cell} onClick={() => click(rowIndex, colIndex, Xturn, board, setBoard, setXturn, winner)} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
