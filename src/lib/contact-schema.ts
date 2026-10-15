/**
 * The contact enquiry: its shape, its options and the one validator both sides
 * run. The client shows errors on blur, the server runs the same function
 * before it trusts anything — one module, so the two cannot drift.
 */

export const NEEDS = [
  "Website",
  "E-commerce Website",
  "Web Application",
  "Mobile Application",
  "SaaS Product",
  "Custom Software",
  "Business Automation",
  "Website Redesign",
  "Website + Web Application",
  "Other",
] as const;

/*
 * Where the project is starting from. This is the answer that changes the
 * first reply most: "website" says what to quote, this says what the
 * conversation has to cover first.
 */
export const PROJECT_STATUSES = [
  "New idea",
  "Existing business, building something new",
  "Existing website or product",
  "Redesign or rebuild",
  "Improving an existing system",
  "Not sure yet",
] as const;

/* Broad bands in rupees, with a way out of answering: they exist so a first
 * reply can be useful, not to qualify anyone out. The studio's work runs up
 * to ₹3,00,000, so the bands divide that range rather than reaching past it —
 * there is no point asking about a budget nobody here is quoting for. */
export const BUDGETS = [
  "Under ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000 – ₹2,00,000",
  "₹2,00,000 – ₹3,00,000",
  "Not sure yet",
] as const;

export const TIMELINES = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "6+ months",
  "Flexible",
  "Not sure yet",
] as const;

export type ContactValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  need: string;
  projectStatus: string;
  budget: string;
  timeline: string;
  details: string;
  reference: string;
};

/** The attachment is a `File`, not a string, so it errors under its own key. */
export type ContactErrors = Partial<
  Record<keyof ContactValues | "file", string>
>;

/** Field order, which is also the order errors are reported in. */
export const FIELDS = [
  "name",
  "company",
  "email",
  "phone",
  "need",
  "projectStatus",
  "budget",
  "timeline",
  "details",
  "reference",
] as const;

const LIMITS = {
  name: 80,
  company: 80,
  email: 160,
  details: 4000,
  reference: 400,
};

/* Deliberately permissive. Anything stricter rejects valid addresses, and the
 * real test is whether a reply arrives. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* What a person might type into a phone field: digits, and the punctuation
 * people separate them with. The count of digits is the actual test. */
const PHONE_SHAPE = /^[+()\-.\s\d]+$/;
/** E.164 allows 15 digits; nothing real is shorter than 7. */
const PHONE_DIGITS = { min: 7, max: 15 };

const digitsOf = (value: string) => value.replace(/\D/g, "");

/*
 * What the file field accepts, in the two forms the page needs: extensions
 * for the input's `accept`, and a human list for the hint under it.
 */
export const FILE_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "png",
  "jpg",
  "jpeg",
  "zip",
] as const;

export const FILE_ACCEPT = FILE_EXTENSIONS.map((ext) => `.${ext}`).join(",");

/** Kept under `serverActions.bodySizeLimit` in `next.config.ts`. */
const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_FILE_LABEL = "10 MB";

/**
 * The attachment's own check, run on pick and again on the server.
 *
 * Extension only: a browser's reported MIME type is guesswork for `.doc` and
 * `.zip`, and this is a hint to the sender rather than a security boundary —
 * whatever arrives is opened by a person, not executed.
 */
export function validateFile(file: { name: string; size: number } | null) {
  if (!file || !file.name || file.size === 0) return undefined;

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!FILE_EXTENSIONS.includes(extension as (typeof FILE_EXTENSIONS)[number]))
    return `We can read ${FILE_EXTENSIONS.join(", ")} — that one we can't.`;

  if (file.size > MAX_FILE_BYTES)
    return `Please keep the file under ${MAX_FILE_LABEL}, or send us a link to it.`;

  return undefined;
}

/**
 * A reference link as a URL, with the scheme people leave off filled in.
 * Returns "" for anything that cannot be one.
 */
export function normaliseLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withScheme);
    // A bare word parses once a scheme is bolted on; a hostname with a dot
    // in it is what separates "acme.com" from "acme".
    if (!/^https?:$/.test(url.protocol)) return "";
    if (!url.hostname.includes(".")) return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const reference = values.reference.trim();

  if (name.length < 2) errors.name = "Please tell us your name.";
  else if (name.length > LIMITS.name) errors.name = "That's longer than we can store.";

  if (values.company.trim().length > LIMITS.company)
    errors.company = "That's longer than we can store.";

  if (!email) errors.email = "We need an email address to reply to.";
  else if (!EMAIL.test(email)) errors.email = "That doesn't look like an email address.";
  else if (email.length > LIMITS.email) errors.email = "That's longer than we can store.";

  if (!phone) {
    errors.phone = "We need a number — it's the quickest way to reach you.";
  } else if (!PHONE_SHAPE.test(phone)) {
    errors.phone = "Digits, spaces and + only, please.";
  } else {
    const digits = digitsOf(phone);
    if (digits.length < PHONE_DIGITS.min || digits.length > PHONE_DIGITS.max)
      errors.phone = "That doesn't look like a phone number.";
  }

  if (!NEEDS.includes(values.need as (typeof NEEDS)[number]))
    errors.need = "Pick the closest one — you can explain below.";

  if (
    !PROJECT_STATUSES.includes(
      values.projectStatus as (typeof PROJECT_STATUSES)[number],
    )
  )
    errors.projectStatus = "Pick the closest one, or “Not sure yet”.";

  if (!BUDGETS.includes(values.budget as (typeof BUDGETS)[number]))
    errors.budget = "Pick a range, or “Not sure yet”.";

  if (!TIMELINES.includes(values.timeline as (typeof TIMELINES)[number]))
    errors.timeline = "Pick the closest one.";

  if (values.details.trim().length > LIMITS.details)
    errors.details = `Please keep this under ${LIMITS.details} characters.`;

  if (reference.length > LIMITS.reference)
    errors.reference = "That's longer than we can store.";
  else if (reference && !normaliseLink(reference))
    errors.reference = "That doesn't look like a web address.";

  return errors;
}

/** Turns an enquiry into the email a person would have written by hand. */
export function composeEnquiry(
  values: ContactValues,
  attachment?: string | null,
) {
  const subject = `New project — ${values.need}`;
  const details = values.details.trim();
  const reference = normaliseLink(values.reference);

  const body = [
    `Name: ${values.name.trim()}`,
    values.company.trim() ? `Company: ${values.company.trim()}` : null,
    `Email: ${values.email.trim()}`,
    `Phone / WhatsApp: ${values.phone.trim()}`,
    "",
    `What they need: ${values.need}`,
    `Starting with: ${values.projectStatus}`,
    `Budget: ${values.budget}`,
    `Timeline: ${values.timeline}`,
    reference ? `Reference: ${reference}` : null,
    "",
    details ? "About the project:" : null,
    details || null,
    attachment ? "" : null,
    attachment ? `Attached: ${attachment}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, body };
}
