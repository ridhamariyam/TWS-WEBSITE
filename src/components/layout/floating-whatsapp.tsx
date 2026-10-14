import { WhatsAppIcon } from "@/components/ui/icons";
import { CONTACT_WHATSAPP } from "@/lib/site-links";

/*
 * A small black disc with a white icon, inside the site's black-and-white
 * palette. It turns white on hover.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={CONTACT_WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with TWS on WhatsApp (opens in a new tab)"
      title="Chat on WhatsApp"
      data-floating-whatsapp=""
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-[850] flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white hover:text-black backdrop-blur-md transition-colors duration-300 hover:border-white hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink bp744:right-[max(1.5rem,env(safe-area-inset-right))] bp744:bottom-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <WhatsAppIcon width={20} height={20} />
    </a>
  );
}
