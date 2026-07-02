/* eslint-disable react-hooks/rules-of-hooks */
import { dateTable } from "./layers";
import type { statisticsType } from "./uniqueValues";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";

//----------------------------------------//
//------        Date and Month       -----//
//----------------------------------------//
export async function dateUpdate() {
  const query = dateTable.createQuery();
  query.where = `category = 'Land Acquisition'`;

  const response = await dateTable.queryFeatures(query);
  const dates = response.features.map((result: any) => {
    // get today and date recorded in the table
    const today = new Date();
    const date = new Date(result.attributes.date);

    // Calculate the number of days passed since the last update
    const time_passed = today.getTime() - date.getTime();
    const days_passed = Math.round(time_passed / (1000 * 3600 * 24));

    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", {
      month: "long",
    });
    const day = date.getDate();
    const as_of_date = year < 1990 ? "" : `${month} ${day}, ${year}`;
    return [as_of_date, days_passed, date];
  });
  return dates;
}

//---------------------------------------------//
//               Pie chart                     //
//---------------------------------------------//
// 'piechart' = constant declared from class ChartPieSeries in layers.ts
interface pieChartDataType {
  piechart: any;
  qChart: any;
  layer: any;
  statusList: any;
  statusField: any;
  statisticField: any;
  statisticType: "sum" | "count";
}
export async function pieChartData({
  piechart,
  qChart,
  layer,
  statusList,
  statusField,
  statisticField,
  statisticType,
}: pieChartDataType) {
  piechart.qChart = qChart.queryExpression();
  piechart.layer = layer;
  piechart.statusList = statusList;
  piechart.statusField = statusField;
  piechart.statisticField = statisticField;
  piechart.statisticType = statisticType;

  return await piechart.chartDataPieSeries();
}

interface fieldStatisticType {
  qChart: any;
  layer: any;
  statisticField: any;
  statisticType: statisticsType;
}

export async function fieldStatistic({
  qChart,
  layer,
  statisticField,
  statisticType,
}: fieldStatisticType) {
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

//----------------------------------------------//
//                 Others                       //
//----------------------------------------------//
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        //speedFactor: 2,
      })
      .catch(function (error: any) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}
