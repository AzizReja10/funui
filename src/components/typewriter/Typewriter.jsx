import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import TypeBasket from "./TypeBasket";
import Carriage from "./Carriage";
import Keys from "./Keys";
import { DustParticles } from "./DustParticles";
import { playClick, playBell, playSweep, playPaperFeed } from "./sound";
import { MAX_CHARS, MARGIN_WARN_AT } from "./engine/basketLayout";
import "./typewriter.css";

export default function Typewriter({
  className = "",
  maxLines = 6,
  initialSound = true,
}) {
  const [lines, setLines] = useState([
    "CLICK KEYS OR TYPE ON YOUR KEYBOARD...",
  ]);
  const [currentLine, setCurrentLine] = useState("");
  const [activeKey, setActiveKey] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [sfxOn, setSfxOn] = useState(initialSound);
  const [bellFlash, setBellFlash] = useState(false);
  const [warnedThisLine, setWarnedThisLine] = useState(false);
  const [isPageFull, setIsPageFull] = useState(false);
  const [ejecting, setEjecting] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

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
        if (next.length >= MAX_CHARS) {
          if (lines.length >= maxLines - 1) {
            // Reached character limit on the final line of the page
            setLines((ls) => [...ls, next]);
            setIsPageFull(true);
            setWarnedThisLine(false);
            setSpinning(true);
            ringBell();
            if (sfxOn) playSweep();
            setTimeout(() => setSpinning(false), 420);
            return "";
          }

          setLines((ls) => [...ls, next]);
          setWarnedThisLine(false);
          setSpinning(true);
          ringBell();
          if (sfxOn) playSweep();
          setTimeout(() => setSpinning(false), 420);
          return "";
        }
        if (next.length === MARGIN_WARN_AT && !warnedThisLine) {
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
    <div className={`relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-black/40 bg-[#161512] shadow-2xl ${className}`}>
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
        <TypeBasket ref={basketRef} />
        <Keys activeKey={activeKey} onKey={handleKeyClick} />
      </div>

      {bellFlash && (
        <div className="pointer-events-none absolute right-5 top-4 z-20 h-2.5 w-2.5 rounded-full bg-[#c9a227] shadow-[0_0_8px_#c9a227]" />
      )}
    </div>
  );
}

export { Typewriter };

