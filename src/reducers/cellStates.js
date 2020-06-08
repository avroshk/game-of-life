import { Grid } from '../utils/grid'

var grid = null;
var hoverGrid = null;

export const getInitialCellState = ({
  spaceWidth,
  spaceHeight,
  cellSize,
  numCells,
  random,
  gridContext,
  cellsContext,
  highlightCellsContext
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
    // if (row === 33 || row === 34 || row === 35) {
    //   if (col === 25) {
    //     return true;
    //   }
    // }
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

  if (grid) {
    gridContext = grid.drawGrid.context;
    cellsContext = grid.drawCells.context;
  }

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
    },
    {
      gridContext,
      cellsContext
    }
  );

  hoverGrid = new Grid(
    new Array(maxNumCells).fill(false),
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
    },
    {
      highlightCellsContext
    }
  );

  return {
    generation: grid.generation,
    lastEditedRow: null,
    lastEditedCol: null,
    lastHighlightedRow: null,
    lastHighlightedCol: null
  };
}

export const cellStatesReducer = (state, action) => {
  switch (action.type) {
    case 'init':
      return getInitialCellState({
        spaceWidth: action.spaceLimits.width,
        spaceHeight: action.spaceLimits.height,
        cellSize: action.cellSize,
        numCells: action.numCells,
        random: action.random,
        gridContext: action.gridContext,
        cellsContext: action.cellsContext,
        highlightCellsContext: action.highlightCellsContext,
      });
    case 'hover': {
      let row = action.row;
      let col = action.col;
      let index = (row*hoverGrid.M)+col;
      if (index < hoverGrid.cells.length) {
        hoverGrid.cells[index] = true;
        setTimeout(() => {
          hoverGrid.cells[index] = false;
        }, 250);
      }
      return {
        ...state,
        lastHighlightedRow: row,
        lastHighlightedCol: col,
      };
    }
    case 'next': {
      grid.getNextState();
      return {
        ...state,
        generation: grid.generation,
      };
    }
    case 'toggle': {
      grid.toggleCell(action.row, action.col);
      return {
        ...state,
        lastEditedRow: action.row,
        lastEditedCol: action.col,
      };
    }
    default: throw new Error('Unexpected action');
  }
};
