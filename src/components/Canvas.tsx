'use client';

import { useCanvas } from '@/hooks/useCanvas';
import { useDrawing } from '@/hooks/useDrawing';
import useItemSelectionStore from '@/stores/shapeSelectionStore';
import React, { useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

function Canvas() {
  // get selected items if any
  const { selectedItem, selectItem } = useItemSelectionStore(
    useShallow((state) => ({
      selectedItem: state.selectedItem,
      selectItem: state.selectItem,
    }))
  );

  // change cursor according to selected item
  const cursor = useMemo(() => {
    return selectedItem === 'Circle' || selectedItem === 'Square'
      ? 'crosshair'
      : 'auto';
  }, [selectedItem]);

  // canvas related operations
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = useCanvas({ canvasRef });
  const { drawExisting, userClick, drawShape, stopDrawing } = useDrawing({
    canvasRef,
  });

  //simulating external interaction for loading existing drawings
  useEffect(() => {
    drawExisting(null);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full justify-center items-center rounded-none`}
      onMouseDown={userClick}
      onMouseMove={drawShape}
      onMouseUp={stopDrawing}
      style={{ cursor: cursor }}
      width={canvasSize.width}
      height={canvasSize.height}
    ></canvas>
  );
}

export default Canvas;
