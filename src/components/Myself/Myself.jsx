import { useRef } from "react";
import balaMain from "../../assets/bala-main.jpeg";
import balaStanding from "../../assets/bala-standing.jpeg";
import { useHoverEffect } from "../Intro/useHoverEffect";
import { profile } from "../../data/profile";

const data = {
  img1: balaMain,
  img2: balaStanding,
};
const Myself = () => {
  const heroImgRef = useRef(null);
  useHoverEffect(heroImgRef, data.img1, data.img2);
  return (
    <section className="myself" id="myself">
      <div className="myself_content">
        <div className="myself_header">
          <p className="myself_t1">Introduction</p>
          <p className="myself_t2">Know About Me</p>
        </div>
        <div className="myself_flex">
          <div className="myself_width">
            <div className="myself_left" ref={heroImgRef}></div>
          </div>
          <div className="myself_right">
            <div className="myself_aboutme myself_borderone">
              <div className="myself_topknot">
                <span className="myself_icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg_myself"
                    viewBox="0 0 39 40"
                    fill="none"
                  >
                    <path
                      d="M19.5 0L22.2577 17.1716L39 20L22.2577 22.8284L19.5 40L16.7423 22.8284L0 20L16.7423 17.1716L19.5 0Z"
                      fill="#AFA1F7"
                    />
                  </svg>
                </span>
                <p className="myself_brief">Introduction</p>
              </div>
              <p className="myself_detrail">
                {profile.about}
              </p>
            </div>
            <div className="myself_aboutme myself_bordertwo">
              <div className="myself_topknot">
                <span className="myself_icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg_myself"
                    viewBox="0 0 39 40"
                    fill="none"
                  >
                    <path
                      d="M19.5 0L22.2577 17.1716L39 20L22.2577 22.8284L19.5 40L16.7423 22.8284L0 20L16.7423 17.1716L19.5 0Z"
                      fill="#AFA1F7"
                    />
                  </svg>
                </span>
                <p className="myself_brief">Contact Information</p>
              </div>
              <div className="myself_contact">
                <div className="myself_email">
                  <p className="myself_address">Email</p>
                  <p className="myself_detrail">{profile.email}</p>
                </div>
                <div className="myself_email">
                  <p className="myself_address">Contact</p>
                  <p className="myself_detrail">{profile.phone}</p>
                </div>
                <div className="myself_email">
                  <p className="myself_address">Location</p>
                  <p className="myself_detrail">{profile.location}</p>
                </div>
                <div className="myself_email">
                  <p className="myself_address">LinkedIn</p>
                  <p className="myself_detrail">bala-vigness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Myself;
