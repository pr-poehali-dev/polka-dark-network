import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser } from "@/data/mockData";

const navItems = [
  { id: "feed", label: "Лента", icon: "LayoutDashboard" },
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "chats", label: "Чаты", icon: "MessageCircle", badge: 7 },
  { id: "friends", label: "Друзья", icon: "Users" },
  { id: "communities", label: "Сообщества", icon: "Globe" },
  { id: "stories", label: "Истории", icon: "PlayCircle" },
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
        background: "rgba(6, 6, 15, 0.95)",
        borderRight: "1px solid var(--border-subtle)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
          style={{ background: "var(--accent-gradient)", boxShadow: "var(--accent-glow)" }}
        >
          P
        </div>
        <span className="font-black text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
          Polka
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`nav-item w-full text-left ${active === item.id ? "active" : ""}`}
          >
            <Icon name={item.icon} size={16} />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span
                className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--accent-gradient)", color: "#fff", minWidth: "18px", textAlign: "center" }}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Mini-profile */}
      <div className="px-3 pb-3 pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div
          className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer glass-hover"
          onClick={() => onNav("profile")}
          style={{ border: "1px solid transparent" }}
        >
          <Avatar name={currentUser.name} size="sm" online />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-600 truncate" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {currentUser.name.split(" ")[0]}
            </div>
            <div className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
              {currentUser.username}
            </div>
          </div>
          <div className="pulse-dot" />
        </div>
      </div>
    </aside>
  );
}
