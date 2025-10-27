import { useRef, useState, useEffect, use } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { generateLotProgress } from "../Query";
import {
  CalciteLabel,
  CalciteRadioButton,
  CalciteRadioButtonGroup,
} from "@esri/calcite-components-react";
import "@esri/calcite-components/dist/components/calcite-radio-button";
import "@esri/calcite-components/dist/components/calcite-radio-button-group";
import "@esri/calcite-components/dist/components/calcite-label";
import { primaryLabelColor, valueLabelColor } from "../uniqueValues";
import { MyContext } from "../App";
// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// https://www.amcharts.com/docs/v5/tutorials/dynamically-switching-data-set-for-an-xychart/
const LotProgressChart = () => {
  const { contractp, landtype, landsection } = use(MyContext);
  const xAxisRef = useRef<unknown | any | undefined>({});
  const yAxisRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [lotProgressData, setLotProgressData] = useState([]);
  const [yearSelected, setYearSelected] = useState<any>();
  const years = ["All", "2021", "2022", "2023", "2024", "2025"];
  console.log(contractp);

  const chartID = "lot-progress";
  useEffect(() => {
    generateLotProgress(yearSelected, contractp, landtype, landsection).then(
      (result: any) => {
        setLotProgressData(result);
      }
    );
  }, [contractp, landtype, landsection, yearSelected]);

  useEffect(() => {
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
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
      })
    );
    chartRef.current = chart;

    var cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomX",
      })
    );
    cursor.lineY.set("visible", false);

    // Chart title
    chart.children.unshift(
      am5.Label.new(root, {
        text: "Monthly Progress of Handed-Over Lots",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        fill: am5.color("#ffffff"),
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 0,
      })
    );

    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0,
        groupData: true,
        baseInterval: {
          timeUnit: "day",
          count: 1,
        },
        groupIntervals: [{ timeUnit: "month", count: 1 }],
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 60,
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: am5.color("#ffffff"),
        }),
        //tooltip: am5.Tooltip.new(root5, {})
      })
    );

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        calculateTotals: true,
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 60,
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: am5.color("#ffffff"),
        }),
      })
    );

    yAxis.get("renderer").labels.template.setAll({
      //oversizedBehavior: "wrap",//
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: 12,
    });

    xAxis.get("renderer").labels.template.setAll({
      //oversizedBehavior: "wrap",//
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: 12,
    });
    xAxisRef.current = xAxis;
    yAxisRef.current = yAxis;

    // Add yaxix title
    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "No. of handed-over lots",
        y: am5.p50,
        centerX: am5.p50,
        fill: am5.color("#ffffff"),
        fontSize: 11,
      })
    );

    // Add series
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        valueYGrouped: "sum",
      })
    );

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 1,
        locationX: 0.5,
        sprite: am5.Label.new(root, {
          text: "{valueYTotal}",
          fill: root.interfaceColors.get("alternativeText"),
          centerY: 0,
          centerX: am5.p50,
          populateText: true,
          fontSize: 10,
        }),
      });
    });

    series.columns.template.setAll({ strokeOpacity: 0 });
    series.data.setAll(lotProgressData);

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartID, lotProgressData]);

  return (
    <>
      <div
        id="chartAlignDiv"
        style={{
          display: "flex",
          border: "solid 1px gray",

          marginRight: "10px",
          marginLeft: "10px",
          backgroundColor: "#2b2b2b",
        }}
      >
        <div
          id="selection"
          style={{
            marginBottom: "auto",
            paddingTop: "15px",
            paddingLeft: "10px",
          }}
        >
          <CalciteRadioButtonGroup name="Options" layout="vertical">
            {years &&
              years.map((year: string, index: any) => {
                return (
                  <CalciteLabel layout="inline" scale="s" key={index}>
                    <CalciteRadioButton
                      value={year}
                      onCalciteRadioButtonChange={(event) =>
                        setYearSelected(event.target.value)
                      }
                    ></CalciteRadioButton>
                    {year}
                  </CalciteLabel>
                );
              })}
          </CalciteRadioButtonGroup>
        </div>

        <div
          id={chartID}
          style={{
            height: "32vh",
            width: "100%",
            backgroundColor: "#2b2b2b",
            color: "white",
            bottom: 50,
            marginLeft: "0.3vw",
            marginRight: "auto",
          }}
        ></div>
      </div>
    </>
  );
};

export default LotProgressChart;
