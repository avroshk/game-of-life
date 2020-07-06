import { useState, useCallback, useEffect } from 'react';
import useEventListener from './eventListener';

const defDefaultTouchState = () => ({
  x: undefined,
  y: undefined,
  row: undefined,
  col: undefined,
  move: false,
});

const getRowFromYPosition = (y, size) => Math.floor(y/size);
const getColFromXPosition = (x, size) => Math.floor(x/size);

const useTouchEvents = (cellSize) => {
  // State for storing mouse coordinates
  const [touch, setTouchState] = useState(defDefaultTouchState());
  const [cellSizeWithPadding, setCellSizeWithPadding] = useState(null);
  const [touchActive, setTouchActive] = useState(false);

  useEffect(() => {
    setCellSizeWithPadding(cellSize+2*Math.ceil(cellSize*0.2));
  }, [cellSize])

  // Event handler utilizing useCallback ...
  // ... so that reference never changes.
  const touchMoveHandler = useCallback(({ touches }) => {
      const {clientX, clientY} = touches[0]
      // Update mouse state
      setTouchState({
        x: clientX,
        y: clientY,
        row: getRowFromYPosition(clientY, cellSizeWithPadding),
        col: getColFromXPosition(clientX, cellSizeWithPadding),
        move: true
      });
    },
    [setTouchState, cellSizeWithPadding]
  );

  const touchStartHandler = useCallback(({ touches }) => {
    const {clientX, clientY} = touches[0]
    // Update mouse state
    setTouchActive(true);
    setTouchState({
      x: clientX,
      y: clientY,
      row: getRowFromYPosition(clientY, cellSizeWithPadding),
      col: getColFromXPosition(clientX, cellSizeWithPadding),
      move: false
    });
  },[setTouchActive, cellSizeWithPadding]);

  const touchEndHandler = useCallback((e) => {
    // Update mouse state
    setTouchActive(false);
    // prevent subsequent mouse down from firing
    e.preventDefault();
  }, [setTouchActive]);

  // Add event listener using event listener hook
  useEventListener('touchmove', touchMoveHandler);
  useEventListener('touchstart', touchStartHandler);
  useEventListener('touchend', touchEndHandler);

  return [touch, touchActive];
}

export default useTouchEvents;
