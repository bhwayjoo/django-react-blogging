import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectArticles, selectLoading } from "../store/store";
import { homeLoading } from "../features/loadingSlice";
import { resultShertchArticle } from "../features/articleSlice";
import ArticleCard from "../components/article/ArticleCard";
import HomeLoading from "../components/loading/HomeLoading";
import customAxios from "../services/api";

function Home() {
  const dispatch = useDispatch();
  const articles = useSelector(selectArticles);
  const isLoading = useSelector(selectLoading);

  useEffect(() => {
    const fetchArticles = async () => {
      dispatch(homeLoading(true));
      try {
        const response = await customAxios.get("articles/articles/");
        dispatch(resultShertchArticle(response.data));
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        dispatch(homeLoading(false));
      }
    };

    fetchArticles();
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Latest Articles
      </h1>
      {isLoading ? (
        <HomeLoading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length ? (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div>No articles found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
