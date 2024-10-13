import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { IArticle } from "../../types/db";

export const ArticleCard = ({
  article,
  commandListState,
}: {
  article: IArticle;
  commandListState: [
    Map<string, number>,
    Dispatch<SetStateAction<Map<string, number>>>
  ];
}) => {
  const [commandList, setCommandList] = commandListState;
  const updateCommandList = (quantity: number) => {
    let newCommandList = new Map(commandList);
    if (quantity === 0) newCommandList.delete(article.name);
    else newCommandList.set(article.name, quantity);
    setCommandList(newCommandList);
  };
  const reduceQuantity = () => {
    if ((commandList.get(article.name) ?? 0) > 0)
      updateCommandList((commandList.get(article.name) ?? 1) - 1);
  };
  const increaseQuantity = () => {
    console.log(commandList);

    updateCommandList((commandList.get(article.name) ?? 0) + 1);
  };

  return (
    <div
      className={
        "flex flex-col items-center select-none p-4 rounded-lg border border-[#00000022] " +
        ((commandList.get(article.name) ?? 0) === 0
          ? "bg-gray-200 cursor-pointer"
          : "")
      }
      max-width="5rem"
      onClick={
        (commandList.get(article.name) ?? 0) === 0
          ? () => increaseQuantity()
          : () => {}
      }
    >
      <span className="text-center">
        {Array.from(article.name.split(/(?=[\(])/)).map((article) => (
          <>
            {article}
            <br />
          </>
        ))}
      </span>
      <div className="flex flex-row items-center gap-2 mt-auto">
        <IconButton
          disabled={(commandList.get(article.name) ?? 0) === 0}
          aria-label="decrease"
          onClick={reduceQuantity}
          size="small"
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <div>{commandList.get(article.name) ?? 0}</div>
        <IconButton
          disabled={(commandList.get(article.name) ?? 0) === 0}
          aria-label="increase"
          onClick={increaseQuantity}
          size="small"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};
