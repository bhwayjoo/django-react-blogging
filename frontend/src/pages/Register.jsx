import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import customAxios from "../services/api";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordC, setShowPasswordC] = useState(false);
  const [nonFieldError, setNonFieldError] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'MyBlog | Register';
    },[]);

    
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
      navigate("/signin");
    } catch (error) {
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
    <div className="flex items-center justify-center min-h-screen my-[5%]  ">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border-2 border-secondary">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Register
        </h2>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          {nonFieldError && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded text-center">
              {nonFieldError}
            </div>
          )}

          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 mb-1"
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
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-1"
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
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password1"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register("password1", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum length is 8 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6 text-primary"
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path
                      fill-rule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6 text-primary"
                  >
                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password1 && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.password1.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password2"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register("password2", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password1 || "Passwords do not match",
                })}
                type={showPasswordC ? "text" : "password"}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowPasswordC(!showPasswordC)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPasswordC ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6 text-primary"
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path
                      fill-rule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6 text-primary"
                  >
                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password2 && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.password2.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LctzSEqAAAAAEiugD06AIpRPrYhA-fQeKJo8WAL"
              onChange={onRecaptchaChange}
              className="mt-4"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              disabled={loading}
            >
              {loading ? (
                <div class="flex-col gap-4 w-full flex items-center justify-center">
                  <div class="w-10 h-10 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-white rounded-full">
                    <div class="w-8 h-8 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-primary rounded-full"></div>
                  </div>
                </div>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
