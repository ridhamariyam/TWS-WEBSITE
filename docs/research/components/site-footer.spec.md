# SiteFooter Specification

## Overview
- **Target file:** `src/components/layout/site-footer.tsx`
- **Screenshot:** `docs/design-references/desktop-1440-99-footer.png`, `mobile-390-99-footer.png`
- **Ground-truth CSS:** `docs/research/css/footer.css`, `footer-auxiliary.css`,
  `footer-fineprint.css`, `currency-selector.css`
- **Ground-truth DOM:** `docs/research/html/99-footer.html` (1222 lines)
- **Interaction model:** static links on desktop; **click accordions on mobile**;
  locale and currency dropdowns at both sizes.
- **Geometry:** y 7116, height 727 @1440. Background `#000`, text `#fff`.

## Structure

```
footer#footer.footer
  SquarespaceMark  +  "A website makes it real"
  5 link column groups:  Products · Solutions · Resources · From Squarespace ·
                         Programs · Support · Company · Follow
  .footer-auxiliary
    ICANN badge  "We are an ICANN accredited registrar."
    SSL badge    "Data traffic protected by SSL encryption"
    locale button (GlobeIcon + "English" + CaretDownSmallIcon)
    currency button ("₹ INR" + caret)
  .footer-fineprint
    "*From TIME. © 2025 TIME USA LLC. All rights reserved. Used under license."
    Terms · Privacy · Security Measures · Sitemap
    "© 2003–2026 Squarespace, Inc."
```

Column headings and every link label/href are in the DOM slice — transcribe all
of them verbatim. The visible columns at 1440 are:

- **Products:** Website Templates, Websites, Domains, AI Website Builder, Design Intelligence, Online Stores, Services, Invoicing, Scheduling, Content & Memberships, Donations, Payments, Marketing Tools, Professional Email, Premium, Feature List, Product Updates, Pricing
- **Solutions:** Creative Services, Professional Services, Education & Training, Beauty, Sports & Fitness, Health & Wellness, Home Services, Events & Experiences, Charities & Nonprofits, Personal
- **Resources:** Customer Examples, Squarespace Collection, Extensions, Squarespace Blog, Free Tools, Business Name Generator, Logo Maker
- **From Squarespace:** Acuity Scheduling, Bio Sites, Unfold, Email Campaigns, Squarespace for Pros
- **Programs:** Circle, Affiliates, Students
- **Support:** Help Center, Forum, Webinars, Hire an Expert, Developer Blog, Developer Platform, System Status
- **Company:** About, Careers, Our Brand, Accessibility, Newsroom, Press & Media, Contact Us
- **Follow:** Instagram, YouTube, LinkedIn, Facebook, X

## Typography
- Column headings: `.text-eyebrow`-ish — confirm against `footer.css`.
- Links: `.text-body`, `#fff`, with the `.cta--has-inline-underline` sweep on hover.
- Fineprint: `.text-footnote`, muted `--color-gray-500`.

## States & behaviors

### Mobile column accordion (<744)
```
.footer__column-group-list {
  opacity: 0; visibility: hidden; height: 0;
  transition: height .3s cubic-bezier(.645,.045,.355,1),
              opacity .3s cubic-bezier(.645,.045,.355,1),
              visibility .3s step-end;
}
.footer__column-group-list--expanded {
  height: var(--footer-column-group-list-height);
  opacity: 1; visibility: visible;
  transition: … visibility .3s step-start;
}
```
Set `--footer-column-group-list-height` from the measured content height.
The caret (`CaretDownSmallIcon`) rotates: `transition: transform .3s`.

### Locale menu
```
.footer__locale-setting-menu {
  z-index: 1000; backdrop-filter: blur(10px);
  visibility: hidden; opacity: 0; pointer-events: none;
  width: 100%; height: 100%;
  transition: opacity .3s cubic-bezier(.645,.045,.355,1),
              visibility .3s cubic-bezier(.645,.045,.355,1);
}
.footer__locale-setting-menu-contents {
  background-color: #222; border-radius: 8px; padding: 8px;
  flex-direction: column; text-align: center; width: 100%;
  transition: transform .3s cubic-bezier(.645,.045,.355,1);
}
.footer__locale-setting-button {
  background-color: #222; border-radius: 8px; padding: 12px;
  gap: 8px; align-items: center; cursor: pointer;
  transition: opacity .3s;
}
```
Languages: English, Deutsch, Español, Français, Italiano, 日本語, Português, 한국어.

## Responsive
- **≥744:** all columns open in a multi-column grid.
- **<744:** each column becomes a tappable accordion row; logo, tagline, badges
  and locale controls stack centred.

## Notes
- Icons: `SquarespaceMark`, `GlobeIcon`, `CaretDownSmallIcon`, `CaretUpIcon`,
  `IcannLogo`, `SslLogo`, plus `SocialIconsSprite` + `SocialIcon` for Follow.
- Render `SocialIconsSprite` once inside the footer before using `SocialIcon`.
