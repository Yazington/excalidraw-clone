import { useEffect, useState } from 'react';

type Point = {
  x: number;
  y: number;
} | null;

type Drawing = {
  startCoordinates: Point;
  endCoordinates: Point;
};

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const useDrawing = ({ canvasRef }: Props) => {
  const [startCoordinates, setStartCoordinates] = useState<Point>(null);
  const [isHoldingMouseDown, setIsHoldingMouseDown] = useState<boolean>(false);
  const [color, setColor] = useState<string>('white');

  const [allDrawings, setAllDrawings] = useState<Drawing[]>([]);

  const saveNewDrawing = (startCoordinates: Point, endCoordinates: Point) => {
    setAllDrawings([...allDrawings, { startCoordinates, endCoordinates }]);
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    saveNewDrawing(startCoordinates, { x: e.clientX, y: e.clientY });
    setStartCoordinates(null);
    setIsHoldingMouseDown(false);
  };

  //when user clicks
  const userClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setStartCoordinates({ x: e.clientX, y: e.clientY });
    setIsHoldingMouseDown(true);
  };

  const drawExisting = (context: CanvasRenderingContext2D | null) => {
    if (!canvasRef) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!context) {
      context = canvas.getContext('2d');
    }
    allDrawings.map((drawing: Drawing) => {
      if (
        !drawing ||
        !drawing.startCoordinates ||
        !drawing.endCoordinates ||
        !drawing.startCoordinates.x ||
        !drawing.startCoordinates.y ||
        !drawing.endCoordinates.x ||
        !drawing.endCoordinates.y
      )
        return;
      const width = drawing?.endCoordinates?.x - drawing?.startCoordinates?.x;
      const height = drawing?.endCoordinates?.y - drawing?.startCoordinates?.y;
      if (!context) return;
      //   context.strokeStyle = 'white';
      //   context.lineWidth = 5;
      drawHandDrawnRect(
        context,
        drawing.startCoordinates?.x + 0.5,
        drawing.startCoordinates?.y + 0.5,
        width,
        height,
        { stroke: 'white', strokeWidth: 2, roughness: 2 }
      );
    });
    return context;
  };
  // draw if holding and diff above threshold
  const drawShape = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isHoldingMouseDown) return;
    if (!startCoordinates) {
      setIsHoldingMouseDown(false);
      return;
    }

    const distanceBetweenPointsForDragX = e.clientX - startCoordinates.x;
    const distanceBetweenPointsForDragY = e.clientY - startCoordinates.y;

    if (!canvasRef) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');

    // Clear the canvas before drawing the new shape
    context?.clearRect(0, 0, canvas.width, canvas.height);
    if (!context) return;
    drawExisting(context);
    // context.strokeStyle = 'white';
    // context.lineWidth = 5;
    drawHandDrawnRect(
      context,
      startCoordinates.x + 0.5,
      startCoordinates.y + 0.5,
      distanceBetweenPointsForDragX,
      distanceBetweenPointsForDragY,
      { stroke: 'white', strokeWidth: 2, roughness: 2 }
    );
  };
  return { drawExisting, userClick, drawShape, stopDrawing };
};

/**
 * Returns a random offset between -roughness/2 and +roughness/2.
 */
function randomOffset(roughness: number) {
  return (Math.random() - 0.5) * roughness;
}

/**
 * Draws a wobbly line by breaking the line between (x1, y1) and (x2, y2)
 * into multiple segments, adding random offsets to the intermediate points.
 *
 * @param ctx - Canvas 2D rendering context
 * @param x1 - Starting x-coordinate
 * @param y1 - Starting y-coordinate
 * @param x2 - Ending x-coordinate
 * @param y2 - Ending y-coordinate
 * @param roughness - Amount of randomness (higher value = more wobble)
 * @param segmentCount - Number of segments to break the line into
 */
function drawWobblyLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughness: number,
  segmentCount: number = 2
) {
  const dx = (x2 - x1) / segmentCount;
  const dy = (y2 - y1) / segmentCount;

  ctx.beginPath();
  ctx.moveTo(x1 + randomOffset(roughness), y1 + randomOffset(roughness));

  for (let i = 1; i <= segmentCount; i++) {
    const nx = x1 + dx * i + randomOffset(roughness);
    const ny = y1 + dy * i + randomOffset(roughness);
    ctx.lineTo(nx, ny);
  }

  ctx.stroke();
}

/**
 * Draws a hand-drawn style rectangle by drawing each edge as a wobbly line.
 *
 * @param ctx - Canvas 2D rendering context
 * @param x - The x-coordinate of the top-left corner
 * @param y - The y-coordinate of the top-left corner
 * @param width - The width of the rectangle
 * @param height - The height of the rectangle
 * @param options - Options for stroke color, width, and roughness
 */
function drawHandDrawnRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options?: { stroke?: string; strokeWidth?: number; roughness?: number }
) {
  const { stroke = 'white', strokeWidth = 5, roughness = 3 } = options || {};

  ctx.strokeStyle = stroke;
  ctx.lineWidth = strokeWidth;

  // Define corners of the rectangle
  const topLeft = { x, y };
  const topRight = { x: x + width, y };
  const bottomRight = { x: x + width, y: y + height };
  const bottomLeft = { x, y: y + height };

  // Draw each edge with the wobbly line function
  drawWobblyLine(ctx, topLeft.x, topLeft.y, topRight.x, topRight.y, roughness);
  drawWobblyLine(
    ctx,
    topRight.x,
    topRight.y,
    bottomRight.x,
    bottomRight.y,
    roughness
  );
  drawWobblyLine(
    ctx,
    bottomRight.x,
    bottomRight.y,
    bottomLeft.x,
    bottomLeft.y,
    roughness
  );
  drawWobblyLine(
    ctx,
    bottomLeft.x,
    bottomLeft.y,
    topLeft.x,
    topLeft.y,
    roughness
  );
}
