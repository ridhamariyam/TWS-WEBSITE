/** Arrow used by buttons and card links. */
export function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true" focusable="false"
      fill="none" height="22" viewBox="0 0 22 22" width="22" xmlns="http://www.w3.org/2000/svg"
      {...props}
    ><path d="M9.25 18H12l7-7-7-7H9.25l6 6H3v2h12.25l-6 6z" fill="currentColor"></path></svg>
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
