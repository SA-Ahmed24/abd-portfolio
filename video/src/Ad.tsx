import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  continueRender,
  delayRender,
} from "remotion";

/* ----------------------------------------------------------------------------
   AD-style promo template for portfolio projects.
   Cream paper + Pakistan green + gold, Fraunces display — matches the site.
   One component, fed per-project props from Root.tsx.
---------------------------------------------------------------------------- */

// ---- fonts (loaded from Google Fonts, with a robust fallback) ----
const fontHandle = delayRender("google-fonts");
if (typeof document !== "undefined") {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    continueRender(fontHandle);
  };
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap";
  link.onload = () => {
    try {
      (document as any).fonts.ready.then(finish);
    } catch {
      finish();
    }
  };
  link.onerror = finish;
  document.head.appendChild(link);
  setTimeout(finish, 6000);
} else {
  continueRender(fontHandle);
}

const DISPLAY = "'Fraunces', Georgia, serif";
const SERIF = "'Instrument Serif', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const PAPER = "#faf6ec";
const PAPER2 = "#f3ecd9";
const INK = "#1a1714";
const INKSOFT = "#5b554b";
const LINE = "#cabf a8".replace(" ", "");

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ============================ MOCK UIs ============================
const Dots: React.FC<{ c?: string }> = () => (
  <div style={{ display: "flex", gap: 6 }}>
    {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
      <div key={c} style={{ width: 9, height: 9, borderRadius: 9, background: c }} />
    ))}
  </div>
);

const Stars: React.FC<{ filled: number; size?: number; color?: string }> = ({
  filled,
  size = 16,
  color = "#e8b923",
}) => (
  <div style={{ display: "flex", gap: 1 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <span key={i} style={{ color: i < filled ? color : "#d8cdb0", fontSize: size, lineHeight: 1 }}>
        ★
      </span>
    ))}
  </div>
);

const AiMock: React.FC<{ frame: number; accent: string; accent2: string }> = ({ frame, accent, accent2 }) => {
  const b1 = interpolate(frame, [104, 120], [0, 1], clamp);
  const b2 = interpolate(frame, [140, 156], [0, 1], clamp);
  const typed = "Dear team — I'm Abdullah, a developer who ships with care and curiosity…";
  const n = Math.floor(interpolate(frame, [158, 250], [0, typed.length], clamp));
  const chip = interpolate(frame, [262, 280], [0, 1], clamp);
  return (
    <div style={{ padding: "18px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          alignSelf: "flex-end",
          maxWidth: "78%",
          background: accent2,
          color: INK,
          padding: "10px 14px",
          borderRadius: "14px 14px 4px 14px",
          fontFamily: SERIF,
          fontSize: 21,
          opacity: b1,
          transform: `translateY(${(1 - b1) * 12}px)`,
        }}
      >
        write my cover letter
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          maxWidth: "86%",
          background: accent,
          color: PAPER,
          padding: "12px 15px",
          borderRadius: "14px 14px 14px 4px",
          fontFamily: SERIF,
          fontSize: 21,
          lineHeight: 1.4,
          opacity: b2,
          transform: `translateY(${(1 - b2) * 12}px)`,
          minHeight: 92,
        }}
      >
        {typed.slice(0, n)}
        <span style={{ opacity: n < typed.length ? 1 : 0 }}>▍</span>
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          opacity: chip,
          transform: `translateY(${(1 - chip) * 10}px)`,
          fontFamily: MONO,
          fontSize: 13,
          color: INK,
          background: "#fff",
          border: `1.5px solid ${INK}`,
          borderRadius: 20,
          padding: "5px 12px",
        }}
      >
        ▸ memory: 4 projects · 3 roles
      </div>
    </div>
  );
};

