import { useState } from "react";
import Icon from "@/components/ui/icon";
import { tracks } from "@/data/mockData";

const GENRES = ["Все", "Поп", "Инди", "Электроника", "Джаз", "Хип-хоп", "Классика"];
const EXTRA_TRACKS = [
  { id: 7, title: "Deep Space", artist: "Cosmo Audio", duration: "6:22", playing: false },
  { id: 8, title: "Тихие воды", artist: "Река", duration: "4:11", playing: false },
  { id: 9, title: "Neon Lights", artist: "City Glow", duration: "3:55", playing: false },
  { id: 10, title: "Вечный город", artist: "Горизонт", duration: "5:02", playing: false },
];
const ALL_TRACKS = [...tracks, ...EXTRA_TRACKS];

const PLAYLISTS = [
  { id: 1, name: "Для работы", count: 24, color: "linear-gradient(135deg,#7B4DFF,#E94FCB)" },
  { id: 2, name: "Вечерние", count: 18, color: "linear-gradient(135deg,#E94FCB,#FF5C5C)" },
  { id: 3, name: "Энергия", count: 31, color: "linear-gradient(135deg,#27E48B,#7B4DFF)" },
  { id: 4, name: "Расслабление", count: 15, color: "linear-gradient(135deg,#FFB84D,#E94FCB)" },
];

export default function Music() {
  const [playing, setPlaying] = useState<number>(1);
  const [progress, setProgress] = useState(42);
  const [tab, setTab] = useState("Моя музыка");
  const [genre, setGenre] = useState("Все");
  const [liked, setLiked] = useState<Set<number>>(new Set([1, 3]));

  const toggleLike = (id: number) => setLiked(p => { const n = new Set(p); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; });
  const playingTrack = ALL_TRACKS.find(t => t.id === playing);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="pk-card p-4 flex items-center gap-3">
        <span className="pk-title">Музыка</span>
        <div className="flex gap-1 ml-2">
          {["Моя музыка", "Рекомендации", "Новинки", "Плейлисты"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pk-tab ${tab === t ? "active" : ""}`}>{t}</button>
          ))}
        </div>
        <div className="relative ml-auto" style={{ width: 200 }}>
          <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-4)" }} />
          <input placeholder="Поиск треков…" className="pk-input pl-8 text-xs" style={{ paddingTop: 7, paddingBottom: 7 }} />
        </div>
      </div>

      {/* Now playing */}
      {playingTrack && (
        <div className="pk-card p-5" style={{ background: "rgba(123,77,255,0.08)", borderColor: "rgba(123,77,255,0.2)" }}>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--accent-grad)", boxShadow: "0 0 20px rgba(123,77,255,0.35)" }}>
              <Icon name="Music2" size={24} style={{ color: "#fff" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm mb-0.5" style={{ color: "var(--text)" }}>{playingTrack.title}</div>
              <div className="text-sm mb-3" style={{ color: "var(--text-3)" }}>{playingTrack.artist}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--text-4)" }}>1:46</span>
                <div className="flex-1 h-1.5 rounded-full relative cursor-pointer" style={{ background: "rgba(255,255,255,0.08)" }}
                  onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100)); }}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "var(--accent-grad)" }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                    style={{ left: `${progress}%`, transform: "translateX(-50%) translateY(-50%)", background: "#fff", boxShadow: "0 0 6px rgba(123,77,255,0.8)" }} />
                </div>
                <span className="text-xs" style={{ color: "var(--text-4)" }}>{playingTrack.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="pk-icon-btn"><Icon name="Shuffle" size={14} /></button>
              <button className="pk-icon-btn" onClick={() => setPlaying(p => Math.max(1, p - 1))}><Icon name="SkipBack" size={14} /></button>
              <button className="pk-icon-btn" onClick={() => setPlaying(0)}
                style={{ background: "var(--accent-grad)", borderColor: "transparent", color: "#fff", width: 44, height: 44, borderRadius: "50%" }}>
                <Icon name="Pause" size={18} />
              </button>
              <button className="pk-icon-btn" onClick={() => setPlaying(p => Math.min(ALL_TRACKS.length, p + 1))}><Icon name="SkipForward" size={14} /></button>
              <button className="pk-icon-btn"><Icon name="Repeat" size={14} /></button>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Icon name="Volume2" size={13} style={{ color: "var(--text-4)" }} />
              <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full" style={{ width: "72%", background: "var(--accent-grad)" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {/* Track list */}
        <div className="flex-1 min-w-0">
          {tab === "Плейлисты" ? (
            <div className="grid grid-cols-2 gap-3">
              {PLAYLISTS.map(pl => (
                <div key={pl.id} className="pk-card pk-card-hover overflow-hidden">
                  <div className="h-28 flex items-center justify-center" style={{ background: pl.color }}>
                    <Icon name="ListMusic" size={40} style={{ color: "rgba(255,255,255,0.3)" }} />
                  </div>
                  <div className="p-3.5">
                    <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{pl.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{pl.count} треков</div>
                  </div>
                </div>
              ))}
              <div className="pk-card flex flex-col items-center justify-center cursor-pointer" style={{ minHeight: 160, border: "2px dashed rgba(123,77,255,0.3)" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(123,77,255,0.6)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(123,77,255,0.3)"}>
                <Icon name="Plus" size={24} style={{ color: "var(--accent)" }} />
                <span className="text-sm mt-2" style={{ color: "var(--text-3)" }}>Новый плейлист</span>
              </div>
            </div>
          ) : (
            <>
              {/* Genres */}
              <div className="flex gap-1.5 mb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {GENRES.map(g => (
                  <button key={g} onClick={() => setGenre(g)} className={`pk-tab flex-shrink-0 ${genre === g ? "active" : ""}`}>{g}</button>
                ))}
              </div>

              <div className="pk-card overflow-hidden">
                {ALL_TRACKS.map((track, i) => (
                  <div key={track.id} onClick={() => setPlaying(track.id)}
                    className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all"
                    style={{
                      background: playing === track.id ? "rgba(123,77,255,0.1)" : "transparent",
                      borderLeft: `2px solid ${playing === track.id ? "var(--accent)" : "transparent"}`,
                      borderBottom: i < ALL_TRACKS.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                    onMouseEnter={e => { if (playing !== track.id) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={e => { if (playing !== track.id) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: playing === track.id ? "var(--accent-grad)" : "var(--surface)" }}>
                      <Icon name={playing === track.id ? "Pause" : "Play"} size={13}
                        style={{ color: playing === track.id ? "#fff" : "var(--text-3)" }} />
                    </div>
                    <span className="w-5 text-xs text-center flex-shrink-0" style={{ color: "var(--text-4)" }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: playing === track.id ? "#c4b5fd" : "var(--text)" }}>{track.title}</div>
                      <div className="text-xs" style={{ color: "var(--text-3)" }}>{track.artist}</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); toggleLike(track.id); }}
                      style={{ color: liked.has(track.id) ? "#ec4899" : "var(--text-4)", background: "none", border: "none", cursor: "pointer" }}>
                      <Icon name="Heart" size={14} />
                    </button>
                    <span className="text-xs" style={{ color: "var(--text-4)" }}>{track.duration}</span>
                    <button style={{ color: "var(--text-4)", background: "none", border: "none", cursor: "pointer" }}>
                      <Icon name="MoreHorizontal" size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
