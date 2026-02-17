/**
 * Bunny.net Stream integration.
 * - Playback: use Bunny embed URL in VideoPlayer (via video-url.ts).
 * - Create/upload: optional; for production, use a backend to keep API key secret.
 */

const BUNNY_VIDEO_API = "https://video.bunnycdn.com";
const BUNNY_EMBED_BASE = "https://iframe.mediadelivery.net/embed";

export function getBunnyLibraryId(): string {
  const id = import.meta.env.VITE_BUNNY_LIBRARY_ID;
  return typeof id === "string" ? id.trim() : "";
}

export function getBunnyStreamApiKey(): string {
  const key = import.meta.env.VITE_BUNNY_STREAM_API_KEY;
  return typeof key === "string" ? key.trim() : "";
}

/** Build Bunny Stream embed URL for playback. */
export function buildBunnyEmbedUrl(libraryId: string, videoId: string): string {
  return `${BUNNY_EMBED_BASE}/${libraryId}/${videoId}`;
}

/** Create a video object in Bunny Stream. Returns the new video's GUID. */
export async function createBunnyVideo(title: string): Promise<{ guid: string }> {
  const libraryId = getBunnyLibraryId();
  const apiKey = getBunnyStreamApiKey();
  if (!libraryId || !apiKey) {
    throw new Error("Bunny Stream: set VITE_BUNNY_LIBRARY_ID and VITE_BUNNY_STREAM_API_KEY in .env");
  }

  const res = await fetch(`${BUNNY_VIDEO_API}/library/${libraryId}/videos`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      AccessKey: apiKey,
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bunny create video failed: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { guid: string };
  if (!data?.guid) throw new Error("Bunny create video: no guid in response");
  return { guid: data.guid };
}

/** Upload video file to an existing Bunny Stream video. */
export async function uploadBunnyVideoFile(
  libraryId: string,
  videoId: string,
  file: File
): Promise<void> {
  const apiKey = getBunnyStreamApiKey();
  if (!apiKey) throw new Error("Bunny Stream: set VITE_BUNNY_STREAM_API_KEY in .env");

  const res = await fetch(
    `${BUNNY_VIDEO_API}/library/${libraryId}/videos/${videoId}`,
    {
      method: "PUT",
      headers: {
        AccessKey: apiKey,
        "Content-Type": "application/octet-stream",
      },
      body: file,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bunny upload failed: ${res.status} ${err}`);
  }
}

/** Create video + upload file, return embed URL for storage. */
export async function createAndUploadBunnyVideo(
  title: string,
  file: File
): Promise<string> {
  const libraryId = getBunnyLibraryId();
  if (!libraryId) throw new Error("Bunny Stream: set VITE_BUNNY_LIBRARY_ID in .env");

  const { guid } = await createBunnyVideo(title);
  await uploadBunnyVideoFile(libraryId, guid, file);
  return buildBunnyEmbedUrl(libraryId, guid);
}
