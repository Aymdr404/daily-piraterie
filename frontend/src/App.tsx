import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Article {
  titre: string;
  contenu: string;
}

interface ApiResponse {
  date: string;
  numeroDuJour: number;
  totalArticles: number;
  article: Article;
}

const App: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          "https://legifrance-backend.onrender.com/api/article-du-jour"
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, []);

  if (loading) return <div className="container">Chargement...</div>;
  if (!data) return <div className="container">Erreur de chargement.</div>;

  return (
    <div className="container">
      <h1>🏛️ Article du jour – Code civil</h1>

      <div className="article-info">
        <span>📅 {data.date}</span>
        <span>🧾 Jour {data.numeroDuJour} / {data.totalArticles}</span>
      </div>

      <h2>{data.article.titre}</h2>
      <p>{data.article.contenu}</p>

      <div className="footer">
        Source : <a href="https://www.legifrance.gouv.fr">Légifrance</a><br/>
        Données extraites du Code civil (version PDF)
      </div>
    </div>
  );
};

export default App;
