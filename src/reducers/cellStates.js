import Grid from '../utils/grid'

var grid = null;

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
  let cells = new Array(maxNumCells).fill(false);

  cells = cells.map((state, i) => {
    let col = (i%maxCols);
    let row = Math.floor(i/maxCols);

    if (grid) {
      if (col <= grid.N && row <= grid.M) {
        let index = (row*grid.M)+col;
        if (index < grid.cells.length) {
          return grid.cells[index];
        }
      }
    }

    if (random) {
      return Math.round(Math.random()) > 0 ? true : false;
    }
    if (row === 33 || row === 34 || row === 35) {
      if (col === 25) {
        return true;
      }
    }
    // if (col%13 === 0) {
    //   return true;
    // }
    // if (
    //   (row === 24 && col === 25) ||
    //   (row === 25 && col === 25) ||
    //   (row === 25 && col === 26) ||
    //   (row === 26 && col === 24) ||
    //   (row === 26 && col === 25)
    // ) {
    //   return true;
    // }
    return state;
  });

  grid = new Grid(
    cells,
    0,
    { M: maxCols, N: maxRows },
    {
      L: () => new Array(maxRows).fill(false),
      R: () => new Array(maxRows).fill(false),
      U: () => new Array(maxCols).fill(false),
      D: () => new Array(maxCols).fill(false),
      LUx: () => false,
      LDx: () => false,
      RUx: () => false,
      RDx: () => false
    }
  )
  return {
    cells: grid.cells,
    M: grid.M,
    N: grid.N,
    generation: grid.generation,
    lastEditedRow: null,
    lastEditedCol: null,
  };
}

const toggleCellStates = (row, col) => {
  let cells = grid.cells;
  let index = (row*grid.M)+col;
  cells[index] = !cells[index];
  return {
    cells: cells,
    M: grid.M,
    N: grid.N,
    generation: grid.generation,
    lastEditedRow: row,
    lastEditedCol: col,
  };

  // let newCellStates = JSON.parse(JSON.stringify(cellStates));
  // if (cellIndex in newCellStates) {
  //   newCellStates[cellIndex].dead = !newCellStates[cellIndex].dead;
  // }
  // return newCellStates;
}

export const cellStatesReducer = (state, action) => {
  switch (action.type) {
    case 'init':
      return getInitialCellState({
        spaceWidth: action.spaceLimits.width,
        spaceHeight: action.spaceLimits.height,
        cellSize: action.cellSize,
        numCells: action.numCells,
        random: action.random
      });
    case 'start': grid.tones.init();
    case 'next': return grid.getNextState();
    // case 'refresh': return updateCellSpaceCoords(action.spaceLimits);
    case 'toggle': return toggleCellStates(action.row, action.col);
    default: throw new Error('Unexpected action');
  }
};
