import React from 'react';

interface CellProps {
  value: string;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  return (
    <div className="cell" style={{ backgroundColor: 'white', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', borderRadius: '10px', fontSize: '2rem' }} onClick={onClick}>
      {value}
    </div>
  );
}

export default Cell;
