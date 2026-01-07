import { use, useEffect, useRef, useState } from "react";
import { handedOverLotLayer, lotLayer, publicLotLayer } from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";

import "../App.css";
import {
  generateHandedOver,
  generateLotData,
  generateLotNumber,
  thousands_separators,
  zoomToLayer,
} from "../Query";

import {
  CalciteLabel,
  CalciteCheckbox,
  CalcitePanel,
} from "@esri/calcite-components-react";
import "@esri/calcite-components/dist/components/calcite-checkbox";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-panel";

import { primaryLabelColor, statusLotQuery } from "../uniqueValues";
import { MyContext } from "../App";
import { ArcgisMap } from "@arcgis/map-components/dist/components/arcgis-map";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

///*** Others */
/// Draw chart
const LotChart = (backgcolorswitch: any) => {
  const arcgisMap = document.querySelector("arcgis-map") as ArcgisMap;
  const { contractp, landtype, landsection } = use(MyContext);

  const background_color_switch = backgcolorswitch.backgcolorswitch;

  useEffect(() => {
    zoomToLayer(lotLayer, arcgisMap);
  }, [contractp, landtype, landsection]);

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

  // Handed Over View checkbox
  const [handedOverCheckBox, setHandedOverCheckBox] = useState<boolean>(false);

  // Background color switch
  const [backgroundColor, setBackgroundColor] = useState<any>("#2b2b2b");
  const [labelColor, setLabelColor] = useState<any>("#d1d5db");

  // Query
  const qCP = "Package = '" + contractp + "'";
  const qLandType = "Type = '" + landtype + "'";
  const qCpLandType = qCP + " AND " + qLandType;
  const qLandSection = "Station1 ='" + landsection + "'";
  const qCpLandTypeSection = qCpLandType + " AND " + qLandSection;

  if (!contractp) {
    lotLayer.definitionExpression = "1=1";
    handedOverLotLayer.definitionExpression = "1=1";
    publicLotLayer.definitionExpression = "1=1";
    // pteLotSubteLayer1.definitionExpression = '1=1';
  } else if (contractp && !landtype && !landsection) {
    lotLayer.definitionExpression = qCP;
    handedOverLotLayer.definitionExpression = qCP;
    publicLotLayer.definitionExpression = qCP;
    // pteLotSubteLayer1.definitionExpression = qCP;
  } else if (contractp && landtype && !landsection) {
    lotLayer.definitionExpression = qCpLandType;
    handedOverLotLayer.definitionExpression = qCpLandType;
    publicLotLayer.definitionExpression = qCpLandType;
    // pteLotSubteLayer1.definitionExpression = qCpLandType;
  } else {
    lotLayer.definitionExpression = qCpLandTypeSection;
    handedOverLotLayer.definitionExpression = qCpLandTypeSection;
    publicLotLayer.definitionExpression = qCpLandTypeSection;
    // pteLotSubteLayer1.definitionExpression = qCpLandTypeSection;
  }

  // Background color change
  useEffect(() => {
    if (background_color_switch === false) {
      setBackgroundColor("#2b2b2b");
      setLabelColor("#d1d5db");
    } else {
      setBackgroundColor("white");
      setLabelColor("black");
    }
  }, [background_color_switch]);

  // Highlight Handed Over lots
  useEffect(() => {
    if (handedOverCheckBox === true) {
      handedOverLotLayer.visible = true;
    } else {
      handedOverLotLayer.visible = false;
    }
  }, [handedOverCheckBox, contractp, landtype, landsection]);

  useEffect(() => {
    generateLotData(contractp, landtype, landsection).then((result: any) => {
      setLotData(result);
    });

    // Lot number
    generateLotNumber().then((response: any) => {
      setLotNumber(response);
    });

    generateHandedOver().then((response: any) => {
      setHandedOverNumber(response);
    });

    // if (!landtype) {
    //   // Handed Over (Lot) + PTE (Subterranean)
    //   generateHandedOverPTE().then((response: any) => {
    //     setHandedOverPteNumber(response);
    //   });
    // } else if (landtype === 'Station') {
    //   // Handed Ove for Lot
    //   generateHandedOver().then((response: any) => {
    //     setHandedOverPteNumber(response);
    //   });
    // } else if (landtype === 'Subterranean') {
    //   // PTE for Subterranean
    //   generatePTE().then((response: any) => {
    //     setHandedOverPteNumber(response);
    //   });
    // }

    // Mode of Acquisition
    // generateLotMoaData(contractp, landtype, landsection).then((response: any) => {
    //   setLotMoaData(response);
    // });
  }, [contractp, landtype, landsection]);

  // useLayoutEffect runs synchronously. If this is used with React.lazy,
  // Every time calcite action is fired, the chart is fired, too.
  // To avoid, use useEffect instead of useLayoutEffect

  // 1. Pie Chart for Land Acquisition
  useEffect(() => {
    // Dispose previously created root element

    maybeDisposeRoot(chartID);

    var root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );
    chartRef.current = chart;

    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    var pieSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField: "category",
        valueField: "value",
        //legendLabelText: "[{fill}]{category}[/]",
        legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        radius: am5.percent(45), // outer radius
        innerRadius: am5.percent(28),
        scale: 1.7,
      })
    );
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    // values inside a donut
    let inner_label = pieSeries.children.push(
      am5.Label.new(root, {
        text: "[#ffffff]{valueSum}[/]\n[fontSize: 0.5em; #d3d3d3; verticalAlign: super]LOTS[/]",
        // text: '[#000000]{valueSum}[/]\n[fontSize: 0.5em; #d3d3d3; verticalAlign: super]LOTS[/]',
        fontSize: "1.4em",
        centerX: am5.percent(50),
        centerY: am5.percent(40),
        populateText: true,
        oversizedBehavior: "fit",
        textAlign: "center",
      })
    );

    pieSeries.onPrivate("width", (width: any) => {
      inner_label.set("maxWidth", width * 0.7);
    });

    // Set slice opacity and stroke colord
    pieSeries.slices.template.setAll({
      toggleKey: "none",
      fillOpacity: 0.9,
      stroke:
        background_color_switch === false
          ? am5.color("#ffffff")
          : am5.color("#000000"),
      strokeWidth: 0.5,
      strokeOpacity: 1,
      templateField: "sliceSettings",
    });

    // Disabling labels and ticksll
    pieSeries.labels.template.set("visible", false);
    pieSeries.ticks.template.set("visible", false);

    // EventDispatcher is disposed at SpriteEventDispatcher...
    // It looks like this error results from clicking events
    pieSeries.slices.template.events.on("click", (ev) => {
      const selected: any = ev.target.dataItem?.dataContext;
      const categorySelected: string = selected.category;
      const find = statusLotQuery.find(
        (emp: any) => emp.category === categorySelected
      );
      const statusSelect = find?.value;

      let highlightSelect: any;
      var query = lotLayer.createQuery();

      arcgisMap?.whenLayerView(lotLayer).then((layerView: any) => {
        //chartLayerView = layerView;

        lotLayer.queryFeatures(query).then(function (results) {
          const RESULT_LENGTH = results.features;
          const ROW_N = RESULT_LENGTH.length;

          let objID = [];
          for (var i = 0; i < ROW_N; i++) {
            var obj = results.features[i].attributes.OBJECTID;
            objID.push(obj);
          }

          var queryExt = new Query({
            objectIds: objID,
          });

          lotLayer.queryExtent(queryExt).then(function (result) {
            if (result.extent) {
              arcgisMap?.goTo(result.extent);
            }
          });

          if (highlightSelect) {
            highlightSelect.remove();
          }
          highlightSelect = layerView.highlight(objID);

          arcgisMap?.view.on("click", function () {
            layerView.filter = new FeatureFilter({
              where: undefined,
            });
            highlightSelect.remove();
          });
        }); // End of queryFeatures

        layerView.filter = new FeatureFilter({
          where: "H_Level = " + statusSelect,
        });

        // For initial state, we need to add this
        arcgisMap?.view.on("click", () => {
          layerView.filter = new FeatureFilter({
            where: undefined,
          });
          highlightSelect !== undefined
            ? highlightSelect.remove()
            : console.log("");
        });
      }); // End of view.whenLayerView
    });

    pieSeries.data.setAll(lotData);

    // Legend
    // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
      })
    );
    legendRef.current = legend;
    legend.data.setAll(pieSeries.dataItems);

    // Change the size of legend markers
    legend.markers.template.setAll({
      width: 18,
      height: 18,
    });

    // Change the marker shape
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10,
    });

    // Responsive legend
    // https://www.amcharts.com/docs/v5/tutorials/pie-chart-with-a-legend-with-dynamically-sized-labels/
    // This aligns Legend to Left
    chart.onPrivate("width", function (width: any) {
      const boxWidth = 220; //props.style.width;
      var availableSpace = Math.max(
        width - chart.height() - boxWidth,
        boxWidth
      );
      //var availableSpace = (boxWidth - valueLabelsWidth) * 0.7
      legend.labels.template.setAll({
        width: availableSpace,
        maxWidth: availableSpace,
      });
    });

    // To align legend items: valueLabels right, labels to left
    // 1. fix width of valueLabels
    // 2. dynamically change width of labels by screen size

    // Change legend labelling properties
    // To have responsive font size, do not set font size
    legend.labels.template.setAll({
      oversizedBehavior: "truncate",
      fill: am5.color("#ffffff"),
      fontSize: "14px",
    });

    legend.valueLabels.template.setAll({
      textAlign: "right",
      //width: valueLabelsWidth,
      fill: am5.color("#ffffff"),
      //fontSize: LEGEND_FONT_SIZE,
      fontSize: "14px",
    });

    legend.itemContainers.template.setAll({
      // set space between legend items
      paddingTop: 3,
      paddingBottom: 1,
    });

    pieSeries.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartID, lotData, backgcolorswitch]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(lotData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <>
      <CalcitePanel
        slot="panel-end"
        scale="s"
        style={{
          width: "35vw",
          padding: "0 1rem",
          borderStyle: "solid",
          borderRightWidth: 3.5,
          borderLeftWidth: 3.5,
          borderBottomWidth: 4.5,
          borderColor: "#555555",
        }}
      >
        <CalciteLabel>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {/* Total Lot Number */}
            <div
              style={{
                color: "#d1d5db",
                fontSize: "1.1vw",
                paddingBottom: "20px",
                paddingTop: "0.6vh",
                margin: "auto",
              }}
            >
              TOTAL LOTS
              <div
                style={{
                  color: "#d1d5db",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  fontFamily: "calibri",
                  marginLeft: "20%",
                  paddingTop: "2vh",
                }}
              >
                {thousands_separators(lotNumber[1])}
                <div
                  style={{
                    color: "#d1d5db",
                    justifyContent: "center",
                    fontSize: "1.3vw",
                    fontWeight: "normal",
                    marginLeft: "10px",
                    marginTop: "15px",
                  }}
                >
                  ({thousands_separators(lotNumber[0])})
                </div>
              </div>
            </div>

            {/* Public Lot Number */}
            <div
              style={{
                color: "#d1d5db",
                fontSize: "1.1vw",
                paddingBottom: "20px",
                paddingTop: "0.6vh",
                margin: "auto",
              }}
            >
              PUBLIC LOTS
              <div
                style={{
                  color: "#d1d5db",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  fontFamily: "calibri",
                  paddingTop: "2vh",
                  marginLeft: "20%",
                }}
              >
                {thousands_separators(lotNumber[2])}
                <div
                  style={{
                    color: "#d1d5db",
                    justifyContent: "center",
                    fontSize: "1.3vw",
                    fontWeight: "normal",
                    marginLeft: "10px",
                    marginTop: "15px",
                  }}
                >
                  <span style={{ color: "#ffffff00" }}>..</span>
                </div>
              </div>
            </div>
            <img
              src="https://EijiGorilla.github.io/Symbols/Land_logo.png"
              alt="Land Logo"
              height={"45px"}
              width={"45px"}
              style={{ margin: "auto" }}
            />
          </div>
        </CalciteLabel>

        {/* Lot Chart */}
        <div
          id={chartID}
          style={{
            height: "53vh",
            backgroundColor: "rgb(0,0,0,0)",
            color: "white",
            marginTop: "3vh",
            marginBottom: "10vh",
          }}
        ></div>

        {/* Handed-Over/PTE */}
        <CalciteLabel>
          <span style={{ color: "#d1d5db", fontSize: "1.1vw" }}>
            HANDED-OVER
          </span>
        </CalciteLabel>
        <CalciteLabel layout="inline">
          {handedOverNumber[0] === "Infinity" ? (
            <b className="handedOverNumber">
              N/A
              <img
                src="https://EijiGorilla.github.io/Symbols/Handed_Over_Logo.svg"
                alt="Land Logo"
                height={"18%"}
                width={"18%"}
                style={{
                  marginLeft: "70%",
                  display: "flex",
                  marginTop: "-10%",
                }}
              />
            </b>
          ) : (
            <b className="handedOverNumber">
              {handedOverNumber[0]}% (
              {thousands_separators(handedOverNumber[1])})
              <img
                src="https://EijiGorilla.github.io/Symbols/Handed_Over_Logo.svg"
                alt="Land Logo"
                height={"18%"}
                width={"18%"}
                style={{
                  marginLeft: "70%",
                  display: "flex",
                  marginTop: "-10%",
                }}
              />
            </b>
          )}
        </CalciteLabel>
      </CalcitePanel>
    </>
  );
}; // End of lotChartgs

export default LotChart;
