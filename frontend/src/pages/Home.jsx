import { useEffect, useState } from "react";
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
  const [tags, setTags] = useState({});
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      dispatch(homeLoading(true));
      try {
        const [articlesResponse, tagsResponse, categoriesResponse] =
          await Promise.all([
            customAxios.get("articles/articles/"),
            customAxios.get("articles/tags/"),
            customAxios.get("articles/categories/"),
          ]);

        dispatch(resultShertchArticle(articlesResponse.data));

        const tagsMap = {};
        tagsResponse.data.forEach((tag) => {
          tagsMap[tag.id] = tag.name;
        });
        setTags(tagsMap);

        const categoriesMap = {};
        categoriesResponse.data.forEach((category) => {
          categoriesMap[category.id] = category.name;
        });
        setCategories(categoriesMap);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        dispatch(homeLoading(false));
      }
    };

    fetchData();
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
              <ArticleCard
                key={article.id}
                article={article}
                tags={tags}
                categories={categories}
              />
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
