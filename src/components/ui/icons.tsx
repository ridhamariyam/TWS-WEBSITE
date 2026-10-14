/**
 * The site's SVG icons. Sizing comes from the caller; colour is
 * `currentColor`, so a mark inverts with the section it sits on.
 *
 * All of them are decorative and hidden from assistive technology by default —
 * icon-only controls carry their own `aria-label`, and every link holding an
 * arrow also holds real text. Pass `aria-hidden={false}` with a role and a
 * name to announce one.
 */

/** Carousel previous control. */
export function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false"
      width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"
      {...props}
    ><path d="M12.75 18H10L3 11L10 4L12.75 4L6.75 10L19 10V12L6.75 12L12.75 18Z" fill="currentColor"></path></svg>
  );
}

/** Plus that rotates 45deg into a cross when an accordion opens. */
export function TogglePlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(0deg)'}}
      {...props}
    ><path fillRule="evenodd" stroke="none" clipRule="evenodd" fill="currentColor" d="M8 6.185V0H6.185V6.185L0 6.185V8L6.185 8V14H8V8L14 8V6.185L8 6.185Z"></path></svg>
  );
}

/** Carousel next control, and card links. */
export function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false"
      fill="none" height="22" viewBox="0 0 22 22" width="22" xmlns="http://www.w3.org/2000/svg"
      {...props}
    ><path d="M9.25 18H12l7-7-7-7H9.25l6 6H3v2h12.25l-6 6z" fill="currentColor"></path></svg>
  );
}

/** Caret on the footer's collapsible column headings. */
export function CaretDownSmallIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false"
      xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="none"
      {...props}
    ><path d="M0.363525 0.954102L0.363525 2.77228L3.99989 6.40865L7.63625 2.77228V0.954102L3.99989 4.59047L0.363525 0.954102Z" fill="currentColor"></path></svg>
  );
}

/** Chevron on nav items and carousel controls. */
export function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false"
      xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"
      {...props}
    ><path d="M3 4L3 6.5L8 11.5L13 6.5L13 4L8 9L3 4Z" fill="currentColor"></path></svg>
  );
}

/** Pause control for autoplaying media. */
export function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false"
      fill="none" height="10" viewBox="0 0 8 10" width="8" xmlns="http://www.w3.org/2000/svg"
      {...props}
    ><g fill="currentColor"><rect height="9" rx=".2" width="3" y=".500244"></rect><rect height="9" rx=".2" width="3" x="5" y=".500244"></rect></g></svg>
  );
}

/** Play control for autoplaying media. */
export function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false"
      fill="none" height="10" viewBox="0 0 6 10" width="6" xmlns="http://www.w3.org/2000/svg"
      {...props}
    ><path d="m.319988 9.26029c-.131849.09887-.319988.00479-.319988-.16001v-8.199999c0-.164816.188166-.258891.320011-.159992l5.466669 4.100621c.10666.08001.10665.24001-.00003.32z" fill="currentColor"></path></svg>
  );
}

/** Solid LinkedIn mark. */
export function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      {...props}
    ><path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M4 1H20C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1ZM4.8 9.5V19.3H8V9.5H4.8ZM6.4 8.15C7.42173 8.15 8.25 7.32173 8.25 6.3C8.25 5.27827 7.42173 4.45 6.4 4.45C5.37827 4.45 4.55 5.27827 4.55 6.3C4.55 7.32173 5.37827 8.15 6.4 8.15ZM9.9 9.5V19.3H13V14.1C13 12.8 13.7 12 14.8 12C15.8 12 16.3 12.8 16.3 14V19.3H19.4V13.4C19.4 10.7 18.3 9.25 16.1 9.25C14.5 9.25 13.4 10 12.9 10.9V9.5H9.9Z"></path></svg>
  );
}

/** Outline Instagram mark. */
export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      {...props}
    ><rect x="2.1" y="2.1" width="19.8" height="19.8" rx="5" stroke="currentColor" strokeWidth="2.2"></rect><circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="2.2"></circle><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"></circle></svg>
  );
}

/** WhatsApp contact links. */
export function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
        aria-hidden="true"
        focusable="false"
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        {...props}
      >
        <path
          d="M16 3a13 13 0 0 0-11.3 19.4L3 29l6.8-1.7A13 13 0 1 0 16 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="m11.2 9.3 2 4-1.6 1.7c1.2 2.4 2.9 4.1 5.3 5.3l1.7-1.6 4 2c.3.2.4.5.3.8-.5 1.5-1.8 2.4-3.4 2.1-5.5-1-10.1-5.6-11.1-11.1-.3-1.6.6-2.9 2.1-3.4.3-.1.6 0 .7.2Z"
          fill="currentColor"
        />
      </svg>
  );
}
