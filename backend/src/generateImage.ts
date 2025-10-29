import { createCanvas, CanvasRenderingContext2D  } from "@napi-rs/canvas";
import fs from "fs";
import path from "path";

export async function generateImage(articleTitle: string, excerpt: string, date: string) {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // --- FOND ---
  ctx.fillStyle = "#fdfcf9";
  ctx.fillRect(0, 0, width, height);

  // --- TITRE PRINCIPAL ---
  ctx.fillStyle = "#1a237e";
  ctx.font = "bold 52px 'Times New Roman'";
  ctx.fillText("🏛️ Article du jour – Code civil", 80, 120);

  // --- ARTICLE ---
  ctx.fillStyle = "#000";
  ctx.font = "bold 42px 'Georgia'";
  ctx.fillText(articleTitle, 80, 220);

  // --- EXTRAIT ---
  ctx.fillStyle = "#333";
  ctx.font = "32px 'Georgia'";
  const wrapped = wrapText(ctx, excerpt, 80, 280, 1040, 40);
  wrapped;

  // --- DATE ---
  ctx.fillStyle = "#555";
  ctx.font = "28px 'Arial'";
  ctx.fillText(`📅 ${date}`, 80, 560);

  // --- LIEN ---
  ctx.fillStyle = "#888";
  ctx.font = "26px 'Arial'";
  ctx.fillText("www.aymeric-sabatier.fr", 80, 600);

  // --- EXPORT ---
  const outputPath = path.join(process.cwd(), "public", "preview.png");
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  console.log("✅ Image Open Graph générée !");
}

// Petite fonction pour le retour à la ligne automatique
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}