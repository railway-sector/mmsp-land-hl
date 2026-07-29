import { createContext } from "react";

type MyDropdownContextType = {
  cpackage: any;
  updateCpackage: any;
  landtype: any;
  updateLandtype: any;
  landsection: any;
  updateLandsection: any;
};

const initialState = {
  cpackage: undefined,
  updateCpackage: undefined,
  landtype: undefined,
  updateLandtype: undefined,
  landsection: undefined,
  updateLandsection: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
