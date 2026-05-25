import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, communities, tracks } from "@/data/mockData";

export default function RightSidebar() {
  return (
    <aside className="flex flex-col gap-3 w-64 flex-shrink-0">
      {/* Profile card */}
      <div className="card p-4">
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar name={currentUser.name} size="xl" ring online />
          <div className="mt-3 font-bold text-base" style={{ color: "var(--text-primary)" }}>{currentUser.name}</div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{currentUser.bio}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Друзья", val: currentUser.friends },
            { label: "Подпис.", val: currentUser.followers },
            { label: "Посты", val: currentUser.posts },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{s.val}</div>
              <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full text-sm py-2">Редактировать профиль</button>
      </div>

      {/* Music */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="section-title text-sm">Музыка</span>
          <Icon name="Music2" size={14} style={{ color: "var(--accent-1)" }} />
        </div>
        <div className="space-y-2">
          {tracks.slice(0, 3).map(t => (
            <div key={t.id} className={`flex items-center gap-2.5 p-2 rounded-xl glass-hover cursor-pointer ${t.playing ? "active" : ""}`}
              style={t.playing ? { background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.2)" } : {}}>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: t.playing ? "var(--accent-gradient)" : "rgba(255,255,255,0.07)" }}
              >
                <Icon name={t.playing ? "Pause" : "Play"} size={12} style={{ color: t.playing ? "#fff" : "var(--text-secondary)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: t.playing ? "#c4b5fd" : "var(--text-primary)" }}>{t.title}</div>
                <div className="text-[10px] truncate" style={{ color: "var(--text-secondary)" }}>{t.artist}</div>
              </div>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{t.duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Communities */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="section-title text-sm">Сообщества</span>
          <Icon name="Globe" size={14} style={{ color: "var(--accent-1)" }} />
        </div>
        <div className="space-y-2">
          {communities.slice(0, 3).map(c => (
            <div key={c.id} className="flex items-center gap-2.5 p-1.5 rounded-xl glass-hover cursor-pointer">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${c.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{c.name}</div>
                <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{c.members} участников</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
