interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;

  // If no Brevo credentials, we log the email (Useful for local development)
  if (!brevoApiKey || !brevoSenderEmail) {
    console.log("==========================================");
    console.log("📧 MOCK EMAIL DISPATCH (No Brevo Configured)");
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log("HTML Body:");
    console.log(options.html);
    console.log("==========================================");
    return true;
  }

  // Production via Brevo REST API
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: brevoSenderEmail, name: "ArenaLink" },
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text || options.html.replace(/<[^>]*>?/gm, ""),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API Error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
