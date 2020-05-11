import React, { useState, useEffect, useReducer, useRef, createRef } from 'react';
import './ObservableUniverse.css'
import Cells from './Cells'
import God from './God'
import useWindowDimensions from '../hooks/windowDimensions'
import { cellStatesReducer } from '../reducers/cellStates'

const CELL_SIZE = 14;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const ObservableUniverse = () => {
  const [clock, setClock] = useState(false);
  const [coords, setCoords] = useState({x: null, y: null});
  const [resizing, setResizing] = useState(false);
  const [editing, setEditing] = useState(false);
  const { height, width } = useWindowDimensions();
  const [cellStates, dispatch] = useReducer(cellStatesReducer, null);
  const dimsRef = useRef(null);
  const intervalRef = useRef();

  const triggerTime = () => {
    return setInterval(() => {
      dispatch({type: 'next'});
      setResizing(false);
    }, 500);
  }

  const act = () => {
    if (clock) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      intervalRef.current = triggerTime();
    }
    setClock(!clock);
  }

  const toggleCell = (e, force) => {
    if (editing || force) {
      let x = e.clientX;
      let y = e.clientY;
      let col = Math.floor(x/CELL_SIZE);
      let row = Math.floor(y/CELL_SIZE);
      if (cellStates.lastEditedRow === row && cellStates.lastEditedCol === col) {

      } else {
        console.log(`(${x-coords.x},${y-coords.y})`,e.movementX, e.movementY)
        // console.log(e.clientX, e.clientY, e.movementX, e.movementY,`(${row},${col})`)
        dispatch({type: 'toggle', row, col})
      }
      setCoords({x,y})
    }
  }


  useEffect(() => {
    // setResizing(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
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
      random: false
    });

    act();

    return () => {
      clearInterval(intervalRef.current);
    }
  }, [width, height]);

  return <div className="ObservableUniverse"
    ref={dimsRef}
    onMouseDown={(e) => {
      toggleCell(e, true);
      setEditing(true);
    }}
    onMouseMove={(e) => {
      toggleCell(e);
    }}
    onMouseUp={() => setEditing(false)}
    >
    <God act={act}/>
    {
      resizing ?
        <div>Resizing</div>:
          cellStates && Cells({
            cells: cellStates.cells,
            M: cellStates.M,
            N: cellStates.N,
            gen: cellStates.generation,
            dispatch,
            editing
          })
    }
  </div>
};

export default ObservableUniverse;
