import React from 'react';

interface CellProps {
  value: string;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  return (
    <div className={`${value ? '' : 'clickable'}`} style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', borderRadius: '10px', fontSize: '2rem',border:'1px solid white' }} onClick={onClick}>
        <div className={`cell ${value ? 'appear' : ''}`}
        >
            {value}
        </div>
      
    </div>
  );
}

export default Cell;
