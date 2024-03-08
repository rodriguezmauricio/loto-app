import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IReduxSellers {
  adminId: string;
  id: string;
  name: string;
  phone: string;
  wallet: number;
  comissionType: string;
  comissionValue: number;
}

export const sellersSlice = createSlice({
  name: "admin",
  initialState: <any>[],
  reducers: {
    updateSellers: (state, action: PayloadAction<IReduxSellers>) => {
      state = action.payload;
      // const { adminId, id, name, wallet, comissionType, comissionValue } = action.payload;
      // state.adminId = adminId;
      // state.id = id;
      // state.name = name;
      // state.wallet = wallet;
      // state.comissionType = comissionType;
      // state.comissionValue = comissionValue;
    },
  },
});

export const { updateSellers } = sellersSlice.actions;
export default sellersSlice.reducer;
