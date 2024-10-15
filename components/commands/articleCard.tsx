import { Checkbox } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IArticle } from "../../types/db";

export const ArticleCard = ({
  article,
  inputArticleQuantity,
  setInputArticleQuantity,
}: {
  article: IArticle;
  inputArticleQuantity: Number;
  setInputArticleQuantity: (qty: number) => void;
}) => {
  const [articleQuantity, _] = useState(inputArticleQuantity);
  const [checked, setChecked] = useState(articleQuantity !== 0);
  useEffect(() => {
    console.log("inputArticleQuantity", inputArticleQuantity);
    
    setChecked(inputArticleQuantity !== 0);
  }
  , [inputArticleQuantity]);
  return (
    <div
      className={
        "flex-grow flex justify-between items-center select-none px-4 py-2 rounded-lg border border-[#00000022] cursor-pointer " +
        (!checked ? "bg-gray-200" : "shadow")
      }
      onClick={() => {
        setInputArticleQuantity(checked ? 0 : 1);
        setChecked(!checked);
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
      <Checkbox color="default" checked={checked} />
    </div>
  );
};
