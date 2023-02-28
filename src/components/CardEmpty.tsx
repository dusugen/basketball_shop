import React from "react";
import { Link } from "react-router-dom";

import emptyCardImg from "../assets/img/empty-cart.png";

const CardEmpty: React.FC = () => {
  return (
    <div className="cart cart--empty">
      <h2>
        Корзина пустая <span>😕</span>
      </h2>
      <p>
        Вероятней всего, вы ещё не выбрали товар.
        <br />
        Для того, чтобы выбрать товар, перейди на главную страницу.
      </p>
      <img src={emptyCardImg} alt="Empty cart" />
      <Link to="/" className="button button--black">
        <span>Вернуться назад</span>
      </Link>
    </div>
  );
};

export default CardEmpty;
