import { useEffect, useState, use } from "react";
import Select from "react-select";
import "../index.css";
import { lotLayer } from "../layers";
import GenerateDropdownData from "npm-dropdown-package";
import { MyContext } from "../contexts/MyContext";

export default function DropdownData() {
  const { updateContractcps, updateLandtype, updateLandsection } =
    use(MyContext);

  // For dropdown filter
  const [initCpTypeSection, setInitCpTypeSection] = useState<
    null | undefined | any
  >();

  const [contractPackage, setContractPackage] = useState<null | any>(null);
  const [landType, setLandType] = useState<null | any>(null);
  const [landSection, setLandSection] = useState<null | any>(null);

  const [landTypeList, setLandTypeList] = useState([]);
  const [landSectionList, setLandSectionList] = useState([]);
  // const [landTypeSelected, setLandTypeSelected] = useState({ name: "" });

  useEffect(() => {
    const dropdownData = new GenerateDropdownData(
      [lotLayer],
      ["Package", "Type", "Station1"],
    );

    dropdownData.dropDownQuery().then((response: any) => {
      setInitCpTypeSection(response);
    });
  }, []);

  const handleContractPackageChange = (obj: any) => {
    setContractPackage(obj);
    setLandTypeList(obj.field2);
    setLandType(null);
    setLandSection(null);
    updateContractcps(obj.field1);
    updateLandtype(undefined);
    updateLandsection(undefined);
  };

  const handleLandTypeChange = (obj: any) => {
    setLandType(obj);
    setLandSectionList(obj.field3);
    setLandSection(null);
    updateLandtype(obj.name);
    updateLandsection(undefined);
  };

  const handleLandSectionChange = (obj: any) => {
    setLandSection(obj);
    updateLandsection(obj.name);
  };

  // Style CSS
  const customstyles = {
    option: (styles: any, { isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#555555"
          : isSelected
            ? "#2b2b2b"
            : "#2b2b2b",
        color: "#ffffff",
        width: "200px",
        zIndex: 999,
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      height: 35,
      width: "200px",
      color: "#ffffff",
      zIndex: 999,
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
        value={contractPackage}
        options={initCpTypeSection}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customstyles}
      />
      <br />

      <div style={{ marginRight: "5px", marginLeft: "5px" }}></div>
      <Select
        placeholder="Select Land Type"
        value={landType}
        options={landTypeList}
        onChange={handleLandTypeChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
      <br />
      <div style={{ marginRight: "5px", marginLeft: "5px" }}></div>
      <Select
        placeholder="Select Station/Area"
        value={landSection}
        options={landSectionList}
        onChange={handleLandSectionChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
    </div>
  );
}
