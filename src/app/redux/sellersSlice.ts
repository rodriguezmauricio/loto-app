import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IReduxSellers {
  adminId: string;
  id: string;
  nome: string;
  telefone: string;
  nomeUsuario: string;
  pix: string;
  saldo: number;
  tipoComissao: string;
  valorComissao: number;
}

export const sellersSlice = createSlice({
  name: "admin",
  initialState: <any>[],
  reducers: {
    updateSellers: (state, action: PayloadAction<IReduxSellers>) => {
      state = action.payload;
      // const { adminId, id, name, wallet, tipoComissao, valorComissao } = action.payload;
      // state.adminId = adminId;
      // state.id = id;
      // state.name = name;
      // state.wallet = wallet;
      // state.tipoComissao = tipoComissao;
      // state.valorComissao = valorComissao;
    },

    addSellers: (state, action: PayloadAction<IReduxSellers>) => {
      //add a seller to the database
      state.push(action.payload);
    },
  },
});

export const { updateSellers, addSellers } = sellersSlice.actions;
export default sellersSlice.reducer;
