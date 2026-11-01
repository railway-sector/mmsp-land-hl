import "@esri/calcite-components/components/calcite-action";
import { captureDashboardScreen } from "../captureDashboard";
import { useMyContext } from "../contexts/MyContext";
import { getLocationName } from "../locationName";

export default function ScreenshotButton() {
  const { selectedLocation } = useMyContext();

  const handleClick = async () => {
    try {
      await captureDashboardScreen(
        [
          document.getElementById("mmsp-map"),
          document.getElementById("side-panel"),
        ],
        getLocationName(selectedLocation)
      );
    } catch (err) {
      console.warn("Screenshot cancelled or failed", err);
    }
  };

  return (
    <calcite-action icon="camera" text="Save screenshot" onClick={handleClick} />
  );
}