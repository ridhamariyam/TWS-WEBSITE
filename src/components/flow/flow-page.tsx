import type { ReactNode } from "react";
import { StudioFooter } from "@/components/layout/studio-footer";
import { FlowNav } from "./flow-nav";
import { SmoothScroll } from "./smooth-scroll";
import styles from "./flow.module.css";

/**
 * The frame every flow page sits in: eased scrolling, the floating nav, a
 * `#content` main (the skip link's target) and the footer.
 */
export function FlowPage({ children }: { children: ReactNode }) {
  return (
    <div id="page" className={styles.page}>
      <SmoothScroll />
      <FlowNav />
      <main id="content">{children}</main>
      <StudioFooter />
    </div>
  );
}
