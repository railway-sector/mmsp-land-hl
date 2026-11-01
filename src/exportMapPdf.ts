import jsPDF from "jspdf";
import { whenOnce } from "@arcgis/core/core/reactiveUtils";
import { mapView } from "./components/MapDisplay";

export interface PrintOptions {
  title: string;
  paper: "a4" | "a3" | "letter";
  orientation: "landscape" | "portrait";
  resolution: 1 | 2 | 3;
  includeDate: boolean;
  margin: number; // mm
}

export const defaultPrintOptions: PrintOptions = {
  title: "MMSP",
  paper: "a4",
  orientation: "landscape",
  resolution: 2,
  includeDate: true,
  margin: 10,
};

/** Local date as YYYY-MM-DD (avoids the UTC day shift of toISOString) */
function localDateStamp() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export async function exportMapPdf(opts: PrintOptions) {
  const view = mapView.current;
  if (!view) throw new Error("Map not ready");

  await whenOnce(() => !view.updating);

  const pdf = new jsPDF({
    orientation: opts.orientation,
    unit: "mm",
    format: opts.paper,
  });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const m = opts.margin;

  // Space reserved for the title/date line
  const headerH = opts.title || opts.includeDate ? 8 : 0;

  // Printable area for the map
  const printW = pageW - m * 2;
  const printH = pageH - m * 2 - headerH;

  // Take the full map at the chosen resolution
  const shot = await view.takeScreenshot({
    format: "png",
    width: view.width * opts.resolution,
    height: view.height * opts.resolution,
  });
  const { width, height } = shot.data;

  // Centered crop matching the printable area's aspect ratio
  const targetRatio = printW / printH;
  let cropW = width;
  let cropH = height;
  if (width / height > targetRatio) {
    cropW = height * targetRatio; // map too wide: trim left/right
  } else {
    cropH = width / targetRatio; // map too tall: trim top/bottom
  }
  const sx = (width - cropW) / 2;
  const sy = (height - cropH) / 2;

  const img = new Image();
  img.src = shot.dataUrl;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cropW);
  canvas.height = Math.round(cropH);
  canvas
    .getContext("2d")!
    .drawImage(img, sx, sy, cropW, cropH, 0, 0, canvas.width, canvas.height);
  const croppedUrl = canvas.toDataURL("image/jpeg", 0.95);

  // Title and date sit inside the top of the printable area
  if (opts.title) {
    pdf.setFontSize(14);
    pdf.text(opts.title, m, m + 5);
  }
  if (opts.includeDate) {
    pdf.setFontSize(9);
    pdf.text(new Date().toLocaleDateString(), pageW - m, m + 5, {
      align: "right",
    });
  }

  // Map fills the whole printable area
  pdf.addImage(croppedUrl, "JPEG", m, m + headerH, printW, printH);

  // File name: title field + today's date, e.g. "Ortigas 2026-11-01.pdf"
  const safeTitle =
    (opts.title || "MMSP").replace(/[\\/:*?"<>|]/g, "").trim() || "MMSP";
  pdf.save(`${safeTitle} ${localDateStamp()}.pdf`);
}