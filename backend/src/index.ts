import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { generateImage } from "./generateImage.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
  })
);

app.use("/previews", express.static(path.join(process.cwd(), "public/previews")));

const filePath = path.join(process.cwd(), "articles.json");
const articles = JSON.parse(fs.readFileSync(filePath, "utf-8"));

app.get("/api/article-du-jour", async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = +now - +startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % articles.length;
    const article = articles[index];

    // Génère une image à la volée
    const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    const imageUrl = await generateImage(article.titre, article.contenu, date);

    res.json({
      date: now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      numeroDuJour: dayOfYear,
      totalArticles: articles.length,
      article,
      previewUrl: `https://daily-piraterie-backend.onrender.com/public/preview.png`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne" });
  }
});

app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur le port ${PORT}`));
