import { ParticleField } from "@/components/ui/particle-field";

/**
 * A run of dark page with the studio's aurora dust behind it.
 *
 * The canvas is a viewport-tall sheet on a zero-height sticky rail, so it
 * travels with the run and its `IntersectionObserver` can park it. One fixed
 * page-wide canvas cannot: a fixed element always intersects the viewport, so
 * it composites even under the white sections that cover it.
 *
 * Two constraints, both load-bearing:
 *
 * - No `isolation: isolate`, or the hero's intro overlay (fixed at z-950 to
 *   cover the header) would be trapped in this stacking context.
 * - `overflow: clip`, not `hidden`: the sheet hangs below the rail and would
 *   otherwise drift over the next section, but `hidden` would make the run a
 *   scroll container and break the sticky rail inside it.
 */
export function DustRun({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-clip ${className ?? ""}`}>
      <div className="pointer-events-none sticky top-0 -z-10 h-0">
        <ParticleField
          mode="dust"
          className="absolute top-0 left-0 h-lvh w-full"
        />
      </div>
      {children}
    </div>
  );
}
