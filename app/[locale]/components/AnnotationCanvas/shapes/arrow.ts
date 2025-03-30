export const arrow = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: {
    x: number;
    y: number;
  },
  headlen: number = 10,
) => {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  ctx.beginPath();

  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);

  ctx.stroke();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - headlen * Math.cos(angle - Math.PI / 7),
    to.y - headlen * Math.sin(angle - Math.PI / 7),
  );

  ctx.lineTo(
    to.x - headlen * Math.cos(angle + Math.PI / 7),
    to.y - headlen * Math.sin(angle + Math.PI / 7),
  );

  ctx.lineTo(to.x, to.y);
  ctx.lineTo(
    to.x - headlen * Math.cos(angle - Math.PI / 7),
    to.y - headlen * Math.sin(angle - Math.PI / 7),
  );
  ctx.closePath();
  ctx.stroke();
};
