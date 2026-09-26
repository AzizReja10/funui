import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import TypeBasket from "./TypeBasket";
import Carriage from "./Carriage";
import Keys from "./Keys";
import { DustParticles } from "./DustParticles";
import { playClick, playBell, playSweep } from "./sound";
import { MAX_CHARS, STEP_PX, MARGIN_WARN_AT } from "./engine/basketLayout";
import "./typewriter.css";

const START_X = 160;

export default function Typewriter({ className = "" }) {
  const [lines, setLines] = useState([
    "CLICK KEYS OR TYPE ON YOUR KEYBOARD...",
  ]);
  const [currentLine, setCurrentLine] = useState("");
  const [activeKey, setActiveKey] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);
  const [bellFlash, setBellFlash] = useState(false);
  const [warnedThisLine, setWarnedThisLine] = useState(false);

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

  const doReturn = useCallback(() => {
    setLines((ls) => [...ls, currentLine]);
    setCurrentLine("");
    setWarnedThisLine(false);
    setSpinning(true);
    ringBell();
    if (sfxOn) playSweep();
    setTimeout(() => setSpinning(false), 420);
  }, [currentLine, ringBell, sfxOn]);

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
      strikeLetter(ch);
      setCurrentLine((prev) => {
        const next = prev + ch;
        if (next.length >= MAX_CHARS) {
          setLines((ls) => [...ls, next]);
          setWarnedThisLine(false);
          setSpinning(true);
          ringBell();
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
    [ringBell, strikeLetter, warnedThisLine]
  );

  const deleteChar = useCallback(() => {
    setCurrentLine((prev) => prev.slice(0, -1));
    flashKey("BKSP");
  }, [flashKey]);

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

  const carriageX = START_X - currentLine.length * STEP_PX;

  return (
    <div className={`relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-black/40 bg-[#161512] shadow-2xl ${className}`}>
      <DustParticles className="opacity-60" />

      <div className="relative z-10 flex items-center justify-between border-b border-black/40 px-5 py-2.5">
        <span
          className="text-[11px] font-medium tracking-wide text-[#c9a227]"
          style={{ fontFamily: "'Special Elite', monospace" }}
        >
          Underwood no. 5
        </span>
        <button
          type="button"
          onClick={() => setSfxOn((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-[#e8e2d0] transition hover:bg-white/5 active:scale-95"
        >
          {sfxOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
          SFX {sfxOn ? "on" : "off"}
        </button>
      </div>

      <div className="relative z-10 px-5 pt-4">
        <Carriage
          ref={carriageRef}
          lines={lines}
          currentLine={currentLine}
          carriageX={carriageX}
          spinning={spinning}
        />
      </div>

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
