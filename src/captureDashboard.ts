import { mapView } from "./components/MapDisplay";

// ----------------------------------------------------
// QUALITY SETTINGS (tweak these)
// ----------------------------------------------------
const HI_RES_MAP = true;   // re-render the map with ArcGIS (sharper map)
const MAP_SCALE = 2;       // map render size vs. screen: 1.5 = faster, 2 = sharper
const FRAMES = 20;         // video frames to wait for (more = sharper panels)
const FORMAT: "jpeg" | "png" = "jpeg"; // "png" = lossless but slower to save
const JPEG_QUALITY = 0.98;
const MAX_SIDE = 6000;     // cap on the longest side, in pixels

function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
}

/** Local date as YYYY-MM-DD (avoids the UTC day shift of toISOString) */
function localDateStamp() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Smallest rectangle (viewport coordinates) containing all elements */
function unionRect(elements: HTMLElement[]) {
  const rects = elements.map((el) => el.getBoundingClientRect());
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return { left, top, width: right - left, height: bottom - top };
}

/** Waits for N real video frames so the stream has time to sharpen */
function waitForFrames(video: HTMLVideoElement, count: number) {
  return new Promise<void>((resolve) => {
    if (!("requestVideoFrameCallback" in video)) {
      setTimeout(resolve, 900);
      return;
    }
    let seen = 0;
    const tick = () => {
      seen += 1;
      if (seen >= count) resolve();
      else (video as any).requestVideoFrameCallback(tick);
    };
    (video as any).requestVideoFrameCallback(tick);
  });
}

export async function captureDashboardScreen(
  targets: (HTMLElement | null)[],
  baseName = "MMSP"
) {
  const elements = targets.filter((el): el is HTMLElement => !!el);
  if (elements.length === 0) throw new Error("No elements to capture");

  // Ask for the screen's real pixel size (CSS size x device pixel ratio)
  const dpr = window.devicePixelRatio || 1;
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      width: { ideal: Math.round(window.innerWidth * dpr) },
      height: { ideal: Math.round(window.innerHeight * dpr) },
      frameRate: { ideal: 30 },
    },
    preferCurrentTab: true, // Chromium hint: preselects this tab
  } as DisplayMediaStreamOptions);

  try {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    await video.play();

    // Measure after the prompt has closed
    const area = unionRect(elements);
    const videoScale = video.videoWidth / window.innerWidth;

    const mapEl = document.getElementById("mmsp-map");
    const view = mapView.current;
    const mapRect = mapEl?.getBoundingClientRect();
    const useHiRes = HI_RES_MAP && !!view && !!mapRect;

    const outScale = Math.min(
      useHiRes ? videoScale * MAP_SCALE : videoScale,
      MAX_SIDE / area.width,
      MAX_SIDE / area.height
    );

    // Render the sharp map while the video frames are being collected
    const mapImgPromise =
      useHiRes && view && mapRect
        ? view
            .takeScreenshot({
              format: "png",
              width: Math.round(mapRect.width * outScale),
              height: Math.round(mapRect.height * outScale),
            })
            .then(async (shot) => {
              const img = new Image();
              img.src = shot.dataUrl;
              await img.decode();
              return img;
            })
        : Promise.resolve(null);

    const [, mapImg] = await Promise.all([
      waitForFrames(video, FRAMES),
      mapImgPromise,
    ]);

    const sx = Math.max(0, area.left * videoScale);
    const sy = Math.max(0, area.top * videoScale);
    const sw = Math.min(area.width * videoScale, video.videoWidth - sx);
    const sh = Math.min(area.height * videoScale, video.videoHeight - sy);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(area.width * outScale);
    canvas.height = Math.round(area.height * outScale);
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // 1. Everything from the screen (panels, charts, map)
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    // 2. Replace the map area with the sharper ArcGIS render
    if (mapImg && mapRect) {
      ctx.drawImage(
        mapImg,
        Math.round((mapRect.left - area.left) * outScale),
        Math.round((mapRect.top - area.top) * outScale),
        Math.round(mapRect.width * outScale),
        Math.round(mapRect.height * outScale)
      );
    }

    // Got the frame, so stop sharing right away
    stream.getTracks().forEach((t) => t.stop());

    const safeName = baseName.replace(/[\\/:*?"<>|]/g, "").trim() || "MMSP";
    const ext = FORMAT === "png" ? "png" : "jpg";
    const filename = `${safeName} ${localDateStamp()}.${ext}`;

    await new Promise<void>((resolve) =>
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            download(url, filename);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }
          resolve();
        },
        FORMAT === "png" ? "image/png" : "image/jpeg",
        FORMAT === "png" ? undefined : JPEG_QUALITY
      )
    );
  } finally {
    stream.getTracks().forEach((t) => t.stop());
  }
}