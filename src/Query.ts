/* eslint-disable react-hooks/rules-of-hooks */
import { dateTable } from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import * as am5 from "@amcharts/amcharts5";
import { cpField, station1Field, lotTypeField } from "./uniqueValues";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import type { statisticsType } from "./uniqueValues";

// ****************************
//    Chart Parameters
// ****************************
type layerViewQueryProps = {
  layer?: any;
  qExpression?: any;
  view: any;
};

export const highlightFilterLayerView = ({
  layer,
  qExpression,
  view,
}: layerViewQueryProps) => {
  const query = layer.createQuery();
  query.where = qExpression;
  let highlightSelect: any;

  view?.whenLayerView(layer).then((layerView: any) => {
    layer?.queryObjectIds(query).then((results: any) => {
      const objID = results;

      const queryExt = new Query({
        objectIds: objID,
      });
      layer?.queryExtent(queryExt).then((result: any) => {
        if (result?.extent) {
          view?.goTo(result.extent);
        }
      });

      highlightSelect && highlightSelect.remove();
      highlightSelect = layerView.highlight(objID);
    });

    layerView.filter = new FeatureFilter({
      where: qExpression,
    });

    // For initial state, we need to add this
    view?.on("click", () => {
      layerView.filter = new FeatureFilter({
        where: undefined,
      });
      highlightSelect && highlightSelect.remove();
    });
  });
};

// Dynamic chart size
export function responsiveChart(
  chart: any,
  pieSeries: any,
  legend: any,
  pieSeriesScale: any,
) {
  chart.onPrivate("width", (width: any) => {
    const availableSpace = width * 0.7; // original 0.7
    const new_fontSize = width / 29;
    const new_pieSeries_scale = width / pieSeriesScale;
    const new_legendMarkerSize = width * 0.045;

    legend.labels.template.setAll({
      width: availableSpace,
      maxWidth: availableSpace,
      fontSize: new_fontSize,
    });

    legend.valueLabels.template.setAll({
      fontSize: new_fontSize,
    });

    legend.markers.template.setAll({
      width: new_legendMarkerSize,
      height: new_legendMarkerSize,
    });

    pieSeries.animate({
      key: "scale",
      to: new_pieSeries_scale,
      duration: 100,
    });
  });
}

interface chartType {
  chartItem?: any;
  chart: any;
  pieSeries: any;
  legend: any;
  root: any;
  contractcp: any;
  landtype: any;
  landsection: any;
  status_field: any;
  arcgisMap: any;
  updateChartPanelwidth: any;
  data: any;
  pieSeriesScale: any;
  pieInnerLabel?: any;
  pieInnerLabelFontSize?: any;
  pieInnerValueFontSize?: any;
  layer: FeatureLayer;
  statusArray: any;
  background_color_switch?: boolean;
}
export function chartRenderer({
  chartItem,
  chart,
  pieSeries,
  legend,
  root,
  contractcp,
  landtype,
  landsection,
  status_field,
  arcgisMap,
  updateChartPanelwidth,
  data,
  pieSeriesScale,
  pieInnerLabel,
  pieInnerLabelFontSize,
  pieInnerValueFontSize,
  layer,
  statusArray,
  background_color_switch,
}: chartType) {
  // Inner label
  let inner_label = pieSeries.children.push(
    am5.Label.new(root, {
      text:
        background_color_switch === false
          ? `[#ffffff]{valueSum}[/]\n[fontSize: ${pieInnerLabelFontSize}; #d3d3d3; verticalAlign: super]${pieInnerLabel}[/]`
          : "[#000000]{valueSum}[/]\n[fontSize: 0.5em; #000000; verticalAlign: super]PRIVATE LOTS[/]",
      // text: '[#000000]{valueSum}[/]\n[fontSize: 0.5em; #d3d3d3; verticalAlign: super]LOTS[/]',
      fontSize: `${pieInnerValueFontSize}`,
      centerX: am5.percent(50),
      centerY: am5.percent(40),
      populateText: true,
      oversizedBehavior: "fit",
      textAlign: "center",
    }),
  );

  pieSeries.onPrivate("width", (width: any) => {
    inner_label.set("maxWidth", width * 0.7);
  });

  // Set slice opacity and stroke color
  pieSeries.slices.template.setAll({
    toggleKey: "none",
    fillOpacity: chartItem === "structure" ? 0 : 0.9,
    stroke: am5.color("#ffffff"),
    strokeWidth: 0.5,
    strokeOpacity: 1,
    templateField: "sliceSettings",
    tooltipText: '{category}: {valuePercentTotal.formatNumber("#.")}%',
  });

  // Disabling labels and ticksll
  pieSeries.labels.template.set("visible", false);
  pieSeries.ticks.template.set("visible", false);

  // EventDispatcher is disposed at SpriteEventDispatcher...
  // It looks like this error results from clicking events
  pieSeries.slices.template.events.on("click", (ev: any) => {
    const Selected: any = ev.target.dataItem?.dataContext;
    const Category = Selected.category;
    const find = statusArray.find((emp: any) => emp.category === Category);
    const statusSelected = find?.value;
    const isStringOrNumber = typeof statusSelected === "number";

    const queryField = isStringOrNumber
      ? `${status_field} = ${statusSelected}`
      : `${status_field} = '${statusSelected}'`;

    const qExpression = queryExpression({
      contractcp: contractcp,
      landtype: landtype,
      landsection: landsection,
      queryField: queryField,
    });

    highlightFilterLayerView({
      layer: layer,
      qExpression: qExpression,
      view: arcgisMap?.view,
    });
  });

  pieSeries.data.setAll(data);

  // Disabling labels and ticksll
  pieSeries.labels.template.setAll({
    visible: false,
    scale: 0,
  });

  pieSeries.ticks.template.setAll({
    visible: false,
    scale: 0,
  });

  // Legend
  // Change the size of legend markers
  legend.markers.template.setAll({
    width: 17,
    height: 17,
  });

  // Change the marker shape
  legend.markerRectangles.template.setAll({
    cornerRadiusTL: 10,
    cornerRadiusTR: 10,
    cornerRadiusBL: 10,
    cornerRadiusBR: 10,
  });

  responsiveChart(chart, pieSeries, legend, pieSeriesScale);
  chart.onPrivate("width", (width: any) => {
    updateChartPanelwidth(width);
  });

  // Change legend labelling properties
  // To have responsive font size, do not set font size
  legend.labels.template.setAll({
    oversizedBehavior: "truncate",
    fill:
      background_color_switch === false
        ? am5.color("#ffffff")
        : am5.color("#000000"),
    fontSize: "14px",
  });

  legend.valueLabels.template.setAll({
    textAlign: "right",
    fill:
      background_color_switch === false
        ? am5.color("#ffffff")
        : am5.color("#000000"),
    fontSize: "14px",
  });

  legend.itemContainers.template.setAll({
    // set space between legend items
    paddingTop: 3,
    paddingBottom: 1,
  });

  pieSeries.appear(1000, 100);
}

