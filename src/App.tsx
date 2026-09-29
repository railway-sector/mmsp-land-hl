import "./index.css";
import "@esri/calcite-components/components/calcite-shell";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { authenticate } from "./autho";

// Components
import Header from "./components/Header";
import MapDisplay from "./components/MapDisplay";
import SidePanel from "./components/SidePanel";
import ActionBar from "./components/ActionBar";

// Contexts
import { MyContextProvider } from "./contexts/MyContext";

// Created once outside the component so it's never recreated on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // ArcGIS data doesn't change that frequently
      staleTime: 1000 * 60 * 5,    // cache stays fresh for 5 minutes
    },
  },
});

export default function App() {
  //------------------------
  //  Authenticate viewers
  //------------------------
  const [loggedInState, setLoggedInState] = useState<boolean>(false);

  useEffect(() => {
    authenticate(setLoggedInState, "dBUHc4nvxTSveUM1");
  }, []);

  return (
    loggedInState && (
      <calcite-shell>
        <MyContextProvider>
          <QueryClientProvider client={queryClient}>
            <Header />
              <MapDisplay />
              <ActionBar />
              <SidePanel />
          </QueryClientProvider>
        </MyContextProvider>
      </calcite-shell>
    )
  );
}