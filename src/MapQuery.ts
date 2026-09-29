import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import type Extent from "@arcgis/core/geometry/Extent";

// ----------------------------------------------------
// Builds a where-clause combining location (package/type/station) and
// status into one SQL expression. Returns "1=1" (show everything) if
// nothing is selected.
// ----------------------------------------------------
export function buildWhereClause(
  packageName: string | null,
  type: string | null,
  station: string | null,
  status: number | string | null,
  statusField: string,
): string {
  const clauses: string[] = [];

  if (packageName) clauses.push(`Package = '${packageName}'`);
  if (type) clauses.push(`Type = '${type}'`);
  if (station) clauses.push(`Station1 = '${station}'`);
  if (status !== null) {
    // Numeric (Lot) unquoted; string (ISF) quoted, or SQL reads it as
    // a bare identifier
    const statusLiteral = typeof status === "string" ? `'${status}'` : status;
    clauses.push(`${statusField} = ${statusLiteral}`);
  }

  return clauses.length > 0 ? clauses.join(" AND ") : "1=1";
}

// ----------------------------------------------------
// Filters a layer by the current selection and returns the extent to
// zoom to (or null). Data/query only — doesn't touch MapView; the
// caller (MapDisplay.tsx) decides what to do with the extent.
// ----------------------------------------------------
export async function filterAndGetTargetExtent(
  layer: FeatureLayer,
  packageName: string | null,
  type: string | null,
  station: string | null,
  status: number | string | null,
  statusField: string,
): Promise<Extent | null> {
  const whereExpression = buildWhereClause(packageName, type, station, status, statusField);

  layer.definitionExpression = whereExpression;

  // if (whereExpression === "1=1") return null;

  const result = await layer.queryExtent({ where: whereExpression });

  return result.extent ?? null;
}