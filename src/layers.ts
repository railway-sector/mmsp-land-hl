import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import {
  SimpleMarkerSymbol,
  TextSymbol,
  SimpleLineSymbol,
} from "@arcgis/core/symbols";
import {
  statusLotColor,
  statusLotLabel,
  structureStatusField,
  structureStatusLabel,
  structureStatusColor,
  lotStatusField,
  structureDemolishedStatusField,
  structureDemolishedStatus,
  structureDemolishedStatusLabel,
  structureDemolishedColor,
  isfRelocationStatusField,
  isfRelocationStatus,
  isfRelocationStatusLabel,
  isfRelocationColor,
} from "./uniqueValues";

/* Standalone table for Dates */
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "a084d9cae5234d93b7aa50f7eb782aec",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});

/* Station Box */
let stationBoxRenderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "U-Shape Retaining Wall",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "Cut & Cover Box",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "TBM Shaft",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "TBM",
      symbol: new SimpleFillSymbol({
        color: [178, 178, 178],
        style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
    {
      value: "Station Platform",
      symbol: new SimpleFillSymbol({
        color: [240, 204, 230],
        style: "backward-diagonal",
        outline: {
          width: 0.4,
          color: "black",
        },
      }),
    },
    {
      value: "Station Box",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          width: 2,
          color: "red",
        },
      }),
    },
    {
      value: "NATM",
      symbol: new SimpleFillSymbol({
        color: [178, 178, 178, 0],
        style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: "grey",
        },
      }),
    },
  ],
});

export const stationBoxLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  renderer: stationBoxRenderer,
  minScale: 150000,
  maxScale: 0,
  title: "Station Box",

  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Land */

const defaultSymbolLot = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: new SimpleLineSymbol({
    color: [110, 110, 110],
    width: 0.7,
  }),
});

const uniqueValueInfos = statusLotLabel.map((status: any, index: any) => {
  return Object.assign({
    value: index + 1,
    label: status,
    symbol: new SimpleFillSymbol({
      color: statusLotColor[index],
    }),
  });
});

const lotLayerStatusRenderer = new UniqueValueRenderer({
  field: lotStatusField,
  defaultSymbol: defaultSymbolLot,
  uniqueValueInfos: uniqueValueInfos,
});

const lotLabel = new LabelClass({
  symbol: new TextSymbol({
    color: "black",
    font: {
      size: 8,
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.CN",
  },
});

export const lotLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 8,

  title: "Land Acquisition",
  labelingInfo: [lotLabel],
  renderer: lotLayerStatusRenderer,
  popupTemplate: {
    title: "<p>{Id}</p>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "OWNER",
            label: "Land Owner",
          },
          {
            fieldName: "Station1",
          },
          {
            fieldName: "H_Level",
            label: "<p>Status of Land Acquisition</p>",
          },
        ],
      },
    ],
  },
});

/* Lot boundary only */
const lotLayerBoundaryRenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [0, 0, 0, 0],
    style: "solid",
    outline: {
      color: [110, 110, 110],
      width: 1.5,
    },
  }),
});

const lotLayerBoundaryLabel = new LabelClass({
  symbol: new TextSymbol({
    color: "white",
    font: {
      // autocast as new Font()
      family: "Gill Sans",
      size: 8,
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.CN",
  },
});

export const lotLayerBoundary = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 8,

  title: "Lot Boundary",
  renderer: lotLayerBoundaryRenderer,
  labelingInfo: [lotLayerBoundaryLabel],
});

/* Handed-Over Lot */
const handedOverRenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "#FF00C5",
    style: "solid",
    outline: new SimpleLineSymbol({
      color: [110, 110, 110],
      width: 0.5,
    }),
  }),
});

export const handedOverLotLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 8,

  definitionExpression: "HandedOver = 1",
  title: "Handed-Over Lots",
  renderer: handedOverRenderer,
  popupEnabled: false,
});

/* Handed-Over Subterranean Lot */
export const pteLotSubteLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 8,

  // eslint-disable-next-line no-useless-concat
  definitionExpression: "Type = 'Subterranean'" + " AND " + "PTE = 1",
  title: "PTE Subterranean Lots",
  renderer: handedOverRenderer,
  popupEnabled: false,
});

/* Structure Layer */
const defaultLotSymbolBoundary = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: {
    style: "short-dash",
    color: [215, 215, 158],
    width: 1.5,
  },
});

const uniqueValueInfosStructure = structureStatusLabel.map(
  (status: any, index: any) => {
    return Object.assign({
      value: index + 1,
      label: status,
      symbol: new SimpleFillSymbol({
        color: structureStatusColor[index],
        style: "backward-diagonal",
        outline: {
          color: "#6e6e6e",
          width: 0.7,
        },
      }),
    });
  }
);

export const structureLayerRenderer = new UniqueValueRenderer({
  field: structureStatusField,
  defaultSymbol: defaultLotSymbolBoundary,
  uniqueValueInfos: uniqueValueInfosStructure,
});

