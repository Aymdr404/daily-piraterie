import React, { useEffect, useState } from "react";
import axios from "axios";

interface Article {
  titre: string;
  contenu: string;
  cid?: string;
}

const App: React.FC = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // 🧠 Ajuste l’URL si ton backend est hébergé ailleurs
        const res = await axios.get<Article>("http://localhost:4000/api/article-du-jour");
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (!article) return <p>Impossible de charger l’article.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🏛️ Article du jour – Code civil
      </h1>
      <h2 className="text-xl font-semibold mb-2">{article.titre}</h2>
      <p className="text-gray-700 whitespace-pre-line">{article.contenu}</p>

      {article.cid && (
        <a
          href={`https://www.legifrance.gouv.fr/codes/id/${article.cid}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline mt-4 block text-right"
        >
          Voir sur Légifrance →
        </a>
      )}
    </div>
  );
};

export default App;
