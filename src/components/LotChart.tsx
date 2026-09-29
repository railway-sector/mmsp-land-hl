import { useEffect, useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useMyContext, type SelectedLocation } from "../contexts/MyContext";
import { fieldStatistic, pieChartStatusData } from "../Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import {
  lotLayer,
  lotStatuses,
  lotstatisticField,
  lotStatusField,
  lotHighLevelField,
  DEFAULT_HANDED_OVER_FIELD,
  DEFAULT_NOT_YET_FIELD,
  handedOverLotsLayer,
  toBeHandedOverLotsLayer,
  subterraneanLotsLayer,
} from "../layers";
import QueryExpressionLayers from "../CreateQueryJosh";
import { filterAndGetTargetExtent } from "../MapQuery";
import { mapView } from "../components/MapDisplay";

const CHART_ID = "lotPieChart";

type ChartDatum = { category: string; value: number; color: string; code: number | string };

// ----------------------------------------------------
// DATA FETCHING
// Public lots = lotStatusField (StatusNVS3) is null.
// keepPreviousData keeps `data` populated across filter changes.
// ----------------------------------------------------
function useLotData({ packageName, type, station }: SelectedLocation) {
  return useQuery({
    queryKey: ["totalLots", packageName, type, station],
    queryFn: async () => {
      const baseFilter = {
        qFields: ["Package", "Type", "Station1"] as [any?, any?, any?],
        qValues: [packageName, type, station] as [any?, any?, any?],
      };

      const totalWhere = new QueryExpressionLayers({ ...baseFilter }).queryExpression();
      const publicWhere = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${lotStatusField} IS NULL`,
      }).queryExpression();
      const handedOverWhere = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${DEFAULT_HANDED_OVER_FIELD} = 1`,
      }).queryExpression();
      const toBeHandedOverWhere = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${DEFAULT_NOT_YET_FIELD} = 1`,
      }).queryExpression();
      const statusWhere = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${lotHighLevelField} IS NOT NULL`,
      }).queryExpression();

      const commonArgs = {
        layer: lotLayer,
        statisticField: lotstatisticField,
        statisticType: "count" as const,
      };

      const [totalNumber, publicNumber, handedOverNumber, toBeHandedOverNumber, chartData] =
        await Promise.all([
          fieldStatistic({ where: totalWhere, ...commonArgs }),
          fieldStatistic({ where: publicWhere, ...commonArgs }),
          fieldStatistic({ where: handedOverWhere, ...commonArgs }),
          fieldStatistic({ where: toBeHandedOverWhere, ...commonArgs }),
          pieChartStatusData({
            where: statusWhere,
            layer: lotLayer,
            statusList: lotStatuses,
            statusField: lotHighLevelField,
            statisticField: lotstatisticField,
            statisticType: "count",
          }),
        ]);

      const privateNumber = totalNumber - publicNumber;

      return {
        totalNumber,
        publicNumber,
        privateNumber,
        handedOverNumber,
        toBeHandedOverNumber,
        chartData,
      };
    },
    placeholderData: keepPreviousData,
  });
}

