import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import customAxios from "../services/api"; // Assuming you have an API service

function LogOutProtect() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await customAxios.head("account/userinfo/");
        if (response.status === 200) {
          setConnected(checkAuthStatus); // User is authenticated
        }
      } catch (e) {
        setConnected(false); // User is not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is authenticated (connected), redirect them to /portfolio
  return !connected ? <Outlet /> : <Navigate to="/" />;
}

export default LogOutProtect;
