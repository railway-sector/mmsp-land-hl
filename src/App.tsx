import { useState, useEffect } from "react";
import "./index.css";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/components/calcite-shell";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapDisplay from "./components/MapDisplay";
import Header from "./components/Header";
import ActionPanel from "./components/ActionPanel";
import ChartLot from "./components/ChartLot";
import { authenticate } from "./autho";

const queryClient = new QueryClient();
export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "dBUHc4nvxTSveUM1");
  }, []);

  return (
    <>
      {loggedInState && (
        <div>
          <calcite-shell
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #555",
              backgroundColor: "#2b2b2b",
            }}
          >
            <QueryClientProvider client={queryClient}>
              <ActionPanel />
              <MapDisplay />
              <ChartLot />
              <Header />
            </QueryClientProvider>
          </calcite-shell>
        </div>
      )}
    </>
  );
}

export default App;
