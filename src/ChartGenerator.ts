import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import * as am5 from "@amcharts/amcharts5";
import Query from "@arcgis/core/rest/support/Query";
import type { statisticsType } from "./uniqueValues";

//---------------------------------------------//
//           Pie Chart Data Generation         //
//---------------------------------------------//

interface pieChartStatusDataType {
  qChart: any;
  layer: any;
  statusList?: any;
  statusColor?: any;
  statusField?: any;
  statisticField?: any;
  valueSumField?: any;
  queryField?: any;
  statisticType?: statisticsType;
}
export async function pieChartStatusData({
  qChart,
  layer,
  statusList,
  statusColor,
  statusField,
  valueSumField,
  statisticType,
}: pieChartStatusDataType) {
  //--- Main statistics
  let statsCollect: any;
  if (statisticType === "count") {
    statsCollect = new StatisticDefinition({
      onStatisticField: statusField,
      outStatisticFieldName: "statsCollect",
      statisticType: statisticType,
    });
  } else if (statisticType === "sum") {
    statsCollect = new StatisticDefinition({
      onStatisticField: valueSumField,
      outStatisticFieldName: "statsCollect",
      statisticType: statisticType,
    });
  }

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];

  const expression = qChart;

  query.where = expression;
  // queryDefinitionExpression({
  //   queryExpression: expression,
  //   featureLayer: [layer],
  // });
  query.orderByFields = [statusField];
  query.groupByFieldsForStatistics = [statusField];

  //--- Query features using statistics definitions
  let total_count = 0;
  return layer?.queryFeatures(query).then(async (response: any) => {
    const stats = response.features;
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      total_count += attributes.statsCollect;
      const statusName = attributes[statusField];

      //--- Check if attributes[statusField] is numeric or string
      //--- This correctly accounts for a case where status in the attribute table is not number,
      const isStringOrNumber = typeof statusName === "number";

      return Object.assign({
        category: isStringOrNumber ? statusList[statusName - 1] : statusName,
        value: attributes.statsCollect,
      });
    });

    //--- Account for zero count
    const data0 = statusList.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      return Object.assign({
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusColor[index]),
        },
      });
    });
    return [data0, total_count];
  });
}

export async function fieldStatistic({
  qChart,
  layer,
  statisticField,
  statisticType,
}: pieChartStatusDataType) {
  const statsCollect = new StatisticDefinition({
    onStatisticField: statisticField,
    outStatisticFieldName: "statsCollect",
    statisticType: statisticType,
  });

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];
  query.where = qChart;

  return layer?.queryFeatures(query).then((response: any) => {
    return response.features[0].attributes.statsCollect;
  });
}