export const structureLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 9,
  title: "Existing Structure",

  renderer: structureLayerRenderer,
  popupTemplate: {
    title: "Structure ID: <b>{STRUCTURE_TAG_NO_}</b>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "STATION",
            label: "Station",
          },
          {
            fieldName: "Status",
            label: "<b>Status of Structure</b>",
          },
          {
            fieldName: "LOT_OWNER",
            label: "Lot Owner",
          },
        ],
      },
    ],
  },
});

/* Structure Demolished Layer */
const uniqueValueInfosDemolished = structureDemolishedStatus.map(
  (status: any, index: any) => {
    return Object.assign({
      value: status,
      label: structureDemolishedStatusLabel[index],
      symbol: new SimpleFillSymbol({
        color: structureDemolishedColor[index],
        style: "solid", // "backward-diagonal"
        outline: {
          color: "#6E6E6E",
          width: 0.7,
        },
      }),
    });
  }
);

const structureDemolishedRenderer = new UniqueValueRenderer({
  field: structureDemolishedStatusField,
  defaultSymbol: defaultLotSymbolBoundary, // autocasts as new SimpleFillSymbol()
  uniqueValueInfos: uniqueValueInfosDemolished,
});

export const structureDemolishedLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 9,
  title: "Demolished Structure",

  renderer: structureDemolishedRenderer,
  popupTemplate: {
    title: "Structure ID: <b>{STRUCTURE_TAG_NO_}</b>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "STATION",
            label: "Station",
          },
          {
            fieldName: "Status",
            label: "<b>Status of Structure</b>",
          },
          {
            fieldName: "LOT_OWNER",
            label: "Lot Owner",
          },
        ],
      },
    ],
  },
});

/* ISF Layer */
const uniqueValueInfosIsf = isfRelocationStatus.map(
  (status: any, index: any) => {
    return Object.assign({
      value: status,
      label: isfRelocationStatusLabel[index],
      symbol: new SimpleMarkerSymbol({
        size: 9,
        color: isfRelocationColor[index], // the first two letters dictate transparency.
        outline: {
          width: 1.5,
          color: "white",
        },
      }),
    });
  }
);
let isfRenderer = new UniqueValueRenderer({
  field: isfRelocationStatusField,
  uniqueValueInfos: uniqueValueInfosIsf,
});

export const isfLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 10,
  title: "ISF (Informal Settlers Families)",

  renderer: isfRenderer,
  labelsVisible: false,
});

/* Construction Boundary */
const ConstructionBoundaryFill = new UniqueValueRenderer({
  field: "MappingBoundary",
  uniqueValueInfos: [
    {
      value: 1,
      label: "",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          width: 2.5,
          color: [255, 255, 255],
          style: "short-dash",
        },
      }),
    },
  ],
});

export const constructionBoundaryLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,

  renderer: ConstructionBoundaryFill,
  definitionExpression: "MappingBoundary = 1",
  title: "Construction Boundary",
  elevationInfo: {
    mode: "on-the-ground",
  },
  popupEnabled: false,
});

/* Alignment Line */
export const alignmentLine = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 6,

  title: "Alignment",
  popupEnabled: false,
});

/* Segment DPWH */
export const dpwhSegmentLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "DPWH Segment",

  popupEnabled: false,
});

/* Depot Building */
export const depotBuildingLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 6,
  title: "Depot Building",

  popupEnabled: false,
});

/* BSS Building */
export const bssDepotBuildingLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 7,
  title: "BSS Building",

  popupEnabled: false,
});

/* East Valenzuela */
export const evsLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "East Valenzuela Station",

  popupEnabled: false,
});

/* NNC Construction boundary (Senate) */
export const senateBoundaryLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 5,
  title: "NCC Property",

  popupEnabled: false,
});

/* Station Layer */
const stationLabels = new LabelClass({
  labelExpressionInfo: { expression: "$feature.Station1" },
  symbol: {
    type: "text",
    color: "black",
    haloColor: "white",
    haloSize: 1,
    font: {
      size: 10,
      weight: "bold",
    },
  },
});

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  labelingInfo: [stationLabels],
  title: "Station",
  definitionExpression: "Project = 'MMSP'",
  //screenSizePerspectiveEnabled: false, // gives constant size regardless of zoom
});
stationLayer.listMode = "hide";

export const creekDivLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "Creek Diversion",

  popupEnabled: false,
});

export const lotGroupLayer = new GroupLayer({
  title: "Land",
  visible: true,
  visibilityMode: "exclusive",
  layers: [pteLotSubteLayer, handedOverLotLayer, lotLayer],
});

export const evsBoundaryPoGroupLayer = new GroupLayer({
  title: "East Valenzuela Station",
  visible: true,
  visibilityMode: "independent",
  layers: [creekDivLayer, evsLayer],
});

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [stationBoxLayer, alignmentLine],
});

export const boundaryGroupLayer = new GroupLayer({
  title: "Boundary",
  visible: true,
  visibilityMode: "independent",
  layers: [constructionBoundaryLayer, senateBoundaryLayer, dpwhSegmentLayer],
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
