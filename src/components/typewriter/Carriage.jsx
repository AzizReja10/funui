import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

const Carriage = forwardRef(function Carriage(
  {
    lines,
    currentLine,
    spinning,
    isPageFull = false,
    ejecting = false,
    maxLines = 6,
  },
  ref
) {
  const ribbonControls = useAnimationControls();
  const carriageContainerRef = useRef(null);
  const paperRef = useRef(null);
  const caretRef = useRef(null);
  const charWidthRef = useRef(7.82);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const span = document.createElement("span");
    span.style.fontFamily = "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    span.style.fontSize = "14.5px";
    span.style.letterSpacing = "-0.01em";
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.textContent = "MMMMMMMMMM";
    document.body.appendChild(span);
    const w = span.getBoundingClientRect().width / 10;
    if (w > 0) charWidthRef.current = w;
    document.body.removeChild(span);
  }, []);

  useImperativeHandle(ref, () => ({
    flashRibbon() {
      ribbonControls.start({
        y: [0, -4, 0],
        transition: { duration: 0.09 },
      });
    },
    getCaretScreenPosition() {
      if (caretRef.current) {
        const rect = caretRef.current.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
      const paperRect = paperRef.current?.getBoundingClientRect();
      if (paperRect) {
        return {
          x: paperRect.left + 24,
          y: paperRect.top + 21,
        };
      }
      return null;
    },
  }));

  const displayLines = [];
  for (let i = 0; i < maxLines; i++) {
    if (i < lines.length) {
      displayLines.push({
        text: lines[i],
        isCurrent: false,
        isFullCursor: isPageFull && i === maxLines - 1,
      });
    } else if (i === lines.length && !isPageFull) {
      displayLines.push({
        text: currentLine,
        isCurrent: true,
        isFullCursor: false,
      });
    } else {
      displayLines.push({
        text: "",
        isCurrent: false,
        isFullCursor: false,
      });
    }
  }

  return (
    <div
      ref={carriageContainerRef}
      className="relative h-52 overflow-hidden rounded-t-lg border-x border-t border-black/50 bg-[#0c0c0a] px-3 pt-3 select-none"
    >
      {/* Platen roller cylinder behind the paper */}
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-28 -translate-y-1/2 border-y border-white/[0.04] bg-gradient-to-b from-[#0a0a09] via-[#1a1917] to-[#0a0a09] opacity-95" />

      {/* Clean Paper Sheet with 6 full-width lines */}
      <motion.div
        ref={paperRef}
        animate={
          ejecting
            ? { y: [-10, -180, 60, 0], opacity: [1, 0, 0, 1] }
            : spinning
            ? { x: [-3, 3, -2, 0] }
            : { y: 0, x: 0, opacity: 1 }
        }
        transition={
          ejecting
            ? { duration: 0.55, times: [0, 0.45, 0.5, 1], ease: "easeInOut" }
            : { duration: 0.15 }
        }
        className="tw-paper-sheet relative mx-auto w-[420px] max-w-[96%] rounded-[3px] border border-[#d6ccb2] px-4 py-2.5 select-none shadow-[0_6px_22px_rgba(0,0,0,0.65)]"
        style={{ fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        {/* 6 PAGE CONTENT LINES */}
        <div className="flex flex-col">
          {displayLines.map((item, i) => (
            <div
              key={i}
              className="flex items-center h-[26px] pl-1 pr-4 text-[14.5px] leading-[26px] text-[#1c1917] overflow-hidden"
            >
              <span
                className="whitespace-pre font-normal tracking-[-0.01em]"
                style={{ fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              >
                {item.text || "\u00A0"}
              </span>
              {item.isCurrent && (
                <span ref={caretRef} className="tw-cursor text-[#1c1917] text-[14.5px] ml-[0.5px]">
                  ▍
                </span>
              )}
              {item.isFullCursor && (
                <span className="tw-cursor text-[#8a2525] text-[14.5px] ml-[0.5px]">▍</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Ribbon striker at center bottom platen guide */}
      <motion.div
        animate={ribbonControls}
        className="absolute bottom-1 left-1/2 h-3.5 w-14 -translate-x-1/2 rounded-xs border border-[#5a2020] bg-[#3a1212] opacity-85 shadow-sm"
      />
    </div>
  );
});

export default Carriage;
