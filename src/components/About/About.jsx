import React from "react";
import { profile } from "../../data/profile";

const TAGS = [
  "ReactJS",
  "Angular",
  "TypeScript",
  "JavaScript",
  "React Native",
  "Redux Toolkit",
  "Context API",
  "REST APIs",
  "GraphQL",
  "Kotlin",
  "Android SDK",
  "Jetpack Compose",
  "Jenkins",
  "GitHub Actions",
  "Production Triage",
  ...profile.domains,
];
const DURATION = 15000;
const ROWS = 1;
const TAGS_PER_ROW = 10;

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

const InfiniteLoopSlider = ({ children, duration, reverse = false }) => {
  return (
    <div className='loop-slider' style={{
      '--duration': `${duration}ms`,
      '--direction': reverse ? 'reverse' : 'normal'
    }}>
      <div className='inner'>
        {children}
        {children}
      </div>
    </div>
  );
};

const Tag = ({ text }) => (
  <div className='tag'><span>#</span> {text}</div>
);

const About = () => (
  <div className='tag-section'>
    <div className='tag-list'>
      {[...new Array(ROWS)].map((_, i) => (
        <InfiniteLoopSlider key={i} duration={random(DURATION - 5000, DURATION + 5000)} reverse={i % 2}>
          {shuffle(TAGS).slice(0, TAGS_PER_ROW).map(tag => (
            <Tag text={tag} key={tag} />
          ))}
        </InfiniteLoopSlider>
      ))}
      <div className='fade' 
      />
    </div>
  </div>
);

export default About;
