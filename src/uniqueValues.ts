//----------------------------------------------//
//              portalItem                      //

import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";

//----------------------------------------------//
const portalItem_url = { url: "https://gis.railway-sector.com/portal" };

export const portalItems = (id: any) => {
  return { id: id, portal: portalItem_url };
};

export const monitorLists = ["Land Acquisition", "Structure", "ISF"];

//----------------------------------------------//
//              Chart Parameters                //
//----------------------------------------------//
// chart width
export const chart_width = "26vw";
export const chart_box_width = 250;

// labeling and value label color
export const labelColor = "#9ca3af";
export const valueColor = "#d1d5db";
export const dark_bkColor = "#2b2b2b";
export const white_bkColor = "white";

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- STATION BOX LAYER ---//
const station_box_q = [
  {
    value: "U-Shape Retaining Wall",
    color: [104, 104, 104],
    style: "backward-diagonal",
    olwidth: 1,
    olcolor: "black",
  },
  {
    value: "Cut & Cover Box",
    color: [104, 104, 104],
    style: "backward-diagonal",
    olwidth: 1,
    olcolor: "black",
  },
  {
    value: "TBM Shaft",
    color: [104, 104, 104],
    style: "backward-diagonal",
    olwidth: 1,
    olcolor: "black",
  },
  {
    value: "TBM",
    color: [178, 178, 178],
    style: "backward-diagonal",
    olwidth: 0.5,
    olcolor: "black",
  },
  {
    value: "Station Platform",
    color: [240, 240, 230],
    style: "backward-diagonal",
    olwidth: 0.4,
    olcolor: "black",
  },
  {
    value: "Station Box",
    color: [0, 0, 0, 0],
    style: "none",
    olwidth: 2,
    olcolor: "red",
  },
  {
    value: "NATM",
    color: [178, 178, 178, 0],
    style: "backward-diagonal",
    olwidth: 0.5,
    olcolor: "grey",
  },
];

export const station_box_uniqueV = station_box_q.map((v: any) => {
  return {
    value: v.value,
    symbol: new SimpleFillSymbol({
      color: v.color,
      style: v.style,
      outline: { width: v.olwidth, color: v.olcolor },
    }),
  };
});

export const station_box_renderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: station_box_uniqueV,
});

//--- OLD SENATE STATION BOX LAYER ---//
const old_senate_uniqueV = [
  {
    value: "Station Platform",
    symbol: new SimpleFillSymbol({
      color: [168, 168, 20],
      style: "solid",
      outline: { width: 0.7, color: "#6e6e6e" },
    }),
  },
  {
    value: "Station Box",
    symbol: new SimpleFillSymbol({
      color: [45, 126, 135, 30],
      style: "solid",
      outline: { width: 0.7, color: "#6e6e6e" },
    }),
  },
];

export const old_senate_stbox_renderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: old_senate_uniqueV,
});

//--- CONSTRUCTION BOUNDARY ---//
export const c_boundary_renderer = new UniqueValueRenderer({
  field: "MappingBoundary",
  uniqueValueInfos: [
    {
      value: 1,
      label: "",
      symbol: new SimpleFillSymbol({
        style: "none",
        outline: { width: 2.5, color: [255, 255, 255], style: "short-dash" },
      }),
    },
  ],
});

//--- SENATE CONSTRUCTION BOUNDARY ---//
export const senate_c_boundary_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [148, 57, 38, 30],
    style: "solid",
    outline: { width: 1, color: "#6e6e6e" },
  }),
});

//--- EAST VALENZUELA STATION LAYER ---//
export const evs_station_renderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "Station Building",
      symbol: new SimpleFillSymbol({
        style: "none",
        outline: { style: "long-dash", width: 1.5, color: "#E1E1E1" },
      }),
    },
    {
      value: "Station Plaza",
      symbol: new SimpleFillSymbol({
        color: [60, 175, 153],
        outline: { width: 1, color: "#E1E1E1" },
      }),
    },
    {
      value: "Cross Road Box",
      symbol: new SimpleFillSymbol({
        color: [168, 56, 0],
        outline: { width: 1, color: "#E1E1E1" },
      }),
    },
    {
      value: "Platform",
      symbol: new SimpleFillSymbol({
        color: "pink",
        style: "backward-diagonal",
        outline: { width: 1, color: "#E1E1E1", style: "solid" },
      }),
    },
  ],
});

//--- STATION POINT LAYER ---//
export const station_labels = new LabelClass({
  labelExpressionInfo: { expression: "$feature.Station1" },
  symbol: {
    type: "text",
    color: "black",
    haloColor: "white",
    haloSize: 1,
    font: { size: 10, weight: "bold" },
  },
});

//----------------------------------------------//
//                  Other layers                //
//----------------------------------------------//

//----------------------------------------------//
//          Lot Layer Parameters                //
//----------------------------------------------//
//--- LOT LAYER ---//
// Acronym:
// ho: handed over
// hoa: handed-over area
// hod: handed-over date
// pri: priority
// lu: land use
// pho: percent handed-over area
// aa: affected area

