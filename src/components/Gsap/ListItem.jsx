import React, { useRef } from "react";
import { Power2, gsap } from "gsap";

export default function ProjectItem({
  index,
  serialNumber,
  projectName,
  onEnter,
  onMove,
}) {
  const textRef = useRef();

  const handleEnter = () => {
    onEnter(index);
    gsap.killTweensOf(textRef.current);

    gsap.to(textRef.current, {
      paddingLeft: "9rem",
      duration: 0.335,
      ease: Power2.easeInOut,
    });
  };

  const handleLeave = () => {
    gsap.killTweensOf(textRef.current);

    gsap.to(textRef.current, {
      paddingLeft: 0,
      duration: 0.335,
      ease: Power2.easeInOut,
    });
  };

  const handleMove = (event) => {
    const { left, top, width, height } = textRef.current.getBoundingClientRect();

    const progressionY = (1 / height) * (event.clientY - top);
    const progressionX = (1 / width) * (event.clientX - left);

    const x = gsap.utils.interpolate(-1, 1, progressionX);
    const y = gsap.utils.interpolate(-1, 1, progressionY);

    onMove({ x, y, index });
  };

  return (
    <li
      ref={textRef}
      className="gsap_items"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
    >
      <div className="custom_container">
        <span className="custom_serialNumber">
            {serialNumber}
        </span>
        <h2 className="custom_projectName">
            {projectName}
        </h2>
      </div>
    </li>
  );
}
