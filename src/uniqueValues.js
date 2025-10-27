// Chart and chart label color
export const primaryLabelColor = "#9ca3af";
export const valueLabelColor = "#d1d5db";

// Lot
export const lotStatusField = "H_Level";
export const statusLotLabel = [
  "Ready for Handover / Handed Over",
  "Pending Delivery",
  "For Appraisal/Offer to Buy",
];
export const statusLotColor = ["#70AD47", "#FF0000", "#FFAA00"];
export const statusLotQuery = statusLotLabel.map((status, index) => {
  return Object.assign({
    category: status,
    value: index + 1,
    color: statusLotColor[index],
  });
});

// Structure
export const structureStatusField = "Status";
export const structureStatusLabel = [
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Appraisal/Offer to Buy",
  "For Expro",
  "Quit Claim",
];
export const structureStatusColor = [
  [112, 173, 71], // Paid #70AD47
  [0, 112, 255], // For Payment Processing #0070FF
  [255, 255, 0], // For Legal Pass #FFFF00
  [255, 170, 0], // For Appraisal/Offer to Compensate #FFAA00
  [255, 0, 0], // For Expro #FF0000
  [0, 115, 76], //Quit Claim #00734C
];

// Structure Demolished
export const structureDemolishedStatusField = "REMARKS";
export const structureDemolishedStatus = ["Demolished", "Not Yet"];
export const structureDemolishedStatusLabel = ["Demolished", "Occupied"];
export const structureDemolishedColor = ["#FFAA00", "#99A5A2"];

// ISF Relocaation
export const isfRelocationStatusField = "RELOCATION";
export const isfRelocationStatus = ["RELOCATED", "UNRELOCATED"];
export const isfRelocationStatusLabel = ["Relocated", "Un-relocated"];
export const isfRelocationColor = ["#267300", "#FF0000"];

export async function defineActions(event) {
  const { item } = event;

  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }

  item.title === "Existing Structure" ||
  item.title === "Demolished Structure" ||
  item.title === "ISF (Informal Settlers Families)" ||
  item.title === "East Valenzuela Station" ||
  item.title === "Senate-DepEd Boundary" ||
  item.title === "PTE Subterranean Lots" ||
  item.title === "Handed-Over Lots" ||
  item.title === "Structures" ||
  item.title === "EVS Station/Creek"
    ? (item.visible = false)
    : (item.visible = true);
}
