import React, { useRef, useState } from "react";

import ProjectItem from "./ListItem";
import ProjectBox from "./Box";
import { projects } from "./DummyData";

export function Index() {
  const [activeIndex, setActiveIndex] = useState(0);
  const projectBoxRef = useRef(null);
  const offsets = useRef([]);

  const handleMove = (event) => {
    const { x, y, index } = event;
    offsets.current[index] = { x, y };
  };

  return (
    <section className="myself" id="skills">
          <div className="myself_content">
            <div className="myself_header">
              <p className="myself_t1">Know About</p>
              <p className="myself_t2">Technologies I Use</p>
            </div>
            <div className="body_skills">
            <div onMouseEnter={() => projectBoxRef.current?.animateIn()} onMouseLeave={() => projectBoxRef.current?.animateOut()} className="gsap_grid">
                {projects.map((project, index) => (
                  <ProjectItem
                    key={project.id}
                    serialNumber={project.id}
                    projectName={project.projectName}
                    index={index}
                    onEnter={() => setActiveIndex(index)}
                    onMove={handleMove}
                  />
                ))}
              </div>
            
              <ProjectBox
                projectImages={projects}
                activeIndex={activeIndex}
                ref={projectBoxRef}
                offsets={offsets.current}
              />
            </div>
          </div>
        </section>
  
  );
}
