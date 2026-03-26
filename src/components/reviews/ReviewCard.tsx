import type { ReviewProps } from "@/sanity/lib/mappers";

interface ReviewCardProps {
  review: ReviewProps;
  index: number;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function ReviewCard({ review, index }: ReviewCardProps) {
  const { name, role, testimonial, rating, avatarUrl } = review;

  return (
    <div
      data-review-card={index}
      data-cursor-scale
      className="review-card-glow group relative flex w-80 shrink-0 flex-col gap-4 rounded-2xl border border-border/30 bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] lg:w-96"
    >
      {/* Decorative quote mark */}
      <span className="pointer-events-none absolute -top-2 -left-1 font-heading text-8xl font-black leading-none text-primary/10 select-none">
        &ldquo;
      </span>

      {/* Star rating */}
      <div data-review-stars={index} className="flex items-center gap-1 pt-4">
        {[...Array(rating)].map((_, i) => (
          <svg
            key={i}
            className="h-4 w-4 text-primary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Testimonial */}
      <p className="flex-1 text-base leading-relaxed text-foreground/80">
        {testimonial}
      </p>

      {/* Author */}
      <div className="mt-auto flex items-center gap-4 border-t border-border/20 pt-6">
        {avatarUrl ? (
          <img
            data-review-avatar={index}
            src={avatarUrl}
            alt={name}
            loading="lazy"
            className="h-12 w-12 shrink-0 rounded-full border border-primary/30 object-cover"
          />
        ) : (
          <div
            data-review-avatar={index}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/20 font-heading text-sm font-bold text-primary"
          >
            {getInitials(name)}
          </div>
        )}
        <div>
          <p className="font-heading font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}
