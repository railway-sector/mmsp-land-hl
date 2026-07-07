import { useMemo, useState } from "react";
import Select from "react-select";
import "../index.css";
import GenerateDropdownData from "dropdown-pkg-arcgis";
import { lotLayer } from "../layers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";

const theme = {
  bg: "#2b2b2b",
  bgDisabled: "#232323",
  border: "#444444",
  borderHover: "#5a5a5a",
  borderFocus: "#6aa9ff",
  text: "#ffffff",
  textMuted: "#9a9a9a",
  optionFocused: "#3a3a3a",
  optionSelected: "#353535",
};

const customStyles = {
  container: (s: any) => ({ ...s, width: "180px" }),
  control: (s: any, { isDisabled, isFocused }: any) => ({
    ...s,
    backgroundColor: isDisabled ? theme.bgDisabled : theme.bg,
    borderColor: isFocused ? theme.borderFocus : theme.border,
    borderRadius: "6px",
    minHeight: "36px",
    boxShadow: "none",
    opacity: isDisabled ? 0.6 : 1,
    "&:hover": {
      borderColor: isFocused ? theme.borderFocus : theme.borderHover,
    },
  }),
  placeholder: (s: any) => ({ ...s, color: theme.textMuted }),
  singleValue: (s: any) => ({ ...s, color: theme.text }),
  input: (s: any) => ({ ...s, color: theme.text }),
  indicatorSeparator: (s: any) => ({ ...s, backgroundColor: theme.border }),
  dropdownIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  clearIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  menu: (s: any) => ({
    ...s,
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    overflow: "hidden",
  }),
  option: (s: any, { isFocused, isSelected }: any) => ({
    ...s,
    backgroundColor: isFocused
      ? theme.optionFocused
      : isSelected
        ? theme.optionSelected
        : theme.bg,
    color: theme.text,
    cursor: "pointer",
  }),
};

export default function DropdownData() {
  const queryClient = useQueryClient();

  const [cPackageSelected, setCPackageSelected] = useState<null | any>(null);
  const [landTypeSelected, setLandTypeSelected] = useState<null | any>(null);
  const [landSection, setLandSection] = useState<null | any>(null);

  const { data: cpackageList } = useQuery<any>({
    queryKey: ["dropdownData"], // Do not add lotLayer as a dependency. The dropdown list will not be updated properly.
    queryFn: async () => {
      const dropdownData = new GenerateDropdownData(
        [lotLayer],
        ["Package", "Type", "Station1"],
      );
      return await dropdownData.dropDownQuery();
    },
    staleTime: Infinity, // never refetch in the backround. If not Inifity, it will refetch.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  //--- Avoid returning empty objects when the component is re-rendered.
  const landTypeList = useMemo(
    () => cPackageSelected?.field2 ?? [],
    [cPackageSelected],
  );

  const landSectionList = useMemo(
    () => landTypeSelected?.field3 ?? [],
    [landTypeSelected],
  );

  //--- Function to instantly update the global cache
  function setSelectedLocation(patch: Partial<SelectedLocation>) {
    queryClient.setQueryData<SelectedLocation>(
      locationKeys.selected,
      (prev) => ({
        cpackage: prev?.cpackage ?? null,
        landType: prev?.landType ?? null,
        landSection: prev?.landSection ?? null,
        ...patch,
      }),
    );
  }

  // handle change event of the Municipality dropdown
  const handleContractPackageChange = (obj: any) => {
    setSelectedLocation({
      cpackage: obj?.field1 ?? null,
      landType: null,
      landSection: null,
    });
    setCPackageSelected(obj);
    setLandTypeSelected(null);
    setLandSection(null);
  };

  // handle change event of the barangay dropdownff
  const handleLandTypeChange = (obj: any) => {
    setSelectedLocation({ landType: obj?.name ?? null, landSection: null });
    setLandTypeSelected(obj);
    setLandSection(null);
  };

  const handleLandSectionChange = (obj: any) => {
    setSelectedLocation({ landSection: obj?.name ?? null });
    setLandSection(obj);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        gap: "12px",
      }}
    >
      <Select
        placeholder="Select CP"
        value={cPackageSelected}
        options={cpackageList && cpackageList}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        isClearable
        styles={customStyles}
      />
      <br />
      <Select
        placeholder="Select Land Type"
        value={landTypeSelected}
        options={landTypeList && landTypeList}
        onChange={handleLandTypeChange}
        getOptionLabel={(x: any) => x.name}
        isClearable
        styles={customStyles}
      />
      <br />
      <Select
        placeholder="Select Area"
        value={landSection}
        options={landSectionList && landSectionList}
        onChange={handleLandSectionChange}
        getOptionLabel={(x: any) => x.name}
        isClearable
        styles={customStyles}
      />
    </div>
  );
}
