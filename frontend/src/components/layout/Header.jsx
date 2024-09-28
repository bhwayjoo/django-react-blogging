import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { useDispatch } from "react-redux";
import customAxios from "../../services/api";
import { resultShertchArticle } from "../../features/articleSlice";
import { motion } from "framer-motion"; // Import Framer Motion

const Header = () => {
  const [authState, setAuthState] = useState({
    connected: false,
    loading: true,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchState, setSearchState] = useState({
    searchTerm: "",
    selectedTag: "",
    selectedCategory: "",
  });
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch both articles and user info when the page is opened
  const checkAuthStatus = useCallback(async () => {
    try {
      const resp = await customAxios.get("articles/articles/");
      dispatch(resultShertchArticle(resp.data));
      const response = await customAxios.get("account/userinfo/");

      // Dispatch articles to the Redux store
      dispatch(resultShertchArticle(resp.data));

      // Update authentication state
      setAuthState({ connected: response.status === 200, loading: false });
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({ connected: false, loading: false });
    }
  }, [dispatch]);

  // Fetch tags and categories when the page loads
  const fetchTagsAndCategories = useCallback(async () => {
    try {
      const [tagsResponse, categoriesResponse] = await Promise.all([
        customAxios.get("articles/tags/"), // Fetch tags
        customAxios.get("articles/categories/"), // Fetch categories
      ]);

      // Set fetched data to the state
      setTags(tagsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Failed to fetch tags and categories:", error);
    }
  }, []);

  // Ensure both auth status and data fetching are done when the page opens
  useEffect(() => {
    checkAuthStatus();
    fetchTagsAndCategories();
  }, [checkAuthStatus, fetchTagsAndCategories]);

  // Handle the search functionality when the user submits a search request
  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const { searchTerm, selectedCategory, selectedTag } = searchState;

        // Fetch search results based on category, term, and tag
        const response = await customAxios.get(
          `articles/articles/?category=${selectedCategory}&keyword=${searchTerm}&tags=${selectedTag}`
        );

        // Dispatch the results to the Redux store
        dispatch(resultShertchArticle(response.data));

        // Navigate to the homepage with search results
        navigate("/", { state: { results: response.data } });
      } catch (error) {
        console.error("Search failed:", error);
      }
    },
    [searchState, dispatch, navigate]
  );

  // Handle input changes in the search form
  const handleSearchInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setSearchState((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Toggle the mobile menu state
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Display a loading spinner if the authentication state is still loading
  if (authState.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          className="h-10 w-10 rounded-full border-4 border-t-4 border-gray-300 border-t-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Render the header and search form
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
          >
            MyBlog
          </Link>

          <nav className="hidden md:flex space-x-6">
            <NavLinks connected={authState.connected} />
          </nav>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative flex-grow">
            <input
              type="text"
              name="searchTerm"
              placeholder="Search articles..."
              value={searchState.searchTerm}
              onChange={handleSearchInputChange}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
            <select
              name="selectedCategory"
              value={searchState.selectedCategory}
              onChange={handleSearchInputChange}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="selectedTag"
              value={searchState.selectedTag}
              onChange={handleSearchInputChange}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 border-t border-gray-200">
          <nav className="flex flex-col space-y-2">
            <NavLinks connected={authState.connected} />
          </nav>
        </div>
      )}
    </header>
  );
};

// eslint-disable-next-line react/display-name
const NavLinks = React.memo(({ connected }) => {
  const linkStyle = "text-gray-600 hover:text-blue-500 transition-colors";

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }, []);

  if (connected) {
    return (
      <>
        <Link to="/" className={linkStyle}>
          Home
        </Link>
        <Link to="/create-article" className={linkStyle}>
          Create Article
        </Link>
        <Link to="/profile" className={linkStyle}>
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-blue-500 transition-colors"
        >
          Logout
        </button>
      </>
    );
  }
  return (
    <>
      <Link to="/" className={linkStyle}>
        Home
      </Link>
      <Link to="/signin" className={linkStyle}>
        Sign In
      </Link>
      <Link to="/signup" className={linkStyle}>
        Sign Up
      </Link>
    </>
  );
});

export default Header;
