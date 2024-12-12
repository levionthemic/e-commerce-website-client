import { createSlice } from "@reduxjs/toolkit";

export const updateEmailModalSlice = createSlice({
  name: "updateEmailModal",
  initialState: {
    modal1: false,
    modal2: false,
    modal3: {
      value: false,
      email: "",
    }
  },
  reducers: {
    openEmailModal1: (state) => {
      state.modal1 = true;
    },
    closeEmailModal1: (state) => {
      state.modal1 = false;
    },
    openEmailModal2: (state) => {
      state.modal2 = true;
    },
    closeEmailModal2: (state) => {
      state.modal2 = false;
    },
    openEmailModal3: (state, action) => {
      state.modal3.value = true;
      state.modal3.email = action.payload;
    },
    closeEmailModal3: (state) => {
      state.modal3 = false;
    },
    
  },
});

// Action creators are generated for each case reducer function
export const {
  openEmailModal1,
  closeEmailModal1,
  openEmailModal2,
  closeEmailModal2,
  openEmailModal3,
  closeEmailModal3,  
} = updateEmailModalSlice.actions;

export default updateEmailModalSlice.reducer;
