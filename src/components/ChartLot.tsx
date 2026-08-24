/* eslint-disable @typescript-eslint/no-unused-expressions */
import { use, useEffect, useRef, useState } from "react";
import {
  handedOverLotLayer,
  lotLayer,
  publicLotLayer,
  subterraenanLots18_layer,
  tobeHandedOverLotLayer,
} from "../layers";
import {
  pieChartData,
  thousands_separators,
  zoomToLayer,
  fieldStatistic,
  makeQuery,
  PieChartRender,
} from "../query";
import "@esri/calcite-components/components/calcite-checkbox";
import "@esri/calcite-components/components/calcite-label";
import {
  cp_f,
  lot_ho_f,
  lot_id_f,
  lot_section_f,
  lot_status_f,
  lot_status_q,
  lot_type_f,
  lot_xho_f,
  labelColor,
  valueColor,
} from "../uniqueValues";
import { ArcgisMap } from "@arcgis/map-components/dist/components/arcgis-map";
import { useQuery } from "@tanstack/react-query";
import type { ChartResponse } from "../interfaceKeys";
import { queryDefinitionExpression } from "../queryDefinition";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import ChartPieSeriesRender from "chart-pie-series-render";
import { MyContext } from "../contexts/MyContext";
import ChartPieSeries from "chart-pie-series";

