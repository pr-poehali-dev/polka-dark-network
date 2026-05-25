import { useState } from "react";
import Icon from "@/components/ui/icon";
import { tracks } from "@/data/mockData";

export default function Music() {
  const [playing, setPlaying] = useState<number | null>(2);
  const [progress, setProgress] = useState(37);
  const [volume, setVolume] = useState(75);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="card p-4 flex items-center gap-4">
        <span className="section-title">Музыка</span>
        <div className="flex gap-1">
          {["Моя музыка", "Рекомендации", "Новинки", "Плейлисты"].map(t => (
            <button key={t} className="tab-item text-sm">{t}</button>
          ))}
        </div>
        <div className="ml-auto relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input placeholder="Поиск треков…" className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text", width: "200px" }} />
        </div>
      </div>

      {/* Now playing card */}
      {playing !== null && (
        <div className="card p-5" style={{ background: "rgba(124,92,252,0.08)", borderColor: "rgba(124,92,252,0.2)" }}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--accent-gradient)", boxShadow: "var(--accent-glow)" }}>
              <Icon name="Music2" size={28} style={{ color: "#fff" }} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-base mb-0.5" style={{ color: "var(--text-primary)" }}>
                {tracks.find(t => t.id === playing)?.title}
              </div>
              <div className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                {tracks.find(t => t.id === playing)?.artist}
              </div>
              {/* Progress */}
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>1:24</span>
                <div className="flex-1 h-1.5 rounded-full cursor-pointer relative" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "var(--accent-gradient)" }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)`, background: "#fff", boxShadow: "0 0 6px rgba(124,92,252,0.8)" }} />
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>3:42</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center glass-hover"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                <Icon name="Shuffle" size={16} />
              </button>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center glass-hover"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                <Icon name="SkipBack" size={16} />
              </button>
              <button onClick={() => setPlaying(playing === null ? 2 : null)}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--accent-gradient)", color: "#fff", boxShadow: "var(--accent-glow)" }}>
                <Icon name="Pause" size={20} />
              </button>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center glass-hover"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                <Icon name="SkipForward" size={16} />
              </button>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center glass-hover"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                <Icon name="Repeat" size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Icon name="Volume2" size={14} style={{ color: "var(--text-muted)" }} />
              <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full" style={{ width: `${volume}%`, background: "var(--accent-gradient)" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track list */}
      <div className="card overflow-hidden">
        {tracks.map((track, i) => (
          <div
            key={track.id}
            onClick={() => setPlaying(track.id)}
            className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all"
            style={{
              background: playing === track.id ? "rgba(124,92,252,0.1)" : "transparent",
              borderBottom: i < tracks.length - 1 ? "1px solid var(--border-subtle)" : "none",
              borderLeft: playing === track.id ? "2px solid var(--accent-1)" : "2px solid transparent",
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: playing === track.id ? "var(--accent-gradient)" : "rgba(255,255,255,0.06)" }}>
              {playing === track.id
                ? <Icon name="Pause" size={13} style={{ color: "#fff" }} />
                : <Icon name="Play" size={13} style={{ color: "var(--text-secondary)" }} />
              }
            </div>
            <span className="w-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: playing === track.id ? "#c4b5fd" : "var(--text-primary)" }}>{track.title}</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{track.artist}</div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-xl flex items-center justify-center glass-hover"
              style={{ color: "var(--text-muted)" }}>
              <Icon name="Heart" size={13} />
            </button>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{track.duration}</span>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center glass-hover"
              style={{ color: "var(--text-muted)" }}>
              <Icon name="MoreHorizontal" size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
