import type { ComponentType, SVGProps } from "react";

import { BadgeCheckIcon, HeartIcon, MapPinIcon } from "@/components/icons";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { features } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { FeatureItem } from "@/types/content";

const featureIcons: Record<FeatureItem["icon"], ComponentType<SVGProps<SVGSVGElement>>> = {
  badge: BadgeCheckIcon,
  pin: MapPinIcon,
  heart: HeartIcon,
};

type StripNode =
  | { kind: "feature"; key: string; feature: FeatureItem }
  | { kind: "separator"; key: string };

/**
 * Centred row of icon + uppercase label highlights divided by 1px ink rules.
 * Desktop: one 32px row. Tablet (<992): wraps, 10px between rows, 70px rules.
 * Mobile (<768): stacked column, rules hidden. Children slide in from x:15
 * with a 300ms stagger (reference anime.js: duration 800, delay 200).
 */
export function FeatureStrip() {
  const nodes: StripNode[] = features.flatMap((feature, index): StripNode[] => {
    const item: StripNode = { kind: "feature", key: `feature-${index}`, feature };
    return index === 0 ? [item] : [{ kind: "separator", key: `separator-${index}` }, item];
  });

  return (
    <section>
      <RevealGroup className="mx-auto flex h-[32px] max-w-[1220px] items-center justify-center max-lg:h-auto max-lg:max-w-[720px] max-lg:flex-wrap max-md:max-w-none max-md:flex-col">
        {nodes.map((node, i) => {
          const spacing = i < nodes.length - 1 && "max-lg:mb-[10px]";

          if (node.kind === "separator") {
            return (
              <Reveal
                key={node.key}
                from={{ x: 15 }}
                duration={800}
                delay={200 + i * 300}
                className={cn("px-[15px] max-md:hidden", spacing)}
              >
                <div aria-hidden="true" className="h-px w-[100px] bg-ink max-lg:w-[70px]" />
              </Reveal>
            );
          }

          const Icon = featureIcons[node.feature.icon];
          return (
            <Reveal
              key={node.key}
              from={{ x: 15 }}
              duration={800}
              delay={200 + i * 300}
              className={cn("flex items-center px-[15px]", spacing)}
            >
              <Icon className="mr-[5px] size-[15px] shrink-0 text-ink" />
              <span className="text-[14px] leading-[32px] font-semibold tracking-normal whitespace-nowrap text-ink uppercase">
                {node.feature.label}
              </span>
            </Reveal>
          );
        })}
      </RevealGroup>
    </section>
  );
}
