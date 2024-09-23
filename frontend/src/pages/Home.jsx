import { useEffect, useState } from "react";
import customAxios from "../services/api";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataStatue = async () => {
      try {
        const response = await customAxios.get("account/userinfo/");
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    dataStatue();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>home</div>
    </>
  );
}

export default Home;
