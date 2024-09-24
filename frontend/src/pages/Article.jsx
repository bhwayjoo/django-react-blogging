import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, Calendar, Tag, MessageCircle, ThumbsUp } from "lucide-react";
import customAxios from "../services/api";

function Article() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await customAxios.get(`articles/articles/${id}/`);
        const fetchedArticle = response.data;
        setArticle(fetchedArticle);
        setComments(fetchedArticle.comments || []);
      } catch (error) {
        console.error("Failed to fetch the article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        const response = await customAxios.post("articles/comment-manager/", {
          article: id,
          content: comment,
        });
        const newComment = response.data;
        setComments([...comments, newComment]);
        setComment("");
      } catch (error) {
        console.error("Failed to post comment:", error);
      }
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await customAxios.delete(`comments/${commentId}/`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  const content = article.contents?.[0] || {};
  const category = article.category || { name: "Uncategorized" };
  const tags = article.tags || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-gray-50 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {content.title || "Untitled"}
          </h1>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="flex items-center">
              <User size={16} className="mr-2" />
              {article.author || "Unknown Author"}
            </span>
            <span className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {new Date(article.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Tag size={16} className="mr-2" />
              {category.name}
            </span>
          </div>
        </header>

        <div className="p-6">
          <div className="prose max-w-none">
            {content.body || "No content available"}
          </div>
        </div>

        <footer className="bg-gray-50 p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
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
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ThumbsUp size={18} />
              <span>Like this article</span>
            </button>
            <span className="flex items-center">
              <MessageCircle size={18} className="mr-2" />
              {comments.length} comments
            </span>
          </div>
        </footer>
      </article>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            rows="4"
            placeholder="Add a comment..."
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post Comment
          </button>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{comment.user}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
              {comment.user === "Current User" && (
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Article;
