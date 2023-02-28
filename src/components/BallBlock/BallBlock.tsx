import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, CartItem } from "../../redux/slices/cartSlice";
import { RootState } from "../../redux/store";

type BallBlockProps = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  sizes: number[];
  types: number[];
};

const BallBlock: React.FC<BallBlockProps> = ({
  id,
  name,
  imageUrl,
  price,
  sizes,
  types,
}) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((obj) => obj.id === id)
  );

  const addedCount = cartItem ? cartItem.count : 0;
  const [activeSize, setActiveSize] = useState(0);

  const size = sizes.map((item, index) => {
    return (
      <li
        key={item}
        className={index === activeSize ? "active" : ""}
        onClick={() => {
          setActiveSize(index);
        }}
      >
        {item}
      </li>
    );
  });

  //CHANGE PIZZA'S TYPE
  const [activeType, setActiveType] = useState(0);
  const typeNames = ["Indoor", "Universal"];

  const ballType = types.map((item, index) => {
    return (
      <li
        key={item}
        className={index === activeType ? "active" : ""}
        onClick={() => {
          setActiveType(index);
        }}
      >
        {typeNames[item]}
      </li>
    );
  });

  // добавляем мяч в корзину(массив)
  const onClickAdd = () => {
    const item: CartItem = {
      id,
      name,
      price,
      imageUrl,
      type: typeNames[activeType],
      size: sizes[activeSize],
      count: 0,
    };
    dispatch(addItem(item));
  };

  return (
    <div className="ball-block-wrapper">
      <div className="ball-block">
        <img className="ball-block__image" src={imageUrl} alt="Ball" />
        <h4 className="ball-block__title">{name}</h4>
        <div className="ball-block__selector">
          <ul>{ballType}</ul>
          <ul>{size}</ul>
        </div>
        <div className="ball-block__bottom">
          <div className="ball-block__price">от {price} ₽</div>
          <button
            className="button button--outline button--add"
            onClick={onClickAdd}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                fill="white"
              />
            </svg>
            <span>Добавить</span>
            {addedCount > 0 && <i>{addedCount}</i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BallBlock;
