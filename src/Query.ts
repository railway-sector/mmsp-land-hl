import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";

// Builds a base Query — where-clause comes from the caller
// (QueryExpressionLayers), this just wires it up to run
function createQuery(where?: string) {
  const query = new Query();
  query.where = where ?? "1=1";
  query.outFields = [];
  query.returnGeometry = false;
  return query;
}

type StatisticType =
  | "count"
  | "sum"
  | "min"
  | "max"
  | "avg"
  | "stddev"
  | "var"
  | "exceedslimit"
  | "percentile-continuous"
  | "percentile-discrete"
  | "envelope-aggregate"
  | "convex-hull-aggregate";

// ----------------------------------------------------
// FIELD STATISTIC
// One number for a single stat (total, public, handed-over, etc).
// Fire several in parallel via Promise.all for a chart's summary row.
// ----------------------------------------------------

type FieldStatisticArgs = {
  where?: string;
  layer: any;
  statisticField: string;
  statisticType: StatisticType;
};

export async function fieldStatistic({
  where,
  layer,
  statisticField,
  statisticType,
}: FieldStatisticArgs): Promise<number> {
  const query = createQuery(where);
  const OUT_FIELD = "result";

  query.outStatistics = [
    new StatisticDefinition({
      onStatisticField: statisticField,
      outStatisticFieldName: OUT_FIELD,
      statisticType,
    }),
  ];

  const response = await layer.queryFeatures(query);
  return response.features[0]?.attributes[OUT_FIELD] ?? 0;
}

// ----------------------------------------------------
// PIE CHART STATUS DATA
// Per-status breakdown for a pie chart. `where` must already include
// any caller-side filtering. `code` is string | number so this serves
// both numeric (lotStatuses) and text-based (isfStatuses) status lists.
// ----------------------------------------------------

type PieChartStatusDataArgs = {
  where?: string;
  layer: any;
  statusList: { code: string | number; label: string; color: string }[];
  statusField: string;
  statisticField: string;
  statisticType: StatisticType;
};

export async function pieChartStatusData({
  where,
  layer,
  statusList,
  statusField,
  statisticField,
  statisticType,
}: PieChartStatusDataArgs) {
  const statusQuery = createQuery(where);
  statusQuery.outFields = [statusField];
  statusQuery.outStatistics = [
    new StatisticDefinition({
      onStatisticField: statisticField,
      outStatisticFieldName: "total_status",
      statisticType,
    }),
  ];
  statusQuery.groupByFieldsForStatistics = [statusField];
  statusQuery.orderByFields = [statusField];

  const statusResponse = await layer.queryFeatures(statusQuery);

  // Attaches each status's color from statusList, so the chart can bind
  // slice fill + click handling directly
  return statusList.map(
    ({
      code,
      label,
      color,
    }): { category: string; value: number; color: string; code: string | number } => {
      const feature = statusResponse.features.find(
        (f: any) => f.attributes[statusField] === code,
      );

      return {
        category: label,
        value: feature?.attributes.total_status ?? 0,
        color,
        code,
      };
    },
  );
}