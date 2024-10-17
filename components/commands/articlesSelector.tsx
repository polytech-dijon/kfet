import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IArticle } from "../../types/db";
import { categoryNames } from "../../utils/db-enum";
import { ArticleCard } from "./articleCard";
import { Button, TextField } from "@mui/material";

function mapArticlesToCategories(articles: IArticle[]) {
  const result = new Map<string, IArticle[]>();
  const categories: string[] = [
    ...new Set(articles.map((article) => article.category)),
  ];

  if (articles.some((article) => article.favorite)) {
    result.set(
      "Favoris",
      articles.filter((article) => article.favorite)
    );
    articles = articles.filter((article) => !article.favorite);
  }
  categories.forEach((categorie) => {
    result.set(
      categoryNames[categorie],
      articles.filter((article) => article.category === categorie)
    );
  });
  return result;
}


const containerStyle = {
  maxHeight: "40vh",
  "&::WebkitScrollbar": {
    width: "0.4em",
  },
  "&::WebkitScrollbarTrack": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::WebkitScrollbarThumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    outline: "1px solid slategrey",
  },
  listStyle: "none"
};

export const ArticlesSelector = ({ articles, commandList, setCommandList }: { articles: IArticle[] | null, commandList: Map<string, number>, setCommandList: (commandList: Map<string, number>) => void; }) => {
  const [articleDict, setArticleDict] = useState<Map<string, IArticle[]>>(mapArticlesToCategories(articles ?? []));
  const [search, setSearch] = useState("");
  useEffect(() => {
    setArticleDict(mapArticlesToCategories((articles??[]).filter(filterArticles)))
  }, [search]);
  if (!articles) return <p>Chargement...</p>;

  const onfilterChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(target.value);
  }

  const addArticle = (articleName : string) => 
    (qty: number) => setCommandList(new Map(commandList).set(String(articleName), qty))
  

  const filterArticles = (article: IArticle) => {
    return article.name.toLowerCase().includes(search.toLowerCase());
  }



  return (
    <>
      <div className="flex gap-2 mb-2">
        <TextField className="grow" label="Chercher/Ajouter" variant="outlined" value={search} onChange={onfilterChange} />
        <Button variant="contained" onClick={()=>{addArticle(search)(1);setSearch("")}}>Ajouter</Button>
      </div>
      <div style={containerStyle} className="overflow-auto px-4 rounded-lg border-2">
        {Array.from(articleDict.keys()).map((category) => (
          <article key={category} className="my-4">
            <h1 className="text-xl text-black opacity-30 font-bold">
              {category} ({articleDict.get(category)?.length})
            </h1>
            <ul className="flex-1 w-full h-full flex flex-wrap relative gap-2">
              {articleDict.get(category)?.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  listSelected={commandList}
                  setInputArticleQuantity={addArticle(article.name)}
                />
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  );
};
