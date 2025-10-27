import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import {
  CalciteShellPanel,
  CalciteActionBar,
  CalciteAction,
  CalcitePanel,
} from "@esri/calcite-components-react";
import { useEffect, useState } from "react";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-legend";
import { defineActions } from "../uniqueValues";
import LotProgressChart from "./LotProgressChart";

function ActionPanel() {
  const [activeWidget, setActiveWidget] = useState(null);
  const [nextWidget, setNextWidget] = useState(null);
  const arcigsMap = document.querySelector("arcgis-map");

  // End of dropdown list
  useEffect(() => {
    if (activeWidget) {
      const actionActiveWidget = document.querySelector(
        `[data-panel-id=${activeWidget}]`
      );
      actionActiveWidget.hidden = true;
    }

    if (nextWidget !== activeWidget) {
      const actionNextWidget = document.querySelector(
        `[data-panel-id=${nextWidget}]`
      );
      actionNextWidget.hidden = false;
    }
  });

  return (
    <>
      <CalciteShellPanel
        // width="m"
        width="1"
        slot="panel-start"
        position="start"
        id="left-shell-panel"
        displayMode="dock"
      >
        <CalciteActionBar slot="action-bar">
          <CalciteAction
            data-action-id="layers"
            icon="layers"
            text="layers"
            id="layers"
            //textEnabled={true}
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="basemaps"
            icon="basemap"
            text="basemaps"
            id="basemaps"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          {/*<CalciteAction
            data-action-id="charts"
            icon="graph-time-series"
            text="Progress Chart"
            id="charts"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>*/}

          <CalciteAction
            data-action-id="information"
            icon="information"
            text="Information"
            id="information"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>
        </CalciteActionBar>

        <CalcitePanel
          heading="Layers"
          height="l"
          width="l"
          data-panel-id="layers"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-layer-list
            referenceElement="arcgis-map"
            selectionMode="multiple"
            visibilityAppearance="checkbox"
            // show-collapse-button
            show-filter
            filter-placeholder="Filter layers"
            listItemCreatedFunction={defineActions}
          ></arcgis-layer-list>
        </CalcitePanel>

        <CalcitePanel
          heading="Basemaps"
          height="l"
          data-panel-id="basemaps"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-basemap-gallery referenceElement="arcgis-map"></arcgis-basemap-gallery>
        </CalcitePanel>

        <CalcitePanel
          class="timeSeries-panel"
          height-scale="l"
          data-panel-id="charts"
          hidden
        ></CalcitePanel>

        <CalcitePanel heading="Description" data-panel-id="information" hidden>
          {nextWidget === "information" ? (
            <div className="informationDiv">
              <ul>
                <li>
                  You can <b>filter the data</b> by City and Barangy using
                  dropdown lists.
                </li>
                <li>
                  <b>Click a tab</b> below the dropdown lists to view progress
                  on land, structure, or NLO in charts.
                </li>
                <li>
                  <b>Click series in pie charts</b> to view progress on the
                  corresponding lots/structures/NLO on the map.
                </li>
                <li>
                  <b>Lots under expropriation</b> are available in the 'Expro
                  List' tab.
                </li>
                <li>
                  <b>Lots with issues</b> are available in the 'IssueList' tab.
                </li>
                <br></br>
                <br></br>
                <b style={{ color: "white" }}>---:Defintion of Terms:---</b>
                <li>
                  <b>ROWUA</b> : Right of Way Usage Agreement
                </li>
                <li>
                  <b>NVS</b> : Negotiated Voluntary Sale
                </li>
              </ul>
            </div>
          ) : (
            <div className="informationDiv" hidden></div>
          )}
        </CalcitePanel>
      </CalciteShellPanel>
      {/* {nextWidget === "charts" && nextWidget !== activeWidget && (
        <LotProgressChart />
      )} */}
    </>
  );
}

export default ActionPanel;
