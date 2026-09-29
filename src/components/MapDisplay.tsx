import "../index.css";

import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-map";

import { useEffect, useRef } from "react";

import type { ArcgisMap } from "@arcgis/map-components/dist/components/arcgis-map";
import type MapView from "@arcgis/core/views/MapView";

import { landGroupLayer, stationLayer, ortigasStationGroupLayer, alignmentLayer, eastValenzuelaStationGroupLayer, depotBuildingsGroupLayer,
          boundaryGroupLayer, senateDepEdStationGroupLayer
 } from "../layers";

// Module-level so LotChart/ISFChart can call goTo() directly
export const mapView: { current: MapView | null } = { current: null };

export default function MapDisplay() {
  const mapRef = useRef<ArcgisMap | null>(null);
  const viewRef = useRef<MapView | null>(null);

  // One-time map setup
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      await mapRef.current.viewOnReady();

      viewRef.current = mapRef.current.view;

      if (!viewRef.current) return;

      mapView.current = viewRef.current;

      viewRef.current.map?.add(landGroupLayer);
      viewRef.current.map?.add(boundaryGroupLayer);
      viewRef.current.map?.add(depotBuildingsGroupLayer);
      viewRef.current.map?.add(senateDepEdStationGroupLayer);
      viewRef.current.map?.add(ortigasStationGroupLayer);
      viewRef.current.map?.add(eastValenzuelaStationGroupLayer);
      viewRef.current.map?.add(alignmentLayer);
      viewRef.current.map?.add(stationLayer);
    };

    initializeMap();
  }, []);

  return (
    <arcgis-map
      id="mmsp-map"
      ref={mapRef}
      basemap="topo-vector"
      ground="world-elevation"
      center="121.04128024704018, 14.607106959078035"
      zoom={12}
    >
      <arcgis-compass slot="top-right" />
    </arcgis-map>
  );
}