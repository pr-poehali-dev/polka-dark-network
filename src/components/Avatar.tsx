interface AvatarProps {
  name: string;
  colorClass?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  ring?: boolean;
}

const sizes = {
  xs: "w-7 h-7 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export default function Avatar({ name, colorClass = "from-violet-500 to-purple-600", size = "md", online, ring }: AvatarProps) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="relative flex-shrink-0">
      {ring ? (
        <div className="avatar-ring p-[2px]">
          <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center font-semibold text-white`} style={{ border: "2px solid var(--bg-deep)" }}>
            {initials}
          </div>
        </div>
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center font-semibold text-white flex-shrink-0`}>
          {initials}
        </div>
      )}
      {online && (
        <div className="online-dot absolute bottom-0 right-0" style={{ border: "2px solid var(--bg-surface)" }} />
      )}
    </div>
  );
}
