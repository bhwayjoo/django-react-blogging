import { useQuery } from "react-query";
import ArticleCard from "../components/article/ArticleCard";
import LoadingArticle from "../components/loading/LoadingArticle";
import customAxios from "../services/api";

// Fetch articles
const fetchArticles = async () => {
  try {
    const { data } = await customAxios.get("articles/articles/");
    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to fetch articles");
  }
};

// Fetch tags
const fetchTags = async () => {
  try {
    const { data } = await customAxios.get("articles/tags/");
    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }
};

// Fetch categories
const fetchCategories = async () => {
  try {
    const { data } = await customAxios.get("articles/categories/");
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

function Home() {
  // Fetch articles using React Query
  const { data: articlesData, isLoading: isLoadingArticles, isError: isErrorArticles } = useQuery("articles", fetchArticles);

  // Fetch tags using React Query
  const { data: tagsData, isLoading: isLoadingTags, isError: isErrorTags } = useQuery("tags", fetchTags);

  // Fetch categories using React Query
  const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery("categories", fetchCategories);

  // Combine loading states
  const isLoading = isLoadingArticles || isLoadingTags || isLoadingCategories;

  // Combine error states
  const isError = isErrorArticles || isErrorTags || isErrorCategories;

  if (isError) return <div>Failed to load data.</div>;

  // Map tags and categories
  const tagsMap = tagsData
    ? tagsData.reduce((acc, tag) => {
        acc[tag.id] = tag.name;
        return acc;
      }, {})
    : {};

  const categoriesMap = categoriesData
    ? categoriesData.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {})
    : {};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Latest Articles
      </h1>
      {isLoading ? (
        // Render 6 skeleton cards during loading
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingArticle key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesData?.length ? (
            articlesData.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                tags={tagsMap}
                categories={categoriesMap}
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
