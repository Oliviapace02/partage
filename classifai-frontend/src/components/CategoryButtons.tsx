import React from "react";
import { Button, Box } from "@mui/material";

interface CategoryButtonsProps {
  categories: string[];
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ categories }) => {
  const handleChoice = (category: string) => {
    console.log(`Choix : ${category}`);
  };

  return (
    <Box display="flex" gap={2} mt={3}>
      {categories.map((category) => (
        <Button key={category} variant="contained" onClick={() => handleChoice(category)}>
          {category}
        </Button>
      ))}
    </Box>
  );
};

export default CategoryButtons;
