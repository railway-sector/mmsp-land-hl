  // ----------------------------------------------------
  // Calcite tab component registration
  // ----------------------------------------------------
  import "@esri/calcite-components/dist/components/calcite-tabs";
  import "@esri/calcite-components/dist/components/calcite-tab";
  import "@esri/calcite-components/dist/components/calcite-tab-nav";
  import "@esri/calcite-components/dist/components/calcite-tab-title";

  import { useState } from "react";
  import LotChart from "./LotChart";
  import HandoverSubteChart from "./HandoverSubteChart";
  import { lotLayer, pteHandoverSubteLotsLayer } from "../layers";

  const tabContentStyle = {
    "--calcite-tab-content-block-padding": "0px",
  } as React.CSSProperties;

  // layout="center" makes each <calcite-tab-title> stretch to fill an
  // equal share of the tab-nav automatically, so the selection indicator
  // (native to this layout) always matches the tab's real rendered size
  // — no fixed pixel widths needed, and no risk of the indicator being
  // smaller than the tab. The inner span just centers the text and wraps
  // instead of overflowing, since "PTE Handover for Subterranean Lots"
  // is too long to fit on one line at this width.
  const tabTextStyle = {
    display: "block",
    width: "100%",
    textAlign: "center",
    whiteSpace: "normal",
    lineHeight: 1.2,
  } as React.CSSProperties;

  export default function SidePanel() {
    // Tabs opened at least once, so a tab's chart only mounts after its
    // first visit. "land" starts visited since it's the default tab.
    const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
      new Set(["land"]),
    );

    const handleTabChange = (e: CustomEvent) => {
      const newTab = (e.target as any).selectedTitle?.className;
      if (!newTab) return;

      // Show the matching lot layer, hide the other
      if (newTab === "land") {
        lotLayer.visible = true;
        pteHandoverSubteLotsLayer.visible = false;
      } else if (newTab === "pte") {
        lotLayer.visible = false;
        pteHandoverSubteLotsLayer.visible = true;
      }

      setVisitedTabs((prev) => new Set(prev).add(newTab));
    };

    return (
      <>
        {/* ----------------------------------------------------
            TAB CONTAINER
            Side panel docked via slot="panel-end", 40% width.
        ---------------------------------------------------- */}
        <calcite-tabs
          slot="panel-end"
          layout="center"
          scale="l"
          style={{
            borderStyle: "solid",
            borderRightWidth: 5,
            borderLeftWidth: 5,
            borderBottomWidth: 5,
            borderTopWidth: 5,
            borderColor: "#555555",
            width: "40%",
          }}
        >
          {/* ----------------------------------------------------
              TAB TITLES
              className is the id checked against visitedTabs.
          ---------------------------------------------------- */}
          <calcite-tab-nav
            slot="title-group"
            id="thetabs"
            oncalciteTabChange={handleTabChange}
          >
            <calcite-tab-title className="land">
              <span style={tabTextStyle}>Land</span>
            </calcite-tab-title>
            <calcite-tab-title className="pte">
              <span style={tabTextStyle}>PTE/ CNO Handover for Subterranean Lots</span>
            </calcite-tab-title>
          </calcite-tab-nav>

          {/* ----------------------------------------------------
              TAB CONTENT
          ---------------------------------------------------- */}
          <calcite-tab style={tabContentStyle}>
            <LotChart />
          </calcite-tab>
          <calcite-tab style={tabContentStyle}>
            {visitedTabs.has("pte") && <HandoverSubteChart />}
          </calcite-tab>
        </calcite-tabs>
      </>
    );
  }