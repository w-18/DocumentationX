import { NextRequest, NextResponse } from "next/server";
import { createCanvas } from "canvas";
import type { CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from "canvas";
import getSession from "@/functions/session"

/**
 * Draws a rounded rectangle on the given context.
 */
function drawRoundedRect(
  ctx: NodeCanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

export async function GET(req: NextRequest) {
    const user = await getSession(req.cookies.get("session")?.value || "");
    const fullName = user?.username || "John Doe"

    console.log(fullName)

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .join("")
      .substring(0, 2) || "NN";

  const width = 256;
  const height = 256;
  const canvas = createCanvas(width, height);

  const ctx = canvas.getContext("2d") as NodeCanvasRenderingContext2D;

  const borderRadius = 12;
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  drawRoundedRect(ctx, 0, 0, width, height, borderRadius);

  const fontSize = 128;
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "#60a5fa");
  gradient.addColorStop(1, "#a78bfa");
  ctx.fillStyle = gradient;
  ctx.fillText(initials, width / 2, height / 2);

  const buffer = canvas.toBuffer("image/png");
  return new NextResponse(buffer, {
    status: 200,
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
  });
}
