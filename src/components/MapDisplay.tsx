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
  lotLayer,
  stationLayer,
  structuresGroupLayer,
  accessRoadOptionsGroupLayer,
} from "../layers";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dateDisplayKeys } from "../interfaceKeys";
import { dateUpdate } from "../query";
import type { DisplayDates } from "../interfaceKeys";

export default function MapDisplay() {
  const queryClient = useQueryClient();
  const arcgisMap = document.querySelector("arcgis-map") as ArcgisMap;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;

  //--- As of Date and days Passed
  const { data: newAsOfDate } = useQuery<DisplayDates | any>({
    queryKey: [dateDisplayKeys.selected],
    queryFn: () => dateUpdate(),
    select: (response) => {
      return {
        asOfDate: response[0][0],
        daysPass: response[0][1],
      };
    },
    staleTime: Infinity,
  });
  queryClient.setQueryData<DisplayDates>(dateDisplayKeys.selected, newAsOfDate);

  //--- Add layers to scene view
  arcgisMap?.viewOnReady(() => {
    arcgisMap?.map?.add(lotGroupLayer);
    arcgisMap?.map?.add(depotBuildingsGroupLayer);
    arcgisMap?.map?.add(evsBoundaryPoGroupLayer);
    arcgisMap?.map?.add(structuresGroupLayer);
    arcgisMap?.map?.add(isfLayer);
    arcgisMap?.map?.add(boundaryGroupLayer);
    arcgisMap?.map?.add(stationLayer);
    arcgisMap?.map?.add(alignmentLine);
    arcgisMap?.map?.add(accessRoadOptionsGroupLayer);

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
        // onarcgisViewReadyChange={(event: any) => {
        //   setMapView(event.target);
        // }}
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
