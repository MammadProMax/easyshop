import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
const initialState = {
   token: "",
};

export const ForgotPassSlice = createSlice({
   name: "forgotPassToken",
   initialState,
   reducers: {
      setForgotToken: (state, action: PayloadAction<string>) => {
         state.token = action.payload;
      },
   },
});

// Action creators are generated for each case reducer function
export const { setForgotToken } = ForgotPassSlice.actions;

export const selectForgotPassToken = (state: RootState) =>
   state.forgotPassReducer.token;

export default ForgotPassSlice.reducer;
