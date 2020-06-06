import { useState, useEffect } from 'react';

const defDefaultMouseCoords = () => ({
  x: undefined,
  y: undefined,
  row: undefined,
  col: undefined
});

const useMouseEvents = (cellSize) => {
  const [mouseCoords, setMouseCoords] = useState(defDefaultMouseCoords());
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const col = Math.floor(e.x/cellSize);
      const row = Math.floor(e.y/cellSize);
      setMouseCoords({
        x: e.x,
        y: e.y,
        row,
        col
      });
    }

    const handleMouseDown = (e) => {
      setMouseDown(true);
    }
    const handleMouseUp = (e) => {
      setMouseDown(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }, []);

  return [mouseCoords, mouseDown];
}

export default useMouseEvents;
