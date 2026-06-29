/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState } from "react";
import {
  handedOverLotLayer,
  lotLayer,
  publicLotLayer,
  queryc_lot,
  queryc_lot2,
  subterraenanLots18_layer,
  tobeHandedOverLotLayer,
} from "../layers";
import { thousands_separators, zoomToLayer } from "../query";
import "@esri/calcite-components/components/calcite-checkbox";
import "@esri/calcite-components/components/calcite-label";
import {
  handedOverField,
  lot_id_field,
  lotStatusField,
  primaryLabelColor,
  statusLotQuery,
  tobeHandedOverField,
  valueLabelColor,
} from "../uniqueValues";
import { ArcgisMap } from "@arcgis/map-components/dist/components/arcgis-map";
import { chartRenderer } from "../chartRenderer";
import { pieChartStatusData, fieldStatistic } from "../chartGenerator";
import { useQuery } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation, ChartResponse } from "../interfaceKeys";
import { queryDefinitionExpression } from "../queryDefinition";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";

const ChartLot = () => {
  const arcgisMap = document.querySelector("arcgis-map") as ArcgisMap;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const [panelWidth, setPanelWidth] = useState<string>("40%");
  const [panelHeader, setPanelHeader] = useState<string>("Chart");

  const handlePanelCollapse = (event: any) => {
    const collapse_state = event.target.collapsed;

    if (collapse_state) {
      setPanelWidth("50px");
      setPanelHeader("");
    } else {
      setPanelWidth("40%");
      setPanelHeader("Chart");
    }
  };

  //--- 1. Location state
  const { data: selectedLocation } = useQuery<SelectedLocation | any>({
    queryKey: locationKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });
  const cpackage = selectedLocation?.cpackage;
  const landType = selectedLocation?.landType;
  const landSection = selectedLocation?.landSection;

  const queryList = [cpackage, landType, landSection];

  //--- 2. Streamlined Data Fetching with useQuery
  const { data } = useQuery<ChartResponse | any>({
    queryKey: [queryList, lotStatusField, lotLayer],
    queryFn: async () => {
      queryc_lot.qValues = queryList;
      queryDefinitionExpression({
        queryExpression: queryc_lot.queryExpression(),
        featureLayer: [
          lotLayer,
          handedOverLotLayer,
          publicLotLayer,
          tobeHandedOverLotLayer,
          subterraenanLots18_layer,
        ],
      });

      //--- chart data
      const chartData = await pieChartStatusData({
        qChart: queryc_lot.queryExpression(),
        layer: lotLayer,
        statusList: statusLotQuery,
        statusField: lotStatusField,
        statisticField: lotStatusField,
        statisticType: "count",
      });

      //--- total number of lots (public + private)
      const totaln = await fieldStatistic({
        qChart: queryc_lot.queryExpression(),
        layer: lotLayer,
        statisticField: lot_id_field,
        statisticType: "count",
      });

      //--- total number of public lots
      queryc_lot2.qValues = queryList;
      queryc_lot2.qExpression = "StatusNVS3 IS NULL";

      const publicn = await fieldStatistic({
        qChart: queryc_lot2.queryExpression(),
        layer: publicLotLayer,
        statisticField: lot_id_field,
        statisticType: "count",
      });

      //--- Number of handed-over lots (GC to JV)
      const total_ho = await fieldStatistic({
        qChart: queryc_lot.queryExpression(),
        layer: lotLayer,
        statisticField: handedOverField,
        statisticType: "sum",
      });

      //--- Number of To-be-handed-over lots (to JV)
      const total_tobe_ho = await fieldStatistic({
        qChart: queryc_lot.queryExpression(),
        layer: lotLayer,
        statisticField: tobeHandedOverField,
        statisticType: "sum",
      });

      //--- Percent handed over
      const perc_ho = ((total_ho / totaln) * 100).toFixed(1);

      //--- Percent to-be-handed-over
      const perc_tob_ho = ((total_tobe_ho / totaln) * 100).toFixed(1);

      zoomToLayer(lotLayer, arcgisMap);

      return {
        chartData: chartData[0] || [],
        lotNumber: totaln,
        publicn: publicn,
        total_ho: total_ho,
        total_tob_ho: total_tobe_ho,
        perc_ho: perc_ho,
        perc_tobe_ho: perc_tob_ho,
      };
    },
    staleTime: Infinity,
  });
  const chartData = data?.chartData || [];
  const totaln = data?.lotNumber || 0;
  const total_ho = data?.total_ho || 0;
  const total_tobe_ho = data?.total_tob_ho || 0;
  const publicn = data?.publicn || 0;
  const perc_ho = data?.perc_ho || 0;
  const perce_tobe_ho = data?.perc_tobe_ho || 0;

  // Chart Resize parameters
  const new_fontSize = chartPanelwidth / 22.3;
  const new_valueSize = new_fontSize * 1.55;
  const new_imageSize = chartPanelwidth * 0.028;
  // const new_asofDateSize = chartPanelwidth * 0.032;
  const new_pieSeriesScale = 220;
  const new_pieInnerValueFontSize = "1.1rem";
  const new_pieInnerLabelFontSize = "0.45em";

  // 1. Land Acquisition
  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "pie-two";

  // 1. Pie Chart for Land Acquisition
  useEffect(() => {
    // maybeDisposeRoot(chartID);

    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter(root);
    chartRef.current = chart;

    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
      radius: 45,
      innerRadius: 28,
      scale: 1,
    });
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    // Legend
    const legend = legendSetter({
      chart: chart,
      root: root,
      centerX: 50,
      x: 50,
    });
    legendRef.current = legend;
    legend.data.setAll(pieSeries.dataItems);

    chartRenderer({
      chart: chart,
      pieSeries: pieSeries,
      legend: legend,
      root: root,
      qChart: queryc_lot,
      status_field: lotStatusField,
      arcgisMap: arcgisMap,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      pieSeriesScale: new_pieSeriesScale,
      pieInnerLabel: "TOTAL LOTS",
      pieInnerLabelFontSize: new_pieInnerLabelFontSize,
      pieInnerValueFontSize: new_pieInnerValueFontSize,
      layer: lotLayer,
      statusArray: statusLotQuery,
      background_color_switch: false,
    });
    return () => {
      root.dispose();
    };
  }, [chartID, chartData]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(chartData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <>
      <calcite-panel
        scale="s"
        slot="panel-end"
        collapsible
        heading={panelHeader}
        // headingLevel={3}
        id="chart-panel"
        collapseDirection="up"
        style={{
          "--calcite-panel-heading-text-color": primaryLabelColor,
          "--calcite-panel-background-color": "#2b2b2b",
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          borderColor: "#555555",
          width: panelWidth,
          overflowY: "auto",
          display: "block", // without adding display, background will not disappear.
        }}
        onClick={handlePanelCollapse}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <img
            src="https://EijiGorilla.github.io/Symbols/Land_logo.png"
            alt="Land Logo"
            height={`${new_imageSize}%`}
            width={`${new_imageSize}%`}
            style={{ marginTop: "15px", marginLeft: "20px" }}
          />
          <dl style={{ alignItems: "center" }}>
            <dt
              style={{
                color: primaryLabelColor,
                fontSize: `${new_fontSize}px`,
              }}
            >
              TOTAL LOTS
            </dt>
            <dd
              style={{
                color: valueLabelColor,
                fontSize: `${new_valueSize}px`,
                fontWeight: "bold",
                fontFamily: "calibri",
                lineHeight: "1.2",
                margin: "auto",
              }}
            >
              {thousands_separators(totaln)}
            </dd>
          </dl>

          {/* Public Lot Number */}
          <dl style={{ alignItems: "center", marginRight: "20px" }}>
            <dt
              style={{
                color: primaryLabelColor,
                fontSize: `${new_fontSize}px`,
              }}
            >
              PUBLIC LOTS
            </dt>
            <dd
              style={{
                color: valueLabelColor,
                fontSize: `${new_valueSize}px`,
                fontWeight: "bold",
                fontFamily: "calibri",
                lineHeight: "1.2",
                margin: "auto",
              }}
            >
              {thousands_separators(publicn)}
            </dd>
          </dl>
        </div>

        {/* Lot Chart */}
        <div
          id={chartID}
          style={{
            // width: "100%",
            height: "57vh",
            color: "white",
            // marginBottom: "3%",
          }}
        ></div>

        {/* Handed-Over */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            lineHeight: "1.2",
            padding: "0px 0px 0px 20px",
          }}
        >
          <dl>
            <dt
              style={{
                color: primaryLabelColor,
                fontSize: `${new_fontSize}px`,
              }}
            >
              <div>Handed Over</div>
              <div>(GC to JV)</div>
            </dt>
            <dd
              style={{
                color: valueLabelColor,
                fontSize: `${new_valueSize}px`,
                fontWeight: "bold",
                fontFamily: "calibri",
                margin: "auto",
              }}
            >
              {perc_ho}% ({thousands_separators(total_ho)})
            </dd>
          </dl>

          <dl>
            <dt
              style={{
                color: primaryLabelColor,
                fontSize: `${new_fontSize}px`,
                marginRight: "30px",
              }}
            >
              <div>To be Handed Over</div>
              <div>(to JV)</div>
            </dt>
            <dd
              style={{
                color: valueLabelColor,
                fontSize: `${new_valueSize}px`,
                fontWeight: "bold",
                fontFamily: "calibri",
                margin: "auto",
              }}
            >
              {perce_tobe_ho}% ({thousands_separators(total_tobe_ho)})
            </dd>
          </dl>
        </div>
      </calcite-panel>
    </>
  );
}; // End of lotChartgs

export default ChartLot;
