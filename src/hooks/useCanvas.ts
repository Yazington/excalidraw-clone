import { useEffect, useState } from 'react';

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const useCanvas = ({ canvasRef }: Props) => {
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 150 });

  useEffect(() => {
    // This code runs only on the client
    if (typeof window !== 'undefined') {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  const resizeCanvas = () => {
    if (!window) return;
    const dpr = window.devicePixelRatio;
    if (!canvasRef) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width * dpr;
    const height = canvas.height * dpr;

    const context = canvas.getContext('2d');
    context?.scale(width, height);
  };

  useEffect(() => {
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return canvasSize;
};
