import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import customAxios from "../services/api";

function VerifyAcount() {
  const { tokenEmail } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await customAxios.get(`account/verifyEmail/${tokenEmail}/`);
        navigate("/login");
      } catch (error) {
        console.error("Verification failed:", error);
        // Optionally, handle the error (e.g., show a message to the user)
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [tokenEmail, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="animate-spin h-10 w-10 mr-3 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Verifying account...
      </div>
    );
  }

  return <div>Verification complete. Redirecting...</div>;
}

export default VerifyAcount;
