import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getCartFromLS } from "../../utils/getCartFromLS";
import { calcTotalPrice } from "../../utils/calcTotalPrice";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  type: string;
  size: number;
  count: number;
};

type CartActions = {
  id: number;
  size: number;
  type: string;
};

interface CartSliceState {
  totalPrice: number;
  items: CartItem[];
}

const { items, totalPrice } = getCartFromLS();

const initialState: CartSliceState = {
  totalPrice,
  items,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const findItem = state.items.find((obj) => {
        return (
          obj.id === action.payload.id &&
          obj.size === action.payload.size &&
          obj.type === action.payload.type
        );
      });
      findItem
        ? findItem.count++
        : state.items.push({ ...action.payload, count: 1 });

      state.totalPrice = calcTotalPrice(state.items);
    },
    minusItem(state, action: PayloadAction<CartActions>) {
      const findItem = state.items.find(
        (obj) =>
          obj.id === action.payload.id &&
          obj.size === action.payload.size &&
          obj.type === action.payload.type
      );

      if (findItem && findItem.count > 0) {
        findItem.count--;
      }

      if (findItem?.count === 0) {
        state.items = state.items.filter((obj) => {
          return !(
            obj.type === action.payload.type &&
            obj.size === action.payload.size &&
            obj.id === action.payload.id
          );
        });
      }

      state.totalPrice = calcTotalPrice(state.items);
    },
    plusItem(state, action: PayloadAction<CartActions>) {
      const findItem = state.items.find(
        (obj) =>
          obj.id === action.payload.id &&
          obj.size === action.payload.size &&
          obj.type === action.payload.type
      );
      if (findItem) {
        findItem.count++;
      }
      state.totalPrice = calcTotalPrice(state.items);
    },
    removeItem(state, action: PayloadAction<CartActions>) {
      state.items = state.items.filter((obj) => {
        return !(
          obj.type === action.payload.type &&
          obj.size === action.payload.size &&
          obj.id === action.payload.id
        );
      });
      state.totalPrice = calcTotalPrice(state.items);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = calcTotalPrice(state.items);
    },
  },
});

export const selectCart = (state: RootState) => state.cart;

export const { addItem, removeItem, clearItems, minusItem, plusItem } =
  cartSlice.actions;

export default cartSlice.reducer;
