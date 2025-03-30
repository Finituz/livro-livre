"use client";
import { useEffect, useRef, useState } from "react";
import { Tools, themeType } from "../../types";

import { rgbToHex, useMousePosition } from "../../utils";

//shapes and tools
import { pencil } from "./shapes/tools/pencil";
import { circle } from "./shapes/circle";
import { rectangle } from "./shapes/rectangle";
import { triangle } from "./shapes/triangle";
import { eraser } from "./shapes/tools/eraser";

// save system
import { saveAnnotationPage } from "./saveSystem/saveAnnotation";
import { clearCanvas } from "./saveSystem/clearCanvas";
import { setStorageSnapshotAnnotation } from "./saveSystem/setStorageSnapshotAnnotation";
import { arrow } from "./shapes/arrow";
import { removeCanvas } from "./saveSystem/removeCanvas";

interface AnnotationCanvasProps {
  bookIndex: number;
  currentPage: number;
  mouseDown: boolean;
  setMouseDown: Function;
  color: themeType;
  tool: Tools | null;
  showAnnotation: boolean;
}

function AnnotationCanvas({
  bookIndex,
  mouseDown,
  setMouseDown,
  color,
  currentPage,
  tool,
  showAnnotation,
}: AnnotationCanvasProps) {
  const initPos = useRef<{ x: number; y: number } | null>(null);
  const prevPoint = useRef<{ x: number; y: number } | null>(null);

  const snapshot = useRef<ImageData>(null);

  const mousePosition = useMousePosition();

  const annotationCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = annotationCanvasRef.current;
  const ctx = canvas?.getContext("2d");

  const draw = (
    ctx: CanvasRenderingContext2D,
    currentPos: { x: number; y: number },
  ) => {
    if (!initPos.current || !prevPoint.current) return;

    switch (tool) {
      case Tools.PENCIL:
        pencil(ctx, currentPos, color, 5);
        break;
      case Tools.MARKER:
        pencil(ctx, currentPos, color, 10, 0.5);
        break;
      case Tools.CIRCLE:
        circle(ctx, initPos.current, currentPos);
        break;
      case Tools.RECTANGLE:
        rectangle(ctx, initPos.current, currentPos);
        break;
      case Tools.TRIANGLE:
        triangle(ctx, initPos.current, currentPos);
        break;
      case Tools.ARROW:
        arrow(ctx, initPos.current, currentPos);
        break;
      case Tools.ERASER:
        eraser(ctx, currentPos, 64);
        break;
    }
  };

  const computePointInCanvas = (clientX: number, clientY: number) => {
    if (!canvas) return { x: clientX, y: clientY };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return { x, y };
  };

  const handlerMouseUp = () => {
    if (!canvas) return;

    saveAnnotationPage(bookIndex, currentPage, canvas);

    setMouseDown(false);
    prevPoint.current = null;
  };

  const handlerMouseDown = () => {
    if (!canvas || !ctx) return;

    initPos.current = { x: mousePosition.x ?? 0, y: mousePosition.y ?? 0 };
    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineWidth = 5;
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = rgbToHex(color.fg);

    setMouseDown(true);
  };

  const handlerResizeWindow = () => {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const handler = () => {
    if (!ctx || !mouseDown || !showAnnotation || !snapshot.current) return;

    ctx.putImageData(snapshot.current, 0, 0);

    const currentPos = computePointInCanvas(
      mousePosition.x ?? 0,
      mousePosition.y ?? 0,
    );

    draw(ctx, currentPos);

    prevPoint.current = currentPos;
  };

  // the follow lines are the reason for me to regret being a dev :/
  const redraw = () => {
    if (!ctx || !canvas) return;
    clearCanvas(canvas, ctx);
    setStorageSnapshotAnnotation(bookIndex, currentPage, ctx);
  };

  useEffect(() => {
    if (!canvas || !ctx || tool != Tools.CLEAR_CANVAS) return;

    clearCanvas(canvas, ctx);
    removeCanvas(bookIndex, currentPage);
  }, [tool]);

  useEffect(redraw, [currentPage]);
  useEffect(() => {
    if (snapshot.current) return;
    redraw();
  });

  return (
    <canvas
      onLoad={redraw}
      onMouseDown={handlerMouseDown}
      onMouseUp={handlerMouseUp}
      onMouseMove={handler}
      onResize={handlerResizeWindow}
      className="absolute z-2 top-[0px] left-[0px] bottom-[0px] right-[0px] w-full h-full"
      width={window.innerWidth}
      height={window.innerHeight}
      ref={annotationCanvasRef}
    ></canvas>
  );
}

export default AnnotationCanvas;
