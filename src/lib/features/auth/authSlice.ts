import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
const initialState = {
   token: "",
   password: "",
};

export const VerfyUserSlice = createSlice({
   name: "verifyToken",
   initialState,
   reducers: {
      setAuth: (
         state,
         action: PayloadAction<{ token: string; password: string }>
      ) => {
         state.token = action.payload.token;
         state.password = action.payload.password;
      },
   },
});

// Action creators are generated for each case reducer function
export const { setAuth } = VerfyUserSlice.actions;

export const selectToken = (state: RootState) => state.authReducer.token;
export const selectPassword = (state: RootState) => state.authReducer.password;

export default VerfyUserSlice.reducer;
