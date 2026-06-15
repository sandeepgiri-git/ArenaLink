import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // If no SMTP credentials, we log the email (Useful for local development)
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log("==========================================");
    console.log("📧 MOCK EMAIL DISPATCH (No SMTP Configured)");
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log("HTML Body:");
    console.log(options.html);
    console.log("==========================================");
    return true;
  }

  // Production SMTP
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"ArenaLink" <${process.env.SMTP_FROM_EMAIL || "noreply@arenalink.com"}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>?/gm, ""), // fallback text stripping HTML
    });

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
