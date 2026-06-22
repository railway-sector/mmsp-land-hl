//--- Dropdown
export interface SelectedLocation {
  cpackage: string | any;
  landType: string | any;
  landSection: string | any;
}

export const locationKeys = {
  selected: ["selectedLocation"] as const,
};

//-- date fields
export interface DateFieldsType {
  dateFields: any;
  latestasofdate: any;
}

export const datefieldKeys = {
  selected: ["selectedDateFields"] as const,
};

//-- Date for display
export interface DisplayDates {
  asOfDate?: any;
  daysPass?: boolean;
}

export const dateDisplayKeys = {
  selected: ["displayDates"] as const,
};

//--- Chart
export interface ChartResponse {
  chartData: any[];
  totalNumber: number | string | undefined;
}

//--- background color for switch
export interface BkColorSwitch {
  bkColor: boolean;
}

export const bkColorKeys = {
  selected: ["selectedBkColor"] as const,
};
