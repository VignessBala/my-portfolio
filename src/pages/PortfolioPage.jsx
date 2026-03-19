import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Preloader from "../components/Preloader/Preloader";
import Mycomp from "../components/Main/Mycomp";
import "../js/app";

function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="App">
      {isLoading ? <Preloader /> : <Mycomp />}
    </div>
  );
}

export default PortfolioPage;
