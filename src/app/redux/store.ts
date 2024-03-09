import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";
import sellersReducer from "./sellersSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    sellers: sellersReducer,
    users: usersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
