import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser } from "@/data/mockData";

const NAV = [
  { id: "feed",        label: "Лента",       icon: "LayoutDashboard" },
  { id: "profile",     label: "Профиль",      icon: "User" },
  { id: "chats",       label: "Чаты",         icon: "MessageCircle", badge: true },
  { id: "friends",     label: "Друзья",       icon: "Users" },
  { id: "communities", label: "Сообщества",   icon: "Globe" },
  { id: "photos",      label: "Фото",         icon: "Image" },
  { id: "music",       label: "Музыка",       icon: "Music2" },
  { id: "video",       label: "Видео",        icon: "Play" },
  { id: "games",       label: "Игры",         icon: "Gamepad2" },
  { id: "boards",      label: "Доски",        icon: "LayoutGrid" },
  { id: "bookmarks",   label: "Закладки",     icon: "Bookmark" },
  { id: "notes",       label: "Не потерять",  icon: "StickyNote" },
  { id: "settings",    label: "Настройки",    icon: "Settings" },
  { id: "more",        label: "Ещё",          icon: "MoreHorizontal" },
];

interface Props { active: string; onNav: (id: string) => void; unreadChats?: number; }

export default function Sidebar({ active, onNav, unreadChats = 0 }: Props) {
  const u = currentUser;
  return (
    <aside
      className="pk-sidebar fixed left-0 top-0 bottom-0 flex flex-col z-40"
      style={{ width: "var(--sidebar-w)", background: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
          style={{ background: "var(--accent-grad)" }}>P</div>
        <span className="font-bold text-base" style={{ color: "var(--text)" }}>Polka</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {NAV.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            className={`pk-nav-item ${active === item.id ? "active" : ""}`}>
            <Icon name={item.icon} size={15} />
            <span className="flex-1">{item.label}</span>
            {item.badge && unreadChats > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--accent-grad)", color: "#fff", minWidth: 18, textAlign: "center" }}>
                {unreadChats}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-2 py-2" style={{ borderTop: "1px solid var(--border)" }}>
        <button className="w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all"
          style={{ background: "transparent" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          onClick={() => onNav("profile")}>
          <Avatar name={u.name} colorClass={u.avatarColor} size="sm" online />
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[13px] font-semibold truncate" style={{ color: "var(--text)" }}>{u.name.split(" ")[0]}</div>
            <div className="text-[11px] truncate" style={{ color: "var(--text-3)" }}>{u.username}</div>
          </div>
          <div className="pk-pulse flex-shrink-0" />
        </button>
      </div>
    </aside>
  );
}
