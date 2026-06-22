import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";

// Dispose function
export function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, (root: any) => {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

interface rootSetterType {
  chartID: any;
  mytheme?: any;
}

export function rootSetter({ chartID }: rootSetterType) {
  const root = am5.Root.new(chartID);
  root.container.children.clear();
  root._logo?.dispose();
  root?.setThemes([
    am5themes_Animated.new(root),
    am5themes_Responsive.new(root),
  ]);

  return root;
}

export function chartSetter(root: any) {
  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
    }),
  );

  return chart;
}

interface seriesSetterType {
  chart: any;
  root: any;
  categoryField: any;
  valueField: any;
  legendValueText: any;
  radius: number;
  innerRadius: number;
  scale: number;
}
export function seriesSetter({
  chart,
  root,
  categoryField,
  valueField,
  legendValueText,
  radius,
  innerRadius,
  scale,
}: seriesSetterType) {
  const pieSeries = chart.series.push(
    am5percent.PieSeries.new(root, {
      name: "Series",
      categoryField: categoryField,
      valueField: valueField,
      legendValueText: legendValueText,
      radius: am5.percent(radius), // outer radius
      innerRadius: am5.percent(innerRadius),
      scale: scale,
    }),
  );

  return pieSeries;
}

interface legendSetterType {
  chart: any;
  root: any;
  centerX: number;
  centerY?: number;
  x?: number;
  y?: number;
}

export function legendSetter({
  chart,
  root,
  centerX,
  x = 0,
}: legendSetterType) {
  const legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.percent(centerX),
      x: am5.percent(x),
    }),
  );

  return legend;
}
