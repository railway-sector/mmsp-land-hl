/* eslint-disable @typescript-eslint/no-unused-expressions */
import { use, useEffect, useRef, useState } from "react";
import { lotLayer } from "../layers";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import {
  chartRenderer,
  generateHandedOver,
  generateLotData,
  generateLotNumber,
  generateToBeHandedOver,
  queryLayersExpression,
  thousands_separators,
  zoomToLayer,
} from "../Query";
import "@esri/calcite-components/components/calcite-checkbox";
import "@esri/calcite-components/components/calcite-label";
import "@esri/calcite-components/components/calcite-panel";
import {
  lotStatusField,
  primaryLabelColor,
  statusLotQuery,
  valueLabelColor,
} from "../uniqueValues";
import { ArcgisMap } from "@arcgis/map-components/dist/components/arcgis-map";
import { MyContext } from "../contexts/MyContext";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// ************************************
//  Chart
// ***********************************
const LotChart = () => {
  const arcgisMap = document.querySelector("arcgis-map") as ArcgisMap;
  const {
    contractp,
    landtype,
    landsection,
    updateChartPanelwidth,
    chartPanelwidth,
  } = use(MyContext);

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

  // Chart Resize parameters
  const new_fontSize = chartPanelwidth / 22.3;
  const new_valueSize = new_fontSize * 1.55;
  const new_imageSize = chartPanelwidth * 0.028;
  // const new_asofDateSize = chartPanelwidth * 0.032;
  const new_pieSeriesScale = 260;
  const new_pieInnerValueFontSize = "1.1rem";
  const new_pieInnerLabelFontSize = "0.6em";

  // 1. Land Acquisition
  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [lotData, setLotData] = useState([
    {
      category: String,
      value: Number,
      sliceSettings: {
        fill: am5.color("#00c5ff"),
      },
    },
  ]);

  const chartID = "pie-two";

  const [lotNumber, setLotNumber] = useState([]);
  const [handedOverNumber, setHandedOverNumber] = useState([]);
  const [toBeHandedOverNumber, setToBeHandedOverNumber] = useState([]);

  useEffect(() => {
    queryLayersExpression({
      contractcp: contractp,
      landtype: landtype,
      landsection: landsection,
      arcgisMap: arcgisMap,
    });

    generateLotData(contractp, landtype, landsection).then((result: any) => {
      setLotData(result);
    });

    // Lot number
    generateLotNumber(contractp, landtype, landsection).then(
      (response: any) => {
        setLotNumber(response);
      },
    );

    generateHandedOver(contractp, landtype, landsection).then(
      (response: any) => {
        setHandedOverNumber(response);
      },
    );

    generateToBeHandedOver(contractp, landtype, landsection).then(
      (response: any) => {
        setToBeHandedOverNumber(response);
      },
    );

    zoomToLayer(lotLayer, arcgisMap);
  }, [contractp, landtype, landsection]);

  // 1. Pie Chart for Land Acquisition
  useEffect(() => {
    // Dispose previously created root element

    maybeDisposeRoot(chartID);

    const root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      }),
    );
    chartRef.current = chart;

    // Create series
    const pieSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField: "category",
        valueField: "value",
        legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        radius: am5.percent(45), // outer radius
        innerRadius: am5.percent(28),
      }),
    );
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    // Legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
      }),
    );
    legendRef.current = legend;
    legend.data.setAll(pieSeries.dataItems);

    chartRenderer({
      chart: chart,
      pieSeries: pieSeries,
      legend: legend,
      root: root,
      contractcp: contractp,
      landtype: landtype,
      landsection: landsection,
      status_field: lotStatusField,
      arcgisMap: arcgisMap,
      updateChartPanelwidth: updateChartPanelwidth,
      data: lotData,
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
  }, [chartID, lotData]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(lotData);
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
              {thousands_separators(lotNumber[0])}
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
              {thousands_separators(lotNumber[2])}
            </dd>
          </dl>
        </div>

        {/* Lot Chart */}
        <div
          id={chartID}
          style={{
            width: "100%",
            height: "55vh",
            color: "white",
            marginBottom: "3%",
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
              {handedOverNumber[0]}% (
              {thousands_separators(handedOverNumber[1])})
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
              {toBeHandedOverNumber[0]}% (
              {thousands_separators(toBeHandedOverNumber[1])})
            </dd>
          </dl>
        </div>
      </calcite-panel>
    </>
  );
}; // End of lotChartgs

export default LotChart;
