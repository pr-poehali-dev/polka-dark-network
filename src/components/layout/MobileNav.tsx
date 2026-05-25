import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "feed", icon: "LayoutDashboard", label: "Лента" },
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "communities", icon: "Globe", label: "Клубы" },
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "more", icon: "MoreHorizontal", label: "Ещё" },
];

interface MobileNavProps {
  active: string;
  onNav: (id: string) => void;
  unreadChats?: number;
}

export default function MobileNav({ active, onNav, unreadChats = 0 }: MobileNavProps) {
  return (
    <nav className="pk-mobile-nav">
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        const showBadge = item.id === "chats" && unreadChats > 0;

        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 relative"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              padding: "6px 0",
            }}
          >
            {/* Icon pill */}
            <div
              className="relative flex items-center justify-center transition-all"
              style={{
                width: 40,
                height: 28,
                borderRadius: 14,
                background: isActive ? "rgba(123,77,255,0.15)" : "transparent",
              }}
            >
              <Icon
                name={item.icon}
                size={isActive ? 19 : 18}
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-4)",
                  transition: "color 0.15s, transform 0.15s",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              />
              {/* Unread badge */}
              {showBadge && (
                <span
                  className="absolute flex items-center justify-center text-[9px] font-bold rounded-full"
                  style={{
                    top: -4,
                    right: -2,
                    minWidth: 16,
                    height: 16,
                    padding: "0 3px",
                    background: "var(--accent-grad)",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {unreadChats > 99 ? "99+" : unreadChats}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className={`text-[10px] font-medium transition-all ${isActive ? "pk-grad-text" : ""}`}
              style={
                isActive
                  ? {}
                  : { color: "var(--text-4)" }
              }
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
