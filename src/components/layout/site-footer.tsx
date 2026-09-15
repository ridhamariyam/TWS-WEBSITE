import Image from "next/image";
import Link from "next/link";

import { RichText } from "@/components/ui/rich-text";
import { footer } from "@/lib/content";
import { cn } from "@/lib/utils";

const CONTAINER = "mx-auto flex w-full max-w-[1220px] max-lg:max-w-[720px] max-md:max-w-none";

const HOVER_LINK = "transition-colors duration-300 ease-in-out hover:text-nav-muted";

/**
 * Site footer: tagline + logo, two office addresses with phone/email, and a bottom
 * bar with the footer navigation and copyright. Transparent so the page grid shows through.
 * >=992px: 10/2 tagline row, 1/4 office columns with the contact column pushed right.
 * 768–991px: three equal columns; bottom bar stacks centred.
 * <768px: everything stacks centred.
 */
export function SiteFooter() {
  const { tagline, logo, offices, phone, email, nav, copyright } = footer;
  const lastNavIndex = nav.length - 1;

  return (
    <footer id="contact" className="relative text-[17px] leading-[32px] text-body">
      {/* Top */}
      <div className="border-b border-white/10">
        <div
          className={cn(
            CONTAINER,
            "items-center justify-center pb-[34.5px] max-lg:pb-[24.5px] max-md:flex-wrap max-md:pb-[21px]",
          )}
        >
          <div className="w-10/12 px-[15px] max-md:mb-[25px] max-md:w-full">
            <h5 className="text-[32px] leading-[42px] font-normal tracking-[-1px] text-ink max-lg:text-[28px] max-lg:leading-[36.75px] max-md:text-center max-md:text-[24px] max-md:leading-[31.5px]">
              <RichText value={tagline} emphasisClassName="font-semibold text-ink border-b-2 border-ink" />
            </h5>
          </div>
          <div className="flex w-2/12 items-center justify-end px-[15px] max-md:w-full max-md:justify-center">
            <Link href="/" className="block">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="block h-[56px] w-[50px]"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Offices + contact */}
      <div className={cn(CONTAINER, "pb-[73.2px] max-lg:flex-wrap max-lg:pb-[43px] max-md:pb-[40px]")}>
        {offices.map((office) => (
          <div
            key={office.name}
            className="flex w-1/4 flex-col px-[15px] max-lg:w-1/3 max-md:mb-[25px] max-md:w-full max-md:items-center"
          >
            <p className="mb-[5px] text-[17px] leading-[32px] font-semibold tracking-[-0.5px] text-ink">
              {office.name}
            </p>
            <address className="text-[15px] leading-[28px] text-body not-italic max-md:text-center">
              {office.lines.map((line, i) => (
                <span key={i} className="block max-md:inline">
                  {line}
                  {i < office.lines.length - 1 ? " " : null}
                </span>
              ))}
            </address>
          </div>
        ))}

        <address className="ml-[25%] flex w-1/4 flex-col items-end justify-end px-[15px] not-italic max-lg:ml-0 max-lg:w-1/3 max-md:w-full max-md:items-center">
          <a
            href={`tel:${phone.replace(/\D/g, "")}`}
            className={cn("mb-[-7px] block text-[17px] leading-[32px] text-ink", HOVER_LINK)}
          >
            {phone}
          </a>
          <div className="text-right leading-[32px] max-md:text-center">
            <a
              href={`mailto:${email}`}
              className={cn(
                "border-b border-current text-[17px] leading-[28px] font-semibold text-ink",
                HOVER_LINK,
              )}
            >
              {email}
            </a>
          </div>
        </address>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-silver">
        <div
          className={cn(
            CONTAINER,
            "items-center justify-center pt-[30px] pb-[32px] max-lg:flex-col max-lg:pb-[25px]",
          )}
        >
          <nav
            aria-label="Footer"
            className="flex w-7/12 px-[15px] max-lg:mb-[10px] max-lg:w-full max-lg:justify-center max-md:mb-[11px]"
          >
            <ul className="flex flex-wrap gap-x-[4.7px] max-lg:justify-center">
              {nav.map((item, index) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-[16px] py-[8px] text-[16px] leading-[28px] font-semibold text-ink",
                      "max-lg:px-[8px] max-lg:py-[7px] max-md:px-[10px] max-md:py-[8px]",
                      index === 0 && "pl-0 max-lg:pl-0 max-md:pl-0",
                      index === lastNavIndex && "pr-0 max-lg:pr-0 max-md:pr-0",
                      HOVER_LINK,
                    )}
                  >
                    <span className="leading-[20px]">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex w-5/12 justify-end px-[15px] max-lg:w-full max-lg:justify-center">
            <p className="text-center text-[15px] leading-[32px] text-body">
              <RichText value={copyright} emphasisClassName="font-medium text-ink border-b border-ink" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