// Disposes a previous chart root under this id (avoids duplicates on remount)
function maybeDisposeRoot(divId: string) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// ----------------------------------------------------
// CHART LIFECYCLE
// Builds the pie chart once, disposes on unmount, updates data/color
// in place afterward (no rebuild).
// ----------------------------------------------------
function usePieChart(
  chartData: ChartDatum[],
  selectedCode: number | string | null,
  onSliceClick: (code: number | string | null) => void,
  textColor: string,
) {
  const pieSeriesRef = useRef<any>({});
  const legendRef = useRef<any>({});

  // Ref so the click handler always reads the latest selectedCode
  const selectedCodeRef = useRef<number | string | null>(selectedCode);
  useEffect(() => {
    selectedCodeRef.current = selectedCode;
  }, [selectedCode]);

  // Ref so chart creation (mount-only) can read textColor without
  // depending on it
  const textColorRef = useRef(textColor);
  useEffect(() => {
    textColorRef.current = textColor;
  }, [textColor]);

  useEffect(() => {
    maybeDisposeRoot(CHART_ID);

    const root = am5.Root.new(CHART_ID);
    root.container.children.clear();
    root._logo?.dispose();

    root.setThemes([am5themes_Animated.new(root), am5themes_Responsive.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, { layout: root.verticalLayout }),
    );

    const pieSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField: "category",
        valueField: "value",
        legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        radius: am5.percent(45),
        innerRadius: am5.percent(28),
        scale: 2,
      }),
    );
    pieSeriesRef.current = pieSeries;

    pieSeries.data.setAll(chartData);

    pieSeries.slices.template.setAll({
      toggleKey: "none",
      fillOpacity: 0.9,
      stroke: am5.color("#ffffff"),
      strokeWidth: 0.5,
      strokeOpacity: 1,
      tooltipText: '{category}: {valuePercentTotal.formatNumber("#.")}%',
    });

    // Slice color comes from each data point's own `color` field
    pieSeries.slices.template.adapters.add("fill", (fill, target) => {
      const color = (target.dataItem?.dataContext as any)?.color;
      return color ? am5.color(color) : fill;
    });
    pieSeries.slices.template.adapters.add("stroke", () => am5.color("#ffffff"));

    // Clicking a slice toggles its status as the selected filter
    pieSeries.slices.template.events.on("click", (ev) => {
      const code = (ev.target.dataItem?.dataContext as any)?.code ?? null;
      const prev = selectedCodeRef.current;
      onSliceClick(prev === code ? null : code);
    });

    pieSeries.labels.template.setAll({ visible: false, scale: 0 });
    pieSeries.ticks.template.setAll({ visible: false, scale: 0 });

    const legend = chart.children.push(
      am5.Legend.new(root, { centerX: am5.percent(50), x: am5.percent(50), scale: 0.9, height: 110 }),
    );
    legendRef.current = legend;

    legend.data.setAll(pieSeries.dataItems);
    legend.markers.template.setAll({ width: 18, height: 18 });
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10,
    });
    legend.labels.template.setAll({
      oversizedBehavior: "truncate",
      fill: am5.color(textColorRef.current),
      width: 300,
      maxWidth: 360,
    });
    legend.valueLabels.template.setAll({ textAlign: "right", fill: am5.color(textColorRef.current) });
    legend.itemContainers.template.setAll({ paddingTop: 3, paddingBottom: 1 });

    return () => {
      root.dispose();
    };
  }, []);

  // Push new data into the existing chart/legend (no rebuild)
  useEffect(() => {
    pieSeriesRef.current?.data?.setAll(chartData);
    legendRef.current?.data?.setAll(pieSeriesRef.current?.dataItems);
  }, [chartData]);

  // amCharts renders its own canvas text, so the legend has to be
  // recolored through its API — updating each existing label instance,
  // not just the template, or already-rendered labels won't repaint.
  useEffect(() => {
    const legend = legendRef.current;
    if (!legend?.labels) return;

    const color = am5.color(textColor);

    legend.labels.template.setAll({ fill: color });
    legend.valueLabels.template.setAll({ fill: color });

    legend.dataItems?.forEach((dataItem: any) => {
      dataItem.get("label")?.set("fill", color);
      dataItem.get("valueLabel")?.set("fill", color);
    });
  }, [textColor]);
}

