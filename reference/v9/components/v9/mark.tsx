type MarkLike = { mark: string; tint: string };

/** Monogram tile standing in for a connector icon. */
export function Mark({
  app,
  size = "md",
  ring,
}: {
  app: MarkLike;
  size?: "md" | "sm";
  ring?: boolean;
}) {
  return (
    <span
      className={`mark mark-${size}`}
      style={{
        background: `linear-gradient(160deg, ${app.tint} 0%, color-mix(in oklab, ${app.tint} 78%, #000) 100%)`,
        boxShadow: ring
          ? "inset 0 1px 0 rgba(255,255,255,0.22), 0 0 0 2px var(--sweet-surface)"
          : undefined,
      }}
      aria-hidden
    >
      {app.mark}
    </span>
  );
}
