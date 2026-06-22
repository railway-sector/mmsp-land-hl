import DropdownData from "./DropdownContext";
import { dateDisplayKeys } from "../interfaceKeys";
import type { DisplayDates } from "../interfaceKeys";
import { useQuery } from "@tanstack/react-query";

function Header() {
  const { data: newAsOfDate } = useQuery<DisplayDates | any>({
    queryKey: dateDisplayKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });

  return (
    <>
      <header
        slot="header"
        id="header-title"
        style={{
          display: "flex",
          height: "70px",
          padding: "0 1rem",
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 4,
          borderTopWidth: 5,
          borderColor: "#555555",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Projec_Logo/DOTr_Logo_v2.png"
          alt="DOTr Logo"
          height={"55px"}
          width={"55px"}
          style={{ marginBottom: "auto", marginTop: "auto" }}
        />
        <b
          style={{
            color: "white",
            marginLeft: "1rem",
            fontSize: "2.6vh",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          MMSP LAND (HL)
        </b>
        <div
          style={{
            width: "200px",
            height: "20px",
            marginTop: "auto",
            marginLeft: "auto",
            marginBottom: "3px",
          }}
        >
          {!newAsOfDate?.asOfDate ? "" : "As of " + newAsOfDate?.asOfDate}
        </div>

        {/* Dropdown component */}
        <DropdownData />

        <img
          src="https://EijiGorilla.github.io/Symbols/Projec_Logo/MMSP.png"
          alt="GCR Logo"
          height={"50px"}
          width={"75px"}
          style={{
            marginBottom: "auto",
            marginTop: "auto",
            marginLeft: "auto",
            marginRight: "1rem",
          }}
        />
      </header>
    </>
  );
}

export default Header;
