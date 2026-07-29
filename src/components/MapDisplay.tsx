import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-zoom";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import type { ArcgisMap } from "@arcgis/map-components/components/arcgis-map";
import {
  alignmentLine,
  boundaryGroupLayer,
  depotBuildingsGroupLayer,
  evsBoundaryPoGroupLayer,
  isfLayer,
  lotGroupLayer,
  stationLayer,
  structuresGroupLayer,
  accessRoadOptionsGroupLayer,
  sources,
} from "../layers";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { addLayersToMap } from "../query";
import { useState } from "react";

export default function MapDisplay() {
  const arcgisMap = document.querySelector("arcgis-map") as ArcgisMap;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;
  const [_mapView, setMapView] = useState<any>();

  //--- Add layers to scene view
  arcgisMap?.viewOnReady(() => {
    addLayersToMap(arcgisMap?.map, [
      lotGroupLayer,
      depotBuildingsGroupLayer,
      evsBoundaryPoGroupLayer,
      structuresGroupLayer,
      isfLayer,
      boundaryGroupLayer,
      stationLayer,
      alignmentLine,
      accessRoadOptionsGroupLayer,
    ]);

    arcgisSearch.allPlaceholder = "LotID";
    arcgisSearch.includeDefaultSourcesDisabled = true;
    arcgisSearch.locationDisabled = true;
    arcgisMap.hideAttribution = true;
    arcgisSearch?.sources.push(...sources);
  });

  return (
    <>
      <arcgis-map
        id="test-map"
        basemap="dark-gray-vector"
        ground="world-elevation"
        center="121.0194387, 14.6972616"
        zoom={10}
        onarcgisViewReadyChange={(event: any) => {
          setMapView(event.target);
        }}
      >
        <arcgis-compass slot="top-right"></arcgis-compass>
        <arcgis-expand close-on-esc slot="top-right" mode="floating">
          <arcgis-search></arcgis-search>
        </arcgis-expand>
        <arcgis-zoom slot="bottom-right"></arcgis-zoom>
        <arcgis-locate slot="top-right"></arcgis-locate>
      </arcgis-map>
    </>
  );
}
