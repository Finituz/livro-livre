export const circle = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: {
    x: number;
    y: number;
  },
) => {
  var radius = Math.sqrt(
    Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2),
  );
  ctx.beginPath();
  ctx.arc(from.x, from.y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
};
