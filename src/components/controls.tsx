import React from 'react';

interface ControlsProps {
  level: 'easy' | 'medium' | 'hard';
  changeDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  resetBoard: () => void;
}

const Controls: React.FC<ControlsProps> = ({ level, changeDifficulty }) => {
  return (
    <div>
      <h2>Wybierz poziom</h2>
      <button className={`btn ${level === 'easy' && 'active'}`} onClick={() => changeDifficulty('easy')}>Łatwy</button>
      <button className={`btn ${level === 'medium' && 'active'}`} onClick={() => changeDifficulty('medium')}>Średni</button>
      <button className={`btn ${level === 'hard' && 'active'}`} onClick={() => changeDifficulty('hard')}>Trudny</button>
    </div>
  );
}

export default Controls;
