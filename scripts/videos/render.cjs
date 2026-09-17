// Render educational MP4s, posters, captions and a source-linked manifest together.
const { bundle } = require("@remotion/bundler");
const {
  getCompositions,
  renderMedia,
  renderStill,
} = require("@remotion/renderer");
const fs = require("node:fs");
const crypto = require("node:crypto");
const lessons = require("../../remotion/lesson-data.json");
const ids = [
  "V7-A-legacy-c",
  "V7-C-build",
  "V7-E-unit-test",
  "V7-H-docs",
  "V11-install",
];
const timestamp = (s) =>
  `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}.000`;
(async () => {
  const serveUrl = await bundle({ entryPoint: "remotion/index.ts" });
  const browserExecutable =
    process.env.REMOTION_BROWSER_EXECUTABLE || "/usr/bin/google-chrome";
  const compositions = await getCompositions(serveUrl, { browserExecutable });
  fs.mkdirSync("public/videos/posters", { recursive: true });
  const manifest = [];
  for (const id of ids) {
    const composition = compositions.find((c) => c.id === id);
    const lesson = lessons.find((l) => l.id === id);
    const outputLocation = `public/videos/${id}.mp4`;
    await renderMedia({
      serveUrl,
      composition,
      inputProps: composition.props,
      browserExecutable,
      outputLocation,
      codec: "h264",
      crf: 20,
      concurrency: 4,
    });
    await renderStill({
      serveUrl,
      composition,
      inputProps: composition.props,
      browserExecutable,
      output: `public/videos/posters/${id}.jpg`,
      frame: 120,
      imageFormat: "jpeg",
    });
    const cues = lesson.scenes.map((s, i) => ({
      second: i * lesson.sceneSeconds,
      title: s.title,
    }));
    fs.writeFileSync(
      `public/videos/${id}.vtt`,
      "WEBVTT\n\n" +
        lesson.scenes
          .map(
            (s, i) =>
              `${i + 1}\n${timestamp(i * lesson.sceneSeconds)} --> ${timestamp((i + 1) * lesson.sceneSeconds)}\n${s.title}\n${s.points.join("\n")}\n`,
          )
          .join("\n"),
    );
    manifest.push({
      id,
      kind: lesson.kind,
      duration: composition.durationInFrames / composition.fps,
      sha256: crypto
        .createHash("sha256")
        .update(fs.readFileSync(outputLocation))
        .digest("hex"),
      source: lesson.source,
      cues,
    });
    console.log(
      `${id}: ${composition.durationInFrames / composition.fps}s rendered`,
    );
  }
  fs.writeFileSync(
    "public/videos/manifest.json",
    JSON.stringify(manifest, null, 2) + "\n",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
