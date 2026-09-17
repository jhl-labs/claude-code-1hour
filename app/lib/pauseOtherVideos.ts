/** Keep independently mounted practice players from speaking over each other. */
export function pauseOtherVideos(current: HTMLVideoElement) {
  document.querySelectorAll('video').forEach((video) => {
    if (video !== current) video.pause();
  });
}
