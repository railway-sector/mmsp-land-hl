import { useEffect, useState, use } from "react";
import Select from "react-select";
import "../index.css";
import "../App.css";
import { DropDownData } from "../customClass";
import { MyContext } from "../App";
import { lotLayer } from "../layers";

export function DropdownData() {
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
  const [landTypeSelected, setLandTypeSelected] = useState({ name: "" });

  useEffect(() => {
    const dropdownData = new DropDownData({
      featureLayers: [lotLayer],
      fieldNames: ["Package", "Type", "Station1"],
    });

    dropdownData.dropDownQuery().then((response: any) => {
      setInitCpTypeSection(response);
    });
  }, []);

  const handleContractPackageChange = (obj: any) => {
    setContractPackage(obj);
    setLandTypeList(obj.field2);
    setLandType(null);
    setLandTypeSelected(obj);
    setLandSection(null);
    updateContractcps(obj.field1);
    updateLandtype(undefined);
    updateLandsection(undefined);
  };

  const handleLandTypeChange = (obj: any) => {
    setLandTypeSelected(obj);
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

  return (
    <>
      <DropdownListDisplay
        handleContractPackageChange={handleContractPackageChange}
        handleLandTypeChange={handleLandTypeChange}
        handleLandSectionChange={handleLandSectionChange}
        initCpTypeSection={initCpTypeSection}
        contractPackage={contractPackage}
        landType={landType}
        landSection={landSection}
        landTypeList={landTypeList}
        landSectionList={landSectionList}
        // companySelected={companySelected}
      ></DropdownListDisplay>
    </>
  );
}

export function DropdownListDisplay({
  handleContractPackageChange,
  handleLandTypeChange,
  handleLandSectionChange,
  initCpTypeSection,
  contractPackage,
  landType,
  landSection,
  landTypeList,
  landSectionList,
}: any) {
  // Style CSS
  const customstyles = {
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#555555"
          : isSelected
          ? "#2b2b2b"
          : "#2b2b2b",
        color: "#ffffff",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      height: 35,
      width: "170px",
      color: "#ffffff",
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div className="dropdownFilter">
      <div className="dropdownFilterLayout">
        <b style={{ color: "white", margin: 10, fontSize: "0.9vw" }}></b>
        <Select
          placeholder="Select CP"
          value={contractPackage}
          options={initCpTypeSection}
          onChange={handleContractPackageChange}
          getOptionLabel={(x: any) => x.field1}
          styles={customstyles}
        />
        <br />
        <b style={{ color: "white", margin: 10, fontSize: "0.9vw" }}></b>
        <Select
          placeholder="Select Land Type"
          value={landType}
          options={landTypeList}
          onChange={handleLandTypeChange}
          getOptionLabel={(x: any) => x.name}
          styles={customstyles}
        />
        <br />
        <b style={{ color: "white", margin: 10, fontSize: "0.9vw" }}></b>
        <Select
          placeholder="Select Station/Area"
          value={landSection}
          options={landSectionList}
          onChange={handleLandSectionChange}
          getOptionLabel={(x: any) => x.name}
          styles={customstyles}
        />
      </div>
    </div>
  );
}
