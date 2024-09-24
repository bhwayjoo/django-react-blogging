import { configureStore } from "@reduxjs/toolkit";
import articleSlice from "../features/articleSlice";

export const store = configureStore({
  reducer: {
    article: articleSlice,
  },
});
