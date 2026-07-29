import { useState, useEffect, useCallback } from "react";
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
import { MyContext } from "./contexts/MyContext";

const queryClient = new QueryClient();
export function App(): React.JSX.Element {
  //------------------------
  //  Authenticate viewers
  //------------------------
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "dBUHc4nvxTSveUM1");
  }, []);

  //------------------------
  //  Create Context
  //------------------------
  const [cpackage, setCpackage] = useState<any>();
  const updateCpackage = useCallback((newC: any) => {
    setCpackage(newC);
  }, []);

  const [landtype, setLandtype] = useState<any>();
  const updateLandtype = useCallback((newB: any) => {
    setLandtype(newB);
  }, []);

  const [landsection, setLandsection] = useState<any>();
  const updateLandsection = useCallback((newB: any) => {
    setLandsection(newB);
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
            <MyContext
              value={{
                cpackage,
                updateCpackage,
                landtype,
                updateLandtype,
                landsection,
                updateLandsection,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <ActionPanel />
                <MapDisplay />
                <ChartLot />
                <Header />
              </QueryClientProvider>
            </MyContext>
          </calcite-shell>
        </div>
      )}
    </>
  );
}

export default App;
