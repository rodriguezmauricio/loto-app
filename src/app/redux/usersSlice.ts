import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IReduxUsers {
  superId: string;
  id: string;
  name: string;
  phone: string;
  wallet: number;
  pix: string;
}

export const usersSlice = createSlice({
  name: "admin",
  initialState: <any>[],
  reducers: {
    updateUsers: (state, action: PayloadAction<IReduxUsers>) => {
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

export const { updateUsers } = usersSlice.actions;
export default usersSlice.reducer;
