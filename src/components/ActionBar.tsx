import "@esri/calcite-components/components/calcite-shell-panel";
import "@esri/calcite-components/components/calcite-action-bar";
import "@esri/calcite-components/components/calcite-action";
import "@esri/calcite-components/components/calcite-panel";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import { useEffect, useRef, useState } from "react";

// Which side panel is open (null = none). Time slider overlays the
// map instead, so it isn't a panel.
type ActivePanel = "basemap" | "layers" | "description" | null;

export default function ActionBar() {
  // Action bar starts collapsed (icon-only)
  const [barExpanded, setBarExpanded] = useState(false);

  // Which panel is open
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  // Panels opened at least once — each mounts only after its first visit
  const [visitedPanels, setVisitedPanels] = useState<Set<string>>(new Set());

  // ----------------------------------------------------
  // LAYER LIST SETUP
  // listItemCreatedFunction is a JS callback, so it's set via ref
  // instead of a plain JSX attribute.
  // ----------------------------------------------------

  const layerListRef = useRef<HTMLArcgisLayerListElement>(null);

  useEffect(() => {
    if (!layerListRef.current) return;

    layerListRef.current.listItemCreatedFunction = (event) => {
      const item = event.item;
      // Group layers already show each child's own legend via the
      // expand chevron, so skip adding a legend to the group itself
      if (item.layer?.type === "group") {
        // item.open = true;
        return;
      }

      item.panel = {
        content: "legend",
        open: true,
      };
    };
    // Reruns once the layers panel first mounts (ref is null before that)
  }, [visitedPanels]);

  // Opens/closes a panel and marks it visited (so it mounts, once)
  const togglePanel = (panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
    setVisitedPanels((prev) => new Set(prev).add(panel as string));
  };

  return (
    <calcite-shell-panel
      slot="panel-start"
      collapsed={activePanel === null}
    >
      <calcite-action-bar
        slot="action-bar"
        expanded={barExpanded}
        oncalciteActionBarToggle={(e: CustomEvent) => {
          setBarExpanded((e.target as HTMLCalciteActionBarElement).expanded);
        }}
      >
        <calcite-action
          icon="layers"
          text="Layers"
          active={activePanel === "layers"}
          onClick={() => togglePanel("layers")}
        ></calcite-action>

        <calcite-action
          icon="basemap"
          text="Basemap"
          active={activePanel === "basemap"}
          onClick={() => togglePanel("basemap")}
        ></calcite-action>

        <calcite-action
          icon="information"
          text="Description"
          active={activePanel === "description"}
          onClick={() => togglePanel("description")}
        ></calcite-action>
      </calcite-action-bar>

      {/* ----------------------------------------------------
          PANELS
          Each mounts once, then toggles via display: none/block
          (not unmount), so state like scroll position survives.
          Close calls setActivePanel(null) directly.
      ---------------------------------------------------- */}

      {/* Layers */}
      {visitedPanels.has("layers") && (
        <calcite-panel
          heading="Layers"
          style={{ display: activePanel === "layers" ? "block" : "none" }}
        >
          <calcite-action
            slot="header-actions-end"
            icon="x"
            text="Close"
            onClick={() => setActivePanel(null)}
          ></calcite-action>
          <div style={{ overflowY: "auto", overflowX: "hidden", maxHeight: "calc(100vh - 120px)" }}>
            <arcgis-layer-list
              ref={layerListRef}
              referenceElement="mmsp-map"
            ></arcgis-layer-list>
          </div>
        </calcite-panel>
      )}

      {/* Basemap */}
      {visitedPanels.has("basemap") && (
        <calcite-panel
          heading="Basemap"
          style={{ display: activePanel === "basemap" ? "block" : "none" }}
        >
          <calcite-action
            slot="header-actions-end"
            icon="x"
            text="Close"
            onClick={() => setActivePanel(null)}
          ></calcite-action>
          <div style={{ overflowY: "auto", overflowX: "hidden", maxHeight: "calc(100vh - 120px)" }}>
            <arcgis-basemap-gallery referenceElement="mmsp-map"></arcgis-basemap-gallery>
          </div>
        </calcite-panel>
      )}

      {/* Description — static text */}
      {visitedPanels.has("description") && (
        <calcite-panel
          heading="Description"
          style={{ display: activePanel === "description" ? "block" : "none" }}
        >
          <calcite-action
            slot="header-actions-end"
            icon="x"
            text="Close"
            onClick={() => setActivePanel(null)}
          ></calcite-action>
          <div
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "calc(100vh - 120px)",
              padding: "12px 16px",
              color: "white",
              lineHeight: 1.6,
            }}
          >
            <p>This smart map shows the progress on the following:</p>
            <ul>
              <li>Land Acquisition</li>
              <li>Structures</li>
              <li>ISF (Informal Settlers Families)</li>
              <li>Lots under Expropriation</li>
            </ul>
            <p>
              The source of data: Master List tables provided by the Social
              &amp; Environmental Team.
            </p>
          </div>
        </calcite-panel>
      )}
    </calcite-shell-panel>
  );
}