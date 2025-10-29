import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*", // Pour Render + GitHub Pages (tu peux restreindre plus tard à ton domaine)
  })
);

const filePath = path.join(process.cwd(), "articles.json");
const articles = JSON.parse(fs.readFileSync(filePath, "utf-8"));

app.get("/api/article-du-jour", (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = +now - +startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % articles.length;
    const article = articles[index];

    res.json({
      date: now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      numeroDuJour: dayOfYear,
      totalArticles: articles.length,
      article
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne" });
  }
});

app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur le port ${PORT}`));
