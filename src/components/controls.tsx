import React from 'react';

interface ControlsProps {
  level: 'easy' | 'medium' | 'hard' | '';
  changeDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  resetBoard:(roomId:string) => void;
  room:string;
  setRoom: (roomId:string) => void
  createRoom: () => void;
  joinRoom:(roomId:string) => void;
  roomId: string;
}

const Controls: React.FC<ControlsProps> = ({ level, changeDifficulty,roomId,setRoom,createRoom,joinRoom,room }) => {
  return (
    <div>
      <h2>Select bot difficulty</h2>
      <button className={`btn ${level === 'easy' && 'active'}`} onClick={() => changeDifficulty('easy')}>Łatwy</button>
      <button className={`btn ${level === 'medium' && 'active'}`} onClick={() => changeDifficulty('medium')}>Średni</button>
      <button className={`btn ${level === 'hard' && 'active'}`} onClick={() => changeDifficulty('hard')}>Trudny</button>
      <h2>Play with other player</h2>
      <div>
          <h2>Dołącz do pokoju</h2>
          <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
          <button onClick={() => joinRoom(room)}>Dołącz</button>
          <button onClick={createRoom}>Stwórz nowy pokój</button>
          {roomId && <p>Kod pokoju: {roomId}</p>}
        </div>
    </div>
  );
}

export default Controls;
