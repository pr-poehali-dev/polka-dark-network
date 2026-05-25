import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { stories } from "@/data/mockData";

const storyBg = [
  "from-violet-900/80 to-purple-900/60",
  "from-blue-900/80 to-cyan-900/60",
  "from-pink-900/80 to-rose-900/60",
  "from-emerald-900/80 to-teal-900/60",
  "from-orange-900/80 to-amber-900/60",
  "from-fuchsia-900/80 to-pink-900/60",
];

export default function Stories() {
  return (
    <div className="animate-fade-in space-y-5">
      {/* Stories row */}
      <div className="card p-4">
        <div className="section-title mb-4">Истории</div>
        <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
            <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: "rgba(124,92,252,0.15)", border: "2px dashed rgba(124,92,252,0.4)" }}>
              <Icon name="Plus" size={22} style={{ color: "var(--accent-1)" }} />
            </div>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Добавить</span>
          </div>
          {stories.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
              <div className="p-[2.5px] rounded-full transition-all group-hover:scale-105"
                style={{ background: s.viewed ? "rgba(255,255,255,0.12)" : "var(--accent-gradient)" }}>
                <div style={{ padding: "2.5px", background: "var(--bg-deep)", borderRadius: "50%" }}>
                  <Avatar name={s.user.name} colorClass={s.user.avatarColor} size="lg" />
                </div>
              </div>
              <span className="text-xs truncate w-16 text-center" style={{ color: s.viewed ? "var(--text-muted)" : "var(--text-secondary)" }}>
                {s.user.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Story cards grid */}
      <div className="grid grid-cols-4 gap-4">
        {stories.map((s, i) => (
          <div key={s.id} className={`relative rounded-2xl overflow-hidden cursor-pointer group`}
            style={{ height: "260px", background: `linear-gradient(160deg, var(--bg-surface), #0a0a20)` }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${storyBg[i % storyBg.length]} opacity-80`} />
            <div className="absolute inset-0 flex items-end p-4">
              <div>
                <div className="mb-2">
                  <div style={{ padding: "2px", background: "var(--accent-gradient)", borderRadius: "50%", display: "inline-block" }}>
                    <div style={{ padding: "2px", background: "transparent", borderRadius: "50%" }}>
                      <Avatar name={s.user.name} colorClass={s.user.avatarColor} size="sm" />
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-sm text-white">{s.user.name.split(" ")[0]}</div>
                <div className="text-xs text-white/60">3 ч назад</div>
              </div>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>
                <Icon name="MoreHorizontal" size={14} />
              </button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                <Icon name="Play" size={20} style={{ color: "#fff" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
