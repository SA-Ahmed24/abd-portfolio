import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, staticFile,
  useCurrentFrame, useVideoConfig, interpolate, spring, continueRender, delayRender,
} from "remotion";

/* Product-launch trailer: real product screenshots shown cinematically
   (browser frame + Ken Burns), narrated voice-over + ambient music + SFX.
   Matches the portfolio's cream / green / gold + Fraunces look. */

// fonts (guarded so it only injects once across compositions)
if (typeof document !== "undefined" && !document.getElementById("abd-gfonts")) {
  const h = delayRender("fonts");
  let done = false; const fin = () => { if (!done) { done = true; continueRender(h); } };
  const l = document.createElement("link"); l.id = "abd-gfonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500;700&display=swap";
  l.onload = fin; l.onerror = fin; document.head.appendChild(l); setTimeout(fin, 6000);
}

const DISPLAY = "'Fraunces', Georgia, serif";
const SERIF = "'Instrument Serif', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const PAPER = "#faf6ec", INK = "#1a1714", INKSOFT = "#5b554b";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Grain: React.FC = () => (
  <>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)", backgroundSize: "22px 22px" }} />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(120,90,30,0.12)" }} />
  </>
);

const BrowserShot: React.FC<{ src: string; url: string; caption: string; local: number; len: number; accent: string }> = ({ src, url, caption, local, len, accent }) => {
  const prog = local / len;
  const scale = interpolate(prog, [0, 1], [1.05, 1.15]);
  const tx = interpolate(prog, [0, 1], [1, -1]);
  const inOp = interpolate(local, [0, 12], [0, 1], clamp);
  const inY = interpolate(local, [0, 14], [26, 0], clamp);
  const capOp = interpolate(local, [10, 24], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: inOp, transform: `translateY(${inY}px)` }}>
      <div style={{ width: 904, borderRadius: 12, overflow: "hidden", border: `3px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 13px", background: "#efe6cf", borderBottom: `2px solid ${INK}` }}>
          <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ff5f56" }} />
          <span style={{ width: 10, height: 10, borderRadius: 10, background: "#ffbd2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: 10, background: "#27c93f" }} />
          <span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 12, color: INKSOFT, background: "#fff", borderRadius: 20, padding: "3px 14px" }}>{url}</span>
        </div>
        <div style={{ width: "100%", height: 508, overflow: "hidden", background: "#0b0908" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", transform: `scale(${scale}) translateX(${tx}%)` }} />
        </div>
      </div>
      <div style={{ marginTop: 22, opacity: capOp, fontFamily: MONO, fontSize: 19, letterSpacing: 1, color: INK }}>
        <span style={{ color: accent }}>▸ </span>{caption}
      </div>
    </AbsoluteFill>
  );
};

export const LaunchTrailer: React.FC<any> = (props) => {
  const { title, tagline, problem, shots = [], url, accent = "#01411c", accent2 = "#d97706", vo } = props;
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const INTRO = 150;
  const OUTRO = durationInFrames - 96;
  const span = OUTRO - INTRO;
  const shotLen = Math.floor(span / shots.length);

  // intro animation
  const probOp = interpolate(frame, [10, 30, 66, 82], [0, 1, 1, 0], clamp);
  const titleSpring = spring({ frame: frame - 88, fps, config: { damping: 200 } });
  const titleOp = interpolate(frame, [88, 104, INTRO - 6, INTRO], [0, 1, 1, 0], clamp);
  const underline = interpolate(frame, [104, 130], [0, 1], clamp);
  const outroOp = interpolate(frame, [OUTRO, OUTRO + 16], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: PAPER, fontFamily: SERIF }}>
      <Grain />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: accent2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: accent }} />

      {/* audio: voice-over (delayed), ambient music bed (quiet, fades out), SFX */}
      <Sequence from={12}><Audio src={staticFile(vo)} /></Sequence>
      <Audio src={staticFile("audio/music.wav")} volume={(f) => interpolate(f, [0, 40, durationInFrames - 50, durationInFrames], [0, 0.16, 0.16, 0], clamp)} />
      <Sequence from={INTRO - 5}><Audio src={staticFile("audio/ding.wav")} volume={0.4} /></Sequence>
      {shots.map((_: any, i: number) => (
        <Sequence key={i} from={INTRO + i * shotLen - 6}><Audio src={staticFile("audio/whoosh.wav")} volume={0.45} /></Sequence>
      ))}

      {/* INTRO — problem then title */}
      {frame < INTRO && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 90 }}>
          <div style={{ position: "absolute", opacity: probOp, fontFamily: SERIF, fontStyle: "italic", fontSize: 38, color: INKSOFT, textAlign: "center", lineHeight: 1.4 }}>
            {problem}
          </div>
          <div style={{ opacity: titleOp, textAlign: "center" }}>
            <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 6, color: accent, marginBottom: 18 }}>NOW SHOWING</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 108, color: INK, lineHeight: 1, transform: `translateY(${(1 - titleSpring) * 36}px)` }}>{title}</div>
            <div style={{ height: 6, width: 300 * underline, background: accent2, margin: "24px auto 0", borderRadius: 3 }} />
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: INKSOFT, marginTop: 22 }}>{tagline}</div>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOTS — real product screenshots */}
      {shots.map((s: any, i: number) => (
        <Sequence key={i} from={INTRO + i * shotLen} durationInFrames={shotLen + 2}>
          <BrowserShot src={s.src} url={url} caption={s.cap} local={frame - (INTRO + i * shotLen)} len={shotLen} accent={accent2} />
        </Sequence>
      ))}

      {/* small persistent title chip during shots */}
      {frame >= INTRO && frame < OUTRO && (
        <div style={{ position: "absolute", top: 30, left: 40, fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, color: INK }}>
          {title}<span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: accent, marginLeft: 10 }}>TRAILER</span>
        </div>
      )}

      {/* OUTRO */}
      {frame >= OUTRO && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: outroOp }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 92, color: INK }}>{title}</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: INKSOFT, marginTop: 8 }}>{tagline}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 30, borderTop: `2px solid #cabfa8`, paddingTop: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 22, color: accent2 }}>AA</span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 1, color: INK }}>syed abdullah ahmed</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
