import React, { useCallback, useEffect, useRef } from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";

import "../scss/app.scss";
import Categories from "../components/Categories";
import Sort, { sortList } from "../components/Sort";
import Skeleton from "../components/BallBlock/Skeleton";
import BallBlock from "../components/BallBlock/BallBlock";
import Pagination from "../components/Pagination/Pagination";
import { useSelector } from "react-redux";
import {
  selectFilter,
  setCategoryId,
  setCurrentPage,
  setFilters,
} from "../redux/slices/filterSlice";
import { fetchBall, SearchBallParams } from "../redux/slices/ballSlice";
import { RootState, useAppDispatch } from "../redux/store";

function Home() {
  const navigate = useNavigate();
  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter);
  const { items, status } = useSelector((state: RootState) => state.ball);

  const dispatch = useAppDispatch();

  const onChangeCategory = useCallback(
    (id: number) => dispatch(setCategoryId(id)),
    [dispatch]
  );
  const onChangePageCount = useCallback(
    (num: number) => dispatch(setCurrentPage(num)),
    [dispatch]
  );

  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const fetchBasket = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const sortBy = sort.sortProperty.replace("-", "");
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const search = searchValue ? `&name=${searchValue}` : "";

    await dispatch(
      fetchBall({
        currentPage: String(currentPage),
        category,
        sortBy,
        order,
        search,
      })
    );
  };

  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, searchValue, currentPage, navigate]);

  // Если был первый рендер, проверяем URL-параметры и сохраняем в redux

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(
        window.location.search.substring(1)
      ) as unknown as SearchBallParams;
      const sort = sortList.find((item) => item.sortProperty === params.sortBy);

      dispatch(
        setFilters({
          searchValue: params.search,
          categoryId: Number(params.category),
          currentPage: Number(params.currentPage),
          sort: sort || sortList[0],
        })
      );
      isSearch.current = true;
    }
  }, [dispatch]);

  // Проверяем, если ли в адресной строке данные.
  useEffect(() => {
    fetchBasket();
    isSearch.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  // Генерация  компонентов мячей
  const balls = items.map((obj: any) => <BallBlock key={obj.id} {...obj} />);

  const skeletons = [...new Array(4)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onChangeCategory} />
        <Sort />
      </div>
      {status === "error" ? (
        <div className="content__error-info">
          <div>
            <span>😕</span>
          </div>
          <h2>
            К сожалению, не удалось отобразить мячи.
            <br /> Повторите попытку позже.{" "}
          </h2>
        </div>
      ) : (
        <>
          <h2 className="content__title">Все мячи</h2>
          <div className="content__items">
            {status === "loading" ? skeletons : balls}
          </div>
        </>
      )}
      <Pagination
        currentPage={currentPage}
        onChangePage={(num: number) => {
          onChangePageCount(num);
        }}
      />
    </div>
  );
}

export default Home;
