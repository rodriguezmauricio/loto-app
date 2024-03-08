import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    id: "a00",
    name: "AAAAAA",
    wallet: 100,
  },
  reducers: {
    updateAdmin: (state, action: PayloadAction<{ id: string; name: string; wallet: number }>) => {
      const { id, name, wallet } = action.payload;
      state.id = id;
      state.name = name;
      state.wallet = wallet;
    },
  },
});

export const { updateAdmin } = adminSlice.actions;
export default adminSlice.reducer;
