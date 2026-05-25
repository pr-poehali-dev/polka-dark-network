import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { users } from "@/data/mockData";

const TABS = ["Все друзья", "Онлайн", "Заявки", "Рекомендации"];

const REQUESTS = [
  { id: 20, name: "Дарья Климова", username: "@dasha_k", bio: "Иллюстратор", avatarColor: "from-pink-400 to-rose-500", mutual: 5, online: false },
  { id: 21, name: "Роман Белов", username: "@roman_b", bio: "Архитектор", avatarColor: "from-blue-400 to-indigo-500", mutual: 3, online: true },
];

const RECOMMENDED = [
  { id: 30, name: "Света Иванова", username: "@sveta_i", bio: "UX Designer", avatarColor: "from-violet-400 to-purple-500", mutual: 8, online: true },
  { id: 31, name: "Кирилл Орлов", username: "@kirill_o", bio: "Видеограф", avatarColor: "from-cyan-400 to-blue-500", mutual: 12, online: false },
  { id: 32, name: "Аня Морозова", username: "@anya_m", bio: "Певица", avatarColor: "from-fuchsia-400 to-pink-500", mutual: 6, online: true },
];

// ─── Call Modal ──────────────────────────────────────────────────────────────
function CallModal({ user, onClose }: { user: { name: string; avatarColor: string }; onClose: () => void }) {
  const [status, setStatus] = useState<"calling" | "connected">("calling");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)" }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in pk-card p-8 w-72 flex flex-col items-center text-center"
        style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pulse rings */}
        <div className="relative mb-6">
          {status === "calling" && (
            <>
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "rgba(123,77,255,0.18)", transform: "scale(1.6)" }}
              />
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: "rgba(123,77,255,0.1)",
                  transform: "scale(2)",
                  animationDelay: "0.3s",
                }}
              />
            </>
          )}
          <Avatar name={user.name} colorClass={user.avatarColor} size="2xl" />
        </div>
        <div className="pk-title mb-1">{user.name}</div>
        <div className="pk-subtitle mb-8">
          {status === "calling" ? "Вызов…" : "Соединено"}
        </div>

        <div className="flex gap-4">
          {status === "calling" ? (
            <>
              <button
                className="pk-icon-btn w-14 h-14 rounded-full"
                style={{ background: "var(--online)", border: "none", color: "#fff" }}
                onClick={() => setStatus("connected")}
              >
                <Icon name="Phone" size={20} />
              </button>
              <button
                className="pk-icon-btn w-14 h-14 rounded-full"
                style={{ background: "var(--error)", border: "none", color: "#fff" }}
                onClick={onClose}
              >
                <Icon name="PhoneOff" size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                className="pk-icon-btn w-12 h-12 rounded-full"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <Icon name="MicOff" size={18} />
              </button>
              <button
                className="pk-icon-btn w-12 h-12 rounded-full"
                style={{ background: "var(--error)", border: "none", color: "#fff" }}
                onClick={onClose}
              >
                <Icon name="PhoneOff" size={18} />
              </button>
              <button
                className="pk-icon-btn w-12 h-12 rounded-full"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <Icon name="Volume2" size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Friend Card ─────────────────────────────────────────────────────────────
function FriendCard({
  user,
  added,
  onToggle,
  onMessage,
  onCall,
  actionLabel,
}: {
  user: { id: number; name: string; username?: string; bio: string; avatarColor: string; mutual: number; online: boolean };
  added: boolean;
  onToggle: () => void;
  onMessage: () => void;
  onCall: () => void;
  actionLabel?: string;
}) {
  return (
    <div
      className="pk-card pk-card-hover p-5 flex flex-col items-center text-center"
      style={{ cursor: "default" }}
    >
      <div className="relative mb-3">
        <div style={{ padding: 2.5, background: "var(--accent-grad)", borderRadius: "50%" }}>
          <div style={{ padding: 2, background: "var(--card)", borderRadius: "50%" }}>
            <Avatar name={user.name} colorClass={user.avatarColor} size="lg" />
          </div>
        </div>
        {user.online && (
          <div
            className="pk-online absolute"
            style={{ bottom: 2, right: 2, border: "2px solid var(--card)" }}
          />
        )}
      </div>

      <div className="font-semibold text-sm mb-0.5" style={{ color: "var(--text)" }}>
        {user.name}
      </div>
      {user.username && (
        <div className="text-xs mb-0.5" style={{ color: "var(--text-4)" }}>
          {user.username}
        </div>
      )}
      <div className="text-xs mb-2" style={{ color: "var(--text-3)" }}>
        {user.bio}
      </div>
      <div
        className="flex items-center gap-1 text-xs mb-4"
        style={{ color: "var(--text-4)" }}
      >
        <Icon name="Users" size={11} />
        {user.mutual} общих
      </div>

      {/* Status badge */}
      {user.online && (
        <div
          className="text-xs px-2 py-0.5 rounded-full mb-3"
          style={{
            background: "rgba(39,228,139,0.12)",
            color: "var(--online)",
            border: "1px solid rgba(39,228,139,0.2)",
          }}
        >
          В сети
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-1.5 w-full">
        <button
          onClick={onToggle}
          className="pk-btn text-xs flex-1"
          style={{
            background: added ? "var(--surface)" : "var(--accent-grad)",
            color: added ? "var(--text-3)" : "#fff",
            border: `1px solid ${added ? "var(--border)" : "transparent"}`,
          }}
        >
          {actionLabel ?? (added ? "Добавлен" : "Добавить")}
        </button>
        <button
          className="pk-icon-btn"
          title="Написать"
          onClick={onMessage}
        >
          <Icon name="MessageCircle" size={14} />
        </button>
        <button
          className="pk-icon-btn"
          title="Позвонить"
          onClick={onCall}
        >
          <Icon name="Phone" size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Friends() {
  const [activeTab, setActiveTab] = useState("Все друзья");
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<Set<number>>(new Set());
  const [callUser, setCallUser] = useState<{ name: string; avatarColor: string } | null>(null);

  const toggle = (id: number) =>
    setAdded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.bio.toLowerCase().includes(search.toLowerCase())
  );

  const displayUsers =
    activeTab === "Онлайн" ? filtered.filter((u) => u.online) : filtered;

  const allDisplay =
    activeTab === "Все друзья" || activeTab === "Онлайн"
      ? displayUsers
      : activeTab === "Заявки"
      ? REQUESTS
      : RECOMMENDED;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Search + Tabs bar */}
      <div className="pk-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Icon
              name="Search"
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-4)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск друзей…"
              className="pk-input pl-9"
            />
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-4)" }}>
            <Icon name="Users" size={13} />
            {users.length} друзей
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pk-tab text-xs ${activeTab === t ? "active" : ""}`}
            >
              {t}
              {t === "Заявки" && (
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "var(--accent-grad)", color: "#fff" }}
                >
                  {REQUESTS.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Section heading */}
      {allDisplay.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <span className="pk-label">
            {activeTab === "Заявки" && `Входящие заявки (${REQUESTS.length})`}
            {activeTab === "Рекомендации" && "Рекомендации"}
            {(activeTab === "Все друзья" || activeTab === "Онлайн") &&
              `${activeTab} (${allDisplay.length})`}
          </span>
        </div>
      )}

      {/* Friend grid */}
      <div className="grid grid-cols-3 gap-4">
        {allDisplay.map((user) => (
          <FriendCard
            key={user.id}
            user={user}
            added={added.has(user.id)}
            onToggle={() => toggle(user.id)}
            onMessage={() => {}}
            onCall={() => setCallUser({ name: user.name, avatarColor: user.avatarColor })}
            actionLabel={
              activeTab === "Заявки"
                ? added.has(user.id)
                  ? "Добавлен"
                  : "Принять"
                : activeTab === "Рекомендации"
                ? added.has(user.id)
                  ? "Добавлен"
                  : "Добавить"
                : undefined
            }
          />
        ))}
      </div>

      {allDisplay.length === 0 && (
        <div
          className="pk-card p-12 flex flex-col items-center gap-3 text-center"
        >
          <Icon name="Users" size={40} style={{ color: "var(--text-4)" }} />
          <div className="pk-title">Никого не найдено</div>
          <div className="pk-subtitle">Попробуйте другой запрос</div>
        </div>
      )}

      {/* Call modal */}
      {callUser && (
        <CallModal user={callUser} onClose={() => setCallUser(null)} />
      )}
    </div>
  );
}