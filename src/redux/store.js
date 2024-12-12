import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice";
import productReducer from "./slices/ProductSlice";
import cartReducer from "./slices/cartSlice"; // Thêm cartReducer
import updatePasswordReducer from './slices/UpdatePasswordModalSlice';
import updateEmailReducer from './slices/UpdateEmailModalSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    cart: cartReducer, // Thêm cart vào store
    updatePasswordModal: updatePasswordReducer,
    updateEmailModal: updateEmailReducer
  },
});

export default store;
