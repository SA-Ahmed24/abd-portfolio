import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, staticFile,
  useCurrentFrame, useVideoConfig, interpolate, spring, continueRender, delayRender,
} from "remotion";

/* Project-explainer reel: hook -> what it is -> feature-by-feature with the real
   product UI + readable captions + voice-over -> tech stack -> outro.
   Cream / green / gold + Fraunces, lightly produced (music + SFX). */

if (typeof document !== "undefined" && !document.getElementById("abd-gfonts")) {
  const h = delayRender("fonts");
  let done = false; const fin = () => { if (!done) { done = true; continueRender(h); } };
  const l = document.createElement("link"); l.id = "abd-gfonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap";
  l.onload = fin; l.onerror = fin; document.head.appendChild(l); setTimeout(fin, 6000);
}

const DISPLAY = "'Fraunces', Georgia, serif";
const SERIF = "'Instrument Serif', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const PAPER = "#faf6ec", INK = "#1a1714", INKSOFT = "#5b554b", LINE = "#cabfa8";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Grain: React.FC = () => (
  <>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)", backgroundSize: "22px 22px" }} />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(120,90,30,0.12)" }} />
  </>
);

// lower-third readable caption
const Caption: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [6, 18], [0, 1], clamp);
  const y = interpolate(f, [6, 20], [22, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, display: "flex", justifyContent: "center", opacity: op, transform: `translateY(${y}px)` }}>
      <div style={{ maxWidth: "80%", background: "rgba(18,14,10,0.93)", color: PAPER, fontFamily: MONO, fontSize: 24, lineHeight: 1.45, padding: "13px 24px", borderRadius: 10, borderLeft: `4px solid ${accent}`, textAlign: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
        {text}
      </div>
    </div>
  );
};

