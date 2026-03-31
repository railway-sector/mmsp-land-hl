import {
  dateTable,
  handedOverLotLayer,
  lotLayer,
  tobeHandedOverLotLayer,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import * as am5 from "@amcharts/amcharts5";
import {
  lotStatusField,
  statusLotQuery,
  statusLotLabel,
  tobeHandedOverField,
  lot_id_field,
  cpField,
  lotTypeField,
  station1Field,
} from "./uniqueValues";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";

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

// ****************************
//    Chart Parameters
// ****************************
export const highlightSelectedUtil = (
  featureLayer: any,
  qExpression: any,
  view: any,
) => {
  const query = featureLayer.createQuery();
  query.where = qExpression;
  let highlightSelect: any;

  view?.whenLayerView(featureLayer).then((layerView: any) => {
    featureLayer?.queryObjectIds(query).then((results: any) => {
      const objID = results;

      const queryExt = new Query({
        objectIds: objID,
      });

      try {
        featureLayer?.queryExtent(queryExt).then((result: any) => {
          if (result?.extent) {
            view?.goTo(result.extent);
          }
        });
      } catch (error) {
        console.error("Error querying extent for point layer:", error);
      }

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

type layerViewQueryProps = {
  pointLayer1?: FeatureLayer;
  pointLayer2?: FeatureLayer;
  lineLayer1?: FeatureLayer;
  lineLayer2?: FeatureLayer;
  polygonLayer?: FeatureLayer;
  qExpression?: any;
  view: any;
};

export const polygonViewQueryFeatureHighlight = ({
  polygonLayer,
  qExpression,
  view,
}: layerViewQueryProps) => {
  highlightSelectedUtil(polygonLayer, qExpression, view);
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

    const queryField = `${status_field} = ${statusSelected}`;
    const qExpression = queryStatisticsLayer({
      contractcp: contractcp,
      landtype: landtype,
      landsection: landsection,
      queryField: queryField,
    });

    polygonViewQueryFeatureHighlight({
      polygonLayer: layer,
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

// Query function for lotLayer
export const queryDropdownTypes = (
  contractcp: any,
  landtype: any,
  landsection: any,
) => {
  const qCP = `${cpField} = '` + contractcp + "'";
  const qLandType = `${lotTypeField} = '` + landtype + "'";
  const qCpLandType = qCP + " AND " + qLandType;
  const qLandSection = `${station1Field} = '` + landsection + "'";
  const qCpLandTypeSection = qCpLandType + " AND " + qLandSection;

  return [qCP, qCpLandType, qCpLandTypeSection];
};

interface queryLayerExpressionType {
  contractcp: string;
  landtype: string;
  landsection: string;
  arcgisMap?: any;
  timesliderstate?: boolean;
}

export function queryLayersExpression({
  contractcp,
  landtype,
  landsection,
}: queryLayerExpressionType) {
  const typeExpression = queryDropdownTypes(contractcp, landtype, landsection);

  if (!contractcp) {
    lotLayer.definitionExpression = "1=1";
    handedOverLotLayer.definitionExpression = "1=1";
    tobeHandedOverLotLayer.definitionExpression = "1=1";
  } else if (contractcp && !landtype && !landsection) {
    lotLayer.definitionExpression = typeExpression[0];
    handedOverLotLayer.definitionExpression = typeExpression[0];
    tobeHandedOverLotLayer.definitionExpression = typeExpression[0];
  } else if (contractcp && landtype && !landsection) {
    lotLayer.definitionExpression = typeExpression[1];
    handedOverLotLayer.definitionExpression = typeExpression[1];
    tobeHandedOverLotLayer.definitionExpression = typeExpression[1];
  } else {
    lotLayer.definitionExpression = typeExpression[2];
    handedOverLotLayer.definitionExpression = typeExpression[2];
    tobeHandedOverLotLayer.definitionExpression = typeExpression[2];
  }
}

interface queryStatisticsType {
  contractcp: any;
  landtype: any;
  landsection: any;
  queryField: any;
}

export function queryStatisticsLayer({
  contractcp,
  landtype,
  landsection,
  queryField,
}: queryStatisticsType) {
  try {
    const typeExpression = queryDropdownTypes(
      contractcp,
      landtype,
      landsection,
    );
    let queryWhere: any;
    if (!contractcp) {
      queryWhere = !queryField ? "1=1" : queryField;
    } else if (contractcp && !landtype && !landsection) {
      queryWhere = !queryField
        ? typeExpression[0]
        : queryField + " AND " + typeExpression[0];
    } else if (contractcp && landtype && !landsection) {
      queryWhere = !queryField
        ? typeExpression[1]
        : queryField + " AND " + typeExpression[1];
    } else {
      queryWhere = !queryField
        ? typeExpression[2]
        : queryField + " AND " + typeExpression[2];
    }

    return queryWhere;
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

// For Lot Pie Chart
export async function generateLotData(
  contractp: any,
  landtype: any,
  landsection: any,
) {
  const total_count = new StatisticDefinition({
    onStatisticField: lotStatusField,
    outStatisticFieldName: "total_count",
    statisticType: "count",
  });

  const query = lotLayer.createQuery();
  query.outFields = [lotStatusField];
  query.outStatistics = [total_count];
  query.orderByFields = [lotStatusField];
  query.groupByFieldsForStatistics = [lotStatusField];
  query.where = queryStatisticsLayer({
    contractcp: contractp,
    landtype: landtype,
    landsection: landsection,
    queryField: undefined,
  });

  return lotLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      const status_id = attributes.H_Level;
      const count = attributes.total_count;
      return Object.assign({
        category: statusLotLabel[status_id - 1],
        value: count,
      });
    });

    const data1: any = [];
    statusLotLabel.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      const object = {
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusLotQuery[index].color),
        },
      };
      data1.push(object);
    });
    return data1;
  });
}

export async function generateLotNumber(
  contractcp: any,
  landtype: any,
  landsection: any,
) {
  const total_lot_number = new StatisticDefinition({
    onStatisticField: "ID",
    outStatisticFieldName: "total_lot_number",
    statisticType: "count",
  });

  const total_lot_pie = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusNVS3 >= 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_lot_pie",
    statisticType: "sum",
  });

  const query = lotLayer.createQuery();
  query.outStatistics = [total_lot_number, total_lot_pie];
  query.where = queryStatisticsLayer({
    contractcp: contractcp,
    landtype: landtype,
    landsection: landsection,
    queryField: undefined,
  });

  return lotLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const totalLotNumber = stats.total_lot_number;
    const totalPrivate = stats.total_lot_pie;
    const totalPublic = totalLotNumber - totalPrivate;
    return [totalLotNumber, totalPrivate, totalPublic];
  });
}

