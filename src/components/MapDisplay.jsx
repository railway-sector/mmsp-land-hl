import { useEffect, useState } from "react";
import "../index.css";
import "../App.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-compass";
import {
  alignmentLine,
  boundaryGroupLayer,
  depotBuildingsGroupLayer,
  evsBoundaryPoGroupLayer,
  handedOverLotLayer,
  isfLayer,
  lotGroupLayer,
  lotLayer,
  stationLayer,
  structuresGroupLayer,
} from "../layers";
import "@esri/calcite-components/dist/components/calcite-button";

function MapDisplay() {
  const [mapView, setMapView] = useState();
  const arcgisMap = document.querySelector("arcgis-map");
  const arcgisSearch = document.querySelector("arcgis-search");

  useEffect(() => {
    if (mapView) {
      arcgisMap.map.add(lotGroupLayer);
      arcgisMap.map.add(depotBuildingsGroupLayer);
      arcgisMap.map.add(evsBoundaryPoGroupLayer);
      arcgisMap.map.add(structuresGroupLayer);
      arcgisMap.map.add(isfLayer);
      arcgisMap.map.add(boundaryGroupLayer);
      arcgisMap.map.add(stationLayer);
      arcgisMap.map.add(handedOverLotLayer);
      arcgisMap.map.add(alignmentLine);
      arcgisMap.map.ground.navigationConstraint = "none";
      arcgisMap.view.ui.components = [];

      arcgisSearch.sources = [
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
      arcgisSearch.locationDisabled = true;
    }
  });

  return (
    <arcgis-map
      // item-id="5ba14f5a7db34710897da0ce2d46d55f"
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom="12"
      center="121.0194387, 14.6972616"
      onarcgisViewReadyChange={(event) => {
        setMapView(event.target);
      }}
    >
      <arcgis-compass slot="top-right"></arcgis-compass>
      <arcgis-expand close-on-esc slot="top-right" mode="floating">
        <arcgis-search></arcgis-search>
        {/* <arcgis-placement>
          <calcite-button>Placeholder</calcite-button>
        </arcgis-placement> */}
      </arcgis-expand>
      <arcgis-zoom slot="bottom-right"></arcgis-zoom>
    </arcgis-map>
  );
}

export default MapDisplay;
