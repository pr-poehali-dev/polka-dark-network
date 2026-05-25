import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, notifications as initNotifs } from "@/data/mockData";

interface TopbarProps {
  onNav: (id: string) => void;
}

export default function Topbar({ onNav }: TopbarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [query, setQuery] = useState("");
  const [notifs, setNotifs] = useState(initNotifs.map(n => ({ ...n, read: false })));
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notifIcons: Record<string, string> = {
    like: "Heart", comment: "MessageCircle", friend: "UserPlus", mention: "AtSign",
  };

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center gap-3 px-5 desktop-topbar"
      style={{
        left: "var(--sidebar-w)",
        height: "var(--topbar-h)",
        background: "rgba(13, 13, 43, 0.92)",
        borderBottom: "1px solid var(--border-subtle)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск по Polka…"
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all"
          style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }}
          onFocus={e => { e.target.style.borderColor = "var(--border-accent)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border-subtle)"; }}
        />
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Add */}
        <button className="btn-primary text-xs px-3 py-1.5">
          <Icon name="Plus" size={13} />Добавить
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(v => !v)}
            className="relative btn-icon"
            style={showNotif ? { borderColor: "var(--border-accent)", background: "rgba(139,92,246,0.1)" } : {}}
          >
            <Icon name="Bell" size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: "var(--accent-gradient)", color: "#fff" }}>{unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-84 rounded-2xl overflow-hidden animate-scale-in z-50"
              style={{ background: "#0f0f2e", border: "1px solid var(--border-medium)", boxShadow: "var(--shadow-elevated)", width: 340 }}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Уведомления</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead}
                    className="text-xs font-medium transition-colors hover:text-violet-300"
                    style={{ color: "var(--accent-1)" }}>
                    Прочитать все
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 px-3 pt-2 pb-1">
                {["Все", "Упоминания", "Друзья"].map(t => (
                  <button key={t} className={`tab-item text-xs ${t === "Все" ? "active" : ""}`}>{t}</button>
                ))}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="flex flex-col items-center py-10" style={{ color: "var(--text-muted)" }}>
                    <Icon name="Bell" size={32} />
                    <div className="text-sm mt-2">Уведомлений нет</div>
                  </div>
                ) : notifs.map(n => (
                  <div key={n.id} onClick={() => markRead(n.id)}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all relative"
                    style={{ background: n.read ? "transparent" : "rgba(139,92,246,0.05)", borderBottom: "1px solid var(--border-subtle)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = n.read ? "transparent" : "rgba(139,92,246,0.05)"; }}>
                    <div className="relative flex-shrink-0">
                      <Avatar name={n.user.name} colorClass={n.user.avatarColor} size="sm" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "var(--accent-gradient)" }}>
                        <Icon name={notifIcons[n.type] ?? "Bell"} size={8} style={{ color: "#fff" }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs leading-relaxed">
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{n.user.name} </span>
                        <span style={{ color: "var(--text-secondary)" }}>{n.text}</span>
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.time} назад</div>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: "var(--accent-1)" }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <button className="w-full text-xs text-center transition-colors hover:text-violet-300" style={{ color: "var(--accent-1)" }}>
                  Все уведомления
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <button onClick={() => onNav("chats")} className="relative btn-icon">
          <Icon name="MessageCircle" size={16} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ background: "var(--accent-gradient)", color: "#fff" }}>7</span>
        </button>

        {/* Avatar */}
        <button onClick={() => onNav("profile")} className="rounded-full transition-all hover:ring-2 ring-violet-500 ring-offset-1 ring-offset-transparent ml-1">
          <Avatar name={currentUser.name} size="sm" online />
        </button>
      </div>
    </header>
  );
}
