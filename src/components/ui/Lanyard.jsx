import { useEffect, useRef, useState } from "react";

/* ───────────────────────── settings ───────────────────────── */
const DEFAULTS = {
  size: 0.6,
  bandLength: 0.5,
  bandWidth: 0.65,
  corner: 0.3,
  gravity: 1,
  damping: 0.5,
  elasticity: 0.5,
  breeze: 0.5,
  finish: "holographic",
  metal: "silver",
  orientation: "portrait",
  cardColor: "#ffffff",
  bandColor: "#111111",
  plain: false,
  interactive: true,
  intro: true,
};

const SLIDERS = [
  ["corner", "Corner Radius", 0, 0.6],
  ["size", "Size", 0.3, 0.9],
  ["bandLength", "Band Length", 0.2, 1],
  ["bandWidth", "Band Width", 0.3, 1],
  ["gravity", "Gravity", 0, 2],
  ["damping", "Damping", 0, 1],
  ["elasticity", "Elasticity", 0, 1],
  ["breeze", "Breeze", 0, 1],
];

const SELECTS = [
  ["finish", "Finish", ["glossy", "holographic", "matte"]],
  ["orientation", "Orientation", ["portrait", "landscape"]],
  ["metal", "Metal", ["silver", "gold", "graphite"]],
];

const METAL = {
  silver: ["#fafbfd", "#9aa1ab", "#e4e7ec"],
  gold: ["#fff0b8", "#a97a1f", "#f2cd6c"],
  graphite: ["#7a808a", "#25282d", "#5b6068"],
};

