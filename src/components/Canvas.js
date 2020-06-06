import React, { useState, useEffect, useRef, useReducer } from 'react';

export const Canvas = ({ className, height, width, dpr, isAnimating, dispatchContext }) => {
  // we use a ref to access the canvas' DOM node
  const canvasRef = useRef(null);
  const actualWidth = width * dpr;
  const actualHeight = height * dpr;

  // the canvas' context is stored once it's created
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvasContext = canvasRef.current.getContext('2d');
      if (canvasContext !== null) {
        canvasContext.scale(dpr, dpr);
        canvasContext.globalCompositeOperation = "soft-light";
        setContext(canvasContext);
        dispatchContext(canvasContext);
      }
    }
  }, [width, height, dpr]);

  return (
    <canvas
      className={className}
      ref={canvasRef}
      height={actualHeight}
      width={actualWidth}
      style={{ width, height }}
    />
  );
};
