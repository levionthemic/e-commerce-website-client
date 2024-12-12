import { createSlice } from "@reduxjs/toolkit";

export const updatePasswordModalSlice = createSlice({
  name: "updatePasswordModal",
  initialState: {
    modal1: false,
    modal2: false,
    modal3: false
  },
  reducers: {
    openModal1: (state) => {
      state.modal1 = true;
    },
    closeModal1: (state) => {
      state.modal1 = false;
    },
    openModal2: (state) => {
      state.modal2 = true;
    },
    closeModal2: (state) => {
      state.modal2 = false;
    },
    openModal3: (state) => {
      state.modal3 = true;
    },
    closeModal3: (state) => {
      state.modal3 = false;
    },
    
  },
});

// Action creators are generated for each case reducer function
export const {
  openModal1,
  closeModal1,
  openModal2,
  closeModal2,
  openModal3,
  closeModal3,  
} = updatePasswordModalSlice.actions;

export default updatePasswordModalSlice.reducer;
