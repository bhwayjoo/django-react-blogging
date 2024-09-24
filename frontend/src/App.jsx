import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
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
import ProtectRouter from "./protect/ProtectRouter";
import LogOutProtect from "./protect/LogOutProtect";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          {/* Use ProtectRouter as an element for a nested route */}
          <Route element={<ProtectRouter />}>
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/edit-article/:id" element={<EditArticle />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* Use ProtectRouter as an element for a nested route */}
          <Route element={<LogOutProtect />}>
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/verifyEmail/:tokenEmail" element={<VerifyAcount />} />
          </Route>
          <Route path="/article/:id" element={<Article />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
