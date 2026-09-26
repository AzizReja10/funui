import { forwardRef, useImperativeHandle } from "react";
import { motion, useAnimationControls } from "framer-motion";

const Carriage = forwardRef(function Carriage(
  { lines, currentLine, carriageX, spinning },
  ref
) {
  const ribbonControls = useAnimationControls();

  useImperativeHandle(ref, () => ({
    flashRibbon() {
      ribbonControls.start({
        y: [0, -6, 0],
        transition: { duration: 0.09 },
      });
    },
  }));

  return (
    <div className="relative h-40 overflow-hidden rounded-t-lg border-x border-t border-black/50 bg-[#0f0e0c] px-4 pt-3 select-none">
      <motion.div
        animate={{ x: carriageX }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="absolute left-6 top-3 flex items-center gap-3"
      >
        <div
          className={`h-9 w-9 rounded-full border-2 border-[#1c1b19] ${
            spinning ? "tw-spool is-spinning" : "tw-spool"
          }`}
        />
        <div
          className="tw-paper-texture relative h-28 w-[520px] rounded-[2px] bg-[#f4ecd8] px-4 pt-2 shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
          style={{ fontFamily: "'Special Elite', monospace" }}
        >
          <div className="flex h-full flex-col justify-end overflow-hidden">
            {lines.slice(-2).map((line, i) => (
              <p key={i} className="whitespace-pre text-[13px] leading-[22px] text-[#2a2620]">
                {line || "\u00A0"}
              </p>
            ))}
            <p className="whitespace-pre text-[13px] leading-[22px] text-[#2a2620]">
              {currentLine}
              <span className="tw-cursor">▍</span>
            </p>
          </div>
        </div>
        <div
          className={`h-9 w-9 rounded-full border-2 border-[#1c1b19] ${
            spinning ? "tw-spool is-spinning" : "tw-spool"
          }`}
        />
      </motion.div>

      <div className="absolute left-0 right-0 top-[92px] h-[2px] bg-[#5a4a4a]" />
      <motion.div
        animate={ribbonControls}
        className="absolute left-1/2 top-[84px] h-4 w-16 -translate-x-1/2 rounded-sm bg-[#3a1414] opacity-80"
      />
      <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#c9a227]" />
    </div>
  );
});

export default Carriage;