const RentezMock: React.FC<{ frame: number; accent: string; accent2: string }> = ({ frame, accent, accent2 }) => {
  const rows = [
    { name: "M. Tasic", rating: 5, color: "#1d6f6b" },
    { name: "A. Khan", rating: 4, color: "#8b1a1a" },
    { name: "J. Doe", rating: 2, color: "#7a5a2a" },
  ];
  const addGlow = Math.sin(interpolate(frame, [220, 320], [0, Math.PI * 4], clamp)) * 0.5 + 0.5;
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 11 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: INKSOFT }}>TENANTS</div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: INKSOFT, border: `1px solid ${LINE}`, borderRadius: 12, padding: "3px 10px" }}>search ⌕</div>
      </div>
      {rows.map((r, i) => {
        const ap = interpolate(frame, [104 + i * 22, 120 + i * 22], [0, 1], clamp);
        const filled = Math.floor(interpolate(frame, [118 + i * 22, 150 + i * 22], [0, r.rating], clamp));
        return (
          <div
            key={r.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#fff",
              border: `1.5px solid ${LINE}`,
              borderRadius: 10,
              padding: "10px 12px",
              opacity: ap,
              transform: `translateX(${(1 - ap) * 24}px)`,
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 34, background: r.color, color: "#fff", fontFamily: DISPLAY, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              {r.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 17, color: INK }}>{r.name}</div>
              <Stars filled={filled} size={14} color={accent2} />
            </div>
            {i === 0 && (
              <div style={{ fontFamily: MONO, fontSize: 10, color: "#fff", background: accent, borderRadius: 10, padding: "3px 8px" }}>credit ✓</div>
            )}
          </div>
        );
      })}
      <div
        style={{
          marginTop: 2,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 13,
          color: "#fff",
          background: accent2,
          borderRadius: 10,
          padding: "10px 0",
          boxShadow: `0 0 ${10 + addGlow * 16}px rgba(216,119,6,${0.3 + addGlow * 0.4})`,
        }}
      >
        + add tenant
      </div>
    </div>
  );
};

const CricketMock: React.FC<{ frame: number; accent: string; accent2: string }> = ({ frame, accent, accent2 }) => {
  const players = [
    { name: "Abdullah", ok: true },
    { name: "Bilal", ok: true },
    { name: "Hamza", ok: false },
    { name: "Zaid", ok: true },
  ];
  const head = interpolate(frame, [100, 116], [0, 1], clamp);
  const stamp = spring({ frame: frame - 250, fps: 30, config: { damping: 120 } });
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ opacity: head, background: accent, color: PAPER, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 1, opacity: 0.85 }}>SAT · 2:00 PM</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 22 }}>vs Eagles CC</div>
      </div>
      {players.map((p, i) => {
        const ap = interpolate(frame, [120 + i * 20, 136 + i * 20], [0, 1], clamp);
        const flip = interpolate(frame, [150 + i * 20, 166 + i * 20], [0, 1], clamp);
        return (
          <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: `1.5px solid ${LINE}`, borderRadius: 9, padding: "9px 13px", opacity: ap }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 17, color: INK }}>{p.name}</span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                background: p.ok ? accent : "#8b1a1a",
                borderRadius: 20,
                width: 26,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: flip,
                transform: `scale(${0.5 + flip * 0.5})`,
              }}
            >
              {p.ok ? "✓" : "✗"}
            </span>
          </div>
        );
      })}
      <div style={{ textAlign: "center", marginTop: 4, opacity: stamp, transform: `scale(${0.6 + stamp * 0.4}) rotate(${-8 + stamp * 8}deg)` }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: 2, color: accent2, border: `2.5px solid ${accent2}`, borderRadius: 8, padding: "6px 16px", display: "inline-block" }}>
          XI LOCKED ✓
        </span>
      </div>
    </div>
  );
};

