import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { useDispatch } from "react-redux";
import customAxios from "../../services/api";
import { resultShertchArticle } from "../../features/articleSlice";
import { homeLoading } from "../../features/loadingSlice";

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

  const checkAuthStatus = useCallback(async () => {
    try {
      const resp = await customAxios.get("articles/articles/");
      dispatch(resultShertchArticle(resp.data));
      const response = await customAxios.get("account/userinfo/");
      setAuthState({ connected: response.status === 200, loading: false });
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({ connected: false, loading: false });
    }
  }, [dispatch]);

  const fetchTagsAndCategories = useCallback(async () => {
    try {
      const [tagsResponse, categoriesResponse] = await Promise.all([
        customAxios.get("articles/tags/"),
        customAxios.get("articles/categories/"),
      ]);
      setTags(tagsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Failed to fetch tags and categories:", error);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
    fetchTagsAndCategories();
  }, [checkAuthStatus, fetchTagsAndCategories]);

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch(homeLoading(true));
      try {
        const { searchTerm, selectedCategory, selectedTag } = searchState;

        const params = new URLSearchParams();
        if (selectedCategory) params.append("category", selectedCategory);
        if (searchTerm) params.append("keyword", searchTerm);
        if (selectedTag) params.append("tags", selectedTag);

        const url = `articles/articles/?${params.toString()}`;
        console.log("Search URL:", url);

        const response = await customAxios.get(url);
        console.log("Search response:", response.data);

        dispatch(resultShertchArticle(response.data));
        navigate("/", { state: { results: response.data } });
      } catch (error) {
        console.error("Search failed:", error);

        if (error.response) {
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
          console.error("Error headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }

        // TODO: Implement user-facing error message
      } finally {
        dispatch(homeLoading(false));
      }
    },
    [searchState, dispatch, navigate]
  );

  const handleSearchInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setSearchState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="text-3xl font-bold text-primary hover:text-gray-600 transition-colors"
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full hover:bg-blue-600 transition-colors"
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
          <nav className="flex flex-col space-y-2 ">
            <NavLinks connected={authState.connected} />
          </nav>
        </div>
      )}
    </header>
  );
};

// eslint-disable-next-line react/display-name
const NavLinks = React.memo(({ connected }) => {
  const linkStyle =
    "text-primary hover:text-blue-500 transition-colors font-semibold";

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
        Accueil
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
          SignOut
        </button>
      </>
    );
  }
  return (
    <>
      <Link to="/" className={linkStyle}>
      Accueil
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
