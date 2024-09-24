import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import customAxios from "../services/api";

function ProtectRouter() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const dataStatue = async () => {
      try {
        const response = await customAxios.head("account/userinfo/");
        if (response.status === 200) {
          setConnected(true);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };
    dataStatue();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return connected ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectRouter;
