import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";

// ============================================================
// FIELD NAMES
// ============================================================

export const lotstatisticField = "OBJECTID";
export const lotStatusField = "StatusNVS3";
export const lotHighLevelField = "H_Level";
export const DEFAULT_HANDED_OVER_FIELD = "HandedOVer";
export const DEFAULT_NOT_YET_FIELD = "not_yet";
export const oasAffectedStructuresStatusField = "REMARKS";
export const stationBoxStatusField = "Layer";

// ============================================================
// STATUS DEFINITIONS
// Used by both the map renderers and the pie charts, so the same
// status always gets the same color everywhere.
// ============================================================

export const lotStatuses = [
  { code: 1, label: "Ready for Handover / Handed Over",      color: "#70ad47" },
  { code: 2, label: "Pending Delivery",                      color: "#FF0000" },
  { code: 3, label: "For Appraisal/Offer to Buy",            color: "#FFAA00" },
];

// TODO: confirm these match REMARKS' exact stored text (case-sensitive)
// in the live service.
export const oasAffectedStructuresStatuses = [
  { code: "Areas not yet Handed Over", label: "Areas not yet Handed Over", color: "#ffffff" },
  { code: "Handed Over Areas",         label: "Handed Over Areas",         color: "#f4c98b" },
  { code: "Demolished",                label: "Demolished",                color: "#8c8c8c" },
];

// TODO: confirm these match Layer's exact stored text (case-sensitive)
// in the live service.
export const stationBoxStatuses = [
  { code: "U-Shape Retaining Wall", label: "U-Shape Retaining Wall", color: "#8c8c8c" },
  { code: "Cut & Cover Box",        label: "Cut & Cover Box",        color: "#8c8c8c" },
  { code: "TBM Shaft",              label: "TBM Shaft",              color: "#8c8c8c" },
  { code: "TBM",                    label: "TBM",                    color: "#8c8c8c" },
  { code: "Station Platform",       label: "Station Platform",       color: "#8c8c8c" },
  { code: "Station Box",            label: "Station Box",            color: "#ff0000" },
  { code: "NATM",                   label: "NATM",                   color: "#8c8c8c" },
];

// ============================================================
// RENDERERS
// ============================================================

const lotLayerRenderer = new UniqueValueRenderer({
  field: lotHighLevelField,
  uniqueValueInfos: lotStatuses.map(({ code, label, color }) => ({
    value: code,
    label: label,
    symbol: new SimpleFillSymbol({
      color,
      outline: { color: "#ffffff", width: 0.5 },
    }),
  })),
});

const publicLotRenderer = new SimpleRenderer({
  label: "Public Land",
  symbol: new SimpleFillSymbol({
    style: "backward-diagonal",
    color: "#d9d9d9",
    outline: { color: "#d9d9d9", width: 0.5 },
  }),
});

// Solid fill per REMARKS category. No hatching, so it stays visually
// distinct from the diagonal-hatch style used elsewhere.
const oasAffectedStructuresRenderer = new UniqueValueRenderer({
  field: oasAffectedStructuresStatusField,
  uniqueValueInfos: oasAffectedStructuresStatuses.map(({ code, label, color }) => ({
    value: code,
    label: label,
    symbol: new SimpleFillSymbol({
      color,
      outline: { color: "#423f3fff", width: 0.5 },
    }),
  })),
});

// Handed Over, To Be Handed Over, and Subterranean each use one fixed
// symbol — they're not a list of statuses, just a yes/no condition.
// The actual filtering (HandedOVer = 1, not_yet = 1, Tunnel_Depth > 18)
// happens on the layer's definitionExpression further down, not here.
const handedOverLotRenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "#c22a77",
    outline: { color: "#c22a77", width: 0.5 },
  }),
});

const toBeHandedOverLotRenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "#6597d5",
    outline: { color: "#6597d5", width: 0.5 },
  }),
});

const subterraneanLotRenderer = new SimpleRenderer({
  label: "Tunnel Depth (>18m)",
  symbol: new SimpleFillSymbol({
    style: "backward-diagonal",
    color: "#6cd309",
    outline: { color: "#6cd309", width: 1 },
  }),
});

// ============================================================
// POPUPS
// ============================================================

