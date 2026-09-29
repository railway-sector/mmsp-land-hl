import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { DateTable } from "../layers";

// Formats a Date, e.g. "July 8, 2026"
function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Static styles — defined once outside the component so they aren't
// recreated on every render.
const styles = {
  header: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "#1c1c1c",
    borderBottom: "1px solid #3a3a3a",
    color: "#ffffff",
  },
  title: {
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },
  date: {
    fontSize: "13px",
    color: "#9a9a9a",
    whiteSpace: "nowrap",
    justifySelf: "end",
  },
} as const;

export default function Header() {
  // Empty until the portal table responds — there's no client-side
  // fallback value here since the date now comes from the table, not
  // the device clock.
  const [displayDate, setDisplayDate] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDate() {
      try {
        await DateTable.load();

        const result = await DateTable.queryFeatures({
          where: "category = 'Land Acquisition HL'",
          outFields: ["date"],
          num: 1,
        });

        const rawDate = result.features[0]?.attributes?.date;
        if (!cancelled && rawDate) {
          setDisplayDate(formatDate(new Date(rawDate)));
        }
      } catch (error) {
        console.error("Failed to load Land Acquisition HL date:", error);
      }
    }

    loadDate();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    // 3-column layout: title (left) | Dropdown (center) | date (right)
    <header slot="header" style={styles.header}>
      <span style={styles.title}>MMSP Land (HL)</span>

      <Dropdown />

      <span style={styles.date}>{displayDate}</span>
    </header>
  );
}