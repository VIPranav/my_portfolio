export default function FloatingGlass() {
  // Repeated cards use CSS glass to avoid per-card SVG filters and observers.
  return <div className="floating-glass" aria-hidden="true" />;
}
