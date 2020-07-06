import React, {
  useState, useEffect, useReducer,
  useRef, createRef, useLayoutEffect
} from 'react';
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
import useTouchEvents from "../hooks/touchEvents";

const CELL_SIZE = 10;
const TIME_INTERVAL = 500;

const useLockBodyScroll = () => {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    // Re-enable scrolling when component unmounts
    return () => document.body.style.overflow = originalStyle;
  }, []);
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const ObservableUniverse = () => {
  const [ref, { width, height, dpr }] = useCanvasDimensions();
  const [cellStates, dispatch] = useReducer(cellStatesReducer, null);
  const intervalRef = useRef();
  const [clock, setClock] = useState(false);
  const [mouse, mouseDown] = useMouseEvents(CELL_SIZE);
  const [touch, touchActive] = useTouchEvents(CELL_SIZE);
  const [gridContext, setGridContext] = useState(null);
  const [cellsContext, setCellsContext] = useState(null);
  const [highlightCellsContext, setHighlightCellsContext] = useState(null);
  const [actInProgress, setActInProgress] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  useLockBodyScroll()

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

  const beginningOfTime = (force=false, random=false) => {
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
      random: random,
      gridContext,
      cellsContext,
      highlightCellsContext,
      timeInterval: TIME_INTERVAL,
      force: force
    });
  }

  // handle mouse click
  useEffect(() => {
    if (!actInProgress) {
      if (mouseDown) {
        // console.log('🦠')
        dispatch({type: 'toggle', row: mouse.row, col: mouse.col})
      }
    }
  }, [mouseDown]);

  // handle touch
  useEffect(() => {
    if (!actInProgress && touchActive) {
      if (touch.move) {
        if (cellStates.lastEditedRow !== touch.row || cellStates.lastEditedCol !== touch.col) {
          // console.log('💉')
          dispatch({type: 'fill', row: touch.row, col: touch.col})
        }
      } else {
        // console.log('💚')
        dispatch({type: 'toggle', row: touch.row, col: touch.col})
      }
    }
  }, [touch])

  // handle mouse movement
  useEffect(() => {
    if (!actInProgress) {
      if (!mouseDown) {
        highlightCell({row: mouse.row, col: mouse.col})
      } else {
        if (cellStates.lastEditedRow !== mouse.row || cellStates.lastEditedCol !== mouse.col) {
          dispatch({type: 'fill', row: mouse.row, col: mouse.col})
        }
      }
    }
  }, [mouse])

  useEffect(() => {
    if (width && height && gridContext && cellsContext && highlightCellsContext) {
      beginningOfTime()
      triggerTime();
      // dispatch({type: 'next'})
    }
    return () => {
      stopTime();
    }
  }, [width, height, gridContext, cellsContext, highlightCellsContext]);

  return (
    <div className="ObservableUniverse" ref={ref} >
      <God
        clock={clock}
        music={musicOn}
        toggleMusic={() => {
          if (musicOn) {
            setMusicOn(false)
            dispatch({type: 'mute', mute: false});
          } else {
            setMusicOn(true)
            dispatch({type: 'mute', mute: true});
          }
        }}
        restart={(random) => {
          let retrigger = false
          if (clock) {
            retrigger = true
          }
          beginningOfTime(true, random)
          if (random) {
            dispatch({type: 'next'});
          }
          if (retrigger) {
            triggerTime()
          }
        }}
        setActInProgress={setActInProgress}
        actInProgress={actInProgress}
        act={() => {
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
              cellStates && cellStates.generation ? <Time time={cellStates.generation} /> : <Time time={'0'} />
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
