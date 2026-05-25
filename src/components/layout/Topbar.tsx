import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, notifications } from "@/data/mockData";

interface TopbarProps {
  onNav: (id: string) => void;
}

export default function Topbar({ onNav }: TopbarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center gap-3 px-5"
      style={{
        left: "var(--sidebar-w)",
        height: "var(--topbar-h)",
        background: "rgba(6, 6, 15, 0.85)",
        borderBottom: "1px solid var(--border-subtle)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Icon
          name="Search"
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск по Polka…"
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
            fontFamily: "Golos Text, sans-serif",
          }}
          onFocus={e => { e.target.style.borderColor = "var(--border-accent)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border-subtle)"; }}
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Add button */}
        <button className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5">
          <Icon name="Plus" size={14} />
          Добавить
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center glass-hover transition-all"
            style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
          >
            <Icon name="Bell" size={17} />
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
              style={{ background: "var(--accent-gradient)", color: "#fff" }}
            >
              {notifications.length}
            </span>
          </button>

          {showNotif && (
            <div
              className="absolute right-0 top-11 w-80 rounded-2xl p-2 animate-fade-in z-50"
              style={{ background: "#10102a", border: "1px solid var(--border-medium)", boxShadow: "var(--shadow-elevated)" }}
            >
              <div className="px-3 py-2 mb-1" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <span className="section-title text-sm">Уведомления</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl glass-hover cursor-pointer">
                  <Avatar name={n.user.name} colorClass={n.user.avatarColor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{n.user.name} </span>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{n.text}</span>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <button
          onClick={() => onNav("chats")}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center glass-hover transition-all"
          style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
        >
          <Icon name="MessageCircle" size={17} />
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ background: "var(--accent-gradient)", color: "#fff" }}
          >
            7
          </span>
        </button>

        {/* Avatar */}
        <button
          onClick={() => onNav("profile")}
          className="ml-1 rounded-full transition-all hover:ring-2 ring-violet-500 ring-offset-2 ring-offset-transparent"
        >
          <Avatar name={currentUser.name} size="sm" online />
        </button>
      </div>
    </header>
  );
}
