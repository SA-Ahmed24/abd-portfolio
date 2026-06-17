import React from "react";
import { Composition } from "remotion";
import { Ad } from "./Ad";

// One parameterized AD composition per project. Render with:
//   npx remotion render src/index.ts ad-<slug> out/<slug>.mp4
export const PROJECTS = [
  {
    slug: "agent-twin",
    kicker: "AI · PYTHON",
    title: "Agent Twin",
    tagline: "an AI version of me.",
    blurb: "it learns how i write, remembers what i've done, and drafts anything in my own voice.",
    features: [
      "learns my writing style",
      "remembers my experiences",
      "drafts resumes, emails & posts",
      "clones my voice for recruiters",
    ],
    tech: "django · DRF · gemini · elevenlabs",
    accent: "#01411c",
    accent2: "#e8b923",
    mock: "ai",
    contribution: "",
  },
  {
    slug: "rentez",
    kicker: "FULL-STACK · TEAM",
    title: "RentEz",
    tagline: "screen tenants before a bad one costs you.",
    blurb: "landlords review tenants with ratings backed by real credit + bankruptcy data.",
    features: [
      "multi-criteria tenant reviews",
      "credit + bankruptcy backed",
      "lease & evidence uploads",
      "email outreach to good tenants",
    ],
    tech: "react · node · postgresql · auth0",
    accent: "#01411c",
    accent2: "#d97706",
    mock: "rentez",
    contribution: "my part — the tenant-creation flow",
  },
  {
    slug: "squadhub",
    kicker: "FULL-STACK",
    title: "SquadHub",
    tagline: "run your cricket club, not a whatsapp group.",
    blurb: "seasons, fixtures, availability and squad selection — all in one place.",
    features: [
      "captain & player roles",
      "fixtures + availability",
      "squad selection tool",
      "season stats",
    ],
    tech: "django · postgres · javascript",
    accent: "#01411c",
    accent2: "#e8b923",
    mock: "cricket",
    contribution: "",
  },
  {
    slug: "movie-review-site",
    kicker: "FULL-STACK",
    title: "Movie Review Site",
    tagline: "my own little letterboxd.",
    blurb: "browse, rate and review films, with profiles and a community voting system.",
    features: [
      "user profiles via signals",
      "rate & review films",
      "up/down voting → rankings",
      "search + pagination",
    ],
    tech: "django · uuid · sqlite",
    accent: "#8b1a1a",
    accent2: "#e8b923",
    mock: "movie",
    contribution: "",
  },
  {
    slug: "nutrisci",
    kicker: "JAVA · TEAM",
    title: "NutriSci",
    tagline: "nutrition tracking, designed properly.",
    blurb: "a java app for york's software design course — patterns over hacks.",
    features: [
      "goal setting & tracking",
      "healthier food-swap engine",
      "stats + graphs",
      "adapter pattern, clean design",
    ],
    tech: "java · OOP · design patterns",
    accent: "#01411c",
    accent2: "#d97706",
    mock: "nutri",
    contribution: "team project · eecs3311",
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {PROJECTS.map((p) => (
        <Composition
          key={p.slug}
          id={`ad-${p.slug}`}
          component={Ad as any}
          durationInFrames={450}
          fps={30}
          width={1024}
          height={768}
          defaultProps={p as any}
        />
      ))}
    </>
  );
};
