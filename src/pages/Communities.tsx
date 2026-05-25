import { useState } from "react";
import Icon from "@/components/ui/icon";
import { communities } from "@/data/mockData";

const tabs = ["Мои", "Рекомендации", "Поиск"];

export default function Communities() {
  const [activeTab, setActiveTab] = useState("Рекомендации");
  const [joined, setJoined] = useState<Set<number>>(new Set([1, 3]));

  const toggle = (id: number) => {
    setJoined(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4 flex items-center gap-4">
        <span className="section-title">Сообщества</span>
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`tab-item ${activeTab === t ? "active" : ""}`}>{t}</button>
          ))}
        </div>
        <button className="btn-primary ml-auto text-sm flex items-center gap-1.5">
          <Icon name="Plus" size={13} />
          Создать
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {communities.map(c => (
          <div key={c.id} className="card overflow-hidden group hover:border-violet-500/30 transition-all cursor-pointer">
            <div className={`h-28 bg-gradient-to-br ${c.color} flex items-center justify-center relative`}>
              <Icon name="Globe" size={40} style={{ color: "rgba(255,255,255,0.2)" }} />
              {c.verified && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--accent-gradient)" }}>
                  <Icon name="Check" size={12} style={{ color: "#fff" }} />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{c.name}</div>
              <div className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{c.category}</div>
              <div className="flex items-center gap-1 text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                <Icon name="Users" size={11} />
                {c.members} участников
              </div>
              <button
                onClick={() => toggle(c.id)}
                className={`w-full text-xs py-2 rounded-xl font-semibold transition-all ${joined.has(c.id) ? "btn-ghost" : "btn-primary"}`}
              >
                {joined.has(c.id) ? "Подписан" : "Подписаться"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
