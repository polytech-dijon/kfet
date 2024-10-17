import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export const CommandNameField = ({
  currentName,
  setNewName,
}: {
  currentName: string;
  setNewName: (name: string) => void;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(currentName);
  const saveNewFieldName = (newName: string)=>() => {
    setNewName(newName);
    setName(newName);
    setEditMode(false);
  };
  return editMode ? (
    <>
      <input
        type="text"
        placeholder="Nom de la commande"
        value={name}
        className="border-2 border-gray-300 rounded-lg p-1"
        onChange={(e) => {
          setName(e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            saveNewFieldName(name)();
          }
        }}
      />
      <IconButton onClick={saveNewFieldName(name)}>
        <CheckIcon />
      </IconButton>
      <IconButton onClick={saveNewFieldName(currentName)}>
        <CloseIcon />
      </IconButton>
    </>
  ) : (
    <>
      {name}
      <IconButton
        onClick={() => {
          setEditMode(true);
        }}
      >
        <EditIcon />
      </IconButton>
    </>
  );
};
