import React, { useState } from 'react';
import './Cell.css';

const Cell = ({row, col, dead, toggle}) => {
  let [bubbleActive, setBubbleActive] = useState(false);
  return <div
    className={"Cell " + (dead ? "dead " : "")}
    onMouseDown={() => {toggle(row,col)}}>
    <div className={"bubble " + (bubbleActive ? "show" : "")}>({row},{col})</div>
  </div>;
}

export default Cell;
