import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
  } from "react";
  import { gsap, Power2 } from "gsap";
  import { useRafFn } from "./Animation";
  
  const ProjectBox = forwardRef((props, ref) => {
    const { activeIndex, projectImages, offsets } = props;
  
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [wavyPosition, setWavyPosition] = useState({
      positionX: 0,
      positionY: 0,
    });
    const [previousX, setPreviousX] = useState(0);
    const [rotation, setRotation] = useState(0);
  
    const boxRef = useRef(null);
    const elRef = useRef(null);
    const imagesRef = useRef([]);
  
    useEffect(() => {
      const onMouseMove = (event) => {
        const { clientX, clientY } = event;
        const mouseX = clientX;
        const mouseY = clientY;
  
        setPosition({ x: mouseX, y: mouseY });
      };
      window.addEventListener("mousemove", onMouseMove);
      return () => window.removeEventListener("mousemove", onMouseMove);
    }, []);
  
    const rafFn = useRafFn(() => {
      setWavyPosition({
        positionX: gsap.utils.interpolate(
          wavyPosition.positionX,
          position.x,
          0.08
        ),
        positionY: gsap.utils.interpolate(
          wavyPosition.positionY,
          position.y,
          0.08
        ),
      });
  
      const distance = gsap.utils.clamp(0, 100, Math.abs(previousX - position.x));
      setRotation(
        gsap.utils.interpolate(
          rotation,
          gsap.utils.mapRange(
            0,
            100,
            0,
            previousX - position.x < 0 ? 45 : -45,
            distance
          ),
          0.08
        )
      );
  
      gsap.set(boxRef.current, {
        rotation,
      });
  
      setPreviousX(position.x);
    });
  
    useEffect(() => {
      rafFn();
    }, [rafFn]);
  
    useEffect(() => {
      if (activeIndex !== null) {
        gsap.to(imagesRef.current[activeIndex], {
          opacity: 1,
          duration: 0.445,
          ease: Power2.easeInOut,
        });
      }
  
      return () => {
        if (activeIndex !== null) {
          gsap.to(imagesRef.current[activeIndex], {
            opacity: 0,
            duration: 0.445,
            ease: Power2.easeInOut,
          });
        }
      };
    }, [activeIndex]);
  
    const animateIn = () => {
      gsap.killTweensOf(elRef.current);
  
      gsap.to(elRef.current, {
        clipPath: `inset(0% 0% 0% 0%)`,
        duration: 0.455,
        ease: Power2.easeInOut,
      });
    };
  
    const animateOut = () => {
      gsap.killTweensOf(elRef.current);
  
      gsap.to(elRef.current, {
        clipPath: `inset(0% 0% 100% 0%)`,
        duration: 0.455,
        ease: Power2.easeInOut,
      });
    };
  
    useImperativeHandle(ref, () => ({
      animateIn,
      animateOut,
    }));
  
    return (
      <div
        ref={boxRef}
        className="hover_gsap"
        style={{
          top: `${wavyPosition.positionY}px`,
          left: `${wavyPosition.positionX}px`,
        }}
      >
        <div
          ref={elRef}
          className="gsap_div"
          style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        >
          {projectImages.map((image, index) => (
            <div
              key={index}
              className="gsap_img"
              ref={(el) => {
                if (el !== null) {
                  imagesRef.current[index] = el;
                }
              }}
              style={{
                transform: `translateX(${12.5 * (offsets[index]?.x || 0)}%) 
                  translateY(${12.5 * (offsets[index]?.y || 0)}%) scale(0.5)`,
              }}
            >
              <img
                alt=""
                src={image.imgSrc}
                className="full_img"
                width={500}
                height={500}
              />
            </div>
          ))}
        </div>
      </div>
    );
  });
  
  export default ProjectBox;
  