// For Permit-to-Enter
export async function generateHandedOver(
  contractcp: any,
  landtype: any,
  landsection: any,
) {
  const total_handedover_lot = new StatisticDefinition({
    onStatisticField: "CASE WHEN HandedOver = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_handedover_lot",
    statisticType: "sum",
  });

  const total_lot_N = new StatisticDefinition({
    onStatisticField: "ID",
    outStatisticFieldName: "total_lot_N",
    statisticType: "count",
  });

  const query = lotLayer.createQuery();
  query.outStatistics = [total_handedover_lot, total_lot_N];
  query.where = queryStatisticsLayer({
    contractcp: contractcp,
    landtype: landtype,
    landsection: landsection,
    queryField: undefined,
  });

  return lotLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const handedover = stats.total_handedover_lot;
    const totaln = stats.total_lot_N;
    const percent = ((handedover / totaln) * 100).toFixed(0);
    return [percent, handedover];
  });
}

// To be Handed Over (Count)
export async function generateToBeHandedOver(
  contractcp: any,
  landtype: any,
  landsection: any,
) {
  const total_handedover_lot = new StatisticDefinition({
    onStatisticField: `CASE WHEN ${tobeHandedOverField} = 1 THEN 1 ELSE 0 END`,
    outStatisticFieldName: "total_handedover_lot",
    statisticType: "sum",
  });

  const total_lot_N = new StatisticDefinition({
    onStatisticField: lot_id_field,
    outStatisticFieldName: "total_lot_N",
    statisticType: "count",
  });

  const query = lotLayer.createQuery();
  query.outStatistics = [total_handedover_lot, total_lot_N];
  query.where = queryStatisticsLayer({
    contractcp: contractcp,
    landtype: landtype,
    landsection: landsection,
    queryField: undefined,
  });

  return lotLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const tobehandedover = stats.total_handedover_lot;
    const totaln = stats.total_lot_N;
    const percent = ((tobehandedover / totaln) * 100).toFixed(0);
    return [percent, tobehandedover];
  });
}

// For monthly progress chart of lot
export async function generateLotProgress(
  yearSelected: any,
  contractp: any,
  landtype: any,
  landsection: any,
) {
  const total_count_handover = new StatisticDefinition({
    onStatisticField: "HandOverDate",
    outStatisticFieldName: "total_count_handover",
    statisticType: "count",
  });

  // let year;
  const years = Number(yearSelected);

  const query = lotLayer.createQuery();
  query.outStatistics = [total_count_handover];
  // eslint-disable-next-line no-useless-concat
  const qStatus = "HandOverDate IS NOT NULL";
  const qYear = "HandedOverYear = " + years;
  const qCP = "Package = '" + contractp + "'";
  const qYearCp = qYear + " AND " + qCP;
  const qLandType = "Type = '" + landtype + "'";
  const qCpLandType = qCP + " AND " + qLandType;
  const qYearCpLandType = qYear + " AND " + qCpLandType;
  const qLandSection = "Station1 ='" + landsection + "'";
  const qCpLandTypeSection = qCpLandType + " AND " + qLandSection;
  const qYearCpLandTypeSection = qYear + " AND " + qCpLandTypeSection;

  // When year is undefined,
  if (!years && !contractp) {
    query.where = qStatus;
  } else if (!years && contractp && !landtype) {
    query.where = qStatus + " AND " + qCP;
  } else if (!years && contractp && landtype && !landsection) {
    query.where = qStatus + " AND " + qCpLandType;
  } else if (!years && contractp && landtype && landsection) {
    query.where = qStatus + " AND " + qCpLandTypeSection;

    // When year is defined,
  } else if (years && !contractp) {
    query.where = qStatus + " AND " + qYear;
  } else if (years && contractp && !landtype && !landsection) {
    query.where = qStatus + " AND " + qYearCp;
  } else if (years && contractp && landtype && !landsection) {
    query.where = qStatus + " AND " + qYearCpLandType;
  } else if (years && contractp && landtype && landsection) {
    query.where = qStatus + " AND " + qYearCpLandTypeSection;
  }

  query.outFields = ["HandOverDate"];
  query.orderByFields = ["HandOverDate"];
  query.groupByFieldsForStatistics = ["HandOverDate"];

  return lotLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      const date = attributes.HandOverDate;
      const count = attributes.total_count_handover;

      // compile in object array
      return Object.assign({
        date: date,
        value: count,
      });
    });
    return data;
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
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}
