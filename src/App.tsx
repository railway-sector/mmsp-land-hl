import { useState, useEffect } from "react";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";
import "./index.css";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/components/calcite-shell";

import MapDisplay from "./components/MapDisplay";
import Header from "./components/Header";
import LotChart from "./components/LotChart";
import { MyContext } from "./contexts/MyContext";
import ActionPanel from "./components/ActionPanel";

export function App(): React.JSX.Element {
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
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  const updateContractcps = (newContractcp: any) => {
    setContractPackage(newContractcp);
  };

  const updateLandtype = (newCompany: any) => {
    setLandtype(newCompany);
  };

  const updateLandsection = (newPtLineType: any) => {
    setLandsection(newPtLineType);
  };

  const updateChartPanelwidth = (newWidth: any) => {
    setChartPanelwidth(newWidth);
  };

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
                contractp,
                landtype,
                landsection,
                chartPanelwidth,
                updateContractcps,
                updateLandtype,
                updateLandsection,
                updateChartPanelwidth,
              }}
            >
              <ActionPanel />
              {/* <Chart /> */}
              <MapDisplay />
              <LotChart />
              <Header />
            </MyContext>
          </calcite-shell>
        </div>
      )}
    </>
  );
}

export default App;
