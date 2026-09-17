# Page Topology — Web Agency homepage (reference layout, rebuilt for TWS)

Measured at 1440×900 unless noted. Page height ≈ 6146px (1440), 7500px (768), 9985px (390).
Body background: white with a 1px `#e7e7e7` vertical rule every 151px, centred (repeating, full page).
Scroll: native (no smooth-scroll library). skrollr drives parallax on desktop; anime.js drives entrance animations.

| # | Section | Component | Top / Height (1440) | Layer | Interaction model |
|---|---------|-----------|---------------------|-------|-------------------|
| 0 | Header | `SiteHeader` | 0 / 116 (absolute, overlays hero) | z-99, not sticky | hover (links, dropdown, CTA); click (mobile menu < 992px) |
| 1 | Hero | `HeroSection` | 0 / 900 (min-height 100vh) | flow, overflow hidden | time-driven (ray loop, particles) + entrance on load |
| 2 | Feature strip | `FeatureStrip` | 900 / 32 | flow | entrance (stagger) |
| 3 | About | `AboutSection` | 932 / 941 | flow, overflow hidden | scroll-driven parallax + entrance; hover on link |
| 4 | Process | `ProcessSection` | 1873 / 257 | flow | entrance (stagger); hover on step number |
| 5 | Projects | `ProjectsSection` | 2130 / 1166 | flow | scroll parallax (word, columns); rotating badge (time); hover cards |
| 6 | Awards | `AwardsSection` | 3296 / 796 | flow | entrance + scroll parallax on giant word |
| 7 | Testimonials | `TestimonialsSection` | 4092 / 602, bg `#1c1d1f` | flow | time-driven carousel (3s autoplay, loop) + click arrows + drag; magic cursor |
| 8 | Latest blog | `BlogSection` | 4694 / 602 | flow | entrance (stagger); hover image zoom |
| 9 | CTA words | `CtaSection` | 5296 / 493, overflow hidden | flow | entrance; rotating badge (time) |
| 10 | Footer | `SiteFooter` | 5789 / 357 | flow | hover links |
| — | Scroll rail | `ScrollProgress` | fixed right 20px, top 450px | z-111, mix-blend difference, hidden < 1200px | scroll-driven (progress fill, fade-in), click → top |
| — | Magic cursor | `MagicCursor` | fixed, follows pointer | z-10000 | pointer-driven, only over the testimonial carousel |

Excluded on purpose: the theme vendor's "56+ pre-built sites" side tab and its promotional popup (demo-store chrome, not part of the site).

Container: `max-width: 1220px; padding-inline: 15px` (steps: 960 < 1200, 720 < 992, 540 < 768, 100% < 576).
Breakpoints (desktop-first): 1399, 1199, 991, 767, 575 → Tailwind `max-2xl`, `max-xl`, `max-lg`, `max-md`, `max-sm`.
