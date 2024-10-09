import { IArticle } from "../../types/db";
import { categoryNames } from "../../utils/db-enum";

function mapArticlesToCategories(articles: IArticle[]) {
  const result = new Map<string, IArticle[]>();
  const categories: string[] = [...new Set(articles.map((article) => article.category))];

  if (articles.some((article) => article.favorite)) {
    result.set(
      "Favoris",
      articles.filter((article) => article.favorite)
    );
  }
  categories.forEach((categorie) => {
    result.set(
        categoryNames[categorie],
      articles.filter((article) => article.category === categorie)
    );
  });
  return result;
}

const ArticleCard = ({ article }: { article: IArticle }) => {
  let currentQuantity = 0;
  return (
    <div className="flex flex-col items-center p-4 rounded-lg border" max-width="5rem">
      <span className="text-center">{article.name}</span>
      <div className="flex flex-row gap-2 mt-auto">
        <div>-</div>
        <div>{currentQuantity}</div>
        <div>+</div>
      </div>
    </div>
  );
};

type ArticleList = {
  articles: IArticle[] | null;
};

const containerStyle = {
  maxHeight: "20vh",
  '&::-webkit-scrollbar': {
    width: '0.4em'
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey'
  },
  listStyle: "none",
};

export const ArticlesSelector = ({ articles }: ArticleList) => {
  if (!articles) return <p>Chargement...</p>;
  let articleDict = mapArticlesToCategories(articles);
  return (
    <div style={containerStyle} className="overflow-auto px-4 shadow-md">
      {Array.from(articleDict.keys()).map((category) => (
        <div key={category} className="my-4">
          <h1 className="text-xl text-black opacity-30 font-bold">
            {category} ({articleDict.get(category)?.length})
          </h1>
          <div className="flex-1 w-full h-full grid grid-cols-3 grid-flow-row relative gap-2">
            {articleDict.get(category)?.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
