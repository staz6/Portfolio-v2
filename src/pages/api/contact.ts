import type { APIRoute } from "astro";
import { Resend } from "resend";
import { loadQuery } from "@/sanity/lib/load-query";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const json = (data: object, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  try {
    // ── Validate env vars ──
    const apiKey = import.meta.env.RESEND_API_KEY;
    const contactEmail = import.meta.env.CONTACT_EMAIL;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return json({ error: "Email service is not configured. Please contact the site owner." }, 500);
    }

    if (!contactEmail) {
      console.error("CONTACT_EMAIL is not configured");
      return json({ error: "Recipient email is not configured. Please contact the site owner." }, 500);
    }

    // ── Parse & validate body ──
    let body: Record<string, string>;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid request body." }, 400);
    }

    const { name, company, project, email } = body;

    if (!name?.trim()) return json({ error: "Please enter your name." }, 400);
    if (!email?.trim()) return json({ error: "Please enter your email." }, 400);
    if (!project?.trim()) return json({ error: "Please describe your project." }, 400);

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Please enter a valid email address." }, 400);
    }

    // ── Fetch sender email from Sanity ──
    let senderFrom = "Portfolio Contact <onboarding@resend.dev>";
    try {
      const { data: profile } = await loadQuery<{ senderEmail?: string }>({
        query: `*[_type == "profile"][0]{ senderEmail }`,
      });
      if (profile?.senderEmail) {
        senderFrom = `Aahad <${profile.senderEmail}>`;
      }
    } catch {
      // Fall back to default if Sanity fetch fails
    }

    // ── Send email via Resend ──
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: senderFrom,
      to: contactEmail,
      subject: `New inquiry from ${name.trim()}${company?.trim() ? ` at ${company.trim()}` : ""}`,
      replyTo: email.trim(),
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #ff6b2b;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${name.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">Company</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${company?.trim() || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">Project</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${project.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold;">Email</td>
              <td style="padding: 12px 0;"><a href="mailto:${email.trim()}">${email.trim()}</a></td>
            </tr>
          </table>
          <p style="margin-top: 24px; color: #888; font-size: 12px;">
            Sent from your portfolio contact form
          </p>
        </div>
      `,
    });

    // Resend returns { error } on failure instead of throwing
    if (error) {
      console.error("Resend API error:", error);
      return json({ error: "Failed to send email. Please try again later." }, 500);
    }

    return json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact form error:", err);
    return json({ error: "An unexpected error occurred. Please try again." }, 500);
  }
};