const MovieMock: React.FC<{ frame: number; accent: string; accent2: string }> = ({ frame, accent2 }) => {
  const grad = [
    "linear-gradient(135deg,#2a1a3a,#5a2a5a)",
    "linear-gradient(135deg,#1a2a3e,#2a3a5a)",
    "linear-gradient(135deg,#3a1a1a,#6a2a2a)",
    "linear-gradient(135deg,#1a3a2a,#2a5a3a)",
    "linear-gradient(135deg,#3a2a1a,#6a4a1a)",
    "linear-gradient(135deg,#2a2a3a,#444466)",
  ];
  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {grad.map((g, i) => {
          const pop = spring({ frame: frame - (104 + i * 9), fps: 30, config: { damping: 120 } });
          const stars = Math.floor(interpolate(frame, [180 + i * 8, 210 + i * 8], [0, [5, 4, 5, 3, 4, 5][i]], clamp));
          return (
            <div key={i} style={{ opacity: pop, transform: `scale(${0.7 + pop * 0.3})` }}>
              <div style={{ height: 120, borderRadius: 8, background: g, border: `1.5px solid ${INK}` }} />
              <div style={{ marginTop: 5, display: "flex", justifyContent: "center" }}>
                <Stars filled={stars} size={11} color={accent2} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NutriMock: React.FC<{ frame: number; accent: string; accent2: string }> = ({ frame, accent, accent2 }) => {
  const bars = [
    { label: "prot", h: 0.85, c: accent },
    { label: "carb", h: 0.6, c: accent2 },
    { label: "fat", h: 0.45, c: "#8b1a1a" },
    { label: "cals", h: 0.95, c: accent },
  ];
  const ringPct = interpolate(frame, [150, 250], [0, 78], clamp);
  const R = 46;
  const circ = 2 * Math.PI * R;
  const tag = interpolate(frame, [270, 288], [0, 1], clamp);
  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: INKSOFT }}>TODAY</div>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-end", height: 150 }}>
          {bars.map((b, i) => {
            const gh = interpolate(frame, [110 + i * 14, 150 + i * 14], [0, b.h], clamp);
            return (
              <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 26, height: 130 * gh, background: b.c, borderRadius: "5px 5px 0 0" }} />
                <span style={{ fontFamily: MONO, fontSize: 11, color: INKSOFT }}>{b.label}</span>
              </div>
            );
          })}
        </div>
        <svg width={116} height={116} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={58} cy={58} r={R} fill="none" stroke="#e2d8bd" strokeWidth={12} />
          <circle cx={58} cy={58} r={R} fill="none" stroke={accent} strokeWidth={12} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - ringPct / 100)} />
          <text x={58} y={58} transform="rotate(90 58 58)" textAnchor="middle" dominantBaseline="central" fontFamily={DISPLAY} fontWeight={600} fontSize={26} fill={INK}>
            {Math.round(ringPct)}%
          </text>
        </svg>
      </div>
      <div style={{ alignSelf: "flex-start", opacity: tag, fontFamily: MONO, fontSize: 12, color: "#fff", background: accent, borderRadius: 16, padding: "5px 12px" }}>
        adapter pattern ✓
      </div>
    </div>
  );
};

const MOCKS: Record<string, React.FC<{ frame: number; accent: string; accent2: string }>> = {
  ai: AiMock,
  rentez: RentezMock,
  cricket: CricketMock,
  movie: MovieMock,
  nutri: NutriMock,
};

