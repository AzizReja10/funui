import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import * as THREE from "three";
import { Volume2, VolumeX, RefreshCw } from "lucide-react";
import "./UploadCard.css";

const SEGMENTS = 20;
const CONFETTI_COUNT = 42;
const R = 42; // Ring radius in SVG coordinates
const CIRCUMFERENCE = 2 * Math.PI * R;
const springCfg = { type: "spring", stiffness: 400, damping: 28 };

// Procedural sound synthesizer using Web Audio API (no external audio assets required)
class AudioSynth {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => { });
    }
  }
  blip() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch { }
  }
  tick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch { }
  }
  victory() {
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.08;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch { }
  }
}

const synth = new AudioSynth();

export function UploadCard({
  className = "",
  uploadDuration = 7.5,
  initialFile = null,
  onUploadComplete,
  enableSound = true,
  presetFiles = [
    { name: "cinematic-reveal-4k.mp4", size: 48 * 1024 * 1024, type: "video/mp4" },
    { name: "drone_coastline_hdr.mov", size: 124 * 1024 * 1024, type: "video/quicktime" },
    { name: "motion_graphics_loop.webm", size: 18 * 1024 * 1024, type: "video/webm" },
  ],
}) {
  const [status, setStatus] = useState("idle"); // idle | uploading | paused | done
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(initialFile);
  const [dragging, setDragging] = useState(false);
  const [soundOn, setSoundOn] = useState(enableSound);
  const [speedMBs, setSpeedMBs] = useState("0.0");
  const [etaSec, setEtaSec] = useState(0);

  const inputRef = useRef(null);
  const floatRef = useRef(null);
  const burstRef = useRef(null);
  const shockwaveRef = useRef(null);
  const streaksRef = useRef(null);
  const tween = useRef(null);
  const streaksTween = useRef(null);
  const lastTickSegment = useRef(-1);
  const shineRef = useRef(null);

  const [hoverIndex, setHoverIndex] = useState(null);

  /* ---------- GSAP: Upload Timeline Tween ---------- */
  const start = useCallback((targetFile, overrideProgress = null) => {
    const activeFile = targetFile || file || presetFiles[0];
    if (!file && activeFile) setFile(activeFile);
    setStatus("uploading");

    if (soundOn) synth.blip();

    const startVal = overrideProgress !== null ? overrideProgress : progress;

    if (tween.current && overrideProgress === null) {
      tween.current.play();
      return;
    }

    if (tween.current) {
      tween.current.kill();
      tween.current = null;
    }

    const state = { value: startVal };
    const dur = Math.max(1.2, uploadDuration * (1 - startVal / 100));

    tween.current = gsap.to(state, {
      value: 100,
      duration: dur,
      ease: "power1.inOut",
      onUpdate: () => {
        const val = state.value;
        setProgress(val);

        // Sound tick as each 5% segment turns on
        const currentSegment = Math.floor(val / (100 / SEGMENTS));
        if (currentSegment > lastTickSegment.current && currentSegment < SEGMENTS) {
          lastTickSegment.current = currentSegment;
          if (soundOn) synth.tick();
        }

        // Compute simulated dynamic transfer speed & ETA
        const fileSizeMB = (activeFile.size || 35 * 1024 * 1024) / 1048576;
        const remainingMB = fileSizeMB * (1 - val / 100);
        const currentSpeed = (fileSizeMB / uploadDuration) * (0.85 + Math.sin(val * 0.15) * 0.35);
        setSpeedMBs(Math.max(0.8, currentSpeed).toFixed(1));
        setEtaSec(Math.max(1, Math.ceil(remainingMB / Math.max(0.5, currentSpeed))));
      },
      onComplete: () => {
        tween.current = null;
        setProgress(100);
        setStatus("done");
        if (soundOn) synth.victory();
        if (onUploadComplete) onUploadComplete(activeFile);
      },
    });
  }, [file, progress, uploadDuration, soundOn, onUploadComplete, presetFiles]);

  const pause = useCallback(() => {
    tween.current?.pause();
    setStatus("paused");
  }, []);

  const cancel = useCallback(() => {
    tween.current?.kill();
    tween.current = null;
    setProgress(0);
    setStatus("idle");
    lastTickSegment.current = -1;
  }, []);

  const scrubToSegment = useCallback((segIndex) => {
    const newProgress = Math.min(100, Math.max(0, ((segIndex + 1) * 100) / SEGMENTS));
    setProgress(newProgress);
    lastTickSegment.current = segIndex;
    if (soundOn) synth.tick();

    if (status === "uploading") {
      start(file, newProgress);
    } else if (status === "paused") {
      if (tween.current) {
        tween.current.kill();
        tween.current = null;
      }
    }
  }, [file, soundOn, start, status]);

  const pick = (f) => {
    if (!f) return;
    tween.current?.kill();
    tween.current = null;
    setFile(f);
    setProgress(0);
    lastTickSegment.current = -1;
    start(f);
  };

  /* ---------- GSAP: Floating Icon in Idle State ---------- */
  useEffect(() => {
    const elem = floatRef.current;
    if (status !== "idle" || !elem) return;
    const ctx = gsap.context(() => {
      gsap.to(elem, {
        y: -8,
        rotation: 2,
        scale: 1.03,
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, floatRef);

    return () => {
      ctx.revert();
      if (elem) gsap.set(elem, { y: 0, rotation: 0, scale: 1 });
    };
  }, [status]);

  /* ---------- GSAP: Speed Lines Stream in Uploading State ---------- */
  useEffect(() => {
    const streaksElem = streaksRef.current;
    if (status !== "uploading" || !streaksElem) return;
    const lines = streaksElem.children;
    streaksTween.current = gsap.to(lines, {
      y: -36,
      opacity: (i) => (i % 2 === 0 ? 0.9 : 0.6),
      scaleY: 1.4,
      duration: 0.75,
      ease: "power2.out",
      stagger: {
        amount: 0.4,
        repeat: -1,
      },
    });

    return () => {
      streaksTween.current?.kill();
      if (lines) gsap.set(lines, { y: 0, opacity: 0, scaleY: 1 });
    };
  }, [status]);

  /* ---------- GSAP: Shimmer Sweep on Filled Segments ---------- */
  useEffect(() => {
    if (status !== "uploading" || !shineRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    tl.fromTo(
      shineRef.current,
      { xPercent: -100 },
      { xPercent: 100, duration: 1.1, ease: "power2.inOut" }
    );

    return () => tl.kill();
  }, [status]);

  /* ---------- GSAP: Confetti & Shockwave Explosion on Done ---------- */
  useEffect(() => {
    if (status !== "done") return;

    // Shockwave pulse
    if (shockwaveRef.current) {
      gsap.fromTo(
        shockwaveRef.current,
        { scale: 0.8, opacity: 0.9 },
        { scale: 2.2, opacity: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    // 3D physics confetti burst
    if (burstRef.current) {
      const particles = burstRef.current.children;
      gsap.fromTo(
        particles,
        { x: 0, y: 0, scale: 0, opacity: 1, rotationX: 0, rotationY: 0, rotationZ: 0 },
        {
          x: (i) => Math.cos((i / CONFETTI_COUNT) * Math.PI * 2) * gsap.utils.random(75, 160),
          y: (i) => Math.sin((i / CONFETTI_COUNT) * Math.PI * 2) * gsap.utils.random(60, 140) + gsap.utils.random(10, 40),
          rotationX: () => gsap.utils.random(-360, 360),
          rotationY: () => gsap.utils.random(-360, 360),
          rotationZ: () => gsap.utils.random(-200, 200),
          scale: () => gsap.utils.random(0.7, 1.4),
          opacity: 0,
          duration: 1.45,
          ease: "power3.out",
          stagger: { amount: 0.1 },
        }
      );
    }
  }, [status]);

  // Derived telemetry metrics
  const activeFile = file || presetFiles[0];
  const totalBytes = activeFile?.size || 48 * 1024 * 1024;
  const sentMB = ((totalBytes * progress) / 100 / 1048576).toFixed(1);
  const totalMB = (totalBytes / 1048576).toFixed(1);

  // File extension badge
  const fileExt = useMemo(() => {
    if (!activeFile?.name) return "MP4";
    const parts = activeFile.name.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "VIDEO";
  }, [activeFile]);

  // Dynamic heading & copy text per state
  const copy = {
    idle: {
      title: "Drop a video to upload",
      sub: "MP4, MOV or WebM · up to 200 MB",
    },
    uploading: {
      title: activeFile?.name || "Uploading video",
      sub: `Transferring data · ${speedMBs} MB/s · ${etaSec}s remaining`,
    },
    paused: {
      title: "Upload Paused",
      sub: `Paused at ${Math.floor(progress)}% · Resume whenever you're ready`,
    },
    done: {
      title: "Upload Complete!",
      sub: `${activeFile?.name || "Video"} is ready to publish`,
    },
  }[status];

  // Action handler dispatcher
  const handleAction = useCallback((action) => {
    if (action === "pause") pause();
    else if (action === "resume") start();
    else if (action === "cancel") cancel();
  }, [pause, start, cancel]);

  // Action buttons configuration
  const buttons = useMemo(() => {
    switch (status) {
      case "uploading":
        return [
          { id: "pause", label: "Pause" },
          { id: "cancel", label: "Cancel", ghost: true },
        ];
      case "paused":
        return [
          { id: "resume", label: "Resume", primary: true },
          { id: "cancel", label: "Cancel", ghost: true },
        ];
      case "done":
        return [{ id: "cancel", label: "Upload another", primary: true }];
      default:
        return [];
    }
  }, [status]);

  // Calculate coordinates of the traveling photon bead at the progress arc tip
  const angleDeg = (progress / 100) * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  const beadX = 54 + (R + 2) * Math.cos(angleRad);
  const beadY = 54 + (R + 2) * Math.sin(angleRad);

  return (
    <div className={`uc-wrapper ${className}`}>
      <motion.div
        className={`uc-card card ${dragging ? "drag" : ""}`}
        data-status={status}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: dragging ? 1.03 : 1 }}
        transition={springCfg}
        onClick={() => status === "idle" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (status === "idle") setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (status === "idle" && e.dataTransfer.files?.[0]) {
            pick(e.dataTransfer.files[0]);
          }
        }}
      >

        {/* Ambient Top Glow */}
        <div className="uc-ambient-glow" />

        {/* Audio Mute/Unmute Toggle */}
        <button
          type="button"
          className="uc-sound-toggle"
          title={soundOn ? "Mute audio effects" : "Enable audio effects"}
          onClick={(e) => {
            e.stopPropagation();
            setSoundOn(!soundOn);
            if (!soundOn) synth.blip();
          }}
        >
          {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Sci-fi Reticle Corner Brackets (Expanding outward on drag) */}
        {status === "idle" && (
          <>
            <motion.span
              className="uc-corner tl"
              animate={{ x: dragging ? -8 : 0, y: dragging ? -8 : 0, scale: dragging ? 1.15 : 1 }}
              transition={springCfg}
            />
            <motion.span
              className="uc-corner tr"
              animate={{ x: dragging ? 8 : 0, y: dragging ? -8 : 0, scale: dragging ? 1.15 : 1 }}
              transition={springCfg}
            />
            <motion.span
              className="uc-corner bl"
              animate={{ x: dragging ? -8 : 0, y: dragging ? 8 : 0, scale: dragging ? 1.15 : 1 }}
              transition={springCfg}
            />
            <motion.span
              className="uc-corner br"
              animate={{ x: dragging ? 8 : 0, y: dragging ? 8 : 0, scale: dragging ? 1.15 : 1 }}
              transition={springCfg}
            />
          </>
        )}

        {/* Central Ring Stage */}
        <div className="uc-ring-stage">
          {/* Subtle Three.js 3D Orbital Stardust */}
          <ThreeRingCanvas status={status} />

          {/* Concentric Aura Pulse in Idle / Dragging */}
          <motion.div
            className="uc-pulse-aura"
            animate={
              dragging
                ? { scale: [1, 1.22, 1], opacity: [0.3, 0.7, 0.3] }
                : status === "uploading"
                  ? { scale: [1, 1.12, 1], opacity: [0.15, 0.35, 0.15] }
                  : { scale: 1, opacity: 0.15 }
            }
            transition={{ duration: dragging ? 1 : 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* SVG Progress Ring */}
          <motion.svg
            className="uc-ring-svg"
            viewBox="0 0 108 108"
            style={{ rotate: -90 }}
            animate={status === "paused" ? { opacity: [1, 0.45, 1] } : { opacity: 1 }}
            transition={status === "paused" ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
          >
            <defs>
              <linearGradient id="ucProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--c)" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Background Track Circle */}
            <circle className="uc-ring-track" cx="54" cy="54" r={R} />

            {/* Dynamic Foreground Progress Stroke */}
            <motion.circle
              className="uc-ring-fg"
              cx="54"
              cy="54"
              r={R}
              stroke="url(#ucProgressGrad)"
              strokeDasharray={CIRCUMFERENCE}
              initial={false}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress / 100) }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            />
          </motion.svg>

          {/* Traveling Photon Bead on Ring Edge */}
          {progress > 1 && progress < 99.5 && (
            <motion.div
              className="uc-progress-bead"
              style={{
                left: `${beadX}px`,
                top: `${beadY}px`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            />
          )}

          {/* Upload Ascending Kinetic Streaks */}
          <div className="uc-speed-streaks" ref={streaksRef}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="uc-speed-line"
                style={{
                  left: `${24 + i * 12}%`,
                  height: `${10 + (i % 3) * 6}px`,
                }}
              />
            ))}
          </div>

          {/* Center Icon Box with GSAP Float / Spring */}
          <div className="uc-icon-box" ref={floatRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ scale: 0.3, rotate: -40, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.3, rotate: 40, opacity: 0 }}
                transition={springCfg}
              >
                <Glyph status={status} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Shockwave Radial Wave on Complete */}
          <div className="uc-shockwave" ref={shockwaveRef} />

          {/* GSAP Celebration Confetti Explosion */}
          <div className="uc-burst" ref={burstRef}>
            {Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
              const types = ["circle", "ribbon", "diamond", "star"];
              const colors = ["var(--uc-ok)", "var(--uc-accent)", "var(--uc-warn)", "#38bdf8", "#ec4899"];
              const type = types[i % types.length];
              const bg = colors[i % colors.length];
              const size = type === "ribbon" ? "width: 10px; height: 4px;" : "width: 7px; height: 7px;";

              return (
                <span
                  key={i}
                  className={`confetti-particle ${type}`}
                  style={{
                    backgroundColor: type !== "star" ? bg : "transparent",
                    color: bg,
                    border: type === "star" ? `3px solid ${bg}` : "none",
                    ...parseStyle(size),
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Heading & Subtitle Blur-Slide Swap */}
        <div className="uc-header">
          <AnimatePresence mode="wait">
            <motion.div
              key={status + (activeFile?.name || "")}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="uc-title">
                <span className="truncate max-w-[280px]">{copy.title}</span>
                {status !== "idle" && <span className="uc-file-badge">{fileExt}</span>}
              </h3>
              <p className="uc-subtitle">{copy.sub}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 20-Segment Equalizer Progress Track & Dynamic Telemetry */}
        <AnimatePresence initial={false}>
          {(status === "uploading" || status === "paused") && (
            <motion.div
              className="uc-progress-section"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Telemetry Row with Status Indicator & Milestone stats */}
              <div className="uc-meta-telemetry">
                <div className="uc-telemetry-left">
                  <span className="uc-bytes-stat font-mono">{sentMB} of {totalMB} MB</span>
                  <div className={`uc-speed-pill ${status === "paused" ? "paused" : "live"}`}>
                    <span className="uc-speed-dot" />
                    {status === "paused" ? (
                      <span className="uc-speed-text">Paused</span>
                    ) : (
                      <span className="uc-speed-text">
                        ↑ {speedMBs} MB/s <span className="uc-telemetry-sep">·</span> {etaSec}s left
                      </span>
                    )}
                  </div>
                </div>
                <div className="uc-telemetry-right">
                  <span className="uc-percent-text">{Math.floor(progress)}%</span>
                </div>
              </div>

              {/* 20 Segments Track & Masked Shimmer Sweep */}
              <div
                className="segs-wrap"
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Floating Milestone Tooltip on Hover */}
                <AnimatePresence>
                  {hoverIndex !== null && (
                    <motion.div
                      className="uc-seg-tooltip"
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        left: `${((hoverIndex + 0.5) / SEGMENTS) * 100}%`,
                      }}
                    >
                      <span className="font-semibold">{Math.min(100, (hoverIndex + 1) * 5)}%</span>
                      <span className="uc-tooltip-sep">·</span>
                      <span>{(((hoverIndex + 1) * 5 * totalBytes) / 100 / 1048576).toFixed(1)} MB</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="segs">
                  {Array.from({ length: SEGMENTS }).map((_, i) => {
                    const threshold = ((i + 1) * 100) / SEGMENTS;
                    const prevThreshold = (i * 100) / SEGMENTS;
                    const on = progress >= threshold;
                    const isFilling = status === "uploading" && progress >= prevThreshold && progress < threshold;

                    // Fisheye scale boost on hover
                    const dist = hoverIndex !== null ? Math.abs(hoverIndex - i) : 99;
                    const hoverScale = dist === 0 ? 1.4 : dist === 1 ? 1.2 : 1;

                    return (
                      <motion.i
                        key={i}
                        className={`uc-seg ${on ? "on" : ""} ${isFilling ? "filling" : ""}`}
                        style={{
                          "--seg-i": i,
                        }}
                        animate={{
                          scaleY: hoverScale * (on ? 1.28 : isFilling ? 1.2 : 1),
                        }}
                        transition={{ type: "spring", stiffness: 450, damping: 22 }}
                        onMouseEnter={() => setHoverIndex(i)}
                        onClick={(e) => {
                          e.stopPropagation();
                          scrubToSegment(i);
                        }}
                      />
                    );
                  })}
                </div>

                {/* Full-Height Shimmer Sweep (active strictly while uploading) */}
                {status === "uploading" && (
                  <div className="shine-mask">
                    <div
                      className="shine-clip"
                      style={{
                        width: `${Math.min(100, Math.ceil(progress / (100 / SEGMENTS)) * (100 / SEGMENTS))}%`,
                      }}
                    >
                      <div className="shine" ref={shineRef} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons: Static layout with spring transitions */}
        <div className="uc-actions actions">
          <AnimatePresence mode="popLayout">
            {buttons.map((b) => (
              <motion.button
                key={b.label}
                layout
                className={`uc-btn btn ${b.primary ? "primary" : ""} ${b.ghost ? "ghost" : ""}`}
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={springCfg}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(b.id);
                }}
              >
                {b.label === "Upload another" && <RefreshCw size={14} className="mr-1" />}
                {b.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Hidden Native File Input */}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) pick(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </motion.div>
    </div>
  );
}

/* Helper to convert style string to object */
function parseStyle(styleStr) {
  const obj = {};
  styleStr.split(";").forEach((pair) => {
    if (!pair.trim()) return;
    const [key, val] = pair.split(":");
    if (key && val) {
      const camel = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      obj[camel] = val.trim();
    }
  });
  return obj;
}

/* Icon Glyphs: Video camera, Upload Arrow, Pause Bars, and Spring Checkmark */
function Glyph({ status }) {
  return (
    <svg viewBox="0 0 24 24" className="uc-glyph" fill="none" stroke="currentColor">
      {status === "idle" && (
        <>
          <rect x="2" y="6" width="14" height="12" rx="3" />
          <path d="M16 10l5-3.5v11L16 14z" />
          <circle cx="8" cy="12" r="2" fill="currentColor" fillOpacity="0.4" />
        </>
      )}

      {status === "uploading" && (
        <>
          <path d="M12 16V5M7 10l5-5 5 5" />
          <path d="M4 19h16" strokeDasharray="3 3" />
        </>
      )}

      {status === "paused" && (
        <>
          <rect x="7" y="5" width="3" height="14" rx="1.5" fill="currentColor" />
          <rect x="14" y="5" width="3" height="14" rx="1.5" fill="currentColor" />
        </>
      )}

      {status === "done" && (
        <motion.path
          d="M4.5 12.5l5 5L19.5 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

/* Simple & Lightweight Three.js 3D Orbital Stardust */
function ThreeRingCanvas({ status }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 120;
    const height = 120;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 2.6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 36 luminous particles in a tilted orbital halo ring
    const count = 36;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const radius = 0.72 + (Math.random() - 0.5) * 0.28;
      const z = (Math.random() - 0.5) * 0.35;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Smooth circular dot sprite
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.7)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const colorHex = status === "paused" ? 0xf59e0b : status === "done" ? 0x10b981 : 0x8b7cff;

    const material = new THREE.PointsMaterial({
      size: 0.11,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: colorHex,
      opacity: status === "uploading" ? 0.9 : 0.6,
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.x = 0.55; // Gentle 3D orbital tilt
    scene.add(points);

    let raf;
    let lastTime = performance.now();
    let elapsed = 0;

    const animate = (now) => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsed += delta;

      // Smooth orbital rotation: faster when uploading, calm standby when paused
      const speedMult = status === "uploading" ? 1.6 : status === "paused" ? 0.25 : 0.6;
      points.rotation.z -= delta * speedMult;

      // Gentle wobble breathing
      points.rotation.y = Math.sin(elapsed * 1.2) * 0.15;

      renderer.render(scene, camera);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [status]);

  return <div ref={mountRef} className="uc-three-stage" />;
}

export default UploadCard;
