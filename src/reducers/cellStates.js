import { Grid } from '../utils/grid'

var grid = null;
var hoverGrid = null;

const HOVER_HIGHLIGHT_FADE_AWAY_TIME = 250;

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
    lastHighlightedCol: null,
    lastMouseDown: false,
    lastDraggedRow: null,
    lastDraggedCol: null,
  };
}

const findPoints = ({x1, y1, x2, y2}) => {
  let points = [];
  let num = y2-y1;
  let den = x2-x1;

  let slope = 0;
  let steps = 0;
  let increment = 0;

  if (den === 0) {
    steps = Math.abs(num)-1;
    increment = num < 0 ? -1 : 1;
    [...Array(steps).keys()].map(i => {
      points.push({x: x1, y: y1+(i+1)*increment});
    });
    return points;
  }
  if (num === 0) {
    steps = Math.abs(den)-1;
    increment = den < 0 ? -1 : 1;
    [...Array(steps).keys()].map(i => {
      points.push({x: x1+(i+1)*increment, y: y1});
    });
    return points;
  }

  slope = num/den;
  let intercept = y1-slope*x1;
  let xSteps = Math.abs(den)-1;
  let ySteps = Math.abs(num)-1;
  let xIncrement = den < 0 ? -1 : 1;
  let yIncrement = num < 0 ? -1 : 1;

  if (x1 === null || x2 === null || y1 === null || y2 === null) {
    return points
  }

  [...Array(xSteps).keys()].map(i => {
    let x = x1+(i+1)*xIncrement;
    let y = Math.ceil(slope*x+intercept);
    points.push({x, y});
  });

  [...Array(ySteps).keys()].map(i => {
    let y = y1+(i+1)*yIncrement;
    let x = Math.ceil((y-intercept)/slope);
    points.push({x, y});
  });

  // console.log(steps, slope)
  // if (steps > 0) {
  //
  // }

  // if (steps > 1) {
  //   console.log(steps, slope)
  //   debugger;
  // }

  // [...Array(steps).keys()].map(i => {
  //   let x = x1 + i*(increment);
  //   let y = slope*x;
  //   console.log(x,y);
  // });

  // ...Array[steps]

  // console.log('\t\t', steps)

  // for (let x=x1+increment; x<x1+steps*increment; x=x+increment) {
  //   points.push({x, y: Math.ceil(slope*x)})
  // }
  return points;
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
        }, HOVER_HIGHLIGHT_FADE_AWAY_TIME);
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
      if (action.row >= 0 && action.col >= 0 && action.row < grid.N && action.col < grid.M) {
        grid.toggleCell(action.row, action.col);
        if (action.fill) {
          // console.log('*', `(${action.row},${action.col})`, `(${state.lastEditedRow},${state.lastEditedCol})`)
          const points = findPoints({x1:action.col, y1:action.row, x2: state.lastEditedCol, y2:state.lastEditedRow})
          console.log('\t', points);

          points.map(({x, y}) => {
            grid.toggleCell(y, x);
          })
        }
      }
      return {
        ...state,
        lastEditedRow: action.row,
        lastEditedCol: action.col,
        lastMouseDown: action.mouseDown
      };
    }
    default: throw new Error('Unexpected action');
  }
};