// ============================ AD ============================
export const Ad: React.FC<any> = (props) => {
  const { kicker, title, tagline, blurb, features = [], tech, accent = "#01411c", accent2 = "#e8b923", mock, contribution } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introOp = interpolate(frame, [0, 12, 60, 76], [0, 1, 1, 0], clamp);
  const mainOp = interpolate(frame, [74, 92, 384, 400], [0, 1, 1, 0], clamp);
  const outroOp = interpolate(frame, [392, 410], [0, 1], clamp);

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });
  const underline = interpolate(frame, [16, 46], [0, 1], clamp);

  const Mock = MOCKS[mock] || AiMock;

  return (
    <AbsoluteFill style={{ background: PAPER, fontFamily: SERIF }}>
      {/* paper texture + vignette */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(120,90,30,0.12)" }} />
      {/* gold top + green bottom rule */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: accent2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: accent }} />

      {/* -------- INTRO -------- */}
      <AbsoluteFill style={{ opacity: introOp, alignItems: "center", justifyContent: "center", padding: 80 }}>
        <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 6, color: accent, marginBottom: 22 }}>{kicker}</div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: title.length > 14 ? 78 : 104,
            color: INK,
            lineHeight: 1,
            textAlign: "center",
            transform: `translateY(${(1 - titleSpring) * 36}px)`,
          }}
        >
          {String(title).toLowerCase()}.
        </div>
        <div style={{ height: 6, width: 280 * underline, background: accent2, marginTop: 26, borderRadius: 3 }} />
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: INKSOFT, marginTop: 26, textAlign: "center" }}>
          {tagline}
        </div>
      </AbsoluteFill>

      {/* -------- MAIN -------- */}
      <AbsoluteFill style={{ opacity: mainOp, padding: "54px 64px" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, borderBottom: `2px solid ${INK}`, paddingBottom: 14 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: INK }}>{String(title).toLowerCase()}.</div>
          <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: accent }}>{kicker}</div>
        </div>

        <div style={{ display: "flex", gap: 34, marginTop: 30 }}>
          {/* left: blurb + features */}
          <div style={{ width: 430 }}>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 28, lineHeight: 1.35, color: INK }}>{blurb}</div>
            <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
              {features.map((f: string, i: number) => {
                const ap = interpolate(frame, [120 + i * 30, 140 + i * 30], [0, 1], clamp);
                return (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", opacity: ap, transform: `translateX(${(1 - ap) * 22}px)` }}>
                    <span style={{ color: accent2, fontSize: 20, lineHeight: 1.1 }}>▸</span>
                    <span style={{ fontFamily: MONO, fontSize: 17, color: INK, lineHeight: 1.3 }}>{f}</span>
                  </div>
                );
              })}
            </div>
            {contribution ? (
              <div style={{ marginTop: 24, display: "inline-block", fontFamily: MONO, fontSize: 13, color: "#fff", background: accent, borderRadius: 18, padding: "6px 14px", opacity: interpolate(frame, [300, 320], [0, 1], clamp) }}>
                {contribution}
              </div>
            ) : null}
          </div>

          {/* right: mock card */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 432,
                background: PAPER2,
                border: `3px solid ${INK}`,
                borderRadius: 14,
                boxShadow: `10px 10px 0 ${INK}`,
                overflow: "hidden",
                transform: `translateY(${interpolate(frame, [88, 110], [30, 0], clamp)}px)`,
                opacity: interpolate(frame, [88, 110], [0, 1], clamp),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `2px solid ${INK}`, background: "#efe6cf" }}>
                <Dots />
                <span style={{ fontFamily: MONO, fontSize: 11, color: INKSOFT }}>{mock}.app</span>
              </div>
              <Mock frame={frame} accent={accent} accent2={accent2} />
            </div>
          </div>
        </div>

        {/* tech ticker */}
        <div style={{ position: "absolute", left: 64, bottom: 40, opacity: interpolate(frame, [300, 320], [0, 1], clamp) }}>
          <span style={{ fontFamily: MONO, fontSize: 15, color: INKSOFT }}>built with </span>
          <span style={{ fontFamily: MONO, fontSize: 15, color: INK, fontWeight: 500 }}>{tech}</span>
        </div>
      </AbsoluteFill>

      {/* -------- OUTRO -------- */}
      <AbsoluteFill style={{ opacity: outroOp, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 96, height: 96, borderRadius: 22, background: accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `6px 6px 0 ${INK}` }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 44, color: accent2 }}>AA</span>
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 40, color: INK, marginTop: 26 }}>Syed Abdullah Ahmed</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 26, color: INKSOFT, marginTop: 6 }}>software engineer · builder</div>
        <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: accent, marginTop: 26, borderTop: `2px solid ${LINE}`, paddingTop: 16 }}>
          see it live + the code →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
