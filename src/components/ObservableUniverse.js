import React, { useEffect, useReducer } from 'react';
import './ObservableUniverse.css'
import Cells from './Cells'
import useWindowDimensions from '../hooks/windowDimensions'
import { getInitialCellState, cellStatesReducer} from '../reducers/cellStates'

const ObservableUniverse = () => {
  const { height, width } = useWindowDimensions();
  // const initialState = getInitialCellState({
  //   spaceWidth: width,
  //   spaceHeight: height,
  //   cellSize: 14,
  //   numCells: 1000,
  //   random: true
  // });
  const initialState = getInitialCellState({
    spaceWidth: 14*9,
    spaceHeight: 14*9,
    cellSize: 14,
    numCells: 81,
    random: false
  });
  const [cellStates, dispatch] = useReducer(cellStatesReducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'refresh',
      spaceLimits: {
        width: width,
        height: height
      }
    })
  }, [height, width]);

  useEffect(() => {
    const clockId = setInterval(() => {
      dispatch({type: 'next'});
    }, 250);
    return () => {
      clearInterval(clockId);
    }
  });

  return <div className="ObservableUniverse">
    {
      Cells({
        cellStates: cellStates,
        dispatch: dispatch,
      })
    }
  </div>
};

export default ObservableUniverse;
