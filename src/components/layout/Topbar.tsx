import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, notifications as initNotifs } from "@/data/mockData";

interface Props { onNav: (id: string) => void; }

const notifIcons: Record<string, string> = { like: "Heart", comment: "MessageCircle", friend: "UserPlus", mention: "AtSign", subscribe: "UserCheck" };

export default function Topbar({ onNav }: Props) {
  const [showNotif, setShowNotif] = useState(false);
  const [query, setQuery] = useState("");
  const [notifs, setNotifs] = useState(initNotifs.map(n => ({ ...n, read: false })));
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;
  const markAll = () => setNotifs(p => p.map(n => ({ ...n, read: true })));

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShowNotif(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <header className="pk-topbar fixed top-0 right-0 z-30 flex items-center gap-3 px-5"
      style={{ left: "var(--sidebar-w)", height: "var(--topbar-h)", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-4)" }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по Polka…"
          className="pk-input pl-9" style={{ paddingTop: 7, paddingBottom: 7 }} />
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <button className="pk-btn pk-btn-primary text-xs py-1.5 px-3">
          <Icon name="Plus" size={13} />Добавить
        </button>

        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button className={`pk-icon-btn relative ${showNotif ? "active" : ""}`} onClick={() => setShowNotif(v => !v)}>
            <Icon name="Bell" size={16} />
            {unread > 0 && <span className="pk-badge">{unread}</span>}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 animate-scale-in z-50 pk-card"
              style={{ width: 340, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="pk-title text-sm">Уведомления</span>
                {unread > 0 && (
                  <button onClick={markAll} className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                    Прочитать все
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.map(n => (
                  <div key={n.id} onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
                    style={{ background: n.read ? "transparent" : "rgba(123,77,255,0.05)", borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = n.read ? "transparent" : "rgba(123,77,255,0.05)"}>
                    <div className="relative flex-shrink-0">
                      <Avatar name={n.user.name} colorClass={n.user.avatarColor} size="sm" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "var(--accent-grad)" }}>
                        <Icon name={notifIcons[n.type] ?? "Bell"} size={8} style={{ color: "#fff" }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs leading-relaxed">
                        <span className="font-semibold" style={{ color: "var(--text)" }}>{n.user.name} </span>
                        <span style={{ color: "var(--text-2)" }}>{n.text}</span>
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--text-4)" }}>{n.time} назад</div>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: "var(--accent)" }} />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center" style={{ borderTop: "1px solid var(--border)" }}>
                <button className="text-xs" style={{ color: "var(--accent)" }}>Все уведомления</button>
              </div>
            </div>
          )}
        </div>

        <button className="pk-icon-btn relative" onClick={() => onNav("chats")}>
          <Icon name="MessageCircle" size={16} />
        </button>

        <button onClick={() => onNav("profile")} className="rounded-full ml-1">
          <Avatar name={currentUser.name} colorClass={currentUser.avatarColor} size="sm" online />
        </button>
      </div>
    </header>
  );
}
