import React, { useState, useEffect, useRef, useReducer } from 'react';
import { cellStatesReducer } from '../reducers/cellStates'

export const Canvas = ({ height, width, dpr, isAnimating }) => {
  // we use a ref to access the canvas' DOM node
  const canvasRef = useRef(null);
  const actualWidth = width * dpr;
  const actualHeight = height * dpr;
  const [_, dispatchContext] = useReducer(cellStatesReducer, null);

  // the canvas' context is stored once it's created
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvasContext = canvasRef.current.getContext('2d');
      if (canvasContext !== null) {
        canvasContext.scale(dpr, dpr);
        canvasContext.globalCompositeOperation = "soft-light";
        setContext(canvasContext);
        dispatchContext({type: 'updateContext', context: canvasContext})
      }
    }
  }, [width, height, dpr]);

  return (
    <canvas
      className="Canvas"
      ref={canvasRef}
      height={actualHeight}
      width={actualWidth}
      style={{ width, height }}
    />
  );
};
