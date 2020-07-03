import { Grid } from '../utils/grid'
import { Tones } from '../utils/tones'

var grid = null;
var hoverGrid = null;
const tones = null;

const HOVER_HIGHLIGHT_FADE_AWAY_TIME = 250;

export const getInitialCellState = ({
  spaceWidth,
  spaceHeight,
  cellSize,
  numCells,
  random,
  gridContext,
  cellsContext,
  highlightCellsContext,
  timeInterval
}) => {
  let padding = Math.ceil(cellSize*0.2)
  // cellSize = cellSize - padding*2
  let borderRadius = Math.ceil(cellSize/2)

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

    // glider
    if (
      (row === 1 && col === 1) ||
      (row === 2 && (col >= 2 && col <= 3)) ||
      (row === 3 && (col >= 1 && col <= 2))
    ) {
      return true;
    }

    // if (random) {
    //   return Math.round(Math.random()) > 0 ? true : false;
    // }
    // if (row === 12 || row === 13 || row === 14) {
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

  tones = new Tones(timeInterval/1000);

  grid = new Grid(
    cells,
    {cellSize, borderRadius, padding},
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
    {cellSize, borderRadius, padding},
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

// const range = (size, startAt = 0) => [...Array(size-startAt).keys()].map(i => i + startAt)
const distance = ({x1,y1},{x2,y2}) => Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))
const unitVector = ({x1,y1},{x2,y2},d) => ({x: (x2-x1)/d, y: (y2-y1)/d})
const addVectors = ({x1,y1},{x,y}) => ({x: x1+x, y: y1+y})
const roundVector = ({x,y}) => ({x: Math.round(x), y: Math.round(y)})

const joinPoints = ({x1,y1},{x2,y2}) => {
  const d = distance({x1,y1},{x2,y2})
  const v = unitVector({x1,y1}, {x2,y2}, d)
  let points = []
  let x = x1
  let y = y1

  // points.push({x: x1,y: y1})

  const numPoints = Math.round(d)
  if (numPoints > 1) {
    for (let i=1; i<numPoints; ++i) {
      const point = addVectors({x1: x,y1: y}, v)
      const roundedLastPoint = roundVector({x,y})
      const roundedPoint = roundVector(point)
      if (!((roundedLastPoint.x === roundedPoint.x) && (roundedLastPoint.y === roundedPoint.y))) {
        points.push(roundedPoint)
      }

      x = point.x
      y = point.y
    }
  }

  points.push({x: x2,y: y2})

  return points
}

const highlightCell = (row, col, lastRow, lastCol, fill=false) => {
  let acc = 0;
  if (lastCol !== null && lastRow !== null) {
    // setTimeout(() => {
    //   hoverGrid.toggleCell(lastRow, lastCol);
    // }, HOVER_HIGHLIGHT_FADE_AWAY_TIME);

    const points = joinPoints({x1:lastRow, y1:lastCol}, {x2:row, y2: col})
    if (points.length > 0) {
      points.map(({x,y}) => {
        if (fill) {
          grid.toggleCell(x, y);
        } else {
          hoverGrid.turnOnCell(x, y);
          setTimeout(() => {
            hoverGrid.turnOffCell(x, y);
          }, HOVER_HIGHLIGHT_FADE_AWAY_TIME);
        }
      })
    }
  }
  // hoverGrid.toggleCell(row, col);
  // setTimeout(() => {
  //   hoverGrid.toggleCell(row, col);
  // }, HOVER_HIGHLIGHT_FADE_AWAY_TIME+acc);
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
        timeInterval: action.timeInterval,
      });
    case 'hover': {
      highlightCell(action.row, action.col, state.lastHighlightedRow, state.lastHighlightedCol);
      return {
        ...state,
        lastHighlightedRow: action.row,
        lastHighlightedCol: action.col,
      };
    }
    case 'mute':
      tones.setActive(action.mute)
      return {
        ...state
      };
    case 'next': {
      grid.getNextState();
      tones.playGridNotes(grid);
      return {
        ...state,
        generation: grid.generation,
      };
    }
    case 'toggle': {
      if (action.row >= 0 && action.col >= 0 && action.row < grid.N && action.col < grid.M) {
        if ((state.lastEditedRow !== null && state.lastEditedCol !== null) && action.fill) {
          highlightCell(action.row, action.col, state.lastEditedRow, state.lastEditedCol, true)
        } else {
          grid.toggleCell(action.row, action.col);
        }
      }
      return {
        ...state,
        lastEditedRow: action.row,
        lastEditedCol: action.col,
        lastHighlightedRow: action.row,
        lastHighlightedCol: action.col,
        lastMouseDown: action.mouseDown
      };
    }
    default: throw new Error('Unexpected action');
  }
};
