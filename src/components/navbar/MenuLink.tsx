interface MenuLinkProps {
  label: string;
  href: string;
  index: number;
  onClick: (href: string) => void;
}

export function MenuLink({ label, href, index, onClick }: MenuLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick(href);
  };

  return (
    <div>
      <a
        href={href}
        onClick={handleClick}
        className="group flex items-baseline gap-4 lg:gap-6"
        data-cursor-scale
      >
        <span className="text-sm font-light opacity-50 transition-opacity duration-300 group-hover:opacity-100 lg:text-base">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="h-[11vw] overflow-hidden md:h-[5.5vw] lg:h-[4.4vw]">
          <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
            <span className="font-heading text-[10vw] font-bold uppercase leading-[1.1] tracking-tight md:text-[5vw] lg:text-[4vw]">
              {label}
            </span>
            <span className="font-heading text-[10vw] font-bold uppercase leading-[1.1] tracking-tight md:text-[5vw] lg:text-[4vw]">
              {label}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
