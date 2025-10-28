import express, { Request, Response } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://www.aymeric-sabatier.fr",
    methods: ["GET", "POST"],
  })
);


const PORT = process.env.PORT || 4000;

// Route principale : article du jour
app.get("/api/article-du-jour", async (_req: Request, res: Response) => {
  try {
    const API_KEY = process.env.LEGIFRANCE_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "Clé API manquante." });
    }

    const codeId = "LEGITEXT000006070721"; // Code civil
    const response = await fetch("https://api.legifrance.gouv.fr/lf-engine-app/consult/code", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: codeId })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur API Légifrance: ${text}`);
    }

    const data = (await response.json()) as { articleList?: any[] };
	const articles = data.articleList || [];


    if (articles.length === 0) {
      throw new Error("Aucun article trouvé.");
    }

    // Calcul de l’article du jour (jour de l’année)
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % articles.length;

    const article = articles[index];

    // Cache d’un jour
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");
    res.json({
      titre: article?.titre || article?.num || "Article inconnu",
      contenu: article?.contenu || "Contenu non disponible.",
      cid: article?.cid || null,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Serveur lancé sur ${PORT}`));