import "@esri/calcite-components/components/calcite-action";
import "@esri/calcite-components/components/calcite-dialog";
import "@esri/calcite-components/components/calcite-button";
import "@esri/calcite-components/components/calcite-label";
import "@esri/calcite-components/components/calcite-input-text";
import "@esri/calcite-components/components/calcite-select";
import "@esri/calcite-components/components/calcite-option";
import "@esri/calcite-components/components/calcite-checkbox";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  exportMapPdf,
  defaultPrintOptions,
  type PrintOptions,
} from "../exportMapPdf";
import { useMyContext } from "../contexts/MyContext";
import { getLocationName } from "../locationName";

export default function PrintMapButton() {
  const { selectedLocation } = useMyContext();

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [opts, setOpts] = useState<PrintOptions>(defaultPrintOptions);

  const update = <K extends keyof PrintOptions>(key: K, value: PrintOptions[K]) =>
    setOpts((prev) => ({ ...prev, [key]: value }));

  // Prefill the title using: station -> package -> "MMSP"
  const openDialog = () => {
    setOpts((prev) => ({
      ...prev,
      title: getLocationName(selectedLocation),
    }));
    setOpen(true);
  };

  const handleExport = async () => {
    setBusy(true);
    try {
      await exportMapPdf(opts);
      setOpen(false);
    } catch (err) {
      console.warn("PDF export failed", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <calcite-action
        icon="print"
        text="Print map to PDF"
        onClick={openDialog}
      />

      {createPortal(
        <calcite-dialog
          open={open}
          heading="Print map to PDF"
          modal
          width-scale="s"
          oncalciteDialogClose={() => setOpen(false)}
        >
          <calcite-label>
            Title
            <calcite-input-text
              value={opts.title}
              oncalciteInputTextInput={(e: Event) =>
                update("title", (e.target as HTMLCalciteInputTextElement).value)
              }
            />
          </calcite-label>

          <calcite-label>
            Paper size
            <calcite-select
              label="Paper size"
              oncalciteSelectChange={(e: Event) =>
                update(
                  "paper",
                  (e.target as HTMLCalciteSelectElement).value as PrintOptions["paper"]
                )
              }
            >
              <calcite-option value="a4" selected={opts.paper === "a4"}>A4</calcite-option>
              <calcite-option value="a3" selected={opts.paper === "a3"}>A3</calcite-option>
              <calcite-option value="letter" selected={opts.paper === "letter"}>Letter</calcite-option>
            </calcite-select>
          </calcite-label>

          <calcite-label>
            Orientation
            <calcite-select
              label="Orientation"
              oncalciteSelectChange={(e: Event) =>
                update(
                  "orientation",
                  (e.target as HTMLCalciteSelectElement).value as PrintOptions["orientation"]
                )
              }
            >
              <calcite-option value="landscape" selected={opts.orientation === "landscape"}>Landscape</calcite-option>
              <calcite-option value="portrait" selected={opts.orientation === "portrait"}>Portrait</calcite-option>
            </calcite-select>
          </calcite-label>

          <calcite-label>
            Quality
            <calcite-select
              label="Quality"
              oncalciteSelectChange={(e: Event) =>
                update(
                  "resolution",
                  Number((e.target as HTMLCalciteSelectElement).value) as PrintOptions["resolution"]
                )
              }
            >
              <calcite-option value="1" selected={opts.resolution === 1}>Standard</calcite-option>
              <calcite-option value="2" selected={opts.resolution === 2}>High</calcite-option>
              <calcite-option value="3" selected={opts.resolution === 3}>Very high (larger file)</calcite-option>
            </calcite-select>
          </calcite-label>

          <calcite-label>
            Margin
            <calcite-select
              label="Margin"
              oncalciteSelectChange={(e: Event) =>
                update("margin", Number((e.target as HTMLCalciteSelectElement).value))
              }
            >
              <calcite-option value="5" selected={opts.margin === 5}>Narrow (5 mm)</calcite-option>
              <calcite-option value="10" selected={opts.margin === 10}>Normal (10 mm)</calcite-option>
              <calcite-option value="20" selected={opts.margin === 20}>Wide (20 mm)</calcite-option>
            </calcite-select>
          </calcite-label>

          <calcite-label layout="inline">
            <calcite-checkbox
              checked={opts.includeDate}
              oncalciteCheckboxChange={(e: Event) =>
                update("includeDate", (e.target as HTMLCalciteCheckboxElement).checked)
              }
            />
            Include date
          </calcite-label>

          <calcite-button
            slot="footer-end"
            appearance="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </calcite-button>
          <calcite-button slot="footer-end" loading={busy} onClick={handleExport}>
            Export PDF
          </calcite-button>
        </calcite-dialog>,
        document.body
      )}
    </>
  );
}