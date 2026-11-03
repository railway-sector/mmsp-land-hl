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

// Quality option -> target print resolution (dots per inch)
const DPI_BY_QUALITY: Record<PrintOptions["resolution"], number> = {
  1: 150, // Standard
  2: 250, // High
  3: 300, // Very high
};

// Safety cap on the longest side of the map render, in pixels
const MAX_SIDE_PX = 8000;

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

  // Printable area for the map (mm)
  const printW = pageW - m * 2;
  const printH = pageH - m * 2 - headerH;
  const targetRatio = printW / printH;

  // The part of the on-screen map (in CSS pixels) that will be printed
  let cropCssW = view.width;
  let cropCssH = view.height;
  if (view.width / view.height > targetRatio) {
    cropCssW = view.height * targetRatio; // map too wide: trim left/right
  } else {
    cropCssH = view.width / targetRatio; // map too tall: trim top/bottom
  }

  // Render scale so the printed area reaches the target DPI
  const dpi = DPI_BY_QUALITY[opts.resolution];
  const neededPxW = (printW / 25.4) * dpi;
  let k = neededPxW / cropCssW;
  k = Math.min(k, MAX_SIDE_PX / Math.max(view.width, view.height));

  const shot = await view.takeScreenshot({
    format: "png",
    width: Math.round(view.width * k),
    height: Math.round(view.height * k),
  });
  const { width, height } = shot.data;

  // Centered crop, in render pixels
  const cropW = (cropCssW / view.width) * width;
  const cropH = (cropCssH / view.height) * height;
  const sx = (width - cropW) / 2;
  const sy = (height - cropH) / 2;

  const img = new Image();
  img.src = shot.dataUrl;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cropW);
  canvas.height = Math.round(cropH);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, canvas.width, canvas.height);
  const croppedUrl = canvas.toDataURL("image/jpeg", 0.98);

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