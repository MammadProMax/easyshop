import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
const initialState = {
   token: "",
};

export const counterSlice = createSlice({
   name: "verifyToken",
   initialState,
   reducers: {
      setToken: (state, action: PayloadAction<string>) => {
         state.token = action.payload;
      },
   },
});

// Action creators are generated for each case reducer function
export const { setToken } = counterSlice.actions;

export const selectToken = (state: RootState) => state.authReducer.token;

export default counterSlice.reducer;
