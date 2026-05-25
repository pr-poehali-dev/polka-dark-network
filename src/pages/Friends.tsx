import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { users } from "@/data/mockData";

const tabs = ["Все друзья", "Онлайн", "Заявки", "Рекомендации"];

export default function Friends() {
  const [activeTab, setActiveTab] = useState("Все друзья");
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<Set<number>>(new Set());

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.bio.toLowerCase().includes(search.toLowerCase())
  );

  const display = activeTab === "Онлайн" ? filtered.filter(u => u.online) : filtered;

  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск друзей…"
            className="w-full pl-8 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }}
          />
        </div>
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`tab-item text-sm ${activeTab === t ? "active" : ""}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {display.map(user => (
          <div key={user.id} className="card p-5 flex flex-col items-center text-center group hover:border-violet-500/30 transition-all">
            <div className="relative mb-3">
              <div style={{ padding: "2.5px", background: "var(--accent-gradient)", borderRadius: "50%" }}>
                <div style={{ padding: "2px", background: "var(--bg-surface)", borderRadius: "50%" }}>
                  <Avatar name={user.name} colorClass={user.avatarColor} size="lg" />
                </div>
              </div>
              {user.online && <div className="online-dot absolute bottom-0.5 right-0.5" />}
            </div>
            <div className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-primary)" }}>{user.name}</div>
            <div className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{user.bio}</div>
            <div className="flex items-center gap-1 text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              <Icon name="Users" size={11} />
              {user.mutual} общих друга
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setAdded(prev => { const n = new Set(prev); if (n.has(user.id)) { n.delete(user.id); } else { n.add(user.id); } return n; })}
                className={`flex-1 text-xs py-2 rounded-xl font-semibold transition-all ${added.has(user.id) ? "btn-ghost" : "btn-primary"}`}
              >
                {added.has(user.id) ? "Добавлен" : "Добавить"}
              </button>
              <button className="btn-ghost text-xs py-2 px-3 rounded-xl">
                <Icon name="MessageCircle" size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