export const lot_id_f = "Id";
export const lot_status_f = "H_Level";
export const lot_xho_f = "not_yet";
export const lot_ho_f = "HandedOver";
export const lot_hod_f = "HandOverDate";
export const lot_hoy_f = "HandedOverYear";
export const cp_f = "Package";
export const lot_type_f = "Type";
export const lot_section_f = "Station1";
export const lot_remarks_f = "REMARKS";
export const lot_issue_f = "Issue";

export const lot_status_q = [
  { value: 1, category: "Ready for Handover / Handed Over", color: "#70ad47" },
  { value: 2, category: "Pending Delivery", color: "#FF0000" },
  { value: 3, category: "For Appraisal/Offer to Buy", color: "#FFAA00" },
];

export const lot_symbol = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: { color: [110, 110, 110], width: 0.7 },
});

export const lot_uniqueV: any = lot_status_q.map((f: any) => {
  return {
    value: f.value,
    label: f.category,
    symbol: new SimpleFillSymbol({ color: f.color }),
  };
});

export const lot_status_renderer = new UniqueValueRenderer({
  field: lot_status_f,
  defaultSymbol: lot_symbol,
  uniqueValueInfos: lot_uniqueV,
});

export const lot_id_label = new LabelClass({
  symbol: new TextSymbol({
    color: "black",
    font: { size: 8 },
  }),
  labelExpressionInfo: { expression: "$feature.CN" },
});

export const lot_popup = {
  title: "<p>{Id}</p>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "OWNER", label: "Land Owner" },
        { fieldName: "Station1" },
        { fieldName: "StatusNVS3", label: "<p>Status of Land Acquisition</p>" },
        { fieldName: "HandOverDate", label: "Handed-over date" },
      ],
    },
  ],
};

//--- PUBLIC LAND LAYER ---//
export const lot_public_renderer = new UniqueValueRenderer({
  valueExpression: "When($feature.StatusNVS3 > 0, 'withStatus', 'publicLands')",
  uniqueValueInfos: [
    { value: "withStatus", symbol: null },
    {
      value: "publicLands",
      symbol: new SimpleFillSymbol({
        color: "#d8cdcdff",
        style: "diagonal-cross",
        outline: { width: 1, color: "#d8cdcdff" },
      }),
    },
  ],
});

export const lot_public_popup = {
  title: "<p>{Id}: Public Land</p>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "OWNER", label: "Land Owner" },
        { fieldName: "Station1" },
        { fieldName: "StatusNVS3", label: "<p>Status of Land Acquisition</p>" },
      ],
    },
  ],
};

//--- LOT BOUNDARY LAYER ---//
export const lot_boundary_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [0, 0, 0, 0],
    style: "solid",
    outline: { color: [110, 110, 110], width: 1.5 },
  }),
});

export const lot_boundary_label = new LabelClass({
  symbol: new TextSymbol({
    color: "white",
    font: { family: "Gill Sans", size: 8 },
  }),
  labelExpressionInfo: { expression: "$feature.CN" },
});

//--- HANDED-OVER LOT LAYER ---//
export const lot_ho_renderer = new UniqueValueRenderer({
  field: lot_ho_f,
  uniqueValueInfos: [
    {
      value: 1,
      label: " ",
      symbol: new SimpleFillSymbol({ color: "#E7298A" }),
    },
  ],
});

//--- TO-BE HANDED-OVER LOT LAYER ---//
export const lot_tobe_ho_renderer = new UniqueValueRenderer({
  field: lot_xho_f,
  uniqueValueInfos: [
    {
      value: 1,
      label: "",
      symbol: new SimpleFillSymbol({ color: "#73B2FF" }),
    },
  ],
});

//--- SUBTERRANEAN LOT 18 UNDER LAYER ---//
export const lot_subt18_renderer = new UniqueValueRenderer({
  valueExpression:
    "When($feature.Tunnel_Depth > 18, 'deepSubte', 'shallowSubte')",
  uniqueValueInfos: [
    {
      value: "deepSubte",
      label: "Tunnel Depth (>18m)",
      symbol: new SimpleFillSymbol({
        color: "#7CFC00",
        style: "backward-diagonal",
        outline: { color: "#7CFC00", width: 1 },
      }),
    },
  ],
});

export const lot_subt18_popup = {
  title: "<p>{Id}</p>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "OWNER", label: "Land Owner" },
        { fieldName: "Station1" },
        { fieldName: "StatusNVS3", label: "<p>Status of Land Acquisition</p>" },
        { fieldName: "Tunnel_Depth", label: "Tunnel Depth (m)" },
      ],
    },
  ],
};

//--- STRUCTURE LAYER ---//
export const str_id_f = "Id";
export const str_lotid_f = "LotID";
export const str_status_f = "Status";
export const str_remarks_f = "REMARKS";

export const str_status_demo_q = [
  { value: "Demolished", category: "Demolished", color: "#FFAA00" },
  { value: "Demolished", category: "Occupied", color: "#99A5A2" },
];

