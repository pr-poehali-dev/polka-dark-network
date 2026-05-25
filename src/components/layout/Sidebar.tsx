import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser } from "@/data/mockData";

const navItems = [
  { id: "feed", label: "Лента", icon: "LayoutDashboard" },
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "chats", label: "Чаты", icon: "MessageCircle", badge: 7 },
  { id: "friends", label: "Друзья", icon: "Users" },
  { id: "communities", label: "Сообщества", icon: "Globe" },
  { id: "photos", label: "Фото", icon: "Image" },
  { id: "music", label: "Музыка", icon: "Music2" },
  { id: "video", label: "Видео", icon: "Play" },
  { id: "games", label: "Игры", icon: "Gamepad2" },
  { id: "boards", label: "Доски", icon: "LayoutGrid" },
  { id: "bookmarks", label: "Закладки", icon: "Bookmark" },
  { id: "notes", label: "Не потерять", icon: "StickyNote" },
  { id: "settings", label: "Настройки", icon: "Settings" },
  { id: "more", label: "Ещё", icon: "MoreHorizontal" },
];

interface SidebarProps {
  active: string;
  onNav: (id: string) => void;
}

export default function Sidebar({ active, onNav }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col z-30"
      style={{
        width: "var(--sidebar-w)",
        background: "rgba(8, 8, 24, 0.97)",
        borderRight: "1px solid var(--border-subtle)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <img
          src="https://cdn.poehali.dev/files/388adf78-f436-4fcf-a8ff-46ee7844de64.svg"
          alt="Polka"
          className="w-8 h-8 object-contain"
          style={{ filter: "drop-shadow(0 0 8px rgba(139,92,246,0.5))" }}
        />
        <span className="font-black text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>Полка</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`nav-item ${active === item.id ? "active" : ""}`}
          >
            <Icon name={item.icon} size={16} />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span
                className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--accent-gradient)", color: "#fff", minWidth: 18, textAlign: "center" }}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Mini-profile */}
      <div className="px-3 pb-3 pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <button
          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl glass-hover"
          onClick={() => onNav("profile")}
          style={{ border: "1px solid transparent" }}
        >
          <Avatar name={currentUser.name} size="sm" online />
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[13px] truncate font-semibold" style={{ color: "var(--text-primary)" }}>
              {currentUser.name.split(" ")[0]}
            </div>
            <div className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
              {currentUser.username}
            </div>
          </div>
          <div className="pulse-dot flex-shrink-0" />
        </button>
      </div>
    </aside>
  );
}