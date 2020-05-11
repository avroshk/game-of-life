import React from 'react';
import './God.css';

const God = ({act}) => {
  return <div className="God" onClick={(e) => {e.preventDefault(); act();}}>
  </div>;
}

export default God;