const FONT = "Inter, system-ui, sans-serif";
const lum = (h) => {
  const n = parseInt(h.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
const clamp01 = (x) => Math.max(0, Math.min(1, x));

/* ───────────────────────── physics + canvas engine ─────────────────────────
   Verlet rope (N+1 points) + a rigid card (2 points) + a spin angle `th`
   for the flip. Fixed 120 Hz timestep, drawn every animation frame.        */
function createLanyard(cv, getS, onGrab) {
  const cx = cv.getContext("2d");
  const IM = {};
  const N = 14;
  let W = 800,
    H = 520,
    dpr = 1;
  let P = [],
    th = 0,
    om = 0,
    T = 0,
    calm = 1,
    sleeping = false,
    tgt = null;
  let drag = false,
    gt = 0.5,
    ptr = { x: 0, y: 0 },
    sp = { x: 0, y: 0 },
    dn = null;
  let raf = 0,
    last = 0,
    acc = 0;

  const fit = () => {
    const r = cv.parentElement.getBoundingClientRect();
    W = r.width;
    H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    cv.width = W * dpr;
    cv.height = H * dpr;
  };
  const ro = new ResizeObserver(fit);
  ro.observe(cv.parentElement);
  fit();

  const dims = () => {
    const S = getS(),
      L = (290 * S.size) / 0.6,
      ld = S.orientation === "landscape";
    const w = ld ? L : L * 0.66,
      h = ld ? L * 0.66 : L;
    return {
      w,
      h,
      u: Math.min(w, h * 0.66),
      R: 4 + S.corner * Math.min(w, h) * 0.3,
      rope: 50 + S.bandLength * 220,
    };
  };

  function init() {
    const S = getS(),
      d = dims(),
      tot = d.rope + d.h * 0.94;
    const a = S.intro
      ? Math.min(1.05, Math.asin(Math.min(1, (W / 2 - 50) / tot)))
      : 0.012;
    const sx = Math.sin(a),
      cy = Math.cos(a);
    P = [];
    for (let i = 0; i <= N + 1; i++) {
      const l = i <= N ? (d.rope * i) / N : tot,
        x = W / 2 + sx * l,
        y = -20 + cy * l;
      P.push({ x, y, px: x, py: y, w: i === 0 ? 0 : i < N ? 1 : 0.4 });
    }
    th = S.intro ? 0.5 : 0;
    om = 0;
    calm = 1;
    sleeping = false;
    tgt = null;
  }

  // Flip = critically-ish damped spring to the opposite face (+ a little swing kick)
  function flip() {
    sleeping = false;
    calm = Math.max(calm, 0.5);
    tgt = Math.round(th / Math.PI) * Math.PI + Math.PI;
    P[N + 1].x += 5;
  }
  function wake(k) {
    sleeping = false;
    calm = Math.max(calm, k === "breeze" ? 1 : 0.4);
  }

  function con(a, b, r, k) {
    const dx = b.x - a.x,
      dy = b.y - a.y,
      l = Math.hypot(dx, dy) || 1e-4;
    const f = ((l - r) / l / (a.w + b.w)) * k;
    a.x += dx * f * a.w;
    a.y += dy * f * a.w;
    b.x -= dx * f * b.w;
    b.y -= dy * f * b.w;
  }

  function step(dt) {
    if (sleeping && !drag) return;
    const S = getS(),
      d = dims(),
      set = 1 - calm;
    const g = 2600 * S.gravity,
      fr = 1 - (0.0008 + S.damping * 0.005 + set * 0.007),
      k = 1 - S.elasticity * 0.6;
    T += dt;
    calm = drag ? 1 : calm * Math.exp(-dt / 1.8); // breeze + energy fade out → card comes to rest
    const br =
      S.breeze *
      1400 *
      calm *
      (Math.sin(T * 0.8) + 0.6 * Math.sin(T * 2.1 + 1) + 0.3 * Math.sin(T * 5.3));
    for (let i = 1; i < P.length; i++) {
      const p = P[i],
        vx = (p.x - p.px) * fr,
        vy = (p.y - p.py) * fr;
      p.px = p.x;
      p.py = p.y;
      p.x += vx + br * (0.25 + i / P.length) * dt * dt;
      p.y += vy + g * dt * dt;
    }
    if (drag) {
      sp.x += (ptr.x - sp.x) * 0.25;
      sp.y += (ptr.y - sp.y) * 0.25;
      const a = P[N],
        b = P[N + 1];
      const dx = sp.x - (a.x + (b.x - a.x) * gt),
        dy = sp.y - (a.y + (b.y - a.y) * gt);
      a.x += dx * (1 - gt) * 0.5;
      a.y += dy * (1 - gt) * 0.5;
      b.x += dx * gt * 0.5;
      b.y += dy * gt * 0.5;
    }
    for (let it = 0; it < 12; it++) {
      for (let i = 0; i <= N; i++)
        con(P[i], P[i + 1], i < N ? d.rope / N : d.h * 0.94, k);
      P[0].x = W / 2;
      P[0].y = -20;
    }
    const c = P[N + 1];
    c.x = Math.max(40, Math.min(W - 40, c.x));
    c.y = Math.min(c.y, H - 14);

    // spin: swing couples into twist; otherwise rest on the nearest face; during a flip, spring to target
    om +=
      ((c.x - c.px) / dt) * dt * 0.004 * (drag ? 1.8 : 1) -
      (tgt === null ? Math.sin(2 * th) * 26 * dt : 0);
    if (tgt !== null) {
      om += ((tgt - th) * 190 - om * 21) * dt;
      if (Math.abs(tgt - th) < 0.004 && Math.abs(om) < 0.05) {
        th = tgt;
        om = 0;
        tgt = null;
      }
    }
    om *= 1 - dt * (1.4 + set * 4);
    th += om * dt;

    // sleep once everything is (almost) still
    if (!drag && tgt === null && calm < 0.12) {
      let v = 0;
      for (const p of P) v = Math.max(v, Math.abs(p.x - p.px) + Math.abs(p.y - p.py));
      const rest = Math.abs(th - Math.round(th / Math.PI) * Math.PI) < 0.01;
      if (
        rest &&
        Math.abs(om) < 0.03 &&
        ((v < 0.02 && Math.abs(P[N + 1].x - W / 2) < 1.5) ||
          (calm < 0.012 && v < 0.05))
      ) {
        sleeping = true;
        om = 0;
        th = Math.round(th / Math.PI) * Math.PI;
        P.forEach((p) => {
          p.px = p.x;
          p.py = p.y;
        });
      }
    }
  }

  /* ── pointer ── */
  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  function hit(p) {
    const d = dims(),
      a = P[N],
      b = P[N + 1],
      rot = Math.atan2(b.y - a.y, b.x - a.x) - Math.PI / 2;
    const dx = p.x - a.x,
      dy = p.y - a.y,
      c = Math.cos(rot),
      s = Math.sin(rot);
    const lx = dx * c + dy * s,
      ly = -dx * s + dy * c;
    return Math.abs(lx) < d.w / 2 + 6 && ly > -0.06 * d.h && ly < 0.94 * d.h
      ? clamp01(ly / (0.94 * d.h))
      : -1;
  }
  const down = (e) => {
    if (!getS().interactive) return;
    const p = pos(e),
      t = hit(p);
    if (t < 0) return;
    dn = { x: p.x, y: p.y, t: performance.now() };
    drag = true;
    sleeping = false;
    calm = 1;
    gt = t;
    ptr = p;
    sp = { ...p };
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor = "grabbing";
    onGrab && onGrab();
  };
  const move = (e) => {
    const p = pos(e);
    if (drag) ptr = p;
    else cv.style.cursor = getS().interactive && hit(p) >= 0 ? "grab" : "default";
  };
  const up = (e) => {
    if (drag) {
      calm = Math.max(calm, 0.6);
      // a quick tap (no real movement) flips the card
      if (
        e.type === "pointerup" &&
        dn &&
        Math.hypot(ptr.x - dn.x, ptr.y - dn.y) < 6 &&
        performance.now() - dn.t < 350
      )
        flip();
    }
    drag = false;
    cv.style.cursor = "default";
  };
  cv.addEventListener("pointerdown", down);
  cv.addEventListener("pointermove", move);
  cv.addEventListener("pointerup", up);
  cv.addEventListener("pointercancel", up);

  /* ── drawing ── */
  const rr = (x, y, w, h, r) => {
    cx.beginPath();
    cx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  };

  function frontArt(w, h, u, ink) {
    const g = cx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#ffc08f");
    g.addColorStop(0.5, "#ff78ae");
    g.addColorStop(1, "#6f63ff");
    cx.fillStyle = g;
    cx.beginPath();
    cx.arc(w * 0.5, h * 0.42, u * 0.34, 0, 7);
    cx.fill();
    cx.fillStyle = "#17171c";
    cx.beginPath();
    cx.arc(w * 0.5, h * 0.4, u * 0.115, 0, 7);
    cx.fill();
    cx.beginPath();
    cx.ellipse(w * 0.5, h * 0.62, u * 0.29, h * 0.11, 0, Math.PI, 0);
    cx.fill();
    cx.fillStyle = ink;
    cx.textAlign = "left";
    cx.font = `700 ${u * 0.1}px ${FONT}`;
    cx.fillText("Ava Lindqvist", w * 0.09, h * 0.78);
    cx.globalAlpha = 0.55;
    cx.font = `500 ${u * 0.053}px ${FONT}`;
    cx.fillText("Product Designer", w * 0.09, h * 0.83);
    cx.textAlign = "right";
    cx.fillText("@ava.l", w * 0.91, h * 0.13);
    cx.globalAlpha = 0.75;
    cx.textAlign = "left";
    const n = 28,
      bw = (w * 0.82) / n;
    for (let i = 0; i < n; i++)
      if (i % 3 !== 2)
        cx.fillRect(
          w * 0.09 + i * bw,
          h * 0.89,
          bw * (0.4 + ((i * 5) % 4) * 0.2),
          h * 0.05
        );
    cx.globalAlpha = 1;
  }
  function backArt(w, h, u, ink) {
    cx.globalAlpha = 0.08;
    cx.strokeStyle = ink;
    cx.lineWidth = u * 0.03;
    for (let i = 1; i < 5; i++) {
      cx.beginPath();
      cx.arc(w / 2, h * 0.38, u * 0.1 * i, 0, 7);
      cx.stroke();
    }
    cx.globalAlpha = 1;
    cx.fillStyle = ink;
    cx.textAlign = "center";
    cx.font = `700 ${u * 0.075}px ${FONT}`;
    cx.letterSpacing = u * 0.02 + "px";
    cx.fillText("LANYARD", w / 2, h * 0.38 + u * 0.03);
    cx.letterSpacing = "0px";
    const s = u * 0.045,
      x0 = w / 2 - s * 4.5,
      y0 = h * 0.56;
    cx.globalAlpha = 0.85;
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++)
        if ((i * 7 + j * 13 + i * j) % 5 < 2 || (i % 8 === 0 && j % 8 === 0))
          cx.fillRect(x0 + i * s, y0 + j * s, s * 0.82, s * 0.82);
    cx.globalAlpha = 0.55;
    cx.font = `500 ${u * 0.045}px ${FONT}`;
    cx.fillText("Scan to connect", w / 2, y0 + s * 9 + u * 0.09);
    cx.globalAlpha = 1;
  }

  function card(S, d, back, rot, cs) {
    const { w, h, u, R } = d,
      ink = lum(S.cardColor) < 0.5 ? "#ffffff" : "#16161a";
    cx.save();
    cx.shadowColor = "rgba(0,0,0,.2)";
    cx.shadowBlur = 30;
    cx.shadowOffsetY = 14;
    cx.fillStyle = S.cardColor;
    rr(0, 0, w, h, R);
    cx.fill();
    cx.restore();
    cx.save();
    rr(0, 0, w, h, R);
    cx.clip();
    const im = IM[back ? "back" : "front"];
    if (im) {
      const s = Math.max(w / im.width, h / im.height);
      cx.drawImage(
        im,
        (w - im.width * s) / 2,
        (h - im.height * s) / 2,
        im.width * s,
        im.height * s
      );
    } else back ? backArt(w, h, u, ink) : frontArt(w, h, u, ink);
    const pos = 0.5 + 0.5 * Math.sin(rot * 2 + th * 1.5);
    if (S.finish === "holographic") {
      const hu = (((rot * 100 + th * 140 + T * 8) % 360) + 360) % 360,
        g = cx.createLinearGradient(0, 0, w, h);
      [0, 0.33, 0.66, 1].forEach((s, i) =>
        g.addColorStop(s, `hsla(${hu + i * 75},95%,72%,.95)`)
      );
      cx.globalCompositeOperation = "soft-light";
      cx.fillStyle = g;
      cx.fillRect(0, 0, w, h);
      const g2 = cx.createLinearGradient(w, 0, 0, h);
      [0, 0.5, 1].forEach((s, i) =>
        g2.addColorStop(s, `hsla(${hu + 120 + i * 90},100%,65%,.35)`)
      );
      cx.globalCompositeOperation = "overlay";
      cx.fillStyle = g2;
      cx.fillRect(0, 0, w, h);
      cx.globalCompositeOperation = "source-over";
    }
    if (S.finish !== "matte") {
      const g = cx.createLinearGradient(0, 0, w, h);
      g.addColorStop(clamp01(pos - 0.3), "rgba(255,255,255,0)");
      g.addColorStop(
        clamp01(pos),
        `rgba(255,255,255,${S.finish === "glossy" ? 0.4 : 0.22})`
      );
      g.addColorStop(clamp01(pos + 0.3), "rgba(255,255,255,0)");
      cx.fillStyle = g;
      cx.fillRect(0, 0, w, h);
    }
    cx.fillStyle = `rgba(0,0,0,${(1 - Math.abs(cs)) * 0.3})`;
    cx.fillRect(0, 0, w, h); // edge-on shading
    cx.restore();
    rr(w / 2 - w * 0.1, h * 0.06 - 4.5, w * 0.2, 9, 5);
    cx.fillStyle = "#F3F3F0";
    cx.fill();
    cx.strokeStyle = "rgba(0,0,0,.14)";
    cx.lineWidth = 1;
    cx.stroke();
    rr(0, 0, w, h, R);
    cx.strokeStyle = "rgba(0,0,0,.08)";
    cx.stroke();
  }

  function draw() {
    const S = getS(),
      d = dims();
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, W, H);
    const bw = 12 + S.bandWidth * 28,
      pts = [{ x: W / 2, y: -90 }, ...P.slice(0, N + 1)],
      bl = lum(S.bandColor) < 0.5;
    const path = () => {
      cx.beginPath();
      cx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++)
        cx.quadraticCurveTo(
          pts[i].x,
          pts[i].y,
          (pts[i].x + pts[i + 1].x) / 2,
          (pts[i].y + pts[i + 1].y) / 2
        );
      const e = pts[pts.length - 1];
      cx.lineTo(e.x, e.y);
    };
    cx.lineJoin = "round";
    cx.lineCap = "butt";
    path();
    cx.strokeStyle = S.bandColor;
    cx.lineWidth = bw;
    cx.stroke();
    path();
    cx.strokeStyle = bl ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.06)";
    cx.lineWidth = bw * 0.3;
    cx.stroke();
    if (!S.plain) {
      // repeating wordmark along the band
      let run = 0,
        nx = 70;
      cx.fillStyle = bl ? "rgba(255,255,255,.88)" : "rgba(0,0,0,.8)";
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      cx.font = `700 ${bw * 0.34}px ${FONT}`;
      cx.letterSpacing = "2px";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1],
          b = pts[i],
          l = Math.hypot(b.x - a.x, b.y - a.y);
        while (nx <= run + l) {
          const f = (nx - run) / l;
          cx.save();
          cx.translate(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f);
          cx.rotate(Math.atan2(b.y - a.y, b.x - a.x));
          cx.fillText("LANYARD", 0, 0);
          cx.restore();
          nx += 105;
        }
        run += l;
      }
      cx.letterSpacing = "0px";
      cx.textBaseline = "alphabetic";
    }
    const a = P[N],
      b = P[N + 1],
      rot = Math.atan2(b.y - a.y, b.x - a.x) - Math.PI / 2,
      cs = Math.cos(th);
    cx.save();
    cx.translate(a.x, a.y);
    cx.rotate(rot);
    cx.scale(cs, 1);
    if (cs < 0) cx.scale(-1, 1); // scaleX(cos θ) = the flip; mirror back so the reverse reads correctly
    cx.translate(-d.w / 2, -0.06 * d.h);
    card(S, d, cs < 0, rot, cs);
    cx.restore();
    const ra = Math.atan2(a.y - P[N - 1].y, a.x - P[N - 1].x),
      m = METAL[S.metal];
    cx.save();
    cx.translate(a.x, a.y);
    cx.rotate(ra - Math.PI / 2);
    const g = cx.createLinearGradient(-bw / 2, 0, bw / 2, 0);
    g.addColorStop(0, m[0]);
    g.addColorStop(0.5, m[1]);
    g.addColorStop(1, m[2]);
    rr(-bw * 0.58, -34, bw * 1.16, 23, 5);
    cx.fillStyle = g;
    cx.fill();
    cx.strokeStyle = "rgba(0,0,0,.18)";
    cx.lineWidth = 1;
    cx.stroke();
    cx.strokeStyle = g;
    cx.lineWidth = 3.4;
    cx.beginPath();
    cx.arc(0, -1, 9, 0, 7);
    cx.stroke();
    cx.restore();
  }

  function loop(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0.016);
    last = ts;
    acc += dt;
    let n = 0;
    while (acc >= 1 / 120 && n++ < 8) {
      step(1 / 120);
      acc -= 1 / 120;
    }
    draw();
    raf = requestAnimationFrame(loop);
  }
  init();
  raf = requestAnimationFrame(loop);

  return {
    init,
    flip,
    wake,
    setImage: (side, im) => {
      IM[side] = im;
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
    },
  };
}

