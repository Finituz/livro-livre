import { themeType } from "@/app/[locale]/types";

export const pencil = (
  ctx: CanvasRenderingContext2D,
  to: { x: number; y: number },
  color: themeType,
  thickness: number = 5,
  opacity: number = 1,
) => {
  ctx.save();
  ctx.lineWidth = thickness;
  ctx.strokeStyle = `rgba(${color.fg.r},${color.fg.g},${color.fg.b},${opacity})`;
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
};
