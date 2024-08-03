import React from "react";
import Layout from "../components/Layout";
import { useAuth } from "../components/Context/UserContext";

const HomePage = () => {
  const [auth, setauth] = useAuth();
  return (
    <>
      <div className="bg-red-900 p-2">
      <p>
        this is
      </p>
      <p>{JSON.stringify(auth, null, 4)}</p>

      </div>
    </>
  );
};

export default HomePage;
