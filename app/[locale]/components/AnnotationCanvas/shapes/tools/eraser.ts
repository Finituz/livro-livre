export const eraser = (
  ctx: CanvasRenderingContext2D,

  to: { x: number; y: number },
  size: number,
) => {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.arc(to.x, to.y, size, 0, Math.PI * 2, false);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};
