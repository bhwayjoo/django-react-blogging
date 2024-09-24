import { useSelector } from "react-redux";
import { articleSelectors } from "../store/selectors/userSelectors";
import ArticleCard from "../components/article/ArticleCard";

function Home() {
  const selector = useSelector(articleSelectors);
  const articles = selector?.article?.article?.payload || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Latest Articles
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div>No articles found</div>
        )}
      </div>
    </div>
  );
}

export default Home;
