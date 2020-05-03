import Grid from '../utils/grid'

export const _getInitialCellState = ({

}) => {
  // let maxCols = Math.floor(spaceWidth/cellSize);
  // let maxRows = Math.floor(spaceHeight/cellSize);
  // let maxNumCells = Math.max(maxCols*maxRows, numCells);
  // let cells = new Array(maxNumCells).fill(false);
  //
  // let M = maxRows;
  // let N = maxCols;
  // const grid = new Grid(
  //   cells,
  //   0,
  //   { M: M, N: N },
  //   {
  //     L: () => new Array(N).fill(false),
  //     R: () => new Array(N).fill(false),
  //     U: () => new Array(M).fill(false),
  //     D: () => new Array(M).fill(false),
  //     LUx: () => false,
  //     LDx: () => false,
  //     RUx: () => false,
  //     RDx: () => false
  //   }
  // )
}

export const getInitialCellState = ({
  spaceWidth,
  spaceHeight,
  cellSize,
  numCells,
  random
}) => {
  let maxCols = Math.floor(spaceWidth/cellSize);
  let maxRows = Math.floor(spaceHeight/cellSize);
  let maxNumCells = Math.max(maxCols*maxRows, numCells);
  let data = {};
  for(let i = 0; i < maxNumCells; i++) {
    let col = (i%maxCols);
    let row = Math.floor(i/maxCols);
    let index = `${row},${col}`;
    let st = true;
    if (random) {
      st = Math.round(Math.random()) > 0 ? true : false;
    }

    if (row === 3 || row === 4 || row === 5) {
      if (col === 4) {
        st = false;
      }
    }

    data[index] = {id: i, row: row, col: col, dead: st};
  }
  // let grids = [];
  // let gridCols = (maxCols/3);
  // let gridRows = (maxRows/3);
  // console.log(gridCols, gridRows)


  return data;
}

const nextCellStates = (cellStates) => {
  let newCellStates = JSON.parse(JSON.stringify(cellStates));
  for (let cellIndex of Object.keys(cellStates)) {
    let cell = cellStates[cellIndex];
    let vicinity = 0;
    for (let i=cell.row-1; i<cell.row+2; i++) {
      for (let j=cell.col-1; j<cell.col+2; j++) {
        let index = `${i},${j}`
        if ((index !== cellIndex) &&
          (index in cellStates) &&
          (!cellStates[index].dead)) {
            vicinity += 1;
        }
      }
    }
    if (cell.dead) {
      // dead
      if (vicinity === 3) {
        // bring to life
        newCellStates[cellIndex].dead = false;
      }
    } else {
      if (vicinity == 2 || vicinity == 3) {
        // let it live
      } else {
        // kill
        newCellStates[cellIndex].dead = true;
      }
    }
  }
  return newCellStates;
}

const updateCellSpaceCoords = (cellStates, spaceLimits) => {
  const newCellStates = getInitialCellState({
    spaceWidth: spaceLimits.width,
    spaceHeight: spaceLimits.height,
    cellSize: 14,
    numCells: 1000,
    random: false
  });
  for (let cellIndex of Object.keys(newCellStates)) {
    if (cellIndex in cellStates) {
        newCellStates[cellIndex].dead = cellStates[cellIndex].dead;
    }
  }
  return newCellStates;
}

const toggleCellStates = (cellStates, cellIndex) => {
  let newCellStates = JSON.parse(JSON.stringify(cellStates));
  if (cellIndex in newCellStates) {
    newCellStates[cellIndex].dead = !newCellStates[cellIndex].dead;
  }
  return newCellStates;
}

export const cellStatesReducer = (state, action) => {
  switch (action.type) {
    case 'current': return state;
    case 'next': return nextCellStates(state);
    case 'refresh': return updateCellSpaceCoords(state, action.spaceLimits);
    case 'toggle': return toggleCellStates(state, action.cellIndex)
    default: throw new Error('Unexpected action');
  }
};
