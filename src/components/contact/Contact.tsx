import { useState, useCallback } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useContactAnimations } from "./useContactAnimations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ContactSocialLink } from "@/sanity/lib/mappers";

type FormState = "idle" | "sending" | "sent" | "error";

interface ContactProps {
  socialLinks?: ContactSocialLink[];
  footerText?: string | null;
}

function useFormSubmit() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormState("sending");
      setErrorMsg("");

      const form = e.currentTarget;
      const data = {
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        company: (form.elements.namedItem("company") as HTMLInputElement).value,
        project: (form.elements.namedItem("project") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
      };

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        // Check content-type to avoid parsing HTML error pages as JSON
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Server returned an unexpected response. The API may not be deployed yet.");
        }

        const body = await res.json();

        if (!res.ok) {
          throw new Error(body.error || "Failed to send message.");
        }

        setFormState("sent");
        form.reset();
        setTimeout(() => setFormState("idle"), 4000);
      } catch (err) {
        const message =
          err instanceof TypeError
            ? "Network error. Please check your connection."
            : err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.";
        setErrorMsg(message);
        setFormState("error");
        setTimeout(() => setFormState("idle"), 5000);
      }
    },
    [],
  );

  return { formState, errorMsg, handleSubmit };
}

export function Contact({ socialLinks = [], footerText }: ContactProps) {
  const sectionRef = useContactAnimations();

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-background"
    >
      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 lg:px-10 lg:pt-40">
        <ContactHeading />
      </div>

      {/* Marquee */}
      <div data-contact-content className="relative z-10 opacity-0">
        <div data-contact-reveal className="my-12 lg:my-20">
          <Marquee />
        </div>

        {/* Main content area */}
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Split: form left, info right */}
          <div
            data-contact-reveal
            className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24"
          >
            {/* Left: form */}
            <ContactForm />

            {/* Right: info stack */}
            <div className="flex flex-col items-center gap-14 lg:items-end lg:justify-between">
              {/* Rotating badge */}
              <RotatingBadge />

              {/* Socials */}
              <div data-contact-reveal className="flex items-center gap-4">
                {socialLinks.map((link) => (
                  <SocialIcon key={link.label} link={link} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            data-contact-reveal
            className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-border/40 pb-8 pt-8 text-sm text-muted-foreground md:flex-row lg:mt-32"
          >
            <p>&copy; {new Date().getFullYear()} Aahad. All rights reserved.</p>
            <p className="text-xs tracking-widest">{footerText || "Crafted with passion & precision"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Heading ────────────────────────────────────────────────── */

function ContactHeading() {
  return (
    <SectionHeading
      number="05"
      label="Contact"
      words={["Let's", "Work", "Together"]}
      prefix="contact"
    />
  );
}

/* ── Marquee ────────────────────────────────────────────────── */

function Marquee() {
  const text = "GOT A PROJECT? — LET'S TALK — AVAILABLE FOR WORK — SAY HELLO — ";
  const itemClass =
    "shrink-0 font-heading text-5xl font-black uppercase tracking-tight text-foreground/[0.07] md:text-7xl lg:text-[8rem]";

  return (
    <div className="marquee-fade relative overflow-hidden select-none">
      {/*
        Two identical spans side by side. Each contains the full repeated text.
        The animation shifts left by exactly one span's width (100% of each span = 50% of wrapper).
        When span 1 exits left, span 2 is in its original position — seamless loop.
      */}
      <div className="marquee-track flex w-max">
        <span className={itemClass}>
          {text}{text}{text}{text}
        </span>
        <span className={itemClass}>
          {text}{text}{text}{text}
        </span>
      </div>
    </div>
  );
}

/* ── Rotating Badge ─────────────────────────────────────────── */

function RotatingBadge() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const magneticRef = useMagnetic<HTMLDivElement>({ strength: isMobile ? 0 : 0.25 });

  const handleClick = () => {
    const form = document.querySelector("[data-contact-form]");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      const firstInput = form.querySelector("input");
      if (firstInput) setTimeout(() => firstInput.focus(), 600);
    }
  };

  return (
    <div
      ref={magneticRef}
      data-cursor-scale
      onClick={handleClick}
      className="group relative flex h-44 w-44 flex-shrink-0 cursor-pointer items-center justify-center lg:h-56 lg:w-56"
    >
      <svg
        data-contact-badge
        className="absolute inset-0 h-full w-full animate-[spin_20s_linear_infinite]"
        viewBox="0 0 200 200"
      >
        <defs>
          <path
            id="badge-circle"
            d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
          />
        </defs>
        <text className="fill-muted-foreground text-[13px] font-semibold uppercase tracking-[0.35em]">
          <textPath href="#badge-circle">
            AVAILABLE FOR WORK — SAY HELLO — AVAILABLE FOR WORK —
          </textPath>
        </text>
      </svg>

      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border/60 bg-transparent transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_40px_var(--primary)] active:border-primary active:bg-primary active:text-primary-foreground active:shadow-[0_0_40px_var(--primary)] lg:h-24 lg:w-24">
        {/* Arrow: points up on mobile, points left on desktop hover */}
        <svg
          className="h-7 w-7 -rotate-90 transition-transform duration-500 group-hover:-rotate-90 lg:h-8 lg:w-8 lg:group-hover:-rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Contact Form (Mad-Lib Style) ──────────────────────────── */

function ContactForm() {
  const { formState, errorMsg, handleSubmit } = useFormSubmit();

  return (
    <form data-contact-form onSubmit={handleSubmit} className="flex flex-col gap-12">
      {/* Mad-lib paragraph */}
      <div className="font-heading text-2xl font-medium leading-[2.4] tracking-tight text-foreground sm:text-3xl lg:text-4xl lg:leading-[2.4]">
        <span className="text-muted-foreground">Hey! My name is</span>{" "}
        <MadLibInput name="name" placeholder="your name" type="text" />{" "}
        <span className="text-muted-foreground">and I work at</span>{" "}
        <MadLibInput name="company" placeholder="company" type="text" />{" "}
        <span className="text-muted-foreground">.</span>
        <br />
        <span className="text-muted-foreground">I'm looking for help with</span>{" "}
        <MadLibInput name="project" placeholder="a new website" type="text" />{" "}
        <span className="text-muted-foreground">.</span>
        <br />
        <span className="text-muted-foreground">Reach me at</span>{" "}
        <MadLibInput name="email" placeholder="email@example.com" type="email" />{" "}
        <span className="text-muted-foreground">.</span>
      </div>

      <SubmitButton formState={formState} errorMsg={errorMsg} />
    </form>
  );
}

/* ── Mad-Lib Input ─────────────────────────────────────────── */

function MadLibInput({
  name,
  placeholder,
  type,
}: {
  name: string;
  placeholder: string;
  type: "text" | "email";
}) {
  return (
    <span className="madlib-field group/ml relative inline-block">
      <input
        type={type}
        name={name}
        required
        autoComplete="off"
        placeholder={placeholder}
        className="inline w-auto min-w-[120px] border-b-2 border-dashed border-muted-foreground/50 bg-transparent text-center font-heading text-inherit font-bold text-foreground placeholder-muted-foreground/50 outline-none transition-all duration-500 focus:border-solid focus:border-primary focus:text-primary sm:min-w-[160px]"
        style={{ fontSize: "inherit" }}
        size={placeholder.length + 2}
      />
      {/* Glow line on focus */}
      <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-primary shadow-[0_0_12px_var(--primary),0_0_4px_var(--primary)] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-focus-within/ml:w-full" />
    </span>
  );
}

/* ── Submit Button ─────────────────────────────────────────── */

function SubmitButton({ formState, errorMsg }: { formState: FormState; errorMsg: string }) {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="submit"
        disabled={formState !== "idle"}
        data-cursor-scale
        className="contact-btn group relative mt-8 flex w-fit items-center gap-4 overflow-hidden rounded-full border-2 border-border/40 px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all duration-500 hover:border-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="contact-btn-bg absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
        <span className="relative z-10 flex items-center gap-3">
          {formState === "idle" && (
            <>
              Send Message
              <svg
                className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </>
          )}
          {formState === "sending" && "Sending..."}
          {formState === "sent" && (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Message Sent!
            </>
          )}
          {formState === "error" && "Failed to Send"}
        </span>
      </button>
      {formState === "error" && errorMsg && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}
    </div>
  );
}

/* ── Social Icon ────────────────────────────────────────────── */

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

function SocialIcon({ link }: { link: ContactSocialLink }) {
  const magneticRef = useMagnetic<HTMLAnchorElement>({ strength: 0.4 });

  return (
    <a
      ref={magneticRef}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      data-cursor-scale
      className="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-border/30 text-muted-foreground transition-all duration-500 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_var(--primary)]"
    >
      {SOCIAL_ICONS[link.icon]}
    </a>
  );
}
