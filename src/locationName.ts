import type { SelectedLocation } from "./contexts/MyContext";

/** station -> package -> "MMSP" */
export function getLocationName(loc: SelectedLocation): string {
  return loc.station ?? loc.packageName ?? "MMSP";
}