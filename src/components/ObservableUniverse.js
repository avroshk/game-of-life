import React, { useState, useEffect, useReducer, useRef, createRef } from 'react';
import './ObservableUniverse.css'
import Cells from './Cells'
import God from './God'
import useWindowDimensions from '../hooks/windowDimensions'
import { cellStatesReducer } from '../reducers/cellStates'
import { Canvas } from "./Canvas";
import Hexagon from "./Hexagon";
import useCanvasDimensions from "../hooks/canvasDimensions";
import useMouseEvents from "../hooks/mouseEvents";

const CELL_SIZE = 14;
const TIME_INTERVAL = 500;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const ObservableUniverse = () => {
  const [ref, { width, height, dpr }] = useCanvasDimensions();
  const [cellStates, dispatch] = useReducer(cellStatesReducer, null);
  const intervalRef = useRef();
  const [clock, setClock] = useState(false);
  const [mouse, mouseDown] = useMouseEvents(CELL_SIZE);
  const [gridContext, setGridContext] = useState(null);
  const [cellsContext, setCellsContext] = useState(null);
  const [highlightCellsContext, setHighlightCellsContext] = useState(null);

  const triggerTime = () => {
    intervalRef.current = setInterval(() => {
      dispatch({type: 'next'});
    }, TIME_INTERVAL);
    setClock(true);
  }

  const stopTime = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setClock(false);
    }
  }

  const toggleCell = ({ row, col }) => {
    if (cellStates.lastEditedRow !== row || cellStates.lastEditedCol !== col) {
      // console.log(mouseDown)
      dispatch({type: 'toggle', row, col})
    }
  }

  const highlightCell = ({ row, col }) => {
    if (cellStates && (cellStates.lastEditedRow !== row || cellStates.lastEditedCol !== col)) {
      dispatch({type: 'hover', row, col})
    }
  }

  useEffect(() => {
    if (mouseDown) {
      toggleCell({row: mouse.row, col: mouse.col})
    }
    highlightCell({row: mouse.row, col: mouse.col})
  }, [mouse]);

  useEffect(() => {
    if (width && height && gridContext && cellsContext && highlightCellsContext) {
      if (clock){
        stopTime();
      }
      dispatch({
        type: 'init',
        spaceLimits: {
          width: width,
          height: height
          // width: dimsRef.current.offsetWidth,
          // height: dimsRef.current.offsetHeight
        },
        cellSize: CELL_SIZE,
        numCells: 81,
        random: true,
        gridContext,
        cellsContext,
        highlightCellsContext
      });
      triggerTime();
    }

    return () => {
      stopTime();
    }
  }, [width, height, gridContext, cellsContext, highlightCellsContext]);

  return (
    <div className="ObservableUniverse" ref={ref} onClick={(e) => toggleCell({row: Math.floor(e.clientY/CELL_SIZE),col: Math.floor(e.clientX/CELL_SIZE)})}>
      <God act={() => {
          if (clock) {
            stopTime();
          } else {
            triggerTime();
          }
        }}/>
      {
        width === undefined || height === undefined || dpr === undefined ?
          <div>{"🤔"}</div> :
          <div>
            {/*<div className="floating">({mouse.x}, {mouse.y}), ({mouse.row}, {mouse.col})</div>*/}
            <Canvas className="gridLayer" width={width} height={height} dpr={dpr} dispatchContext={setGridContext} />
            <Canvas className="cellsLayer" width={width} height={height} dpr={dpr} dispatchContext={setCellsContext} />
            <Canvas className="hoverLayer" width={width} height={height} dpr={dpr} dispatchContext={setHighlightCellsContext} />
          </div>
      }
    </div>
  );
}

export default ObservableUniverse;
