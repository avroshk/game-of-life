import React, { useState, useEffect, useReducer, useRef, createRef } from 'react';
import './ObservableUniverse.css'
import Cells from './Cells'
import God from './God'
import useWindowDimensions from '../hooks/windowDimensions'
import { cellStatesReducer } from '../reducers/cellStates'
import { Canvas } from "./Canvas";
import Hexagon from "./Hexagon";
import Time from "./Time";
import useCanvasDimensions from "../hooks/canvasDimensions";
import useMouseEvents from "../hooks/mouseEvents";

const CELL_SIZE = 5;
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

  const highlightCell = ({ row, col }) => {
    if (cellStates) {
      dispatch({type: 'hover', row, col})
    }
  }

  useEffect(() => {
    if (mouseDown) {
      dispatch({type: 'toggle', row: mouse.row, col: mouse.col, mouseDown})
    }
  }, [mouseDown]);

  useEffect(() => {
    if (mouseDown) {
      if (cellStates.lastEditedRow !== mouse.row || cellStates.lastEditedCol !== mouse.col) {
        dispatch({type: 'toggle', row: mouse.row, col: mouse.col, mouseDown, fill: true})
      }
    } else {
      highlightCell({row: mouse.row, col: mouse.col})
    }
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
        },
        cellSize: CELL_SIZE,
        numCells: 81,
        random: false,
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
    <div className="ObservableUniverse" ref={ref} >
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
            {
              cellStates && cellStates.generation ? <Time time={cellStates.generation} /> : null
            }
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
