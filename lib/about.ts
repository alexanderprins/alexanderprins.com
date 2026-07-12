// About / homepage narrative copy. Alexander's own voice, verbatim.
// DO NOT AI-polish. Contractions and phrasing are intentional (human voice
// is the point; panel: "if AI wrote it, I'll know"). No em dashes.

// NOTE: the homepage hero (app/page.tsx) renders this sentence as JSX so
// "motion" and "video" can be inline links — keep the two in sync.
export const positioning =
  "I specialize in brand design, can ship production code with Claude Code, and have strengths in motion and video.";

// bio[1] is mirrored in app/about/page.tsx, where "Shift Nudge" and
// "Matt D. Smith" render as inline links (same convention as the hero).
export const bio: string[] = [
  `I'm an engineer who never learned to code. I think in systems and structure but express it through design: brand identities, websites, motion. I care less about the line between designer and builder than about making the work real and out in the world. That pull has moved me closer and closer to the code itself. Tools like Claude Code and Cursor have unlocked a new level of execution for me, and working in the terminal is the most exciting shift in how I make things right now. It's a great time to be a designer.`,
  `Underneath all of it is one pattern I've repeated my whole life: play, discover, systematize. I prototype, find what's working, then build a repeatable system around it. Currently I make video and motion content for Shift Nudge, a product design education company founded by Matt D. Smith, while building brands and websites for clients when I can. I live in Des Moines, Iowa, with my wife and daughter. Also, unfortunately, I'm a lifelong Colorado Rockies fan.`,
];
