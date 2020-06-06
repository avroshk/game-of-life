import { useCanvas } from "./Canvas";

const Hexagon = ({ x, y, size, color, rotation }) => {
  const context = useCanvas();
  if (context !== null) {
    const edgeLength = size * 0.5;

    context.beginPath();

    [30, 90, 150, 210, 270, 330].forEach((angle, index) => {
      const radAngle = ((angle + rotation) * Math.PI) / 180;
      const point = {
        x: x + edgeLength + edgeLength * Math.cos(radAngle),
        y: y + edgeLength + edgeLength * Math.sin(radAngle)
      };
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });

    context.fillStyle = color;
    context.fill();
  }

  return null;
};

export default Hexagon;
