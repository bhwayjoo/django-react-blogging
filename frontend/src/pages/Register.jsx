import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import customAxios from "../services/api";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nonFieldError, setNonFieldError] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const password1 = watch("password1");

  useEffect(() => {
    const scriptId = "google-recaptcha-script";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://www.google.com/recaptcha/enterprise.js?render=6LefxyEqAAAAAMvOn8M8XTvpKDPiUo1jcPhA7QBh";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.grecaptcha.enterprise.ready(() => {
          window.grecaptcha.enterprise
            .execute("6LefxyEqAAAAAMvOn8M8XTvpKDPiUo1jcPhA7QBh", {
              action: "REGISTER",
            })
            .then(() => {
              setRecaptchaValue(false);
            })
            .catch((err) => {
              console.error("Error executing reCAPTCHA:", err);
            });
        });
      };
    }

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const onRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    console.log(recaptchaValue);
  };

  const submitForm = async (data) => {
    setLoading(true);
    setNonFieldError("");

    if (!recaptchaValue) {
      setNonFieldError("Please complete the reCAPTCHA");
      setLoading(false);
      return;
    }
    try {
      await customAxios.post(`/account/register/`, {
        ...data,
        recaptcha: recaptchaValue,
      });
      console.log("co");
      navigate("/login");
    } catch (error) {
      console.log(error);
      const errorData = error.response?.data;
      if (errorData) {
        if (errorData.email) {
          setNonFieldError("Email is already in use");
        } else if (errorData.non_field_errors) {
          setNonFieldError(errorData.non_field_errors[0]);
        } else {
          setNonFieldError("Bad request, please contact support");
        }
      } else {
        setNonFieldError("An unknown error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Register
        </h2>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          {nonFieldError && (
            <div className="text-red-500 text-center mb-4">{nonFieldError}</div>
          )}

          <div className="flex flex-col mb-5">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 characters",
                },
              })}
              type="text"
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex flex-col mb-5">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col mb-5">
            <label
              htmlFor="password1"
              className="text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password1"
                {...register("password1", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum length is 8 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder="Enter your password"
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
                    d="M12 4.5a7.5 7.5 0 015.558 12.628M5.633 12.572A7.5 7.5 0 0112 4.5m0 0a7.5 7.5 0 00-5.558 12.628M12 4.5v15"
                  />
                </svg>
              </button>
            </div>
            {errors.password1 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password1.message}
              </p>
            )}
          </div>

          <div className="flex flex-col mb-5">
            <label
              htmlFor="password2"
              className="text-sm font-semibold text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="password2"
                {...register("password2", {
                  required: "Please confirm your password",
                  minLength: {
                    value: 8,
                    message: "Minimum length is 8 characters",
                  },
                  validate: (value) =>
                    value === password1 || "Passwords do not match",
                })}
                type={showPassword ? "text" : "password"}
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder="Confirm your password"
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
                    d="M12 4.5a7.5 7.5 0 015.558 12.628M5.633 12.572A7.5 7.5 0 0112 4.5m0 0a7.5 7.5 0 00-5.558 12.628M12 4.5v15"
                  />
                </svg>
              </button>
            </div>
            {errors.password2 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password2.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <ReCAPTCHA
              sitekey="6LctzSEqAAAAAEiugD06AIpRPrYhA-fQeKJo8WAL"
              onChange={onRecaptchaChange}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 text-white font-semibold rounded-md ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {loading && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
