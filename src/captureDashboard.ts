import { mapView } from "./components/MapDisplay";

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

export async function captureDashboardScreen(
  targets: (HTMLElement | null)[],
  baseName = "MMSP",
  hiResMap = true // set false to keep the compass/time slider on the map
) {
  const elements = targets.filter((el): el is HTMLElement => !!el);
  if (elements.length === 0) throw new Error("No elements to capture");

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      width: { ideal: 3840 },
      height: { ideal: 2160 },
      frameRate: { ideal: 15 },
    },
    preferCurrentTab: true, // Chromium hint: preselects this tab
  } as DisplayMediaStreamOptions);

  try {
    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    // Early frames are heavily compressed; wait for a sharp one
    await new Promise((r) => setTimeout(r, 1000));

    // Measure after the delay, in case the layout shifted
    const area = unionRect(elements);
    const videoScale = video.videoWidth / window.innerWidth;

    const sx = Math.max(0, area.left * videoScale);
    const sy = Math.max(0, area.top * videoScale);
    const sw = Math.min(area.width * videoScale, video.videoWidth - sx);
    const sh = Math.min(area.height * videoScale, video.videoHeight - sy);

    // Output scale: 2x the screen capture when using the hi-res map,
    // capped so the final image stays at a safe size
    const mapEl = document.getElementById("mmsp-map");
    const view = mapView.current;
    const useHiRes = hiResMap && !!mapEl && !!view;
    let outScale = useHiRes ? videoScale * 2 : videoScale;
    const maxSide = 8000;
    outScale = Math.min(
      outScale,
      maxSide / area.width,
      maxSide / area.height
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(area.width * outScale);
    canvas.height = Math.round(area.height * outScale);

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // 1. Everything from the screen (panels, charts, map)
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    // 2. Replace the map area with a sharper ArcGIS render
    if (useHiRes && mapEl && view) {
      const mapRect = mapEl.getBoundingClientRect();
      const shot = await view.takeScreenshot({
        format: "png",
        width: Math.round(mapRect.width * outScale),
        height: Math.round(mapRect.height * outScale),
      });

      const img = new Image();
      img.src = shot.dataUrl;
      await img.decode();

      ctx.drawImage(
        img,
        Math.round((mapRect.left - area.left) * outScale),
        Math.round((mapRect.top - area.top) * outScale),
        Math.round(mapRect.width * outScale),
        Math.round(mapRect.height * outScale)
      );
    }

    // Strip characters that aren't allowed in file names
    const safeName = baseName.replace(/[\\/:*?"<>|]/g, "").trim() || "MMSP";
    const filename = `${safeName} ${localDateStamp()}.jpg`;

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
        "image/jpeg",
        1.0 // maximum quality
      )
    );
  } finally {
    stream.getTracks().forEach((t) => t.stop());
  }
}