import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    quantity: 0,
  },
  reducers: {
    setCartQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    increaseCartQuantity: (state, action) => {
      state.quantity = state.quantity + action.payload;
    },
    decreaseCartQuantity: (state, action) => {
      state.quantity = state.quantity - action.payload;
    },
  },
});

export const { setCartQuantity, increaseCartQuantity, decreaseCartQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
