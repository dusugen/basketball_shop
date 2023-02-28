import React from "react";

type CategoriesProps = {
  value: number;
  onClickCategory: (index: number) => void;
};

const Categories: React.FC<CategoriesProps> = React.memo(
  ({ value, onClickCategory }) => {
    const categories = [
      "Все",
      "Кожа",
      "Резина",
      "Композитные",
      "Синтетические",
    ].map((name, index) => {
      return (
        <li
          onClick={() => {
            onClickCategory(index);
          }}
          className={index === value ? "active" : ""}
          key={index}
        >
          {name}
        </li>
      );
    });
    return (
      <div className="categories">
        <ul>{categories}</ul>
      </div>
    );
  }
);
export default Categories;
