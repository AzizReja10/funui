import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { KEY_ORDER, BASKET } from "./engine/basketLayout";

const TypeBasket = forwardRef(function TypeBasket(_, ref) {
  const controlsMap = useRef({});

  useImperativeHandle(ref, () => ({
    strike(letter) {
      const key = letter.toUpperCase();
      const controls = controlsMap.current[key];
      if (!controls) return;
      controls
        .start({
          rotate: 0,
          y: -30,
          transition: { duration: 0.055, ease: "easeOut" },
        })
        .then(() => {
          controls.start({
            rotate: BASKET[key],
            y: 0,
            transition: { duration: 0.09, ease: "easeIn" },
          });
        });
    },
  }));

  return (
    <div className="relative mx-auto h-16 w-full overflow-hidden">
      <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#c9a227]" />
      {KEY_ORDER.map((letter) => (
        <Bar
          key={letter}
          letter={letter}
          restAngle={BASKET[letter]}
          registerControls={(c) => {
            controlsMap.current[letter] = c;
          }}
        />
      ))}
    </div>
  );
});

function Bar({ letter, restAngle, registerControls }) {
  const controls = useAnimationControls();

  useEffect(() => {
    registerControls(controls);
  }, [controls, registerControls]);

  return (
    <motion.div
      initial={{ rotate: restAngle, y: 0 }}
      animate={controls}
      style={{
        position: "absolute",
        left: "50%",
        bottom: 0,
        width: "2px",
        height: "34px",
        transformOrigin: "bottom center",
        background: "linear-gradient(to top, #2a2a28, #55524a)",
        marginLeft: "-1px",
      }}
    >
      <span
        className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-[1px] bg-[#3a3833] px-[3px] text-[7px] font-bold leading-[10px] text-[#e8e2d0] select-none"
        style={{ fontFamily: "'Special Elite', monospace" }}
      >
        {letter}
      </span>
    </motion.div>
  );
}

export default TypeBasket;
