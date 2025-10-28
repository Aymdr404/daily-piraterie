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

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Article>(
        "https://legifrance-backend.onrender.com/api/article-du-jour"
      );
      setArticle(res.data);
    } catch (err) {
      console.error(err);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );

  if (!article)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-600 text-lg">Impossible de charger l’article.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      {/* Container */}
      <div className="max-w-3xl mx-auto">
        {/* Card */}
        <div className="bg-white shadow-2xl rounded-3xl p-10 transition-all duration-500 hover:shadow-3xl">
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-gray-800">
            🏛️ Article du jour – Code civil
          </h1>

          {/* Titre Article */}
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700">
            {article.titre}
          </h2>

          {/* Contenu */}
          <p className="text-gray-600 whitespace-pre-line leading-relaxed text-lg md:text-xl">
            {article.contenu}
          </p>

          {/* Lien Légifrance */}
          {article.cid && (
            <div className="mt-8 flex justify-end">
              <a
                href={`https://www.legifrance.gouv.fr/codes/id/${article.cid}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-medium hover:underline text-lg"
              >
                Voir sur Légifrance →
              </a>
            </div>
          )}

          {/* Bouton Article suivant */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={fetchArticle}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
            >
              Article suivant
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          © {new Date().getFullYear()} Daily Piraterie
        </footer>
      </div>
    </div>
  );
};

export default App;
