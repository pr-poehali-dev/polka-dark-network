import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, communities, tracks, stories } from "@/data/mockData";

interface Props { onNav?: (id: string) => void; }

export default function RightSidebar({ onNav }: Props) {
  const [playing, setPlaying] = useState(tracks.findIndex(t => t.playing));

  return (
    <aside className="pk-right-sidebar flex flex-col gap-3 flex-shrink-0" style={{ width: 248 }}>
      {/* Profile mini */}
      <div className="pk-card p-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div style={{ padding: 2.5, background: "var(--accent-grad)", borderRadius: "50%" }}>
              <div style={{ padding: 2, background: "var(--bg)", borderRadius: "50%" }}>
                <Avatar name={currentUser.name} colorClass={currentUser.avatarColor} size="xl" />
              </div>
            </div>
          </div>
          <div className="font-bold text-sm" style={{ color: "var(--text)" }}>{currentUser.name}</div>
          <div className="text-xs mt-0.5 line-clamp-2 px-2" style={{ color: "var(--text-3)" }}>{currentUser.bio}</div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-3 mb-3">
          {[{ l: "Друзья", v: currentUser.friends }, { l: "Подпис.", v: currentUser.followers }, { l: "Посты", v: currentUser.posts }].map(s => (
            <div key={s.l} className="text-center p-2 rounded-lg" style={{ background: "var(--surface)" }}>
              <div className="font-bold text-sm" style={{ color: "var(--text)" }}>{s.v}</div>
              <div className="text-[10px]" style={{ color: "var(--text-3)" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <button className="pk-btn pk-btn-primary w-full text-xs py-2" onClick={() => onNav?.("profile")}>Редактировать профиль</button>
      </div>

      {/* Stories */}
      <div className="pk-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="pk-title text-sm">Истории</span>
          <button className="text-xs" style={{ color: "var(--accent)" }}>Все</button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {stories.slice(0, 6).map(s => (
            <div key={s.id} className="flex-shrink-0">
              <div className={`pk-story-ring ${s.viewed ? "viewed" : ""}`} style={{ padding: 2 }}>
                <div style={{ padding: 1.5, background: "var(--bg)", borderRadius: "50%" }}>
                  <Avatar name={s.user.name} colorClass={s.user.avatarColor} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Music */}
      <div className="pk-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="pk-title text-sm">Музыка</span>
          <button className="text-xs" style={{ color: "var(--accent)" }}>Смотреть все</button>
        </div>
        <div className="space-y-1">
          {tracks.slice(0, 4).map((t, i) => (
            <div key={t.id} onClick={() => setPlaying(i)}
              className="flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all"
              style={playing === i ? { background: "rgba(123,77,255,0.1)", border: "1px solid rgba(123,77,255,0.2)" } : { border: "1px solid transparent" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: playing === i ? "var(--accent-grad)" : "var(--surface)" }}>
                <Icon name={playing === i ? "Pause" : "Play"} size={12} style={{ color: playing === i ? "#fff" : "var(--text-3)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: playing === i ? "#c4b5fd" : "var(--text)" }}>{t.title}</div>
                <div className="text-[10px] truncate" style={{ color: "var(--text-3)" }}>{t.artist}</div>
              </div>
              <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-4)" }}>{t.duration}</span>
            </div>
          ))}
        </div>
        {playing >= 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="w-full h-1 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: "38%", background: "var(--accent-grad)" }} />
            </div>
            <div className="flex justify-center gap-3">
              {(["SkipBack", "Pause", "SkipForward"] as const).map(ic => (
                <button key={ic} className="pk-icon-btn"
                  style={ic === "Pause" ? { background: "var(--accent-grad)", borderColor: "transparent", color: "#fff", width: 30, height: 30 } : { width: 26, height: 26 }}>
                  <Icon name={ic} size={ic === "Pause" ? 13 : 11} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Communities */}
      <div className="pk-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="pk-title text-sm">Сообщества</span>
          <button className="text-xs" style={{ color: "var(--accent)" }}>Все</button>
        </div>
        <div className="space-y-2">
          {communities.slice(0, 4).map(c => (
            <div key={c.id} className="flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer transition-all"
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>{c.name}</div>
                <div className="text-[10px]" style={{ color: "var(--text-3)" }}>{c.members}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
