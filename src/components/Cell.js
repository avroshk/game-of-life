import React, { useState } from 'react';
import './Cell.css';

const _Cell = ({dead, toggle}) => {
  let [bubbleActive, setBubbleActive] = useState(false);
  return <div
    className={"Cell " + (dead ? "dead " : "")}
    onMouseDown={(e) => toggle(true, e)}>
  </div>;
}

const Cell = React.memo(_Cell);

export default Cell;

/* <div className={"bubble " + (bubbleActive ? "show" : "")}>({row},{col})</div> */
