import React, { useEffect } from "react";
import { Link } from "react-scroll";
import { profile } from "../../data/profile";

const Intro = () => {
  useEffect(() => {
    const playBtn = document.getElementById("play");
    const audios = document.querySelectorAll("audio");

    if (!playBtn) {
      return undefined;
    }

    const handlePlayMouseOver = () => {
      audios.forEach(audio => {
        audio.play();
      });
    };
  
    const handlePlayMouseLeave = () => {
      audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  
    playBtn.addEventListener('mouseover', handlePlayMouseOver);
    playBtn.addEventListener('mouseleave', handlePlayMouseLeave);
  
    return () => {
      playBtn.removeEventListener("mouseover", handlePlayMouseOver);
      playBtn.removeEventListener("mouseleave", handlePlayMouseLeave);
    };
  }, []);

  return (
    <section id="hero">
      <div className="intro_content">
        <div className="intro_body">
          <div className="intro_icons">
            <p className="intro_tname">Hello, I&apos;m Bala</p>
            <span className="intro_hand"></span>
          </div>
          <span className="intro_span">
            {profile.title}
            <span className="dot_intro">.</span>
          </span>
          <p className="intro_dname">{profile.summary}</p>
          <div className="btn_intro">
            <a href={profile.resumePath} className="intro_newbtn" target="_blank" rel="noreferrer">
              <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="intro_down">
                  <path d="M7 21C5.89543 21 5 20.1046 5 19V3H14L19 8V19C19 20.1046 18.1046 21 17 21H7Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 3V9H19" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="intro_spanz">Resume</span>
            </a>
            <Link
              activeClass="active"
              to="contact"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="intro_newbtn"
              id="play"
            >
              <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="intro_down">
                  <path d="M3 5H21V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 5L12 14L21 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="intro_spanz">Contact Me</span>
            </Link>
          </div>
        </div>
        <div className="intro_dlogo">
          <div className="avatar" data-type="wave">
            <div className="image"></div>
          </div>
        </div>
      </div>
      <div className="intro_scroll">
        
      </div>
    </section>
  );
};

export default Intro;