// real product screenshot in a browser frame, punching in toward a focus point
const FeatureShot: React.FC<{ shot: any; url: string; idx: number; accent: string; accent2: string }> = ({ shot, url, idx, accent, accent2 }) => {
  const f = useCurrentFrame();
  const inOp = interpolate(f, [0, 14], [0, 1], clamp);
  const inX = interpolate(f, [0, 16], [40, 0], clamp);
  const scale = interpolate(f, [0, 150], [1.04, 1.16], clamp);
  const fx = (shot.fx ?? 0.5) * 100, fy = (shot.fy ?? 0.4) * 100;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: inOp, transform: `translateX(${inX}px)` }}>
      <div style={{ position: "absolute", top: 64, left: 46, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: accent }}>
        {String(idx).padStart(2, "0")} — {shot.section}
      </div>
      <div style={{ width: 872, borderRadius: 12, overflow: "hidden", border: `3px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, background: "#fff", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 13px", background: "#efe6cf", borderBottom: `2px solid ${INK}` }}>
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => <span key={c} style={{ width: 10, height: 10, borderRadius: 10, background: c }} />)}
          <span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 12, color: INKSOFT, background: "#fff", borderRadius: 20, padding: "3px 14px" }}>{url}</span>
        </div>
        <div style={{ width: "100%", height: 470, overflow: "hidden", background: "#0b0908" }}>
          <Img src={staticFile(shot.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", transform: `scale(${scale})`, transformOrigin: `${fx}% ${fy}%` }} />
        </div>
      </div>
      <Caption text={shot.cap} accent={accent2} />
    </AbsoluteFill>
  );
};

export const LaunchTrailer: React.FC<any> = (props) => {
  const { title, tagline, problem, problemKey, whatis, tech = [], role, shots = [], url, accent = "#01411c", accent2 = "#d97706", vo } = props;
  const frame = useCurrentFrame();
  const { fps, durationInFrames: total } = useVideoConfig();

  const P = 180, W = 300, TECH_LEN = 96, OUTRO_LEN = 96;
  const shotsStart = W, shotsEnd = total - TECH_LEN - OUTRO_LEN;
  const shotLen = Math.floor((shotsEnd - shotsStart) / shots.length);
  const techStart = shotsEnd, outroStart = total - OUTRO_LEN;

  // section label for the top-right
  let section = "";
  if (frame < P) section = "01 — the problem";
  else if (frame < W) section = "02 — what it is";
  else if (frame < shotsEnd) section = "features";
  else if (frame < outroStart) section = "the stack";

  const progress = interpolate(frame, [0, total], [0, 100], clamp);

  // intro hook
  const probWord = spring({ frame: frame - 24, fps, config: { damping: 200 } });
  const probOp = interpolate(frame, [8, 26, P - 18, P], [0, 1, 1, 0], clamp);
  // what-it-is
  const wf = frame - P;
  const titleSpring = spring({ frame: wf - 6, fps, config: { damping: 200 } });
  const wOp = interpolate(wf, [0, 16, W - P - 16, W - P], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: PAPER, fontFamily: SERIF }}>
      <Grain />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: accent2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: accent }} />

      {/* audio */}
      <Sequence from={18}><Audio src={staticFile(vo)} /></Sequence>
      <Audio src={staticFile("audio/music.wav")} volume={(f) => interpolate(f, [0, 40, total - 55, total], [0, 0.34, 0.34, 0], clamp)} />
      <Sequence from={0}><Audio src={staticFile("audio/riser.wav")} volume={0.5} /></Sequence>
      {[P, W, ...shots.map((_: any, i: number) => shotsStart + i * shotLen), techStart, outroStart].map((fr, i) => (
        <Sequence key={i} from={fr - 6}><Audio src={staticFile("audio/whoosh.wav")} volume={0.4} /></Sequence>
      ))}
      <Sequence from={W - 6}><Audio src={staticFile("audio/ding.wav")} volume={0.4} /></Sequence>

      {/* SCENE 1 — hook / the problem */}
      <Sequence from={0} durationInFrames={P}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 90, opacity: probOp }}>
          <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 5, color: accent, marginBottom: 26 }}>THE PROBLEM</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 46, color: INK, textAlign: "center", lineHeight: 1.25, maxWidth: 760 }}>{problem}</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 92, color: accent2, marginTop: 18, transform: `scale(${interpolate(probWord, [0, 1], [0.7, 1])})` }}>{problemKey}</div>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2 — what it is */}
      <Sequence from={P} durationInFrames={W - P}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 90, opacity: wOp }}>
          <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 6, color: accent, marginBottom: 16 }}>INTRODUCING</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 104, color: INK, lineHeight: 1, transform: `translateY(${(1 - titleSpring) * 34}px)` }}>{title}</div>
          <div style={{ height: 6, width: interpolate(wf, [20, 46], [0, 320], clamp), background: accent2, margin: "22px 0", borderRadius: 3 }} />
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: INKSOFT, textAlign: "center", maxWidth: 720, lineHeight: 1.3 }}>{whatis}</div>
        </AbsoluteFill>
      </Sequence>

      {/* SCENES 3..n — features with real UI */}
      {shots.map((s: any, i: number) => (
        <Sequence key={i} from={shotsStart + i * shotLen} durationInFrames={shotLen + 2}>
          <FeatureShot shot={s} url={url} idx={i + 3} accent={accent} accent2={accent2} />
        </Sequence>
      ))}

      {/* SCENE — tech stack */}
      <Sequence from={techStart} durationInFrames={TECH_LEN + OUTRO_LEN}>
        <TechScene tech={tech} role={role} accent={accent} accent2={accent2} len={TECH_LEN} />
      </Sequence>

      {/* SCENE — outro */}
      <Sequence from={outroStart} durationInFrames={OUTRO_LEN}>
        <Outro title={title} tagline={tagline} accent={accent} accent2={accent2} />
      </Sequence>

      {/* persistent overlays */}
      {frame > 6 && frame < outroStart && (
        <>
          <div style={{ position: "absolute", top: 26, left: 40, display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 9, height: 9, borderRadius: 9, background: "#d23", boxShadow: "0 0 8px #d23", opacity: 0.6 + 0.4 * Math.sin(frame / 6) }} />
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: INK }}>{title}</span>
          </div>
          <div style={{ position: "absolute", top: 30, right: 40, fontFamily: MONO, fontSize: 12, letterSpacing: 3, color: INKSOFT, textTransform: "uppercase" }}>{section}</div>
        </>
      )}
      {/* progress bar */}
      <div style={{ position: "absolute", left: 0, bottom: 8, height: 4, width: `${progress}%`, background: accent2 }} />
    </AbsoluteFill>
  );
};

const TechScene: React.FC<any> = ({ tech, role, accent, accent2, len }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 14, len - 10, len], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
      <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 6, color: accent, marginBottom: 26 }}>BUILT WITH</div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 820 }}>
        {tech.map((t: string, i: number) => {
          const a = interpolate(f, [10 + i * 8, 24 + i * 8], [0, 1], clamp);
          return (
            <div key={t} style={{ opacity: a, transform: `translateY(${(1 - a) * 16}px)`, fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, color: INK, background: "#fff", border: `2.5px solid ${INK}`, borderRadius: 10, padding: "10px 22px", boxShadow: `5px 5px 0 ${accent}` }}>
              {t}
            </div>
          );
        })}
      </div>
      {role ? <div style={{ marginTop: 30, fontFamily: MONO, fontSize: 15, color: "#fff", background: accent2, borderRadius: 18, padding: "7px 16px", opacity: interpolate(f, [40, 56], [0, 1], clamp) }}>{role}</div> : null}
    </AbsoluteFill>
  );
};

const Outro: React.FC<any> = ({ title, tagline, accent, accent2 }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 16], [0, 1], clamp);
  const s = spring({ frame: f - 4, fps: 30, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 96, color: INK, transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})` }}>{title}</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: INKSOFT, marginTop: 8 }}>{tagline}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 30, borderTop: `2px solid ${LINE}`, paddingTop: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 22, color: accent2 }}>AA</span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 1, color: INK }}>syed abdullah ahmed · portfolio</span>
      </div>
    </AbsoluteFill>
  );
};
