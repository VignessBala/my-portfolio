import React from "react";
import skills from "../../assets/Skills.png"

const Skills = () => {
    return(
        <section className="myself" id="skills">
          <div className="myself_content">
            <div className="myself_header">
              <p className="myself_t1">Know About</p>
              <p className="myself_t2">Technologies I Use</p>
            </div>
            <div className="body_skills">
              <div className="skills_img">
                <img src={skills} alt="skills" className="skuills_photo"></img>
              </div>
            </div>
          </div>
        </section>
    );
};

export default Skills