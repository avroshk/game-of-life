import React, { useState, useEffect, useReducer } from 'react';
import Cell from './Cell'

// const Cells = ({cellStates, dispatch}) => {
//   let cells = [];
//   for (let cellIndex of Object.keys(cellStates)) {
//     let cell = cellStates[cellIndex];
//     cells.push(<Cell
//       key={`${cell.row},${cell.col}`}
//       dead={cell.dead}
//       row={cell.row}
//       col={cell.col}
//       toggle={(row, col) => {dispatch({type: 'toggle', cellIndex: `${row},${col}`});}}
//     />);
//   }
//   return cells;
// }

const Cells = ({cells, M, N}) =>
  cells.map((state, i) =>
    <Cell
      key={i}
      dead={!state}
      row={Math.floor(i/N)}
      col={(i%M)}
    />

export default Cells;

// {
//     let newCellStates = {...cellStates};
//     let newCellState = {...newCellStates[index]};
//     newCellState.dead = action;
//     newCellStates[index] = newCellState;
//     setCellStates({
//       ...newCellStates
//     });
//   }
