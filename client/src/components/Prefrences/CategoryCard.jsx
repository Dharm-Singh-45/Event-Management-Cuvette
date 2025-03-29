import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({ category, isSelected, onSelect }) => {
  return (
    <div
      className={`categoryCard-container ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <img src={category?.img} alt={category?.title} />
      <span>{category?.title}</span>
    </div>
  );
};

export default CategoryCard;
