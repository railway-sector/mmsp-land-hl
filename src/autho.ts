import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";

export async function authenticate(setLoggedInState: any, appId: any) {
  const info = new OAuthInfo({
    appId: appId,
    popup: false,
    portalUrl: "https://gis.railway-sector.com/portal",
  });

  IdentityManager.registerOAuthInfos([info]);

  try {
    await IdentityManager.checkSignInStatus(info.portalUrl + "/sharing");

    // Unblock the app now — nothing below needs to hold up rendering.
    setLoggedInState(true);

    // Fire-and-forget: only needed for the log line, so it runs in the
    // background instead of adding a second sequential network round trip.
    const portal: any = new Portal({
      access: "public",
      url: info.portalUrl,
      authMode: "no-prompt",
    });
    portal.load().then(() => {
      console.log("Logged in as: ", portal.user.username);
    });
  } catch (error) {
    console.error("Authentication error:", error);
    IdentityManager.getCredential(info.portalUrl);
  }
}