import React from "react";
import Intro from "../Intro/Intro";
import Navigation from "../Navigation/Navigation";
import About from "../About/About";
import Myself from "../Myself/Myself";
import grediant_bg from "../../assets/bg_greidant.png"
import Histroy from "../Histroy/Histroy";
import Project from "../Projects/Projects";
import Contact from "../Contact/Contact";
import { Index } from "../Gsap/Index";

const Mycomp = () => {

    // Apply smooth scrolling behavior to the target element
        return (
        <div className="body_bg">
            <div className="bg_img">
                <img className="grediant_img" src={grediant_bg} alt="Background Image"></img>
            </div>
            <Navigation />
            <Intro />
            <About />
            <Myself />
            <Histroy />
            <Project />
            <Index />
            <Contact />
       </div>
    );
  };

  export default Mycomp;