export const triangle = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: {
    x: number;
    y: number;
  },
) => {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.lineTo(from.x * 2 - to.x, to.y);
  ctx.closePath();
  ctx.stroke();
};
