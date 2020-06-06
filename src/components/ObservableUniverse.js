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

  useEffect(() => {
    if (mouseDown) {
      toggleCell({row: mouse.row, col: mouse.col})
    }
  }, [mouse]);

  useEffect(() => {
    if (width && height) {
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
      });
      triggerTime();
    }

    return () => {
      stopTime();
    }
  }, [width, height]);

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
            <Canvas width={width} height={height} dpr={dpr} />
          </div>
      }
    </div>
  );
}

// const _ObservableUniverse = () => {
//   const [clock, setClock] = useState(false);
//   const [coords, setCoords] = useState({x: null, y: null});
//   const [resizing, setResizing] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const { height, width } = useWindowDimensions();
//   const [cellStates, dispatch] = useReducer(cellStatesReducer, null);
//   const dimsRef = useRef(null);
//   const intervalRef = useRef();
//
//   const triggerTime = () => {
//     if (!intervalRef.current) {
//       dispatch({type: 'start'});
//     }
//     intervalRef.current = setInterval(() => {
//       dispatch({type: 'next'});
//       setResizing(false);
//     }, TIME_INTERVAL);
//   }
//
//   const stopTime = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//   }
//
//   const toggleCell = (e, force) => {
//     if (editing || force) {
//       let x = e.clientX;
//       let y = e.clientY;
//       let col = Math.floor(x/CELL_SIZE);
//       let row = Math.floor(y/CELL_SIZE);
//       if (cellStates.lastEditedRow === row && cellStates.lastEditedCol === col) {
//
//       } else {
//         console.log(`(${x-coords.x},${y-coords.y})`,e.movementX, e.movementY)
//         // console.log(e.clientX, e.clientY, e.movementX, e.movementY,`(${row},${col})`)
//         dispatch({type: 'toggle', row, col})
//       }
//       setCoords({x,y})
//     }
//   }
//
//
//   useEffect(() => {
//     // setResizing(true);
//
//     dispatch({
//       type: 'init',
//       spaceLimits: {
//         width: width,
//         height: height
//         // width: dimsRef.current.offsetWidth,
//         // height: dimsRef.current.offsetHeight
//       },
//       cellSize: CELL_SIZE,
//       numCells: 81,
//       random: false
//     });
//
//     return () => {
//       stopTime();
//     }
//   }, [width, height]);
//
//   return <div className="ObservableUniverse"
//     ref={dimsRef}
//     onMouseDown={(e) => {
//       toggleCell(e, true);
//       setEditing(true);
//     }}
//     onMouseMove={(e) => {
//       toggleCell(e);
//     }}
//     onMouseUp={() => setEditing(false)}
//     >
//     <God act={act}/>
//     {
//       resizing ?
//         <div>Resizing</div>:
//           cellStates && Cells({
//             cells: cellStates.cells,
//             M: cellStates.M,
//             N: cellStates.N,
//             gen: cellStates.generation,
//             dispatch,
//             editing
//           })
//     }
//   </div>
// };

export default ObservableUniverse;
