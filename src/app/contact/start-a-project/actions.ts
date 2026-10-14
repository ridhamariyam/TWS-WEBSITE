"use server";

import {
  type ContactErrors,
  type ContactValues,
  composeEnquiry,
  normaliseLink,
  validateContact,
  validateFile,
} from "@/lib/contact-schema";
import { CONTACT_EMAIL } from "@/lib/site-links";
import { sendContactMail } from "@/lib/contact-mail";

/*
 * What happens when someone sends the form.
 *
 * Validate and screen spam, then send through SMTP when configured.
 * Otherwise use CONTACT_WEBHOOK_URL or a composed mailto. Attachments
 * travel with SMTP and webhook submissions.
 *
 * A mailto cannot carry an attachment, so on that path the file is not sent
 * anywhere: the sender is told, by name, to attach it themselves.
 */

/*
 * Every rejection carries what was typed. React resets an uncontrolled form
 * once its action resolves, so without this a rejected enquiry comes back
 * blank and has to be retyped.
 */
export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors; values: ContactValues }
  | { status: "sent"; attachment?: string }
  /** Validated and ready, but delivery is not configured — hand it over. */
  | { status: "compose"; mailto: string; attachment?: string }
  | { status: "error"; message: string; values: ContactValues };

/** A form filled faster than this was not filled by a person. */
const MIN_FILL_MS = 2500;
/** Anything older than this is a stale tab or a replayed payload. */
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

function read(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** The attachment, or null when the field was left alone. */
function readFile(formData: FormData): File | null {
  const value = formData.get("file");
  if (!(value instanceof File)) return null;
  // An untouched file input still posts an empty, unnamed File.
  return value.size > 0 && value.name ? value : null;
}

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: invisible, so only a script fills it. Fails silently.
  if (read(formData, "website")) return { status: "sent" };

  const values: ContactValues = {
    name: read(formData, "name"),
    company: read(formData, "company"),
    email: read(formData, "email"),
    phone: read(formData, "phone"),
    need: read(formData, "need"),
    projectStatus: read(formData, "projectStatus"),
    budget: read(formData, "budget"),
    timeline: read(formData, "timeline"),
    details: read(formData, "details"),
    reference: read(formData, "reference"),
  };

  /*
   * The stamp is written by script on mount, so a form posted without
   * JavaScript has none. Treating that as abuse would reject the senders the
   * no-JS path exists for, so the timing check is skipped rather than failed.
   */
  const stamp = read(formData, "startedAt").trim();
  if (stamp) {
    const startedAt = Number(stamp);
    const elapsed = Date.now() - startedAt;
    if (
      !Number.isFinite(startedAt) ||
      startedAt <= 0 ||
      elapsed < MIN_FILL_MS ||
      elapsed > MAX_AGE_MS
    ) {
      return {
        status: "error",
        message:
          "That didn't go through. Please try again, or email us directly.",
        values,
      };
    }
  }

  const file = readFile(formData);
  const errors = validateContact(values);
  const fileError = validateFile(file);
  if (fileError) errors.file = fileError;

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors, values };
  }

  const attachment = file?.name;
  const { subject, body } = composeEnquiry(values, attachment);
  try {
    if (await sendContactMail(subject, body, values.email.trim(), file)) {
      return { status: "sent", attachment };
    }
  } catch {
    return { status: "compose", mailto: mailtoFor(subject, body), attachment };
  }
  const endpoint = process.env.CONTACT_WEBHOOK_URL;

  if (endpoint) {
    try {
      const response = file
        ? await fetch(endpoint, { method: "POST", body: payloadWith(file, values, subject) })
        : await fetch(endpoint, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload(values, subject)),
          });
      if (!response.ok) throw new Error(`Endpoint replied ${response.status}`);
      return { status: "sent", attachment };
    } catch {
      // Delivery failed: fall back to something that works.
      return {
        status: "compose",
        mailto: mailtoFor(subject, body),
        attachment,
      };
    }
  }

  return { status: "compose", mailto: mailtoFor(subject, body), attachment };
}

/** One shape for the enquiry, whichever way it travels. */
function payload(values: ContactValues, subject: string) {
  return {
    ...values,
    reference: normaliseLink(values.reference),
    subject,
    receivedAt: new Date().toISOString(),
  };
}

/** The same fields as multipart, so the file can ride along. */
function payloadWith(file: File, values: ContactValues, subject: string) {
  const body = new FormData();
  for (const [key, value] of Object.entries(payload(values, subject))) {
    body.append(key, String(value));
  }
  body.append("file", file, file.name);
  return body;
}

function mailtoFor(subject: string, body: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
