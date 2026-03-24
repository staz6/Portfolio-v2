import { ReviewsHeading } from "./ReviewsHeading";
import { ReviewCard } from "./ReviewCard";
import { useReviewsAnimations } from "./useReviewsAnimations";
import type { ReviewProps } from "@/sanity/lib/mappers";

interface ReviewsComponentProps {
  reviews?: ReviewProps[];
}

export function Reviews({ reviews = [] }: ReviewsComponentProps) {
  const sectionRef = useReviewsAnimations();

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative overflow-hidden bg-background"
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-1/4 -right-1/4 h-[60%] w-[60%] rounded-full bg-primary/[0.06] blur-[60px] lg:blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-[50%] w-[50%] rounded-full bg-primary/[0.04] blur-[50px] lg:blur-[100px]" />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-40">
        <ReviewsHeading />
      </div>

      {/* Background quote marquee — hidden on mobile */}
      <div className="pointer-events-none absolute inset-0 hidden items-center overflow-hidden select-none lg:flex">
        <div className="marquee-fade w-full">
          <div
            className="marquee-track flex w-max"
            style={{ animationDuration: "60s" }}
          >
            <span className="shrink-0 font-heading text-[8rem] font-black uppercase tracking-tight text-foreground/[0.03] md:text-[12rem] lg:text-[20rem]">
              {"\u201C"} WORDS MATTER {"\u201D"} TRUST {"\u201C"} RESULTS {"\u201D"}&nbsp;
            </span>
            <span className="shrink-0 font-heading text-[8rem] font-black uppercase tracking-tight text-foreground/[0.03] md:text-[12rem] lg:text-[20rem]">
              {"\u201C"} WORDS MATTER {"\u201D"} TRUST {"\u201C"} RESULTS {"\u201D"}&nbsp;
            </span>
          </div>
        </div>
      </div>

      {/* Card marquee */}
      <div
        data-reviews-content
        className="group/marquee relative z-10 pb-24 lg:pb-40"
      >
        <div className="marquee-fade overflow-hidden py-2">
          <div
            data-reviews-row="0"
            className="flex w-max group-hover/marquee:[animation-play-state:paused]"
            style={{ animation: "marquee 60s linear infinite" }}
          >
            {/* Two identical sets — each 50% of track for seamless loop */}
            {[0, 1].map((set) => (
              <div key={set} className="flex shrink-0 gap-6 pr-6">
                {reviews.map((review, i) => (
                  <ReviewCard key={`r${set}-${i}`} review={review} index={i} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