const lotPopupTemplate = new PopupTemplate({
  title: "{Package} — {Type}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "OWNER", label: "Land Owner" },
        { fieldName: lotHighLevelField, label: "Status" },
        { fieldName: "Package", label: "Package" },
        { fieldName: "Type", label: "Type" },
        { fieldName: "Station1", label: "Station" },
      ],
    },
  ],
});

// ============================================================
// LABELS
// ============================================================

// Labels lot features with their "CN" field. Used by lotLayer and its
// three derived layers below (handedOver, toBeHandedOver,
// subterranean). Only shows once zoomed in past 1:50,000.
const lotCnLabelClass = new LabelClass({
  labelExpressionInfo: { expression: "$feature.CN" },
  symbol: new TextSymbol({
    color: "#000000",
    haloColor: "#ffffff",
    haloSize: 1,
    font: { size: 9, family: "sans-serif" },
  }),
  minScale: 10000,
  maxScale: 0,
});

// ============================================================
// LAYERS — Land
// (1st added in MapDisplay: landGroupLayer)
// ============================================================

export const lotLayer = new FeatureLayer({
  portalItem: {
    id: "93790e8102f84713a69e562da12bb415",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: ["StatusNVS3", "HandedOVer", "not_yet", "Package", "Type", "Station1", "OBJECTID", "OWNER", "Id", "Issue", "CN"],
  layerId: 31,
  title: "Acquisition Status",
  renderer: lotLayerRenderer,
  popupTemplate: lotPopupTemplate,
  labelingInfo: [lotCnLabelClass],
  labelsVisible: true,
  listMode: "show",
});

// Shows only lots where HandedOVer = 1
export const handedOverLotsLayer = new FeatureLayer({
  portalItem: {
    id: "93790e8102f84713a69e562da12bb415",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: ["HandedOVer", "CN"],
  layerId: 31,
  title: "Handed Over (GC to JV)",
  opacity: 0.9,
  renderer: handedOverLotRenderer,
  definitionExpression: "HandedOVer = 1",
  popupEnabled: false,
  labelingInfo: [lotCnLabelClass],
  labelsVisible: true,
  listMode: "show",
  visible: false,
});

// Shows only lots where not_yet = 1
export const toBeHandedOverLotsLayer = new FeatureLayer({
  portalItem: {
    id: "93790e8102f84713a69e562da12bb415",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: ["not_yet", "CN"],
  layerId: 31,
  title: "To Be Handed Over (to JV)",
  opacity: 0.7,
  renderer: toBeHandedOverLotRenderer,
  definitionExpression: "not_yet = 1",
  popupEnabled: false,
  labelingInfo: [lotCnLabelClass],
  labelsVisible: true,
  listMode: "show",
  visible: false,
});

// Shows only lots deeper than 18m (tunnel depth)
export const subterraneanLotsLayer = new FeatureLayer({
  portalItem: {
    id: "93790e8102f84713a69e562da12bb415",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: ["Tunnel_Depth", "CN"],
  layerId: 31,
  title: "Subterranean Lots",
  opacity: 0.7,
  renderer: subterraneanLotRenderer,
  definitionExpression: "Tunnel_Depth > 18",
  popupEnabled: false,
  labelingInfo: [lotCnLabelClass],
  labelsVisible: true,
  listMode: "show",
  visible: false,
});

export const publicLotsLayer = new FeatureLayer({
  portalItem: {
    id: "93790e8102f84713a69e562da12bb415",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: ["StatusNVS3", "CN"],
  layerId: 31,
  title: "Public Land",
  renderer: publicLotRenderer,
  definitionExpression: `${lotStatusField} IS NULL`,
  popupEnabled: false,
  labelingInfo: [lotCnLabelClass],
  labelsVisible: true,
  listMode: "show",
  visible: true,
});

export const landGroupLayer = new GroupLayer({
  title: "Land",
  visibilityMode: "independent",
  layers: [lotLayer, handedOverLotsLayer, toBeHandedOverLotsLayer, subterraneanLotsLayer, publicLotsLayer],
  visible: true,
  listMode: "show",
});

// ============================================================
// LAYERS — Boundary
// (2nd added in MapDisplay: boundaryGroupLayer)
// ============================================================

export const constructionBoundaryLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 4,
  title: "Construction Boundary",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
});

// Label scale for this layer is set directly in the portal item, not
// here in code.
export const stationBoxLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 2,
  title: "Station Box",
  opacity: 0.7,
  popupEnabled: false,
  listMode: "show",
});

export const boundaryGroupLayer = new GroupLayer({
  title: "Boundary",
  visibilityMode: "independent",
  layers: [constructionBoundaryLayer, stationBoxLayer],
  visible: true,
  listMode: "show",
});

// ============================================================
// LAYERS — Depot Buildings
// (3rd added in MapDisplay: depotBuildingsGroupLayer)
// ============================================================

export const bssBuildingLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 7,
  title: "BSS Building",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const depotBuildingLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 6,
  title: "Depot Building",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const dpwhSegmentLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 2,
  title: "DPWH Segment",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const depotBuildingsGroupLayer = new GroupLayer({
  title: "Depot Buildings",
  visibilityMode: "independent",
  layers: [dpwhSegmentLayer, bssBuildingLayer, depotBuildingLayer],
  visible: true,
  listMode: "show",
});

// ============================================================
// LAYERS — Senate-DepEd Station
// (4th added in MapDisplay: senateDepEdStationGroupLayer)
// ============================================================

export const senateOldConstructionBoundaryLayer = new FeatureLayer({
  portalItem: {
    id: "791f47c19d054cf88dd85fa5a4b4c991",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 24,
  title: "Senate Old Construction Boundary",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const senateOldStationBoxLayer = new FeatureLayer({
  portalItem: {
    id: "791f47c19d054cf88dd85fa5a4b4c991",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 25,
  title: "Senate Old Station Box",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const nccPropertyLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 5,
  title: "NCC Property",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const senateDepEdStationGroupLayer = new GroupLayer({
  title: "Senate-DepEd Station",
  visibilityMode: "independent",
  layers: [senateOldConstructionBoundaryLayer, senateOldStationBoxLayer, nccPropertyLayer],
  visible: true,
  listMode: "show",
});

// ============================================================
// LAYERS — Ortigas Station
// (5th added in MapDisplay: ortigasStationGroupLayer)
// ============================================================

export const oasAccessRoadLayer = new FeatureLayer({
  portalItem: {
    id: "437ae464f49544e080c9dda8f98a169d",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 29,
  title: "OAS Access Roads",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const oasAffectedStructuresLayer = new FeatureLayer({
  portalItem: {
    id: "437ae464f49544e080c9dda8f98a169d",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [oasAffectedStructuresStatusField],
  layerId: 28,
  title: "OAS Affected Structures",
  renderer: oasAffectedStructuresRenderer,
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const ortigasStationGroupLayer = new GroupLayer({
  title: "Ortigas Station",
  visibilityMode: "independent",
  layers: [oasAffectedStructuresLayer, oasAccessRoadLayer],
  visible: true,
  listMode: "show",
});

// ============================================================
// LAYERS — East Valenzuela Station
// (6th added in MapDisplay: eastValenzuelaStationGroupLayer)
// ============================================================

export const creekDiversionLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 3,
  title: "Creek Diversion",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const eastValenzuelaStationLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 1,
  title: "East Valenzuela Station",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
  minScale: 50000,
  maxScale: 0,
});

export const eastValenzuelaStationGroupLayer = new GroupLayer({
  title: "East Valenzuela Station",
  visibilityMode: "independent",
  layers: [creekDiversionLayer, eastValenzuelaStationLayer],
  visible: true,
  listMode: "show",
});

// ============================================================
// LAYERS — Alignment
// (7th added in MapDisplay: alignmentLayer)
// ============================================================

export const alignmentLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 6,
  title: "Alignment",
  opacity: 1,
  popupEnabled: false,
  listMode: "show",
  visible: true,
});

// ============================================================
// LAYERS — Stations
// (8th added in MapDisplay: stationLayer)
// ============================================================

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: [],
  layerId: 1,
  title: "Stations",
  opacity: 1,
  popupEnabled: false,
  listMode: "hide",
});

// ============================================================
// TABLES — Land Acquisition Date
// Standalone table (no geometry), so this uses Table instead of
// FeatureLayer. No layerId, since it's not one of several sub-layers
// on the portal item — the item itself is the table.
// ============================================================

export const DateTable = new FeatureLayer({
  portalItem: {
    id: "a084d9cae5234d93b7aa50f7eb782aec",
    portal: { url: "https://gis.railway-sector.com/portal" },
  },
  outFields: ["category", "date"],
});