import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, Calendar, Tag, MessageCircle, ThumbsUp } from "lucide-react";
import customAxios from "../services/api";
import LoadingArticle from "../components/loading/LoadingArticle";
import LodingComments from "../components/loading/LodingComments";

function Article() {
  const [article, setArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [tagNames, setTagNames] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchArticleAndMetadata = async () => {
      setLoadingArticle(true);  // Start loading state
      try {
        const articleResponse = await customAxios.get(`articles/articles/${id}/`);
        const fetchedArticle = articleResponse.data;

        if (!fetchedArticle) {
          throw new Error("Article not found");
        }

        setArticle(fetchedArticle);
        setComments(fetchedArticle.comments || []);

        // Fetch category name
        if (fetchedArticle.category) {
          const categoryResponse = await customAxios.get(`articles/categories/${fetchedArticle.category}/`);
          setCategoryName(categoryResponse.data.name);
        }

        // Fetch tag names
        if (fetchedArticle.tags && fetchedArticle.tags.length > 0) {
          const tagPromises = fetchedArticle.tags.map((tagId) =>
            customAxios.get(`articles/tags/${tagId}/`)
          );
          const tagResponses = await Promise.all(tagPromises);
          const newTagNames = {};
          tagResponses.forEach((response) => {
            newTagNames[response.data.id] = response.data.name;
          });
          setTagNames(newTagNames);
        }
      } catch (error) {
        console.error("Failed to fetch the article or metadata:", error);
      } finally {
        setLoadingArticle(false);
      }
    };

    fetchArticleAndMetadata();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const commentsResponse = await customAxios.get(`comments?articleId=${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
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


  const content = article?.contents?.[0] || {};

  return (
    <div className="container mx-auto px-4 py-8">
    {loadingArticle ? <LoadingArticle/>  :
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
            {categoryName || "Uncategorized"}
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
          {article.tags?.map((tagId) => (
            <span
              key={tagId}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center"
            >
              <Tag size={12} className="mr-1" />
              {tagNames[tagId] || `Tag ${tagId}`}
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
    }

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
     
         <form onSubmit={handleCommentSubmit} className={`mb-6 ${loadingComments ?'hidden' :''}`}>
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
          {loadingComments
            ? Array.from({ length: 3 }).map((_, index) => (
                <LodingComments key={index} />
              ))
            : comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white p-4 rounded-lg shadow"
                >
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
