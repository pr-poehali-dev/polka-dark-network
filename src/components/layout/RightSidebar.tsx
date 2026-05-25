import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, communities, tracks, stories } from "@/data/mockData";

export default function RightSidebar() {
  return (
    <aside className="flex flex-col gap-3 flex-shrink-0" style={{ width: 256 }}>
      {/* Profile card */}
      <div className="card p-4">
        <div className="flex flex-col items-center text-center mb-3">
          <div style={{ padding: "2.5px", background: "var(--accent-gradient)", borderRadius: "50%", marginBottom: 10 }}>
            <div style={{ padding: "2.5px", background: "var(--bg-surface)", borderRadius: "50%" }}>
              <Avatar name={currentUser.name} size="xl" />
            </div>
          </div>
          <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{currentUser.name}</div>
          <div className="text-xs mt-0.5 px-2 text-center line-clamp-2" style={{ color: "var(--text-secondary)" }}>{currentUser.bio}</div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 mb-3">
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
        <button className="btn-primary w-full justify-center text-xs py-2">Редактировать профиль</button>
      </div>

      {/* Stories mini */}
      <div className="card p-3">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Истории</span>
          <span className="text-xs cursor-pointer" style={{ color: "var(--accent-1)" }}>Все</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {stories.slice(0, 6).map(s => (
            <div key={s.id} className="flex-shrink-0 cursor-pointer">
              <div className={`story-ring ${s.viewed ? "viewed" : ""}`} style={{ padding: "2px" }}>
                <div style={{ padding: "1.5px", background: "var(--bg-surface)", borderRadius: "50%" }}>
                  <Avatar name={s.user.name} colorClass={s.user.avatarColor} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Music */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Музыка</span>
          <span className="text-xs cursor-pointer" style={{ color: "var(--accent-1)" }}>Все</span>
        </div>
        <div className="space-y-2">
          {tracks.slice(0, 3).map(t => (
            <div key={t.id} className="flex items-center gap-2.5 p-2 rounded-xl glass-hover cursor-pointer"
              style={t.playing ? { background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" } : {}}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: t.playing ? "var(--accent-gradient)" : "rgba(255,255,255,0.07)" }}>
                <Icon name={t.playing ? "Pause" : "Play"} size={12} style={{ color: t.playing ? "#fff" : "var(--text-secondary)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: t.playing ? "#d8b4fe" : "var(--text-primary)" }}>{t.title}</div>
                <div className="text-[10px] truncate" style={{ color: "var(--text-secondary)" }}>{t.artist}</div>
              </div>
              <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>{t.duration}</span>
            </div>
          ))}
        </div>
        {/* Mini player */}
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className="w-full h-1 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: "42%", background: "var(--accent-gradient)" }} />
          </div>
          <div className="flex items-center justify-center gap-3">
            {(["SkipBack", "Pause", "SkipForward"] as const).map(icon => (
              <button key={icon} className="btn-icon flex-shrink-0"
                style={icon === "Pause" ? { background: "var(--accent-gradient)", border: "none", color: "#fff", width: 32, height: 32 } : { width: 28, height: 28 }}>
                <Icon name={icon} size={icon === "Pause" ? 14 : 12} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Communities */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Сообщества</span>
          <span className="text-xs cursor-pointer" style={{ color: "var(--accent-1)" }}>Все</span>
        </div>
        <div className="space-y-2">
          {communities.slice(0, 4).map(c => (
            <div key={c.id} className="flex items-center gap-2.5 p-1.5 rounded-xl glass-hover cursor-pointer">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${c.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{c.name}</div>
                <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{c.members}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
