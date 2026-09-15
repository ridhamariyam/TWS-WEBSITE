import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { AwardsSection } from "@/components/sections/awards-section";
import { BlogSection } from "@/components/sections/blog-section";
import { CtaSection } from "@/components/sections/cta-section";
import { FeatureStrip } from "@/components/sections/feature-strip";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      {/* Below 992px the header bar occupies 100px of flow on the reference; above it the header overlays the hero. */}
      <main className="relative overflow-x-clip max-lg:pt-[100px]">
        <HeroSection />
        <FeatureStrip />
        <AboutSection />
        <ProcessSection />
        <ProjectsSection />
        <AwardsSection />
        <TestimonialsSection />
        <BlogSection />
        <CtaSection />
      </main>
      <SiteFooter />
      <ScrollProgress />
    </>
  );
}