export const str_status_q = [
  { value: 1, category: "Paid", color: "#70AD47", rgb: [112, 173, 71] },
  {
    value: 2,
    category: "For Payment Processing",
    color: "#0070FF",
    rgb: [0, 112, 255],
  },
  {
    value: 3,
    category: "For Legal Pass",
    color: "#FFFF00",
    rgb: [255, 255, 0],
  },
  {
    value: 4,
    category: "For Appraisal/Offer to Buy",
    color: "#FFAA00",
    rgb: [255, 170, 0],
  },
  { value: 5, category: "For Expro", color: "#FF0000", rgb: [255, 0, 0] },
  { value: 6, category: "Quit Claim", color: "#00734C", rgb: [0, 115, 76] },
];

const defaultLotSymbolBoundary = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: {
    style: "short-dash",
    color: [215, 215, 158],
    width: 1.5,
  },
});

const str_status_uniqueV: any = str_status_q.map((f: any) => {
  return {
    value: f.value,
    label: f.category,
    symbol: new SimpleFillSymbol({
      color: f.color,
      style: "backward-diagonal",
      outline: { color: "#6e6e6e", width: 0.7 },
    }),
  };
});

export const structureLayerRenderer = new UniqueValueRenderer({
  field: str_status_f,
  defaultSymbol: defaultLotSymbolBoundary,
  uniqueValueInfos: str_status_uniqueV,
});

export const str_popup = {
  title: "Structure ID: <b>{STRUCTURE_TAG_NO_}</b>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "STATION", label: "Station" },
        { fieldName: "Status", label: "<b>Status of Structure</b>" },
        { fieldName: "LOT_OWNER", label: "Lot Owner" },
      ],
    },
  ],
};

//--- STRUCTURE DEMOLISHED LAYER ---//
const str_demo_status_uniqueV = str_status_demo_q.map((f: any) => {
  return {
    value: f.value,
    label: f.category,
    symbol: new SimpleFillSymbol({
      color: f.color,
      style: "solid",
      outline: { color: "#6E6E6E", width: 0.7 },
    }),
  };
});

export const str_demo_status_renderer = new UniqueValueRenderer({
  field: str_remarks_f,
  defaultSymbol: defaultLotSymbolBoundary,
  uniqueValueInfos: str_demo_status_uniqueV,
});

export const str_demo_popup = {
  title: "Structure ID: <b>{STRUCTURE_TAG_NO_}</b>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "STATION", label: "Station" },
        { fieldName: "Status", label: "<b>Status of Structure</b>" },
        { fieldName: "LOT_OWNER", label: "Lot Owner" },
      ],
    },
  ],
};

//--- STRUCTURE: OAS AFFECTED LAYER ---//
const str_oas_q = [
  { value: "Areas not yet Handed Over", style: "solid", color: "white" },
  { value: "Handed Over Areas", style: "solid", color: "#ffe5b4" },
  { value: "Demolished", style: "solid", color: "grey" },
];

const str_oas_uniqueV = str_oas_q.map((f: any) => {
  return {
    value: f.value,
    symbol: new SimpleFillSymbol({ style: f.style, color: f.color }),
  };
});

export const str_oas_renderer = new UniqueValueRenderer({
  field: "REMARKS",
  uniqueValueInfos: str_oas_uniqueV,
});

export const str_oas_label = new LabelClass({
  symbol: new TextSymbol({
    color: "black",
    font: { size: 8, weight: "bold" },
    haloColor: "white",
    haloSize: "0.5pt",
  }),
  labelExpressionInfo: { expression: "$feature.STRUCTURE_TAG_NO_" },
});

//--- ISF ---//
export const isf_status_f = "RELOCATION";

export const isf_status_q = [
  { value: "UNRELOCATED", category: "Unrelocated", color: "#FF0000" },
  { value: "RELOCATED", category: "Relocated", color: "#267300" },
  { value: "SELF-RELOCATED", category: "Self-Relocated", color: "#0070ff" },
];

const isf_status_uniqueV = isf_status_q.map((f: any) => {
  return {
    value: f.value,
    label: f.category,
    symbol: new SimpleMarkerSymbol({
      size: 9,
      color: f.color,
      outline: { width: 1.5, color: "white" },
    }),
  };
});

export const isf_renderer = new UniqueValueRenderer({
  field: "RELOCATION",
  uniqueValueInfos: isf_status_uniqueV,
});

export const isf_popup = {
  title: "<p>{Id}</p>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "Package", label: "CP" },
        { fieldName: "Station1", label: "Station" },
        { fieldName: "RELOCATION", label: "Status" },
      ],
    },
  ],
};

//--- LAYER LIST ---//
export async function defineActions(event: any) {
  const { item } = event;

  if (item.layer.type !== "group") {
    item.panel = { content: "legend", open: true };
  }

  item.title === "Existing Structure" ||
  item.title === "Demolished Structure" ||
  item.title === "ISF (Informal Settlers Families)" ||
  item.title === "Senate-DepEd Boundary" ||
  item.title === "Handed Over (GC to JV)" ||
  item.title === "To be Handed Over (to JV)" ||
  item.title === "Structures" ||
  item.title === "SBS_20250303" ||
  item.title === "SBS_20260203" ||
  item.title === "Subterranean Lots"
    ? (item.visible = false)
    : (item.visible = true);
}
