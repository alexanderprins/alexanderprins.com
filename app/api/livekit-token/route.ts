import { NextRequest, NextResponse } from "next/server";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";

// Mints a short-lived pass for one visitor to talk to the portfolio voice agent
// (projects/livekit-portfolio-agent). The response follows LiveKit's standard token
// endpoint format, so the client's TokenSource.endpoint() can read it directly.
//
// The agent to dispatch is fixed here on the server: whatever the browser sends, the
// pass only ever calls the portfolio agent, in a fresh room of its own.
// Env: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET (Vercel + .env.local).
// LIVEKIT_AGENT_DEPLOYMENT is for local testing only: the `dev-...` deployment that
// `lk agent dev` prints. Leave it unset in production to reach the deployed agent.

const AGENT_NAME = "livekit-portfolio-agent";

export async function POST(request: NextRequest) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL;
  if (!apiKey || !apiSecret || !serverUrl) {
    return NextResponse.json({ error: "Voice is not configured" }, { status: 500 });
  }

  // Only this site may ask for a pass (a browser always sends Origin on a POST).
  const origin = request.headers.get("origin") ?? "";
  const allowed =
    /^https:\/\/(www\.)?alexanderprins\.com$/.test(origin) ||
    /^http:\/\/localhost(:\d+)?$/.test(origin);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = crypto.randomUUID();
  const at = new AccessToken(apiKey, apiSecret, {
    identity: `visitor-${id}`,
    name: "Visitor",
    ttl: "10m",
  });
  at.addGrant({ roomJoin: true, room: `portfolio-${id}`, canPublish: true, canSubscribe: true });
  at.roomConfig = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({
        agentName: AGENT_NAME,
        deployment: process.env.LIVEKIT_AGENT_DEPLOYMENT ?? "",
      }),
    ],
  });

  return NextResponse.json(
    { server_url: serverUrl, participant_token: await at.toJwt() },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
