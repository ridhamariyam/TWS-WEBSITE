import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/sections/hero-section";
import { GrowYourBusinessSection } from "@/components/sections/grow-your-business-section";
import { OnePlatformSection } from "@/components/sections/one-platform-section";
import { GetStartedSection } from "@/components/sections/get-started-section";
import { YourDomainSection } from "@/components/sections/your-domain-section";
import { CustomersServedSection } from "@/components/sections/customers-served-section";
import { MadeWithSqspSection } from "@/components/sections/made-with-sqsp-section";
import { HomepageAccordions } from "@/components/sections/homepage-accordions";
import { ConversionCtaSection } from "@/components/sections/conversion-cta-section";
import { SocialIconsSprite } from "@/components/icons";

/**
 * squarespace.com homepage clone.
 *
 * Section order matches the live page's `main#content`. The page runs black ->
 * white -> black: the hero is dark, the three product sections are light, and
 * `get-started` carries a gradient back down to black before the domain search.
 *
 * There is no scroll container and no smooth-scroll library here, because the
 * original has neither — it is plain native scrolling with IntersectionObserver
 * reveals.
 */
export default function Home() {
  return (
    <div id="homepage-default" className="bg-primitive-black">
      <SocialIconsSprite />
      <SiteHeader />
      <main id="content">
        <HeroSection />
        <GrowYourBusinessSection />
        <OnePlatformSection />
        <GetStartedSection />
        <YourDomainSection />
        <CustomersServedSection />
        <MadeWithSqspSection />
        <HomepageAccordions />
        <ConversionCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
