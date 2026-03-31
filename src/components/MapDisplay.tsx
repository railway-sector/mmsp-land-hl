import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-locate";
import "@arcgis/map-components/components/arcgis-zoom";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";

import {
  alignmentLine,
  boundaryGroupLayer,
  depotBuildingsGroupLayer,
  evsBoundaryPoGroupLayer,
  isfLayer,
  lotGroupLayer,
  lotLayer,
  stationLayer,
  structuresGroupLayer,
} from "../layers";
import type { ArcgisMap } from "@arcgis/map-components/components/arcgis-map";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { useState } from "react";

export default function MapDisplay() {
  const [mapView, setMapView] = useState();
  const arcgisMap = document.querySelector("arcgis-map") as ArcgisMap;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;

  arcgisMap?.viewOnReady(() => {
    console.log(mapView);
    arcgisMap?.map?.add(lotGroupLayer);
    arcgisMap?.map?.add(depotBuildingsGroupLayer);
    arcgisMap?.map?.add(evsBoundaryPoGroupLayer);
    arcgisMap?.map?.add(structuresGroupLayer);
    arcgisMap?.map?.add(isfLayer);
    arcgisMap?.map?.add(boundaryGroupLayer);
    arcgisMap?.map?.add(stationLayer);
    arcgisMap?.map?.add(alignmentLine);

    // Search components
    const sources: any = [
      {
        layer: lotLayer,
        searchFields: ["LotID"],
        displayField: "LotID",
        exactMatch: false,
        outFields: ["LotID"],
        name: "Lot ID",
        placeholder: "example: 10083",
      },
    ];

    arcgisSearch.allPlaceholder = "LotID";
    arcgisSearch.includeDefaultSourcesDisabled = true;
    arcgisMap.hideAttribution = true;
    arcgisSearch?.sources.push(...sources);
  });

  return (
    <>
      <arcgis-map
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
