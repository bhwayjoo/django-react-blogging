import { createSlice } from "@reduxjs/toolkit";

const article = {
  article: null,
};
const articleSlice = createSlice({
  name: "article",
  initialState: article,
  reducers: {
    resultShertchArticle: (state, action) => {
      state.article = action;
      console.log(action);
    },
  },
});
export const { resultShertchArticle } = articleSlice.actions;
export default articleSlice.reducer;
