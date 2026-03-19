import React, { useState, useEffect } from "react";
import Preloader from "./components/Preloader/Preloader";
import Mycomp from "./components/Main/Mycomp";
import "./js/app";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.onload = () => {
      AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
      });
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="App">
      {isLoading ? <Preloader /> : <Mycomp />}
    </div>
  );
}

export default App;
