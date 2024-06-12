import React from 'react';

interface GameStatusProps {
  winner: string;
  score: { X: number; O: number };
}

const GameStatus: React.FC<GameStatusProps> = ({ winner, score }) => {
  return (
    <div>
      {winner && <p>Wygrał {winner}</p>}
      <p>GRACZ {score.X} : {score.O} BOT</p>
    </div>
  );
}

export default GameStatus;
