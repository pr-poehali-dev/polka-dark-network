import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, stories, feedItems, boards } from "@/data/mockData";
import RightSidebar from "@/components/layout/RightSidebar";

type FeedItem = typeof feedItems[0];

function SaveToBoardModal({ item, onClose }: { item: FeedItem; onClose: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [newBoard, setNewBoard] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="animate-scale-in card p-5 w-80" style={{ background: "#10102a", boxShadow: "var(--shadow-elevated)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span className="section-title">Сохранить на доску</span>
          <button className="btn-icon" onClick={onClose}><Icon name="X" size={15} /></button>
        </div>
        <div className="space-y-2 mb-4">
          {boards.map(b => (
            <button key={b.id} onClick={() => setSelected(b.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
              style={{ background: selected === b.id ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${selected === b.id ? "rgba(139,92,246,0.35)" : "var(--border-subtle)"}` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex-shrink-0`} />
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{b.name}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{b.count} изображений</div>
              </div>
              {selected === b.id && <Icon name="Check" size={14} style={{ color: "#a78bfa" }} />}
            </button>
          ))}
        </div>
        <div className="mb-3">
          <input value={newBoard} onChange={e => setNewBoard(e.target.value)} placeholder="+ Новая доска"
            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }} />
        </div>
        <button className="btn-primary w-full justify-center" onClick={onClose}>
          <Icon name="Bookmark" size={13} />
          Сохранить
        </button>
      </div>
    </div>
  );
}

function PinCard({ item, onSave }: { item: FeedItem; onSave: (item: FeedItem) => void }) {
  const [liked, setLiked] = useState(item.saved);
  const [likeCount, setLikeCount] = useState(item.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  return (
    <div className="pin-item rounded-xl overflow-hidden cursor-pointer" style={{ borderRadius: "var(--radius-lg)" }}>
      <div className="relative" style={{ height: `${item.height}px`, background: `linear-gradient(160deg, #1a0530, #0a0a25)` }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />

        {/* Video badge */}
        {item.type === "video" && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold"
            style={{ background: "rgba(0,0,0,0.65)", color: "#fff", backdropFilter: "blur(8px)" }}>
            <Icon name="Play" size={10} />
            {(item as { duration?: string }).duration}
          </div>
        )}

        {/* Play icon for video */}
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
              <Icon name="Play" size={20} style={{ color: "#fff" }} />
            </div>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="pin-overlay">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Avatar name={item.user.name} colorClass={item.user.avatarColor} size="xs" />
              <span className="text-xs font-medium text-white">{item.user.username}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={e => { e.stopPropagation(); onSave(item); }}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: item.saved ? "var(--accent-gradient)" : "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                <Icon name="Bookmark" size={13} style={{ color: "#fff" }} />
              </button>
              <button onClick={handleLike}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: liked ? "rgba(236,72,153,0.7)" : "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                <Icon name="Heart" size={13} style={{ color: "#fff" }} />
              </button>
            </div>
          </div>
          <p className="text-xs text-white/90 font-medium">{item.text}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-white/60 flex items-center gap-1">
              <Icon name="Heart" size={9} />{likeCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-white/60 flex items-center gap-1">
              <Icon name="MessageCircle" size={9} />{item.comments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Feed() {
  const [postText, setPostText] = useState("");
  const [saveModal, setSaveModal] = useState<FeedItem | null>(null);
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set([3, 6, 9]));

  const filtered = filter === "all" ? feedItems : feedItems.filter(i => i.type === filter);

  const handleSave = (item: FeedItem) => {
    setSaveModal(item);
    setSavedItems(prev => new Set([...prev, item.id]));
  };

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0 space-y-4 animate-fade-in">

        {/* Stories row */}
        <div className="card p-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: "rgba(139,92,246,0.15)", border: "2px dashed rgba(139,92,246,0.45)" }}>
                <Icon name="Plus" size={20} style={{ color: "var(--accent-1)" }} />
              </div>
              <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>История</span>
            </div>
            {stories.map(s => (
              <div key={s.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
                <div className={`story-ring ${s.viewed ? "viewed" : ""} transition-all group-hover:scale-105`}>
                  <div style={{ padding: "2.5px", background: "var(--bg-deep)", borderRadius: "50%" }}>
                    <Avatar name={s.user.name} colorClass={s.user.avatarColor} size="md" />
                  </div>
                </div>
                <span className="text-[10px] truncate w-14 text-center" style={{ color: s.viewed ? "var(--text-muted)" : "var(--text-secondary)" }}>
                  {s.user.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Create post */}
        <div className="card p-4">
          <div className="flex gap-3 items-start">
            <Avatar name={currentUser.name} size="md" />
            <div className="flex-1">
              <textarea value={postText} onChange={e => setPostText(e.target.value)}
                placeholder="Поделитесь чем-то новым…"
                rows={2} className="w-full resize-none rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }}
                onFocus={e => { e.target.style.borderColor = "var(--border-accent)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border-subtle)"; }} />
              <div className="flex items-center gap-2 mt-2">
                {[
                  { icon: "Image", label: "Фото" },
                  { icon: "Video", label: "Видео" },
                  { icon: "Users", label: "Соавтор" },
                  { icon: "MapPin", label: "Место" },
                ].map(a => (
                  <button key={a.icon} className="btn-ghost text-xs py-1.5 px-2.5">
                    <Icon name={a.icon} size={12} />{a.label}
                  </button>
                ))}
                <button className="btn-primary ml-auto text-xs px-4 py-1.5" disabled={!postText.trim()}>
                  Опубликовать
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "Все" },
            { key: "photo", label: "Фото" },
            { key: "video", label: "Видео" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key as "all" | "photo" | "video")}
              className={`tab-item ${filter === f.key ? "active" : ""}`}>{f.label}</button>
          ))}
        </div>

        {/* Pinterest masonry grid */}
        <div className="columns-3 gap-3" style={{ columnGap: "12px" }}>
          {filtered.map(item => (
            <PinCard key={item.id} item={{ ...item, saved: savedItems.has(item.id) }} onSave={handleSave} />
          ))}
        </div>
      </div>

      <RightSidebar />

      {saveModal && <SaveToBoardModal item={saveModal} onClose={() => setSaveModal(null)} />}
    </div>
  );
}
