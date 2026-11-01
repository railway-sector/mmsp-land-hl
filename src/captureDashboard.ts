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
  baseName = "MMSP"
) {
  const elements = targets.filter((el): el is HTMLElement => !!el);
  if (elements.length === 0) throw new Error("No elements to capture");

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    preferCurrentTab: true, // Chromium hint: preselects this tab
  } as DisplayMediaStreamOptions);

  try {
    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();
    await new Promise((r) => setTimeout(r, 300)); // let the prompt close

    // Measure after the delay, in case the layout shifted
    const area = unionRect(elements);
    const scale = video.videoWidth / window.innerWidth;

    const sx = Math.max(0, area.left * scale);
    const sy = Math.max(0, area.top * scale);
    const sw = Math.min(area.width * scale, video.videoWidth - sx);
    const sh = Math.min(area.height * scale, video.videoHeight - sy);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    canvas
      .getContext("2d")!
      .drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

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
        0.92
      )
    );
  } finally {
    stream.getTracks().forEach((t) => t.stop());
  }
}