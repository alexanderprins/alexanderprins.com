"use client";

// "Talk to my portfolio": a live voice call with the portfolio agent
// (projects/livekit-portfolio-agent), drawn as the PDS stipple shape.
// The shape is the agent's state, the light is the voice:
//   Play        circle   listening  (glows with the visitor's mic)
//   Discover    square   thinking
//   Systematize triangle speaking   (glows with the agent's voice)
// The tile is always dark, so its text is always light (whatever page it's on).
// Captions run under it so it works with the sound off. A call ends itself after
// CALL_LIMIT_MS so one visitor can't drain the month's free minutes.
// The pass comes from /api/livekit-token; the Three.js lives in morphEngine.ts.

import { useEffect, useRef, useState } from "react";
import { TokenSource } from "livekit-client";
import {
  RoomAudioRenderer,
  SessionProvider,
  useAgent,
  useSession,
  useSessionMessages,
  useTrackVolume,
} from "@livekit/components-react";
import { prefersReducedMotion } from "@/lib/stipple";
import { MORPH_DEFAULTS as D, SHAPE, mountMorph, type MorphControls } from "./home/morphEngine";

const AGENT_NAME = "livekit-portfolio-agent";
const CALL_LIMIT_MS = 3 * 60 * 1000;
const EMAIL = "hello@alexanderprins.com";
const tokenSource = TokenSource.endpoint("/api/livekit-token");

const PDS = [
  { word: "Play", state: "Listening", shape: SHAPE.sphere, icon: <circle cx="4.5" cy="4.5" r="4.5" /> },
  { word: "Discover", state: "Thinking", shape: SHAPE.cube, icon: <rect x="0.5" y="0.5" width="8" height="8" /> },
  { word: "Systematize", state: "Speaking", shape: SHAPE.pyramid, icon: <polygon points="4.5,0.5 9,8.5 0,8.5" /> },
];

export function VoiceMorph({ paper = "#111111" }: { paper?: string }) {
  const session = useSession(tokenSource, { agentName: AGENT_NAME, agentConnectTimeoutMilliseconds: 25_000 });
  return (
    <SessionProvider session={session}>
      <Stage session={session} paper={paper} />
      <RoomAudioRenderer />
    </SessionProvider>
  );
}

function Stage({ session, paper }: { session: ReturnType<typeof useSession>; paper: string }) {
  const agent = useAgent(session);
  const { messages } = useSessionMessages(session);
  const agentLevel = useTrackVolume(agent.microphoneTrack);
  const micLevel = useTrackVolume(session.isConnected ? session.local.microphoneTrack : undefined);

  const stage = useRef<HTMLDivElement>(null);
  const morph = useRef<MorphControls | null>(null);
  const level = useRef(0);
  const [note, setNote] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  // the agent never arrived or dropped (including when the month's free minutes run
  // out): remember it while rendering, so the message outlives the session ending
  const [failed, setFailed] = useState(false);
  if (agent.state === "failed" && !failed) setFailed(true);

  const live = session.isConnected || starting;
  // which PDS step is "on": listening (or still connecting) = Play
  const phase = agent.state === "speaking" ? 2 : agent.state === "thinking" ? 1 : 0;

  // the voice that should light the shape right now (read by the frame loop below)
  useEffect(() => {
    level.current = agent.state === "speaking" ? agentLevel : agent.state === "listening" ? micLevel : 0;
  }, [agent.state, agentLevel, micLevel]);

  useEffect(() => {
    if (!stage.current) return;
    const m = mountMorph(stage.current, { reducedMotion: prefersReducedMotion(), ink: "#ffffff", paper });
    m.setParams({ quality: 1, size: 0.62 }); // smaller than the hero, so captions get clear space
    morph.current = m;
    // ease the light toward the voice level every frame (uniform-only, cheap)
    let raf = 0;
    let glow = 0;
    const tick = () => {
      glow += (level.current - glow) * 0.25;
      m.setParams({ tone: D.tone + glow * 1.1, contrast: D.contrast + glow * 1.5 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      m.dispose();
    };
  }, [paper]);

  useEffect(() => morph.current?.setShape(PDS[live ? phase : 0].shape), [phase, live]);

  // the per-call time limit
  useEffect(() => {
    if (!session.isConnected) return;
    const t = setTimeout(() => {
      setNote(`That's the time limit for one call. For more, email Alex at ${EMAIL}.`);
      session.end();
    }, CALL_LIMIT_MS);
    return () => clearTimeout(t);
  }, [session.isConnected, session]);

  useEffect(() => {
    if (agent.state === "failed") session.end();
  }, [agent.state, session]);

  const start = async () => {
    setNote(null);
    setFailed(false);
    setStarting(true);
    try {
      await session.start({ tracks: { microphone: { enabled: true } } });
    } catch {
      setNote(`Couldn't start the call. Check your microphone permission, or email Alex at ${EMAIL}.`);
    } finally {
      setStarting(false);
    }
  };

  const lastAgent = [...messages].reverse().find((m) => m.type === "agentTranscript");
  const lastUser = [...messages].reverse().find((m) => m.type === "userTranscript");

  return (
    <div className="relative aspect-video w-full overflow-hidden" style={{ background: paper }}>
      {/* the canvas overscans its box vertically (morphEngine.ts); the tile clips it */}
      <div ref={stage} aria-hidden="true" className="pointer-events-none absolute inset-0" />

      {/* PDS steps, top left: which one the agent is in */}
      <ul className="absolute left-4 top-4 flex gap-1 text-sm leading-6" aria-hidden={!live}>
        {PDS.map((p, i) => {
          const on = live && i === phase;
          return (
            <li
              key={p.word}
              className={`flex items-center gap-2 rounded-full px-2.5 transition-colors duration-300 ${
                on ? "bg-white text-[#111]" : "text-white/40"
              }`}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" aria-hidden="true">
                {p.icon}
              </svg>
              {p.word}
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="polite">
        {live ? PDS[phase].state : ""}
      </p>

      {/* captions + the call button, bottom */}
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-6">
        <div className="min-h-12 max-w-[60ch] text-sm leading-6" aria-live="polite">
          {live && lastUser ? <p className="line-clamp-1 text-white/40">{lastUser.message}</p> : null}
          {live && lastAgent ? <p className="line-clamp-2 text-white">{lastAgent.message}</p> : null}
          {!live && failed ? (
            <p className="text-white/60">The guide can&apos;t take calls right now. Email Alex at {EMAIL}.</p>
          ) : null}
          {!live && !failed && note ? <p className="text-white/60">{note}</p> : null}
          {!live && !failed && !note ? (
            <p className="text-white/60">Ask about Alex&apos;s work. It answers out loud, in about three minutes or less.</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={live ? () => session.end() : start}
          disabled={starting}
          className={`flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm transition-colors ${
            live ? "border border-white/30 text-white hover:bg-white/10" : "bg-white text-[#111] hover:bg-white/80"
          } disabled:cursor-wait disabled:opacity-60`}
        >
          {starting ? "Connecting…" : live ? "End call" : "Talk to my portfolio"}
        </button>
      </div>
    </div>
  );
}
