interface AvatarProps {
  name: string;
  src?: string;
  colorClass?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  online?: boolean;
  ring?: boolean;
  square?: boolean;
}

const sizes = {
  xs:  "w-7 h-7 text-[9px]",
  sm:  "w-8 h-8 text-[10px]",
  md:  "w-10 h-10 text-xs",
  lg:  "w-12 h-12 text-sm",
  xl:  "w-16 h-16 text-base",
  "2xl": "w-20 h-20 text-lg",
};

export default function Avatar({ name, src, colorClass = "from-violet-500 to-pink-600", size = "md", online, ring, square }: AvatarProps) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  const radius = square ? "rounded-xl" : "rounded-full";

  const inner = src ? (
    <img src={src} alt={name} className={`${sizes[size]} ${radius} object-cover flex-shrink-0`} />
  ) : (
    <div className={`${sizes[size]} ${radius} bg-gradient-to-br ${colorClass} flex items-center justify-center font-semibold text-white flex-shrink-0 select-none`}>
      {initials}
    </div>
  );

  if (ring) {
    return (
      <div className="relative flex-shrink-0">
        <div className="pk-story-ring">
          <div style={{ padding: "2px", background: "var(--bg)", borderRadius: square ? "12px" : "50%" }}>
            {inner}
          </div>
        </div>
        {online && <div className="pk-online" />}
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0">
      {inner}
      {online && <div className="pk-online" />}
    </div>
  );
}