const ChartLot = () => {
  const { cpackage, landtype, landsection } = use(MyContext);
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

  //--- Common qValues and qFields for QueryExpressionLayers class
  const qV = [cpackage, landtype, landsection];
  const qF = [cp_f, lot_type_f, lot_section_f];
  const queryc = makeQuery(qV, qF);
  const queryc2 = makeQuery(qV, qF, `StatusNVS3 IS NULL`);

  //--- 2. Streamlined Data Fetching with useQuery
  const { data, isLoading } = useQuery<ChartResponse | any>({
    queryKey: [cpackage, landtype, landsection, lot_status_f, lotLayer],
    queryFn: async () => {
      queryDefinitionExpression({
        queryExpression: queryc.queryExpression(),
        featureLayer: [
          lotLayer,
          handedOverLotLayer,
          publicLotLayer,
          tobeHandedOverLotLayer,
          subterraenanLots18_layer,
        ],
      });

      const [chartData, totaln, publicn, total_ho, total_xho] =
        await Promise.all([
          //--- chart data
          pieChartData({
            piechart: new ChartPieSeries(),
            qChart: queryc,
            layer: lotLayer,
            statusList: lot_status_q,
            statusField: lot_status_f,
            statisticField: lot_status_f,
            statisticType: "count",
          }),

          //--- total number of lots (public + private)
          fieldStatistic({
            where: queryc.queryExpression(),
            layer: lotLayer,
            statisticField: `${lot_id_f}`,
            statisticType: "count",
          }),

          //--- total number of public lots
          fieldStatistic({
            where: queryc2.queryExpression(),
            layer: lotLayer,
            statisticField: `${lot_id_f}`,
            statisticType: "count",
          }),

          //--- Number of handed-over lots (GC to JV)
          fieldStatistic({
            where: queryc.queryExpression(),
            layer: lotLayer,
            statisticField: lot_ho_f,
            statisticType: "sum",
          }),

          //--- Number of To-be-handed-over lots (to JV)
          fieldStatistic({
            where: queryc.queryExpression(),
            layer: lotLayer,
            statisticField: lot_xho_f,
            statisticType: "sum",
          }),
        ]);

      //--- Percent handed over
      const perc_ho = ((total_ho / totaln) * 100).toFixed(1);

      //--- Percent to-be-handed-over
      const perc_tob_ho = ((total_xho / totaln) * 100).toFixed(1);

      zoomToLayer(lotLayer, arcgisMap);

      return {
        chartData: chartData[0] || [],
        lotNumber: totaln,
        publicn: publicn,
        total_ho: total_ho,
        total_xho: total_xho,
        perc_ho: perc_ho,
        perc_tobe_ho: perc_tob_ho,
      };
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const chartData = data?.chartData || [];
  const totaln = data?.lotNumber || 0;
  const total_ho = data?.total_ho || 0;
  const total_xho = data?.total_xho || 0;
  const publicn = data?.publicn || 0;
  const perc_ho = data?.perc_ho || 0;
  const perce_tobe_ho = data?.perc_tobe_ho || 0;

  // Chart Resize parameters
  const new_fontSize = chartPanelwidth / 28;
  const new_valueSize = chartPanelwidth / 16;
  const new_pieSeriesScale = 220;
  const new_pieInnerValueFontSize = "1.1rem";
  const new_pieInnerLabelFontSize = "0.45em";

  // 1. Land Acquisition
  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "pie-two";

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter(root);
    chartRef.current = chart;

    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
      radius: 40,
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
    legend.setAll({ marginBottom: 50 });
    legend.data.setAll(pieSeries.dataItems);

    // chart renderer
    PieChartRender({
      render: new ChartPieSeriesRender(),
      chart,
      pieSeries: pieSeries,
      legend,
      root,
      qChart: queryc,
      q2Expression: undefined,
      status_field: lot_status_f,
      view: arcgisMap?.view,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      seriesScale: new_pieSeriesScale,
      innerLabel: "PRIVATE LOTS",
      innerLabelFontSize: new_pieInnerLabelFontSize,
      innerValueFontSize: new_pieInnerValueFontSize,
      layer: lotLayer,
      statusArray: lot_status_q,
      bkg_color_switch: false,
      seriesFillHash: undefined,
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
    <calcite-panel
      scale="s"
      slot="panel-end"
      collapsible
      heading={panelHeader}
      // headingLevel={3}
      id="chart-panel"
      collapseDirection="up"
      style={{
        "--calcite-panel-heading-text-color": labelColor,
        "--calcite-panel-background-color": "#2b2b2b",
        borderStyle: "solid",
        borderRightWidth: 5,
        borderLeftWidth: 5,
        borderBottomWidth: 5,
        borderColor: "#555555",
        width: panelWidth,
        overflowY: "auto",
        overflowX: "hidden",
        display: "block", // without adding display, background will not disappear.
        scrollbarWidth: "none",
      }}
      onClick={handlePanelCollapse}
    >
      <div
        style={{
          display: "flex",
          gap: "65px",
          marginTop: "2%",
          justifyContent: "center",
        }}
      >
        <dl style={{ alignItems: "center" }}>
          <dt style={{ color: labelColor, fontSize: `${new_fontSize}px` }}>
            TOTAL LOTS
          </dt>
          <dd
            style={{
              color: valueColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              opacity: isLoading ? 0 : 1,
              textAlign: "center",
            }}
          >
            {thousands_separators(totaln)}
          </dd>
        </dl>

        {/* Public Lot Number */}
        <dl style={{ alignItems: "center", marginRight: "20px" }}>
          <dt style={{ color: labelColor, fontSize: `${new_fontSize}px` }}>
            PUBLIC LOTS
          </dt>
          <dd
            style={{
              color: valueColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              opacity: isLoading ? 0 : 1,
              textAlign: "center",
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
          width: "100%",
          height: "62vh",
          color: "white",
          opacity: isLoading ? 0 : 1,
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
        <dl style={{ justifyContent: "space-between" }}>
          <dt style={{ color: labelColor, fontSize: `${new_fontSize}px` }}>
            <div style={{ marginBottom: "5px" }}>HANDED-OVER (GC to JV)</div>
          </dt>
          <dd
            style={{
              color: valueColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              margin: "auto",
              textAlign: "center",
            }}
          >
            {perc_ho}% ({thousands_separators(total_ho)})
          </dd>
        </dl>

        <dl style={{ justifyContent: "space-between", marginRight: "5%" }}>
          <dt style={{ color: labelColor, fontSize: `${new_fontSize}px` }}>
            <div style={{ marginBottom: "5px" }}>TO BE HANDED-OVER (to JV)</div>
          </dt>
          <dd
            style={{
              color: valueColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              margin: "auto",
              textAlign: "center",
            }}
          >
            {perce_tobe_ho}% ({thousands_separators(total_xho)})
          </dd>
        </dl>
      </div>
    </calcite-panel>
  );
}; // End of lotChartgs

export default ChartLot;