/* ───────────────────────── small UI pieces ───────────────────────── */
const row =
  "relative flex h-10 items-center justify-between gap-2.5 overflow-hidden rounded-xl bg-neutral-100 px-3.5 text-[13px] transition-colors hover:bg-neutral-200/70";

function Slider({ label, min, max, value, onChange }) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className={row + " cursor-ew-resize"}>
      <div
        className="absolute inset-y-0 left-0 bg-neutral-300/80 transition-[width] duration-150 ease-linear"
        style={{ width: p + "%" }}
      />
      <div
        className="absolute inset-y-[11px] w-[3px] rounded bg-neutral-400 transition-[left] duration-150 ease-linear"
        style={{ left: `calc(${p}% - 6px)` }}
      />
      <span className="relative">{label}</span>
      <b className="relative font-medium tabular-nums">{value.toFixed(2)}</b>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </label>
  );
}
function Select({ label, value, options, onChange }) {
  return (
    <label className={row + " cursor-pointer"}>
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent text-right font-medium capitalize outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
function Color({ label, value, onChange }) {
  return (
    <label className={row + " cursor-pointer"}>
      <span>{label}</span>
      <span className="flex items-center gap-2 font-medium text-neutral-500">
        {value}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-6 cursor-pointer rounded-full border border-black/10 bg-transparent p-0"
        />
      </span>
    </label>
  );
}
function Toggle({ label, value, onChange }) {
  return (
    <label className={row + " cursor-pointer"}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="peer hidden"
      />
      <i
        className={
          "relative h-[22px] w-[38px] rounded-full transition-colors duration-300 " +
          (value ? "bg-neutral-900" : "bg-neutral-300")
        }
      >
        <i
          className={
            "absolute left-[3px] top-[3px] h-4 w-4 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] " +
            (value ? "translate-x-4" : "")
          }
        />
      </i>
    </label>
  );
}
function Upload({ label, done, onFile }) {
  return (
    <label className={row + " cursor-pointer"}>
      <span>{label}</span>
      <em className="font-medium not-italic text-neutral-500">
        {done ? "Added" : "Upload"}
      </em>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
    </label>
  );
}

/* ───────────────────────── the component ───────────────────────── */
export function Lanyard() {
  const [S, setS] = useState(DEFAULTS);
  const [hint, setHint] = useState(true);
  const [added, setAdded] = useState({});
  const cv = useRef(null),
    sim = useRef(null),
    live = useRef(S);
  live.current = S; // engine reads the latest settings through this ref

  useEffect(() => {
    const l = createLanyard(
      cv.current,
      () => live.current,
      () => setHint(false)
    );
    sim.current = l;
    return l.destroy;
  }, []);

  const set = (k, v) => {
    live.current = { ...live.current, [k]: v };
    setS(live.current);
    sim.current && sim.current.wake(k); // wake the physics so the change is visible
  };
  const upload = (side, file) => {
    const im = new Image();
    im.onload = () => {
      sim.current.setImage(side, im);
      setAdded((a) => ({ ...a, [side]: true }));
    };
    im.src = URL.createObjectURL(file);
  };
  const reset = () => {
    live.current = DEFAULTS;
    setS(DEFAULTS);
    sim.current.init();
  };

  return (
    <div className="mx-auto max-w-[1080px] bg-white px-5 py-8 text-neutral-900">
      <h1 className="text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">
        Lanyard
      </h1>
      <p className="mt-3 text-sm text-neutral-500">
        A badge on a physics-driven band. Grab it, fling it, tap to flip.
      </p>

      <div className="relative mt-6 h-[470px] overflow-hidden rounded-[28px] border border-black/10 bg-[#F3F3F0] sm:h-[540px]">
        <canvas
          ref={cv}
          className="absolute inset-0 block h-full w-full touch-none"
        />
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            onClick={() => {
              sim.current.flip();
              setHint(false);
            }}
            className="h-11 rounded-xl border border-black/10 bg-white px-4 text-[13px] font-medium transition active:scale-90"
          >
            Flip
          </button>
          <button
            onClick={() => {
              sim.current.init();
              setHint(true);
            }}
            aria-label="Replay intro"
            className="grid h-11 w-11 place-items-center rounded-xl border border-black/10 bg-white transition active:scale-90"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M20 11a8 8 0 0 0-14.5-4M4 4v4h4M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4" />
            </svg>
          </button>
        </div>
        <p
          className={
            "pointer-events-none absolute inset-x-0 bottom-4 text-center text-[13px] text-neutral-500 transition-opacity duration-700 " +
            (hint ? "opacity-100" : "opacity-0")
          }
        >
          Try dragging · tap the card to flip
        </p>
      </div>

      <section className="mt-5 rounded-[28px] border border-black/10 bg-neutral-50 p-3">
        <div className="flex items-center justify-between px-3 py-2">
          <h2 className="text-sm font-semibold">Customize</h2>
          <button
            onClick={reset}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
          >
            Reset
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 rounded-2xl border border-black/10 bg-white p-2 sm:grid-cols-3">
          <Upload
            label="Front Image"
            done={added.front}
            onFile={(f) => upload("front", f)}
          />
          <Upload
            label="Back Image"
            done={added.back}
            onFile={(f) => upload("back", f)}
          />
          {SELECTS.map(([k, l, o]) => (
            <Select
              key={k}
              label={l}
              value={S[k]}
              options={o}
              onChange={(v) => set(k, v)}
            />
          ))}
          <Color
            label="Card Color"
            value={S.cardColor}
            onChange={(v) => set("cardColor", v)}
          />
          <Color
            label="Band Color"
            value={S.bandColor}
            onChange={(v) => set("bandColor", v)}
          />
          <Toggle
            label="Plain Band"
            value={S.plain}
            onChange={(v) => set("plain", v)}
          />
          {SLIDERS.map(([k, l, a, b]) => (
            <Slider
              key={k}
              label={l}
              min={a}
              max={b}
              value={S[k]}
              onChange={(v) => set(k, v)}
            />
          ))}
          <Toggle
            label="Interactive"
            value={S.interactive}
            onChange={(v) => set("interactive", v)}
          />
          <Toggle
            label="Intro"
            value={S.intro}
            onChange={(v) => set("intro", v)}
          />
        </div>
      </section>
    </div>
  );
}

export default Lanyard;
