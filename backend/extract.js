import fs from "fs";
import pdf from "pdf-parse";

const buffer = fs.readFileSync("./code_civil.pdf");

pdf(buffer).then((data) => {
  const text = data.text;

  // Découpage approximatif par "Article"
  const articles = text
    .split(/\n(?=Article [0-9A-Z\-]+)/g)
    .map((block) => {
      const match = block.match(/(Article [0-9A-Z\-]+)([\s\S]*)/);
      if (!match) return null;
      return {
        titre: match[1].trim(),
        contenu: match[2].replace(/\n+/g, " ").trim()
      };
    })
    .filter(Boolean);

  fs.writeFileSync("articles.json", JSON.stringify(articles, null, 2));
  console.log(`✅ ${articles.length} articles extraits avec succès !`);
});
