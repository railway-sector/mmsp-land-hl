import { useState } from "react";
import Select from "react-select";
import "../index.css";
import GenerateDropdownData from "npm-dropdown-package";
import { lotLayer } from "../layers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";

export default function DropdownData() {
  const queryClient = useQueryClient();

  const [cPackageSelected, setCPackageSelected] = useState<null | any>(null);
  const [landTypeSelected, setLandTypeSelected] = useState<null | any>(null);
  const [landSection, setLandSection] = useState<null | any>(null);

  const [landTypeList, setLandTypeList] = useState<any>([]);
  const [landSectionList, setLandSectionList] = useState<any>([]);

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

  // this instantly updates the global cache
  function updateDropdownListValues(
    cp_obj_field: SelectedLocation["cpackage"],
    type_obj_field: SelectedLocation["landType"],
    section_obj_field: SelectedLocation["landSection"],
  ) {
    return queryClient.setQueryData<SelectedLocation>(locationKeys.selected, {
      cpackage: cp_obj_field,
      landType: type_obj_field,
      landSection: section_obj_field,
    });
  }

  // handle change event of the Municipality dropdown
  const handleContractPackageChange = (obj: any) => {
    updateDropdownListValues(obj.field1, undefined, undefined);
    setCPackageSelected(obj);
    setLandTypeList(obj.field2);
    setLandTypeSelected(null);
    setLandSection(null);
  };

  // handle change event of the barangay dropdownff
  const handleLandTypeChange = (obj: any) => {
    updateDropdownListValues(cPackageSelected?.field1, obj.name, undefined);
    setLandTypeSelected(obj);
    setLandSectionList(obj.field3);
    setLandSection(null);
  };

  const handleLandSectionChange = (obj: any) => {
    updateDropdownListValues(
      cPackageSelected?.field1,
      landTypeSelected?.name,
      obj.name,
    );
    setLandSection(obj);
  };

  // Style CSS
  const customstyles = {
    option: (styles: any, { isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#999999"
          : isSelected
            ? "#2b2b2b"
            : "#2b2b2b",
        color: "#ffffff",
        width: "200px",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      color: "#ffffff",
      touchUi: false,
      width: "200px",
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        padding: "5px",
        borderRadius: "5px",
        zIndex: 999,
      }}
    >
      <Select
        placeholder="Select CP"
        value={cPackageSelected}
        options={cpackageList && cpackageList}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customstyles}
      />
      <br />

      <div style={{ marginRight: "5px", marginLeft: "5px" }}></div>
      <Select
        placeholder="Select Land Type"
        value={landTypeSelected}
        options={landTypeList && landTypeList}
        onChange={handleLandTypeChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
      <br />
      <div style={{ marginRight: "5px", marginLeft: "5px" }}></div>
      <Select
        placeholder="Select Station/Area"
        value={landSection}
        options={landSectionList && landSectionList}
        onChange={handleLandSectionChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
    </div>
  );
}
