import { NextRequest, NextResponse } from "next/server";

// Unsplash helper for the Thatch Pathways tool (public/thatch/pathways).
// The browser asks this route, and this route asks Unsplash with the key, so the key
// never reaches the browser. Env: UNSPLASH_ACCESS_KEY (the Access Key, never the Secret Key).
// Only three requests are allowed: one photo by id, a search, and the download ping
// Unsplash asks apps to send when a photo is used. GET with no params = "is it set up?"

const API = "https://api.unsplash.com";
const ID = /^[A-Za-z0-9_-]{6,32}$/;

export async function GET(request: NextRequest) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return NextResponse.json({ error: "Unsplash is not configured" }, { status: 503 });

  // Only pages on this site may use it (browsers mark requests from other sites).
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const params = request.nextUrl.searchParams;
  const id = params.get("id");
  const q = params.get("q");
  const track = params.get("track");

  let path: string;
  let cacheSeconds = 0;
  if (id) {
    if (!ID.test(id)) return NextResponse.json({ error: "Bad photo id" }, { status: 400 });
    path = `/photos/${id}`;
    cacheSeconds = 86400; // a photo's details rarely change
  } else if (q) {
    if (q.length > 80) return NextResponse.json({ error: "Search too long" }, { status: 400 });
    path = `/search/photos?per_page=12&query=${encodeURIComponent(q)}`;
    cacheSeconds = 3600;
  } else if (track) {
    if (!ID.test(track)) return NextResponse.json({ error: "Bad photo id" }, { status: 400 });
    path = `/photos/${track}/download`;
  } else {
    return NextResponse.json({ ok: true });
  }

  const res = await fetch(API + path, {
    headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
    cache: "no-store",
  });
  if (!res.ok) {
    // Unsplash answers 403 when the hourly limit (50 in demo mode) is used up.
    const status = res.status === 404 ? 404 : res.status === 403 ? 429 : 502;
    return NextResponse.json({ error: `Unsplash error ${res.status}` }, { status });
  }
  // Repeat lookups are served from Vercel's cache, so they don't count against the limit.
  return NextResponse.json(await res.json(), {
    headers: cacheSeconds
      ? { "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds}` }
      : { "Cache-Control": "no-store" },
  });
}