// ****************************
//    Dropdown Parameters
// ****************************
interface queryExpressionType {
  contractcp: string;
  landtype: string;
  landsection: string;
  queryField?: any;
}
export function queryExpression({
  contractcp,
  landtype,
  landsection,
  queryField,
}: queryExpressionType) {
  const qCp = `${cpField} = '${contractcp}'`;
  const qLandType = `${lotTypeField} = '${landtype}'`;
  const qCpLandType = `${qCp} AND ${qLandType}`;
  const qLandSection = `${station1Field} = '${landsection}'`;
  const qCpLandTypeSection = `${qCpLandType} AND ${qLandSection}`;

  let expression = "";
  if (!contractcp) {
    expression = !queryField ? "1=1" : queryField;
  } else if (contractcp && !landtype && !landsection) {
    expression = !queryField ? qCp : `${qCp} AND ${queryField}`;
  } else if (contractcp && landtype && !landsection) {
    expression = !queryField ? qCpLandType : `${qCpLandType} AND ${queryField}`;
  } else {
    expression = !queryField
      ? qCpLandTypeSection
      : `${qCpLandTypeSection} AND ${queryField}`;
  }

  return expression;
}

interface queryDefinitionExpressionType {
  queryExpression?: string;
  featureLayer?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
  arcgisScene?: any;
  timesliderstate?: boolean;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer,
  // timesliderstate,
  // arcgisScene,
}: queryDefinitionExpressionType) {
  if (queryExpression) {
    if (featureLayer) {
      if (Array.isArray(featureLayer)) {
        featureLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = queryExpression;
          }
        });
      } else {
        featureLayer.definitionExpression = queryExpression;
      }
    }
  }

  // if (!timesliderstate) {
  //   zoomToLayer(lotLayer, arcgisScene);
  //   zoomToLayer(structureLayer, arcgisScene);
  // }
}

//---------------------------------------------//
//           Pie Chart Data Generation         //
//---------------------------------------------//

interface pieChartStatusDataType {
  contractcp: string;
  landtype: string;
  landsection: string;
  layer: any;
  statusList?: any;
  statusColor?: any;
  statusField?: any;
  idField?: any;
  valueSumField?: any;
  queryField?: any;
  statisticType?: statisticsType;
}
export async function pieChartStatusData({
  contractcp,
  landtype,
  landsection,
  layer,
  statusList,
  statusColor,
  statusField,
  valueSumField,
  queryField,
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

  const expression = queryExpression({
    contractcp: contractcp,
    landtype: landtype,
    landsection: landsection,
    queryField: queryField,
  });

  query.where = expression;
  queryDefinitionExpression({
    queryExpression: expression,
    featureLayer: [layer],
  });
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

export async function totalFieldCount({
  contractcp,
  landtype,
  landsection,
  layer,
  idField,
  queryField,
}: pieChartStatusDataType) {
  const statsCollect = new StatisticDefinition({
    onStatisticField: idField,
    outStatisticFieldName: "statsCollect",
    statisticType: "count",
  });

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];
  query.where = queryExpression({
    contractcp: contractcp,
    landtype: landtype,
    landsection: landsection,
    queryField: queryField,
  });

  return layer?.queryFeatures(query).then((response: any) => {
    return response.features[0].attributes.statsCollect;
  });
}

export async function totalFieldSum({
  contractcp,
  landtype,
  landsection,
  layer,
  valueSumField,
  queryField,
}: pieChartStatusDataType) {
  const statsCollect = new StatisticDefinition({
    onStatisticField: valueSumField,
    outStatisticFieldName: "statsCollect",
    statisticType: "sum",
  });

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];
  query.where = queryExpression({
    contractcp: contractcp,
    landtype: landtype,
    landsection: landsection,
    queryField: queryField,
  });

  return layer?.queryFeatures(query).then((response: any) => {
    return response.features[0].attributes.statsCollect;
  });
}

// Updat date
export async function dateUpdate() {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // For updating date

  const query = dateTable.createQuery();
  query.where = "category = 'Land Acquisition HL'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      const date = new Date(result.attributes.date);
      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return final;
    });
    return dates;
  });
}

// Thousand separators function
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
