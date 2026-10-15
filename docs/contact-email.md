# Contact form email

Enquiries are sent to **thewebstudioagency@gmail.com**, with the visitor's
address as Reply-To and their uploaded file attached.

For Gmail, enable two-step verification and create an App Password:
https://support.google.com/mail/answer/185833

Copy `.env.example` to `.env.local` and set `SMTP_PASSWORD` to the App Password.
Set the same variables in your hosting environment and restart or redeploy.
Keep credentials private; do not commit `.env.local`.

For another SMTP provider, set its host, port, username and password. Port 465
uses implicit TLS; other ports require STARTTLS. The authenticated username
must be an email address allowed to send by that provider.

Without credentials, or if delivery fails, the form offers a composed email
for the visitor to send from their own mail app. SMTP success means the mail
server accepted the message; inbox delivery must be checked separately.

After configuring credentials, submit a real enquiry and confirm its arrival,
Reply-To address and attachment in the studio inbox.
