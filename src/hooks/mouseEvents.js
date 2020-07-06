import { useState, useCallback, useEffect } from 'react';
import useEventListener from './eventListener';

const defDefaultMouseState = () => ({
  x: undefined,
  y: undefined,
  row: undefined,
  col: undefined,
});

const getRowFromYPosition = (y, size) => Math.floor(y/size);
const getColFromXPosition = (x, size) => Math.floor(x/size);

const useMouseEvents = (cellSize) => {
  // State for storing mouse coordinates
  const [mouse, setMouseState] = useState(defDefaultMouseState());
  const [cellSizeWithPadding, setCellSizeWithPadding] = useState(null);
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    setCellSizeWithPadding(cellSize+2*Math.ceil(cellSize*0.2));
  }, [cellSize])

  // Event handler utilizing useCallback ...
  // ... so that reference never changes.
  const mouseMoveHandler = useCallback(({ clientX, clientY }) => {
      // Update mouse state
      setMouseState({
        x: clientX,
        y: clientY,
        row: getRowFromYPosition(clientY, cellSizeWithPadding),
        col: getColFromXPosition(clientX, cellSizeWithPadding)
      });
    },
    [setMouseState, cellSizeWithPadding]
  );

  const mouseDownHandler = useCallback(() => {
      // Update mouse state
      setMouseDown(true);
    },
    [setMouseDown]
  );

  const mouseUpHandler = useCallback(() => {
      // Update mouse state
      setMouseDown(false);
    },
    [setMouseDown]
  );

  // Add event listener using event listener hook
  useEventListener('mousemove', mouseMoveHandler);
  useEventListener('mousedown', mouseDownHandler);
  useEventListener('mouseup', mouseUpHandler);

  return [mouse, mouseDown];
}

export default useMouseEvents;
