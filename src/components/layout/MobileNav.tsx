import Icon from "@/components/ui/icon";

const mobileNavItems = [
  { id: "feed", icon: "LayoutDashboard", label: "Лента" },
  { id: "chats", icon: "MessageCircle", label: "Чаты", badge: 7 },
  { id: "communities", icon: "Globe", label: "Клубы" },
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "more", icon: "MoreHorizontal", label: "Ещё" },
];

interface MobileNavProps {
  active: string;
  onNav: (id: string) => void;
}

export default function MobileNav({ active, onNav }: MobileNavProps) {
  return (
    <nav className="mobile-nav">
      {mobileNavItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNav(item.id)}
          className="flex flex-col items-center justify-center gap-1 flex-1 relative transition-all"
          style={{ color: active === item.id ? "#d8b4fe" : "var(--text-secondary)", background: "transparent", border: "none", cursor: "pointer", fontFamily: "Golos Text, sans-serif" }}
        >
          {item.badge && (
            <span className="absolute top-1 right-1/4 text-[8px] font-bold px-1 py-0.5 rounded-full"
              style={{ background: "var(--accent-gradient)", color: "#fff", minWidth: 14, textAlign: "center" }}>
              {item.badge}
            </span>
          )}
          <div className={`w-10 h-7 rounded-xl flex items-center justify-center transition-all ${active === item.id ? "bg-violet-500/15" : ""}`}>
            <Icon name={item.icon} size={18} />
          </div>
          <span className="text-[9px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
