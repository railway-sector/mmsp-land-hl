import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import {
  station_box_renderer,
  old_senate_stbox_renderer,
  c_boundary_renderer,
  senate_c_boundary_renderer,
  evs_station_renderer,
  station_labels,
  lot_id_label,
  lot_status_renderer,
  lot_popup,
  lot_subt18_renderer,
  lot_subt18_popup,
  lot_public_renderer,
  lot_public_popup,
  lot_boundary_renderer,
  lot_boundary_label,
  lot_ho_renderer,
  lot_tobe_ho_renderer,
  structureLayerRenderer,
  str_popup,
  str_demo_status_renderer,
  str_demo_popup,
  str_oas_renderer,
  str_oas_label,
  isf_renderer,
  isf_popup,
  portalItems,
  lot_status_f,
  lot_id_f,
  lot_ho_f,
} from "./uniqueValues";

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- STATION BOX LAYER ---//
export const stationBoxLayer = new FeatureLayer({
  portalItem: portalItems("52d4f29105934e3f95f6b39c7e5fba6e"),
  layerId: 2,
  renderer: station_box_renderer,
  minScale: 150000,
  maxScale: 0,
  title: "Station Box",
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- OLD SENATE STATION BOX LAYER ---//
export const senateStationBoxOld = new FeatureLayer({
  portalItem: portalItems("791f47c19d054cf88dd85fa5a4b4c991"),
  layerId: 25,
  renderer: old_senate_stbox_renderer,
  minScale: 150000,
  maxScale: 0,
  title: "Senate Old Station Box",
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- CONSTRUCTION BOUNDARY ---//
export const constructionBoundaryLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 4,
  renderer: c_boundary_renderer,
  definitionExpression: "MappingBoundary = 1",
  title: "Construction Boundary",
  elevationInfo: { mode: "on-the-ground" },
  popupEnabled: false,
});

//--- SENATE CONSTRUCTION BOUNDARY ---//
export const senateConstructionBoundaryLayerOld = new FeatureLayer({
  portalItem: portalItems("791f47c19d054cf88dd85fa5a4b4c991"),
  layerId: 24,
  renderer: senate_c_boundary_renderer,
  title: "Senate Old Construction Boundary",
  elevationInfo: { mode: "on-the-ground" },
  popupEnabled: false,
});

//--- ALIGNMENT LINE LAYER ---//
export const alignmentLine = new FeatureLayer({
  portalItem: portalItems("52d4f29105934e3f95f6b39c7e5fba6e"),
  layerId: 6,
  title: "Alignment",
  popupEnabled: false,
});

//--- EAST VALENZUELA STATION LAYER ---//
export const evsLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 1,
  title: "East Valenzuela Station",
  renderer: evs_station_renderer,
  popupEnabled: false,
});

//--- STATION POINT LAYER ---//
export const stationLayer = new FeatureLayer({
  portalItem: portalItems("52d4f29105934e3f95f6b39c7e5fba6e"),
  layerId: 1,
  labelingInfo: [station_labels],
  title: "Station",
  definitionExpression: "Project = 'MMSP'",
});
stationLayer.listMode = "hide";

//----------------------------------------------//
//               Other layers                   //
//----------------------------------------------//
//--- DATE FEATURE TABLE ---//
export const dateTable = new FeatureLayer({
  portalItem: portalItems("a084d9cae5234d93b7aa50f7eb782aec"),
});

//--- SEGMENT DPWH LAYER ---//
export const dpwhSegmentLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 2,
  title: "DPWH Segment",
  popupEnabled: false,
});

//--- DEPOT BUILDING LAYER ---//
export const depotBuildingLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 6,
  title: "Depot Building",
  popupEnabled: false,
});

//--- BSS BUILDING LAYER ---//
export const bssDepotBuildingLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 7,
  title: "BSS Building",
  popupEnabled: false,
});

//--- NNC CONSTRUCTION BOUNDARY (SENATE) ---//
export const senateBoundaryLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 5,
  title: "NCC Property",
  popupEnabled: false,
});

//--- CREEK DIVERSION LAYER ---//
export const creekDivLayer = new FeatureLayer({
  portalItem: portalItems("52d4f29105934e3f95f6b39c7e5fba6e"),
  layerId: 3,
  title: "Creek Diversion",
  popupEnabled: false,
});

//--- OAS ACCESS ROAD LAYER ---//
export const oas_accessRoad = new FeatureLayer({
  portalItem: portalItems("437ae464f49544e080c9dda8f98a169d"),
  layerId: 29,
  title: "OAS Access Road",
  popupEnabled: false,
});

