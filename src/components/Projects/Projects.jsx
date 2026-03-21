import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VanillaTilt from "vanilla-tilt";
import wishlistPlusImage from "../../assets/project-wishlist-plus.png";
import mtnMomoImage from "../../assets/project-mtn-momo.png";
import autoAuditImage from "../../assets/project-auto-audit.png";
import starcbsImage from "../../assets/project-starcbs.png";
import projectBg from "../../assets/project-bg.svg";
import logo1 from "../../assets/code/js.png";
import logo2 from "../../assets/code/tailwind.png";
import logo3 from "../../assets/code/api.svg";
import logo4 from "../../assets/code/react.png";
import ant from "../../assets/code/antdesign.svg";
import nextjs from "../../assets/code/red.svg";
import angular from "../../assets/code/angu.svg";
import rest from "../../assets/code/restapi.svg";
import git from "../../assets/code/git.png";

const ProjectArrow = ({ className, onClick, direction }) => (
  <button
    type="button"
    className={`${className} project_arrow project_arrow--${direction}`}
    onClick={onClick}
    aria-label={direction === "next" ? "Next project" : "Previous project"}
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d={direction === "next" ? "M6 3L12 9L6 15" : "M12 3L6 9L12 15"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const projectCards = [
  {
    href: "https://apps.shopify.com/swym-relay",
    title: "Wishlist Plus",
    description: "Shopify storefront and admin modules built with ReactJS, TypeScript, GraphQL, and Redux Toolkit.",
    image: wishlistPlusImage,
    background: "linear-gradient(90deg, rgb(241, 70, 88) 0%, rgb(220, 37, 55) 100%)",
    topBackground: "linear-gradient(rgb(241, 70, 88) 0%, rgba(0, 0, 0, 0) 100%)",
    bottomBackground: "linear-gradient(0deg, rgb(241, 70, 88) 10%, rgba(0, 0, 0, 0) 100%)",
    logos: [logo4, logo1, logo3, nextjs],
  },
  {
    href: "https://play.google.com/store/apps/details?id=com.consumerug&hl=en&pli=1",
    title: "MTN MoMo",
    description: "Production React Native payment flows with Redux, navigation, API integration, release support, and incident fixes.",
    image: mtnMomoImage,
    background: "linear-gradient(90deg, rgb(164 70 241) 0%, rgb(114 43 150) 100%)",
    topBackground: "linear-gradient(rgb(203 25 255), rgba(0, 0, 0, 0) 100%)",
    bottomBackground: "linear-gradient(0deg, rgb(203 25 255) 10%, rgba(0, 0, 0, 0) 100%)",
    logos: [logo4, nextjs, rest, git],
  },
  {
    href: null,
    title: "Auto Audit / Let's Dine",
    description: "React Native feature delivery for audit automation, SMS and email mirroring, and lifecycle reliability fixes.",
    image: autoAuditImage,
    background: "linear-gradient(90deg, rgb(43, 140, 122) 0%, rgb(18, 96, 83) 100%)",
    topBackground: "linear-gradient(rgb(43, 140, 122), rgba(0, 0, 0, 0) 100%)",
    bottomBackground: "linear-gradient(0deg, rgb(43, 140, 122) 10%, rgba(0, 0, 0, 0) 100%)",
    logos: [logo4, rest, logo3, ant],
  },
  {
    href: null,
    title: "STARCBS / STARONE",
    description: "Angular web modules and React Native banking workflows with ASP.NET Core APIs and sprint release support.",
    image: starcbsImage,
    background: "linear-gradient(90deg, rgb(52, 103, 196) 0%, rgb(40, 66, 132) 100%)",
    topBackground: "linear-gradient(rgb(52, 103, 196), rgba(0, 0, 0, 0) 100%)",
    bottomBackground: "linear-gradient(0deg, rgb(52, 103, 196) 10%, rgba(0, 0, 0, 0) 100%)",
    logos: [angular, ant, rest, logo2],
  },
];

const Projects = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    adaptiveHeight: false,
    prevArrow: <ProjectArrow direction="prev" />,
    nextArrow: <ProjectArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1180,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: true,
        },
      },
    ],
  };

  const tiltCardRefs = useRef([]);

  useEffect(() => {
    tiltCardRefs.current.forEach((cardNode) => {
      if (!cardNode) {
        return;
      }

      VanillaTilt.init(cardNode, {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 1,
        gyroscope: false,
      });
    });

    return () => {
      tiltCardRefs.current.forEach((cardNode) => {
        cardNode?.vanillaTilt?.destroy();
      });
    };
  }, []);

  return (
    <section className="myself" id="projects">
      <div className="myself_content">
        <div className="myself_header no_min">
          <p className="myself_t1">The Projects</p>
          <p className="myself_t2">That I Build</p>
        </div>
        <div className="project_body">
          <div className="project_sliderWrap">
            <Slider {...settings}>
              {projectCards.map((project, index) => {
                const cardMarkup = (
                  <div className="project_cardFrame">
                    <div
                      className="project_tilt"
                      ref={(node) => {
                        tiltCardRefs.current[index] = node;
                      }}
                    >
                      <div
                        className={`project_cardContent${
                          project.href ? " project_cardContent--interactive" : ""
                        }`}
                      >
                        <div className="card_project" style={{ background: project.background }}>
                          <img className="box_img" src={projectBg} alt="" />
                          <span className="project_span">
                            <img className="project_img" src={project.image} alt={project.title} />
                          </span>
                          <div className="top_project" style={{ background: project.topBackground }}></div>
                          <div className="bottom_project" style={{ background: project.bottomBackground }}></div>
                          <p className="project_txt">{project.title}</p>
                          <div className="project_logo_sec">
                            <div className="project_sets">
                              {project.logos.map((logo, logoIndex) => (
                                <img
                                  key={`${project.title}-${logoIndex}`}
                                  className={`imgs_prj${logoIndex + 1}`}
                                  src={logo}
                                  alt=""
                                />
                              ))}
                            </div>
                          </div>
                          <p className="project_txt2">{project.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );

                if (!project.href) {
                  return <div key={project.title}>{cardMarkup}</div>;
                }

                return (
                  <a href={project.href} key={project.title} target="_blank" rel="noreferrer">
                    {cardMarkup}
                  </a>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
