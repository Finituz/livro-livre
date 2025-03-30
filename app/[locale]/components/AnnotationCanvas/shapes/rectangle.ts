export const rectangle = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: {
    x: number;
    y: number;
  },
) => {
  ctx.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
};
