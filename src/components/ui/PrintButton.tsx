"use client";
export default function PrintButton() {
  return (
    <button className="button button-secondary" onClick={() => window.print()}>
      Print / save as PDF
    </button>
  );
}
