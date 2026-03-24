import { useState, useEffect } from "react";

interface NavItem {
  href: string;
}

export function useScrollSpy(items: readonly NavItem[], offset = 100): string {
  const [activeSection, setActiveSection] = useState(
    items[0]?.href.slice(1) ?? "",
  );

  useEffect(() => {
    const sectionIds = items.map((item) => item.href.slice(1));

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          const topMost = intersecting.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top
              ? prev
              : curr,
          );
          setActiveSection(topMost.target.id);
        }
      },
      {
        rootMargin: `-${offset}px 0px -40% 0px`,
        threshold: 0,
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, offset]);

  return activeSection;
}
