import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type Ball = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  sizes: number[];
  types: number[];
};

export type SearchBallParams = {
  currentPage: string;
  category: string;
  sortBy: string;
  order: string;
  search: string;
};

export enum Status {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

interface BallSliceState {
  status: Status;
  items: Ball[];
}

const initialState: BallSliceState = {
  items: [],
  status: Status.LOADING,
};

export const fetchBall = createAsyncThunk(
  "ball/fetchBall",
  async (params: SearchBallParams) => {
    const { currentPage, category, sortBy, order, search } = params;
    const { data } = await axios.get(
      `https://63bbda34cf99234bfa660b9e.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
    );

    if (data.length === 0) {
      throw new Error("rejected");
    }
    return data as Ball[];
  }
);

const ballSlice = createSlice({
  name: "ball",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Ball[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBall.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchBall.pending, (state, action) => {
      state.status = Status.LOADING;
      state.items = [];
    });
    builder.addCase(fetchBall.rejected, (state, action) => {
      state.items = [];
      state.status = Status.ERROR;
    });
  },
});

export const { setItems } = ballSlice.actions;

export default ballSlice.reducer;
