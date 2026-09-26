import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { KEY_ORDER, BASKET } from "./engine/basketLayout";

const TypeBasket = forwardRef(function TypeBasket({ onStrike }, ref) {
  const controlsMap = useRef({});
  const slugRefs = useRef({});

  useImperativeHandle(ref, () => ({
    getLeverTip(letter) {
      const key = letter.toUpperCase();
      const el = slugRefs.current[key];
      if (el) {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
      return null;
    },
    strike(letter) {
      const key = letter.toUpperCase();
      const controls = controlsMap.current[key];
      if (!controls) return;
      controls
        .start({
          scale: 1.15,
          y: -4,
          zIndex: 40,
          transition: { duration: 0.05, ease: "easeOut" },
        })
        .then(() => {
          controls.start({
            scale: 1,
            y: 0,
            zIndex: 10,
            transition: { duration: 0.12, ease: "easeIn" },
          });
        });
    },
  }));

  return (
    <div className="relative mx-auto h-16 w-full overflow-visible">
      <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#c9a227] shadow-[0_0_6px_#c9a227]" />
      {KEY_ORDER.map((letter) => (
        <Bar
          key={letter}
          letter={letter}
          restAngle={BASKET[letter]}
          onStrike={onStrike}
          registerControls={(c) => {
            controlsMap.current[letter] = c;
          }}
          registerSlugRef={(l, el) => {
            if (el) slugRefs.current[l] = el;
          }}
        />
      ))}
    </div>
  );
});

function Bar({ letter, restAngle, registerControls, registerSlugRef, onStrike }) {
  const controls = useAnimationControls();

  useEffect(() => {
    registerControls(controls);
  }, [controls, registerControls]);

  return (
    <motion.div
      initial={{ rotate: restAngle, y: 0, scale: 1 }}
      animate={controls}
      onClick={() => onStrike?.(letter)}
      className="cursor-pointer group"
      style={{
        position: "absolute",
        left: "50%",
        bottom: 0,
        width: "3px",
        height: "36px",
        transformOrigin: "bottom center",
        background: "linear-gradient(to top, #1e1e1c, #484642 70%, #736f68)",
        marginLeft: "-1.5px",
        borderRadius: "1px",
      }}
      title={`Type lever '${letter}'`}
    >
      <span
        ref={(el) => registerSlugRef(letter, el)}
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-[1.5px] border border-black/40 bg-[#35332f] px-[3px] py-[0.5px] text-[7.5px] font-bold leading-[9px] text-[#f4ecd8] select-none shadow-xs transition-colors group-hover:bg-[#c9a227] group-hover:text-black"
        style={{ fontFamily: "'Special Elite', monospace" }}
      >
        {letter}
      </span>
    </motion.div>
  );
}

export default TypeBasket;
