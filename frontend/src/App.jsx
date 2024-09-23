import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Article from "./pages/Article";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Register from "./pages/Register";
import VerifyAcount from "./pages/VerifyAcount";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/create-article" element={<CreateArticle />} />
        <Route path="/edit-article/:id" element={<EditArticle />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verifyEmail/:tokenEmail" element={<VerifyAcount />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
