import { configureStore } from "@reduxjs/toolkit";
import articleSlice from "../features/articleSlice";
import loadingSlice from "../features/loadingSlice";

export const store = configureStore({
  reducer: {
    article: articleSlice,
    loading: loadingSlice,
  },
});

export const selectLoading = (state) => state.loading.isLoading;
export const selectArticles = (state) => state.article.article?.payload || [];
