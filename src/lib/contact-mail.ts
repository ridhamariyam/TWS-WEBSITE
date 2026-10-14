import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/site-links";

/** Returns false when SMTP is not configured; delivery errors reject. */
export async function sendContactMail(
  subject: string,
  text: string,
  replyTo: string,
  file: File | null,
): Promise<boolean> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) return false;

  const port = Number(process.env.SMTP_PORT || "465");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Invalid SMTP port");
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  const result = await transport.sendMail({
    from: { name: "TWS Website", address: user },
    to: CONTACT_EMAIL,
    replyTo,
    subject,
    text,
    attachments: file
      ? [{ filename: file.name, content: Buffer.from(await file.arrayBuffer()) }]
      : [],
  });
  if (!result.accepted.length) throw new Error("Mail was not accepted");
  return true;
}
