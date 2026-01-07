import { dateTable, lotLayer } from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import * as am5 from "@amcharts/amcharts5";
import { lotStatusField, statusLotQuery, statusLotLabel } from "./uniqueValues";

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

// For Lot Pie Chart
export async function generateLotData(
  contractp: any,
  landtype: any,
  landsection: any
) {
  // Query
  const qCP = "Package = '" + contractp + "'";
  const qLandType = "Type = '" + landtype + "'";
  const qCpLandType = qCP + " AND " + qLandType;
  const qLandSection = "Station1 ='" + landsection + "'";
  const qCpLandTypeSection = qCpLandType + " AND " + qLandSection;

  var total_count = new StatisticDefinition({
    onStatisticField: lotStatusField,
    outStatisticFieldName: "total_count",
    statisticType: "count",
  });

  var query = lotLayer.createQuery();
  query.outFields = [lotStatusField];
  query.outStatistics = [total_count];
  query.orderByFields = [lotStatusField];
  query.groupByFieldsForStatistics = [lotStatusField];

  if (!contractp) {
    query.where = "1=1";
  } else if (contractp && !landtype && !landsection) {
    query.where = qCP;
  } else if (contractp && landtype && !landsection) {
    query.where = qCpLandType;
  } else {
    query.where = qCpLandTypeSection;
  }

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
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

export async function generateLotNumber() {
  var total_lot_number = new StatisticDefinition({
    onStatisticField: "ID",
    outStatisticFieldName: "total_lot_number",
    statisticType: "count",
  });

  var total_lot_pie = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusNVS3 >= 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_lot_pie",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [total_lot_number, total_lot_pie];
  query.returnGeometry = true;

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const totalLotNumber = stats.total_lot_number;
    const totalPrivate = stats.total_lot_pie;
    const totalPublic = totalLotNumber - totalPrivate;
    return [totalLotNumber, totalPrivate, totalPublic];
  });
}

// For Permit-to-Enter
export async function generateHandedOver() {
  var total_handedover_lot = new StatisticDefinition({
    onStatisticField: "CASE WHEN HandedOver = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_handedover_lot",
    statisticType: "sum",
  });

  var total_lot_N = new StatisticDefinition({
    onStatisticField: "ID",
    outStatisticFieldName: "total_lot_N",
    statisticType: "count",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [total_handedover_lot, total_lot_N];

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const handedover = stats.total_handedover_lot;
    const totaln = stats.total_lot_N;
    const percent = ((handedover / totaln) * 100).toFixed(0);
    return [percent, handedover];
  });
}

// For monthly progress chart of lot
export async function generateLotProgress(
  yearSelected: any,
  contractp: any,
  landtype: any,
  landsection: any
) {
  var total_count_handover = new StatisticDefinition({
    onStatisticField: "HandOverDate",
    outStatisticFieldName: "total_count_handover",
    statisticType: "count",
  });
  console.log(yearSelected);
  // let year;
  let years: any;
  years = Number(yearSelected);

  var query = lotLayer.createQuery();
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
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
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
    var num_parts = num.toString().split(".");
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
