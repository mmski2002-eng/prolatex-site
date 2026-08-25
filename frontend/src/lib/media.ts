// Разрешение видео/постеров в public/video. Работает на сервере (fs), деградирует
// мягко, если файла ещё нет (сборка медиа может идти параллельно).
import fs from "fs";
import path from "path";

function slugifyFilename(name: string): string {
  const noExt = name.replace(/\.[^/.]+$/, "");
  return noExt
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const videoDir = path.join(process.cwd(), "public", "video");
const posterDir = path.join(videoDir, "posters");

function safeReaddir(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

const availableVideos = new Set(
  safeReaddir(videoDir).filter((f) => f.toLowerCase().endsWith(".mp4"))
);
const availablePosters = new Set(
  safeReaddir(posterDir).filter((f) => f.toLowerCase().endsWith(".jpg"))
);

export interface ResolvedMedia {
  videoSrc: string | null;
  posterSrc: string | null;
}

/** originalFilename — как записано в content.json (production_videos[].file, technologies[].video) */
export function resolveVideo(originalFilename: string): ResolvedMedia {
  const base = slugifyFilename(originalFilename);
  const videoFile = `${base}.mp4`;
  const posterFile = `${base}.jpg`;
  return {
    videoSrc: availableVideos.has(videoFile) ? `/video/${videoFile}` : null,
    posterSrc: availablePosters.has(posterFile)
      ? `/video/posters/${posterFile}`
      : null,
  };
}
