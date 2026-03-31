import { createContext } from "react";

type MyDropdownContextType = {
  contractp: any;
  landtype: any;
  landsection: any;
  chartPanelwidth: any;
  updateContractcps: any;
  updateLandtype: any;
  updateLandsection: any;
  updateChartPanelwidth: any;
};

const initialState = {
  contractp: undefined,
  landtype: undefined,
  landsection: undefined,
  chartPanelwidth: undefined,
  updateContractcps: undefined,
  updateLandtype: undefined,
  updateLandsection: undefined,
  updateChartPanelwidth: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
