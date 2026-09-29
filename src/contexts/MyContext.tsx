import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type SelectedLocation = {
  packageName: string | null;
  type: string | null;
  station: string | null;
};

// Which chart a selected pie slice belongs to, plus its code
export type StatusSelection = {
  source: "lot" | "isf" | "structure";
  code: number | string;
} | null;

type MyContextValue = {
  selectedLocation: SelectedLocation;
  updateLocation: (location: SelectedLocation) => void;
  selectedStatus: StatusSelection;
  updateStatus: (status: StatusSelection) => void;
};

const MyContext = createContext<MyContextValue | undefined>(undefined);

export function MyContextProvider({ children }: { children: ReactNode }) {
  // Single source of truth for the current package/type/station selection,
  // shared app-wide.
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({
    packageName: null,
    type: null,
    station: null,
  });

  // Tagged { source, code } of whichever chart's pie slice is currently
  // selected (Lot, ISF, Structure), shared so MapDisplay can combine it
  // with selectedLocation for map filtering/zoom.
  const [selectedStatus, setSelectedStatus] = useState<StatusSelection>(null);

  // Bundles state + updaters into one stable object so context consumers
  // don't re-render unless something in here actually changed.
  const value = useMemo(
    () => ({
      selectedLocation,
      updateLocation: setSelectedLocation,
      selectedStatus,
      updateStatus: setSelectedStatus,
    }),
    [selectedLocation, selectedStatus],
  );

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
}