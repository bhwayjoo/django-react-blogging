import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import customAxios from "../services/api";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      const res = await customAxios.post("account/google-login/", {
        token: credentialResponse.credential,
      });

      const { access, refresh } = res.data;

      localStorage.setItem("authToken", access);
      localStorage.setItem("refreshToken", refresh);
      window.location.reload();
    } catch (error) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await customAxios.post("account/login/", {
        email,
        password,
      });

      const token = response.data.access;
      const refreshToken = response.data.refresh;

      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      window.location.reload();
    } catch (error) {
      setError(error.response.data.error);
      console.error(error.response.data.error);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Login
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded dark:bg-red-900 dark:text-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col mb-5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Email Address
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-col mb-5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                id="password"
                type={showPassword ? "text" : "password"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={`M${
                      showPassword
                        ? "5 12a7 7 0 0110-9m5 5a7 7 0 00-10 9m-1.5-6.5A1.5 1.5 0 109 12a1.5 1.5 0 00-1.5-1.5"
                        : "3 3m0 6a10 10 0 1114.32 0M4.42 4.42a10 10 0 0114.32 0m-1.34 1.34a7 7 0 00-10 9m-2-1a7 7 0 010-10.28"
                    }`}
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              />
            </div>
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>

          <Link
            to="/portfolio/FrogPassword"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot Password?
          </Link>
          <div className="flex mt-4 justify-center">
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() =>
                  setError("Google login failed. Please try again.")
                }
                useOneTap
              />
            </GoogleOAuthProvider>
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 text-white font-medium rounded-lg text-sm transition-all duration-300 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
