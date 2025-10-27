import React, { createContext, useState, useEffect } from "react";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";
import "./App.css";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteShell } from "@esri/calcite-components-react";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import LotChart from "./components/LotChart";

type MyDropdownContextType = {
  contractp: any;
  landtype: any;
  landsection: any;
  updateContractcps: any;
  updateLandtype: any;
  updateLandsection: any;
};

const initialState = {
  contractp: undefined,
  landtype: undefined,
  landsection: undefined,
  updateContractcps: undefined,
  updateLandtype: undefined,
  updateLandsection: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});

function App() {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    // Useful video: https://www.google.com/search?sca_esv=41638d9270b90df6&rlz=1C1CHBF_enPH1083PH1083&udm=7&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZud1z6kQpMfoEdCJxnpm_3W-pLdZZVzNY_L9_ftx08kwv-_tUbRt8pOUS8_MjaceHuSAD6YvWZ0rfFzwmtmaBgLepZn2IJkVH-w3cPU5sPVz9l1Pp06apNShUnFfpGUJOF8p91U6HxH3ukND0OVTTVy0CGuHNdViLZqynGb0mLSRGeGVO46qnJ_2yk3F0uV6R6BW9rQ&q=apply+user+authentication+using+arcgis+maps+sdk+for+javascript+for+arcgis+enterprise&sa=X&ved=2ahUKEwjVqZbdlLKQAxUtmq8BHVQQCHcQtKgLegQIGRAB&biw=1920&bih=911&dpr=1#fpstate=ive&vld=cid:fcf356be,vid:hQH9d1vc8Gc,st:0
    // check app authentication: https://developers.arcgis.com/documentation/security-and-authentication/app-authentication/how-to-implement-app-authentication/
    const info = new OAuthInfo({
      appId: "dBUHc4nvxTSveUM1",
      popup: false,
      portalUrl: "https://gis.railway-sector.com/portal",
    });

    IdentityManager.registerOAuthInfos([info]);
    async function loginAndLoadPortal() {
      try {
        await IdentityManager.checkSignInStatus(info.portalUrl + "/sharing");
        const portal: any = new Portal({
          // access: "public",
          url: info.portalUrl,
          authMode: "no-prompt",
        });
        portal.load().then(() => {
          setLoggedInState(true);
          console.log("Logged in as: ", portal.user.username);
        });
      } catch (error) {
        console.error("Authentication error:", error);
        IdentityManager.getCredential(info.portalUrl);
      }
    }
    loginAndLoadPortal();
  }, []);

  const [contractp, setContractPackage] = useState<any>();
  const [landtype, setLandtype] = useState<any>();
  const [landsection, setLandsection] = useState<any>();

  const updateContractcps = (newContractcp: any) => {
    setContractPackage(newContractcp);
  };

  const updateLandtype = (newCompany: any) => {
    setLandtype(newCompany);
  };

  const updateLandsection = (newPtLineType: any) => {
    setLandsection(newPtLineType);
  };

  return (
    <>
      {loggedInState === true ? (
        <div>
          <CalciteShell>
            <MyContext
              value={{
                contractp,
                landtype,
                landsection,
                updateContractcps,
                updateLandtype,
                updateLandsection,
              }}
            >
              <ActionPanel />
              {/* <Chart /> */}
              <MapDisplay />
              <LotChart />
              <Header />
            </MyContext>
          </CalciteShell>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default App;
