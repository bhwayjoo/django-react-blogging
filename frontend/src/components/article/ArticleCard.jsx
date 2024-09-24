import { Calendar, Tag, MessageCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

function ArticleCard({ article }) {
  const content = article.contents?.[0] || {};

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-6">
        <Link
          to={`/article/${article.id}/`}
          className="text-2xl font-semibold mb-2 text-gray-800"
        >
          {content.title || "Untitled"}
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {content.body || "No content available"}
        </p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User size={16} className="mr-2" />
          <span>{article.author || "Unknown author"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar size={16} className="mr-2" />
          <span>{new Date(article.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags?.map((tag) => (
            <span
              key={tag.id}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center"
            >
              <Tag size={12} className="mr-1" />
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <MessageCircle size={16} className="mr-2" />
            {article.comments?.length || 0} comments
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {article.category?.name || "Uncategorized"}
          </span>
        </div>
      </div>
    </div>
  );
}
export default ArticleCard;
