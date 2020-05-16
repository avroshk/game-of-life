import React from 'react';
import Cell from './Cell'

const Cells = ({cells, M, N, gen, dispatch, editing}) =>
  cells.map((state, i) =>
    <Cell
      key={i}
      dead={!state}
      row={Math.floor(i/N)}
      col={(i%M)}
      toggle={(force, e) => {
        // let row = Math.floor(i/M)
        // let col = i%M
        // if (editing || force) {
        //
        //   dispatch({type: 'toggle', row, col})
        //   // console.log(`* editing (${row},${col})(${force},${editing})`);
        // }
        // // else {
        // //   console.log(`just hovering (${row},${col})`)
        // // }
        // console.log(row, col)
        // // console.log(`M=${M}`, `N=${N}`, `i=${i}`, `row=${row}`, `col=${col}`, e.screenX, e.screenY, e.movementX, e.movementY)
        // // dispatch({type: 'toggle', row, col})
      }}
    />)

export default Cells;
