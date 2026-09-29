import Select from "react-select";
import { useEffect, useState } from "react";
import GenerateDropdownData from "../CreateDropdownJosh";
import { lotLayer } from "../layers";
import { useMyContext } from "../contexts/MyContext";

// ----------------------------------------------------
// TYPES
// Shape returned by GenerateDropdownData for 3 fields:
// { field1, field2: [{ name, field3: [{ name }] }] }
// ----------------------------------------------------

// One station object (deepest level)
type Station = {
  name: string;
};

// One type object (middle level)
type TypeOption = {
  name: string;
  field3: Station[];
};

// One package object (top level)
type PackageOption = {
  field1: string;
  field2: TypeOption[];
};

// ----------------------------------------------------
// REACT SELECT STYLES
// Dark-theme overrides for react-select. Defined once outside the
// component so it isn't recreated every render.
// ----------------------------------------------------

const customstyles = {
  container: (defaultStyles: any) => ({
    ...defaultStyles,
    width: "180px",
  }),
  control: (defaultStyles: any, { isDisabled, isFocused }: any) => ({
    ...defaultStyles,
    backgroundColor: isDisabled ? "#232323" : "#2b2b2b",
    borderColor: isFocused ? "#6aa9ff" : "#444444",
    borderRadius: "6px",
    minHeight: "36px",
    boxShadow: "none",
    opacity: isDisabled ? 0.6 : 1,
    "&:hover": {
      borderColor: isFocused ? "#6aa9ff" : "#5a5a5a",
    },
  }),
  placeholder: (defaultStyles: any) => ({
    ...defaultStyles,
    color: "#9a9a9a",
  }),
  singleValue: (defaultStyles: any) => ({
    ...defaultStyles,
    color: "#ffffff",
  }),
  input: (defaultStyles: any) => ({
    ...defaultStyles,
    color: "#ffffff",
  }),
  indicatorSeparator: (defaultStyles: any) => ({
    ...defaultStyles,
    backgroundColor: "#444444",
  }),
  dropdownIndicator: (defaultStyles: any) => ({
    ...defaultStyles,
    color: "#9a9a9a",
    "&:hover": { color: "#ffffff" },
  }),
  clearIndicator: (defaultStyles: any) => ({
    ...defaultStyles,
    color: "#9a9a9a",
    "&:hover": { color: "#ffffff" },
  }),
  menu: (defaultStyles: any) => ({
    ...defaultStyles,
    backgroundColor: "#2b2b2b",
    border: "1px solid #444444",
    overflow: "hidden",
  }),
  option: (defaultStyles: any, { isFocused, isSelected }: any) => ({
    ...defaultStyles,
    backgroundColor:
      isFocused
        ? "#3a3a3a"
        : isSelected
          ? "#353535"
          : "#2b2b2b",
    color: "#ffffff",
    cursor: "pointer",
  }),
};

export default function Dropdown() {
  const { selectedLocation, updateLocation, updateStatus } = useMyContext();

  // ----------------------------------------------------
  // STATE
  // Only packageList is real local state (fetched data). The selections
  // below are derived, not stored, so there's one source of truth.
  // -----------------`-----------------------------------

  const [packageList, setPackageList] = useState<PackageOption[]>([]);

  // ----------------------------------------------------
  // DERIVED SELECTION STATE
  // Recomputed each render from selectedLocation + packageList — can't
  // drift out of sync with context since nothing is stored separately.
  // ----------------------------------------------------

  const packageSelected =
    packageList.find((p) => p.field1 === selectedLocation.packageName) ??
    null;

  const typeList = packageSelected?.field2 ?? [];

  const typeSelected =
    typeList.find((t) => t.name === selectedLocation.type) ?? null;

  const stationList = typeSelected?.field3 ?? [];

  const stationSelected =
    stationList.find((s) => s.name === selectedLocation.station) ?? null;

  // ----------------------------------------------------
  // LOAD DROPDOWN DATA
  // Builds the package -> type -> station options from lotLayer, once
  // on mount.
  // ----------------------------------------------------

  useEffect(() => {
    const dropdownData = new GenerateDropdownData(
      [lotLayer],
      ["Package", "Type", "Station1"],
    );

    dropdownData.dropDownQuery().then((response: PackageOption[]) => {
      setPackageList(response);
    });
  }, []);

  // ----------------------------------------------------
  // PACKAGE CHANGE
  // Resets type/station/status, since none stay meaningful under a
  // different package. Guarded so re-picking the same package is a no-op.
  // ----------------------------------------------------

  const handlePackageChange = (obj: PackageOption | null) => {
    const newPackageName = obj?.field1 ?? null;
    if (newPackageName === selectedLocation.packageName) return;

    updateLocation({
      packageName: newPackageName,
      type: null,
      station: null,
    });
    updateStatus(null);
  };

  // ----------------------------------------------------
  // TYPE CHANGE
  // Keeps package, resets station + status. Same no-op guard as above.
  // ----------------------------------------------------

  const handleTypeChange = (obj: TypeOption | null) => {
    const newType = obj?.name ?? null;
    if (newType === selectedLocation.type) return;

    updateLocation({
      ...selectedLocation,
      type: newType,
      station: null,
    });
    updateStatus(null);
  };

  // ----------------------------------------------------
  // STATION CHANGE
  // Keeps package/type, resets status only. Same no-op guard as above.
  // ----------------------------------------------------

  const handleStationChange = (obj: Station | null) => {
    const newStation = obj?.name ?? null;
    if (newStation === selectedLocation.station) return;

    updateLocation({
      ...selectedLocation,
      station: newStation,
    });
    updateStatus(null);
  };

  // ----------------------------------------------------
  // UI
  // Package -> Type -> Station, each disabled until its parent is picked.
  // ----------------------------------------------------

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Select
        value={packageSelected}
        options={packageList}
        getOptionLabel={(x) => x.field1}
        onChange={handlePackageChange}
        styles={customstyles}
        isClearable
        placeholder="Package"
      />

      <Select
        value={typeSelected}
        options={typeList}
        getOptionLabel={(x) => x.name}
        onChange={handleTypeChange}
        styles={customstyles}
        isClearable
        isDisabled={!packageSelected}
        placeholder="Type"
      />

      <Select
        value={stationSelected}
        options={stationList}
        getOptionLabel={(x) => x.name}
        onChange={handleStationChange}
        styles={customstyles}
        isClearable
        isDisabled={!typeSelected}
        placeholder="Station"
      />
    </div>
  );
}