//----------------------------------------------//
//       Lot / Structure / ISF Layers           //
//----------------------------------------------//
//--- LOT LAYER ---//
export const lotLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  outFields: [lot_id_f, lot_status_f],
  layerId: 8,
  title: "Acquisition Status",
  labelingInfo: [lot_id_label],
  renderer: lot_status_renderer,
  minScale: 50000,
  maxScale: 0,
  popupTemplate: lot_popup,
});

//--- SUBTERRANEAN LOT 18 UNDER LAYER ---//
export const subterraenanLots18_layer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 8,
  outFields: [lot_id_f, lot_status_f],
  title: "Subterranean Lots",
  definitionExpression: "Type = 'Subterranean' AND Tunnel_Depth > 18",
  labelingInfo: [lot_id_label],
  renderer: lot_subt18_renderer,
  minScale: 50000,
  maxScale: 0,
  popupTemplate: lot_subt18_popup,
});

//--- PUBLIC LAND LAYER ---//
export const publicLotLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 8,
  outFields: [lot_id_f, lot_status_f],
  title: "Public Lot",
  labelingInfo: [lot_id_label],
  renderer: lot_public_renderer,
  definitionExpression: "StatusNVS3 IS NULL",
  popupTemplate: lot_public_popup,
});

//--- LOT BOUNDARY LAYER ---//
export const lotLayerBoundary = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 8,
  title: "Lot Boundary",
  renderer: lot_boundary_renderer,
  labelingInfo: [lot_boundary_label],
});

//--- HANDED-OVER LOT LAYER ---//
export const handedOverLotLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 8,
  definitionExpression: `${lot_ho_f} = 1`,
  title: "Handed Over (GC to JV)",
  renderer: lot_ho_renderer,
  popupEnabled: false,
});

//--- TO-BE HANDED-OVER LOT LAYER ---//
export const tobeHandedOverLotLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 8,
  title: "To be Handed Over (to JV)",
  renderer: lot_tobe_ho_renderer,
  popupEnabled: false,
});

//--- TO-BE SUBTERRANEAN LOT LAYER ---//
export const pteLotSubteLayer1 = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 8,
  definitionExpression: "Type = 'Subterranean'",
});

//--- STRUCTURE LAYER ---//
export const structureLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 9,
  title: "Existing Structure",
  renderer: structureLayerRenderer,
  popupTemplate: str_popup,
});

//--- STRUCTURE DEMOLISEHD LAYER ---//
export const structureDemolishedLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 9,
  title: "Demolished Structure",
  renderer: str_demo_status_renderer,
  popupTemplate: str_demo_popup,
});

//--- STRUCTURE: OAS AFFECTED LAYER ---//
export const oas_affectedStructures = new FeatureLayer({
  portalItem: portalItems("437ae464f49544e080c9dda8f98a169d"),
  layerId: 28,
  title: "OAS Affected Structures",
  renderer: str_oas_renderer,
  popupEnabled: false,
  labelingInfo: [str_oas_label],
});

//--- ISF LAYER ---//
export const isfLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 10,
  title: "ISF (Informal Settlers Families)",
  renderer: isf_renderer,
  labelsVisible: false,
  popupTemplate: isf_popup,
});

//----------------------------------------------//
//              Group Layers                    //
//----------------------------------------------//
export const accessRoadOptionsGroupLayer = new GroupLayer({
  title: "Ortigas Station",
  visible: true,
  visibilityMode: "independent",
  layers: [oas_affectedStructures, oas_accessRoad],
});

export const lotGroupLayer = new GroupLayer({
  title: "Land",
  visible: true,
  visibilityMode: "independent",
  layers: [
    publicLotLayer,
    lotLayer,
    handedOverLotLayer,
    tobeHandedOverLotLayer,
    subterraenanLots18_layer,
  ],
});

export const evsBoundaryPoGroupLayer = new GroupLayer({
  title: "East Valenzuela Station",
  visible: true,
  visibilityMode: "independent",
  layers: [creekDivLayer, evsLayer],
});

export const boundaryGroupLayer = new GroupLayer({
  title: "Boundary",
  visible: true,
  visibilityMode: "independent",
  layers: [
    senateConstructionBoundaryLayerOld,
    senateStationBoxOld,
    senateBoundaryLayer,
    dpwhSegmentLayer,
    stationBoxLayer,
    constructionBoundaryLayer,
  ],
});

export const depotBuildingsGroupLayer = new GroupLayer({
  title: "Depot Buildings",
  visible: true,
  visibilityMode: "independent",
  layers: [depotBuildingLayer, bssDepotBuildingLayer],
});

export const structuresGroupLayer = new GroupLayer({
  title: "Structures",
  visible: false,
  visibilityMode: "independent",
  layers: [structureLayer, structureDemolishedLayer],
});

//----------------------------------------------//
//              Other parameters                //
//----------------------------------------------//
export const sources: any = [
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
