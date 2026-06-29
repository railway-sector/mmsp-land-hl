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
  statusField,
  statisticField,
  statisticType,
}: pieChartStatusDataType) {
  //--- Main statistics
  let statsCollect: any;
  statsCollect = new StatisticDefinition({
    onStatisticField: statisticField,
    outStatisticFieldName: "statsCollect",
    statisticType: statisticType,
  });

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];
  query.where = qChart;
  query.orderByFields = [statusField];
  query.groupByFieldsForStatistics = [statusField];

  //--- Query features using statistics definitions
  let total_count = 0;

  const response = await layer?.queryFeatures(query);
  const data = response.features.map((result: any) => {
    const attributes = result.attributes;
    total_count += attributes.statsCollect;
    const statusName = attributes[statusField];

    //--- Check if attributes[statusField] is numeric or string
    //--- This correctly accounts for a case where status in the attribute table is not number,
    const isStringOrNumber = typeof statusName === "number";

    return Object.assign({
      category: isStringOrNumber
        ? statusList.find((item: any) => item.value === statusName)?.category
        : statusName,
      value: attributes.statsCollect,
    });
  });

  //--- Account for zero count
  const data0 = statusList.map((status: any) => {
    const find = data.find((emp: any) => emp.category === status.category);
    const value = find === undefined ? 0 : find?.value;
    return Object.assign({
      category: status.category,
      value: value,
      sliceSettings: {
        fill: am5.color(status.color),
      },
    });
  });
  return [data0, total_count];
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

  const response = await layer?.queryFeatures(query);
  return response.features[0].attributes.statsCollect;
}
