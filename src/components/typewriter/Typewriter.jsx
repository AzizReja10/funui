import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import TypeBasket from "./TypeBasket";
import Carriage from "./Carriage";
import Keys from "./Keys";
import { DustParticles } from "./DustParticles";
import { playClick, playBell, playSweep, playPaperFeed } from "./sound";
import {
  MAX_CHARS,
  MARGIN_WARN_AT,
  MAX_LINE_WIDTH_PX,
  MARGIN_WARN_WIDTH_PX,
  getTextPixelWidth,
} from "./engine/basketLayout";
import "./typewriter.css";

export default function Typewriter({
  className = "",
  maxLines = 6,
  initialSound = true,
}) {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [activeKey, setActiveKey] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [sfxOn, setSfxOn] = useState(initialSound);
  const [bellFlash, setBellFlash] = useState(false);
  const [warnedThisLine, setWarnedThisLine] = useState(false);
  const [isPageFull, setIsPageFull] = useState(false);
  const [ejecting, setEjecting] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [strikes, setStrikes] = useState([]);

  const containerRef = useRef(null);
  const basketRef = useRef(null);
  const carriageRef = useRef(null);
  const activeKeyTimeout = useRef(null);

  const flashKey = useCallback((label) => {
    clearTimeout(activeKeyTimeout.current);
    setActiveKey(label);
    activeKeyTimeout.current = setTimeout(() => setActiveKey(null), 100);
  }, []);

  const ringBell = useCallback(() => {
    setBellFlash(true);
    if (sfxOn) playBell();
    setTimeout(() => setBellFlash(false), 350);
  }, [sfxOn]);

  const ejectPage = useCallback(() => {
    if (ejecting) return;
    setEjecting(true);
    setSpinning(true);
    ringBell();
    if (sfxOn) {
      playSweep();
      playPaperFeed();
    }
    setTimeout(() => {
      setLines([]);
      setCurrentLine("");
      setIsPageFull(false);
      setWarnedThisLine(false);
      setPageNumber((p) => p + 1);
      setSpinning(false);
      setEjecting(false);
      if (sfxOn) playBell();
    }, 550);
  }, [ejecting, ringBell, sfxOn]);

  const doReturn = useCallback(() => {
    if (ejecting) return;

    if (isPageFull) {
      ejectPage();
      return;
    }

    // If already at or reaching maximum lines allowed on the page
    if (lines.length >= maxLines - 1) {
      setLines((ls) => [...ls, currentLine]);
      setCurrentLine("");
      setIsPageFull(true);
      setWarnedThisLine(false);
      setSpinning(true);
      ringBell();
      if (sfxOn) playSweep();
      setTimeout(() => setSpinning(false), 420);
      return;
    }

    setLines((ls) => [...ls, currentLine]);
    setCurrentLine("");
    setWarnedThisLine(false);
    setSpinning(true);
    ringBell();
    if (sfxOn) playSweep();
    setTimeout(() => setSpinning(false), 420);
  }, [currentLine, ejectPage, ejecting, isPageFull, lines.length, maxLines, ringBell, sfxOn]);

  const strikeLetter = useCallback(
    (ch) => {
      const upper = ch.toUpperCase();
      if (upper !== " ") {
        basketRef.current?.strike(upper);
        carriageRef.current?.flashRibbon();

        // Exact live screen coordinates: origin from basket lever, target on paper
        const leverTip = basketRef.current?.getLeverTip(upper);
        const caretPos = carriageRef.current?.getCaretScreenPosition();
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (caretPos && containerRect) {
          const targetX = caretPos.x - containerRect.left;
          const targetY = caretPos.y - containerRect.top;

          let originX = containerRect.width / 2;
          let originY = containerRect.height - 110;

          if (leverTip) {
            originX = leverTip.x - containerRect.left;
            originY = leverTip.y - containerRect.top;
          }

          const newStrike = {
            id: `${Date.now()}-${Math.random()}`,
            letter: upper,
            originX,
            originY,
            targetX,
            targetY,
          };

          setStrikes((prev) => [...prev.slice(-3), newStrike]);
          setTimeout(() => {
            setStrikes((prev) => prev.filter((s) => s.id !== newStrike.id));
          }, 240);
        }

        if (sfxOn) playClick();
      }
    },
    [sfxOn]
  );

  const appendChar = useCallback(
    (ch) => {
      if (ejecting) return;

      // Prevent typing if page is already full and alert with bell
      if (isPageFull) {
        ringBell();
        return;
      }

      strikeLetter(ch);
      setCurrentLine((prev) => {
        const next = prev + ch;
        const width = getTextPixelWidth(next);
        const isOverflow = width >= MAX_LINE_WIDTH_PX || next.length >= MAX_CHARS;

        if (isOverflow) {
          // Check if we can wrap at a word boundary (last space within recent characters)
          const lastSpaceIdx = prev.lastIndexOf(" ");
          let lineToCommit = prev;
          let nextLineStart = ch;

          if (lastSpaceIdx > 0 && prev.length - lastSpaceIdx <= 15) {
            lineToCommit = prev.slice(0, lastSpaceIdx);
            nextLineStart = prev.slice(lastSpaceIdx + 1) + ch;
          }

          if (lines.length >= maxLines - 1) {
            // Reached line limit on the final line of the page
            setLines((ls) => [...ls, lineToCommit]);
            setIsPageFull(true);
            setWarnedThisLine(false);
            setSpinning(true);
            ringBell();
            if (sfxOn) playSweep();
            setTimeout(() => setSpinning(false), 420);
            return "";
          }

          setLines((ls) => [...ls, lineToCommit]);
          setWarnedThisLine(false);
          setSpinning(true);
          ringBell();
          if (sfxOn) playSweep();
          setTimeout(() => setSpinning(false), 420);
          return nextLineStart;
        }

        if ((width >= MARGIN_WARN_WIDTH_PX || next.length >= MARGIN_WARN_AT) && !warnedThisLine) {
          setWarnedThisLine(true);
          ringBell();
        }
        return next;
      });
    },
    [ejecting, isPageFull, lines.length, maxLines, ringBell, sfxOn, strikeLetter, warnedThisLine]
  );

  const deleteChar = useCallback(() => {
    if (ejecting) return;
    flashKey("BKSP");

    if (currentLine.length > 0) {
      setCurrentLine((prev) => prev.slice(0, -1));
      setIsPageFull(false);
    } else if (lines.length > 0) {
      // Pull back the previous line to continue editing
      const lastLine = lines[lines.length - 1];
      setLines((ls) => ls.slice(0, -1));
      setCurrentLine(lastLine);
      setIsPageFull(false);
    }
  }, [currentLine.length, ejecting, flashKey, lines]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target.isContentEditable
      ) {
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        flashKey("RETURN");
        doReturn();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        deleteChar();
      } else if (e.key === " ") {
        e.preventDefault();
        flashKey("SPACE");
        appendChar(" ");
      } else if (e.key.length === 1) {
        flashKey(e.key.toUpperCase());
        appendChar(e.key);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appendChar, deleteChar, doReturn, flashKey]);

  function handleKeyClick(label) {
    if (label === "SPACE") {
      flashKey("SPACE");
      appendChar(" ");
    } else if (label === "RETURN") {
      flashKey("RETURN");
      doReturn();
    } else if (label === "BKSP") {
      deleteChar();
    } else {
      flashKey(label);
      appendChar(label.toLowerCase());
    }
  }

  const currentLineNum = Math.min(
    lines.length + (isPageFull ? 0 : 1),
    maxLines
  );

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-black/40 bg-[#161512] shadow-2xl ${className}`}
    >
      <DustParticles className="opacity-60" />

      <div className="relative z-10 flex items-center justify-between border-b border-black/40 px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="text-[11px] font-medium tracking-wide text-[#c9a227]"
            style={{ fontFamily: "'Special Elite', monospace" }}
          >
            Underwood no. 5
          </span>
          <span className="text-[10px] text-zinc-500 font-mono tracking-tight">
            Sheet {pageNumber} • Line {currentLineNum}/{maxLines}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={ejectPage}
            disabled={ejecting}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] transition active:scale-95 cursor-pointer ${
              isPageFull
                ? "border-[#c9a227] bg-[#c9a227]/20 text-[#f5d77f] font-semibold shadow-[0_0_12px_rgba(201,162,39,0.35)] animate-pulse hover:bg-[#c9a227]/30"
                : "border-white/10 text-[#e8e2d0] hover:bg-white/5 hover:border-white/20"
            }`}
            title={isPageFull ? "Page limit reached! Click or press Return to load a new sheet" : "Eject current sheet"}
          >
            <RotateCcw size={10} className={ejecting ? "animate-spin" : isPageFull ? "text-[#c9a227]" : "text-zinc-400"} />
            <span>{isPageFull ? "New Sheet (↵)" : "Eject"}</span>
          </button>

          <button
            type="button"
            onClick={() => setSfxOn((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-[#e8e2d0] transition hover:bg-white/5 active:scale-95 cursor-pointer"
          >
            {sfxOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
            SFX {sfxOn ? "on" : "off"}
          </button>
        </div>
      </div>

      <div className="relative z-10 px-5 pt-4">
        <Carriage
          ref={carriageRef}
          lines={lines}
          currentLine={currentLine}
          spinning={spinning}
          isPageFull={isPageFull}
          ejecting={ejecting}
          maxLines={maxLines}
          pageNumber={pageNumber}
        />
      </div>

      {isPageFull && (
        <div className="relative z-10 mx-5 mt-2 flex items-center justify-between rounded-md border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-1.5 text-[11px] text-[#e8c868]">
          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
            Page Full ({maxLines}/{maxLines} lines)
          </span>
          <span className="text-[10px] text-[#f5d77f]/90">
            Press <kbd className="rounded border border-[#c9a227]/40 bg-black/50 px-1 py-0.5 text-[9px] font-mono text-[#f5d77f]">RETURN ↵</kbd> or click New Sheet
          </span>
        </div>
      )}

      <div className="relative z-10 border-x border-black/50 bg-gradient-to-b from-[#2b2a27] to-[#141412] px-5 pt-2">
        <TypeBasket ref={basketRef} onStrike={handleKeyClick} />
        <Keys activeKey={activeKey} onKey={handleKeyClick} />
      </div>

      {/* Seamless Typebar Strike Overlay generated exactly from the type lever in the basket to character */}
      <svg
        className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="tw-steel-lever" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22211f" />
            <stop offset="35%" stopColor="#8a877e" />
            <stop offset="60%" stopColor="#b3b0a6" />
            <stop offset="100%" stopColor="#383632" />
          </linearGradient>
          <linearGradient id="tw-slug-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#484540" />
            <stop offset="50%" stopColor="#282623" />
            <stop offset="100%" stopColor="#151412" />
          </linearGradient>
          <filter id="tw-ink-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>

        {strikes.map((strike) => (
          <g key={strike.id}>
            {/* Carbon-ink ribbon impact impression at the exact character position */}
            <motion.ellipse
              cx={strike.targetX}
              cy={strike.targetY}
              rx={6.5}
              ry={5}
              fill="#1b1713"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{
                opacity: [0, 0.75, 0.4, 0],
                scale: [0.3, 1.25, 0.9, 0.4],
              }}
              transition={{
                duration: 0.22,
                times: [0, 0.32, 0.65, 1],
                ease: "easeOut",
              }}
              style={{
                transformOrigin: `${strike.targetX}px ${strike.targetY}px`,
              }}
              filter="url(#tw-ink-blur)"
            />

            {/* Steel typebar shank generating directly from the basket lever to character */}
            <motion.line
              x1={strike.originX}
              y1={strike.originY}
              initial={{
                x2: strike.originX,
                y2: strike.originY,
                opacity: 0.4,
              }}
              animate={{
                x2: [strike.originX, strike.targetX, strike.targetX, strike.originX],
                y2: [strike.originY, strike.targetY, strike.targetY, strike.originY],
                opacity: [0.4, 1, 1, 0],
              }}
              transition={{
                duration: 0.22,
                times: [0, 0.32, 0.65, 1],
                ease: "easeOut",
              }}
              stroke="url(#tw-steel-lever)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Metal character type slug matching the basket lever, landing directly on character */}
            <motion.g
              initial={{
                x: strike.originX,
                y: strike.originY,
                opacity: 0.4,
                scale: 0.6,
              }}
              animate={{
                x: [strike.originX, strike.targetX, strike.targetX, strike.originX],
                y: [strike.originY, strike.targetY, strike.targetY, strike.originY],
                opacity: [0.4, 1, 1, 0],
                scale: [0.6, 1, 1, 0.6],
              }}
              transition={{
                duration: 0.22,
                times: [0, 0.32, 0.65, 1],
                ease: "easeOut",
              }}
            >
              {/* Type slug steel casing */}
              <rect
                x="-7.5"
                y="-8.5"
                width="15"
                height="17"
                rx="2"
                fill="url(#tw-slug-grad)"
                stroke="#0d0d0c"
                strokeWidth="1.2"
              />
              <rect
                x="-6"
                y="-7"
                width="12"
                height="14"
                rx="1"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="0.8"
              />
              {/* Typebar linkage rivet */}
              <circle
                cx="0"
                cy="11"
                r="1.8"
                fill="#8c8980"
                stroke="#1a1917"
                strokeWidth="0.8"
              />
              {/* Embossed metal letter on slug face */}
              <text
                x="0"
                y="3.5"
                textAnchor="middle"
                fill="#f5eedc"
                fontFamily="'Roboto', sans-serif"
                fontSize="9.5"
                fontWeight="bold"
              >
                {strike.letter}
              </text>
            </motion.g>
          </g>
        ))}
      </svg>

      {bellFlash && (
        <div className="pointer-events-none absolute right-5 top-4 z-20 h-2.5 w-2.5 rounded-full bg-[#c9a227] shadow-[0_0_8px_#c9a227]" />
      )}
    </div>
  );
}

export { Typewriter };