// ----------------------------------------------------
// COMPONENT
// ----------------------------------------------------
export default function LotChart() {
  const { selectedLocation, selectedStatus, updateStatus } = useMyContext();

  // Background toggle: default (transparent) or white, text flips dark
  // only when white is active
  const [background, setBackground] = useState<"default" | "white">("default");
  const isDefault = background === "default";
  const bgColor = isDefault ? "transparent" : "#ffffff";
  const textColor = isDefault ? "#ffffff" : "#1a1a1a";
  const toggleBackground = () => setBackground((prev) => (prev === "default" ? "white" : "default"));

  // Only "ours" if the selection is tagged with this chart's source
  const lotSelectedCode =
    selectedStatus?.source === "lot" ? (selectedStatus.code as number) : null;

  const handleSliceClick = (code: number | string | null) => {
    updateStatus(code === null ? null : { source: "lot", code });
  };

  const { data, isError } = useLotData(selectedLocation);
  const chartData = data?.chartData ?? [];

  // False until the first fetch resolves, then stays true
  const hasData = !!data;

  usePieChart(chartData, lotSelectedCode, handleSliceClick, textColor);

  // Filters lotLayer and zooms to match (only if no status is selected,
  // or the selection is this chart's own). Also keeps the three derived
  // lot layers filtered to the current package/type/station, on top of
  // each one's own base condition — those never drive the zoom.
  useEffect(() => {
    const { packageName, type, station } = selectedLocation;
    const shouldZoom = selectedStatus === null || selectedStatus.source === "lot";

    const locationFilter = {
      qFields: ["Package", "Type", "Station1"] as [any?, any?, any?],
      qValues: [packageName, type, station] as [any?, any?, any?],
    };

    handedOverLotsLayer.definitionExpression = new QueryExpressionLayers({
      ...locationFilter,
      qExpression: `${DEFAULT_HANDED_OVER_FIELD} = 1`,
    }).queryExpression();

    toBeHandedOverLotsLayer.definitionExpression = new QueryExpressionLayers({
      ...locationFilter,
      qExpression: `${DEFAULT_NOT_YET_FIELD} = 1`,
    }).queryExpression();

    subterraneanLotsLayer.definitionExpression = new QueryExpressionLayers({
      ...locationFilter,
      qExpression: "Tunnel_Depth > 18",
    }).queryExpression();

    filterAndGetTargetExtent(
      lotLayer,
      packageName,
      type,
      station,
      lotSelectedCode,
      lotHighLevelField,
    ).then((extent) => {
      if (extent && mapView.current && shouldZoom) {
        mapView.current.goTo(extent);
      }
    });
  }, [selectedLocation, selectedStatus, lotSelectedCode]);

  const totalNumber = data?.totalNumber ?? 0;
  const publicNumber = data?.publicNumber ?? 0;
  const privateNumber = data?.privateNumber ?? 0;
  const handedOverNumber = data?.handedOverNumber ?? 0;
  const toBeHandedOverNumber = data?.toBeHandedOverNumber ?? 0;

  // Guarded against divide-by-zero when nothing matches the filter yet
  const handedOverPercentage =
    totalNumber > 0 ? Number(((handedOverNumber / totalNumber) * 100).toFixed(1)) : 0;
  const toBeHandedOverPercentage =
    totalNumber > 0 ? Number(((toBeHandedOverNumber / totalNumber) * 100).toFixed(1)) : 0;

  if (isError) {
    return (
      <div style={{ color: "#ff6b6b", padding: "16px" }}>
        Failed to load lot data. Please check your connection.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "98%",
        display: "flex",
        flexDirection: "column",
        paddingTop: "12px",
        backgroundColor: bgColor,
        transition: "background-color 0.2s",
      }}
    >
      <div style={{ flexShrink: 0, display: "flex", gap: "24px", justifyContent: "center", width: "100%", color: textColor }}>
        <div style={{ minWidth: "110px" }}>
          <div style={{ fontSize: "12px", opacity: 0.7, textAlign: "center" }}>TOTAL LOTS</div>
          <div style={{ height: "12px", fontSize: "28px", fontWeight: 600, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {hasData ? totalNumber.toLocaleString() : ""}
          </div>
        </div>
        <div style={{ minWidth: "110px" }}>
          <div style={{ fontSize: "12px", opacity: 0.7, textAlign: "center" }}>PUBLIC LOTS</div>
          <div style={{ height: "12px", fontSize: "28px", fontWeight: 600, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {hasData ? publicNumber.toLocaleString() : ""}
          </div>
        </div>
        <div style={{ minWidth: "110px" }}>
          <div style={{ fontSize: "12px", opacity: 0.7, textAlign: "center" }}>PRIVATE LOTS</div>
          <div style={{ height: "12px", fontSize: "28px", fontWeight: 600, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {hasData ? privateNumber.toLocaleString() : ""}
          </div>
        </div>
      </div>

      <div
        id={CHART_ID}
        style={{
          position: "relative", 
          flex: "1 1 auto",
          minHeight: "200px",
          overflow: "hidden",
          backgroundColor: "rgba(0,0,0,0)",
          color: textColor,
          marginBottom: "15px",
        }}
      ></div>

      <div style={{ position: "relative", flexShrink: 0, display: "flex", gap: "24px", justifyContent: "center", width: "100%", color: textColor, paddingTop: "5px" }}>
        <div style={{ minWidth: "170px" }}>
          <div style={{ fontSize: "12px", opacity: 0.7, textAlign: "center" }}>HANDED OVER LOTS</div>
          <div style={{ height: "34px", fontSize: "28px", fontWeight: 600, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {hasData ? `${handedOverPercentage}% (${handedOverNumber.toLocaleString()})` : ""}
          </div>
        </div>
        <div style={{ minWidth: "170px" }}>
          <div style={{ fontSize: "12px", opacity: 0.7, textAlign: "center" }}>TO BE HANDED OVER LOTS</div>
          <div style={{ height: "34px", fontSize: "28px", fontWeight: 600, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {hasData ? `${toBeHandedOverPercentage}% (${toBeHandedOverNumber.toLocaleString()})` : ""}
          </div>
        </div>
      </div>

      {/* Background toggle: default (transparent) <-> white */}
      <div
        style={{
          position: "relative",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "transparent",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <span style={{ fontSize: "12px", color: textColor }}>
            {isDefault ? "Default" : "White"}
          </span>
          <span
            role="switch"
            aria-checked={!isDefault}
            onClick={toggleBackground}
            style={{
              position: "relative",
              width: "40px",
              height: "22px",
              borderRadius: "11px",
              backgroundColor: isDefault ? "#666666" : "#2e7d32",
              transition: "background-color 0.2s",
              display: "inline-block",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "2px",
                left: isDefault ? "2px" : "20px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                transition: "left 0.2s",
              }}
            />
          </span>
        </label>
      </div>
    </div>
  );
}