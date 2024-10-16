import { Checkbox } from "@mui/material";
import React, { useEffect } from "react";
import { IArticle } from "../../types/db";

export const ArticleCard = ({
  article,
  listSelected,
  setInputArticleQuantity,
}: {
  article: IArticle;
  listSelected: Map<string, number>;
  setInputArticleQuantity: (qty: number) => void;
}) => {
  const [isChecked, setIsChecked] = React.useState(false);
  useEffect(() => {
    setIsChecked(listSelected.has(article.name));
  }
  , [listSelected]);
  return (
    <li
      className={
        "flex-grow flex justify-between items-center select-none px-4 py-2 rounded-lg border border-[#00000022] cursor-pointer " +
        (!isChecked ? "bg-gray-200" : "shadow")
      }
      onClick={() => {
        setInputArticleQuantity(isChecked ? 0 : 1);
      }}
    >
      <span className="">
        {Array.from(article.name.split(/(?=[\(])/)).map((article) => (
          <React.Fragment key={article}>
            {article}
            <br />
          </React.Fragment>
        ))}
      </span>
      <Checkbox color="default" checked={isChecked} />
    </li>
  );
};
