import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, stories, feedItems, boards } from "@/data/mockData";
import RightSidebar from "@/components/layout/RightSidebar";

type FeedItem = typeof feedItems[0];

const INIT_COMMENTS: Record<number, { id: number; user: string; text: string; time: string }[]> = {
  1: [{ id: 1, user: "mia", text: "Просто потрясающий кадр!", time: "1 ч" }],
  3: [{ id: 1, user: "neo", text: "Хочу туда!", time: "2 ч" }, { id: 2, user: "anne", text: "Красота 🌸", time: "3 ч" }],
};

function PostModal({ item, onClose, onLike, liked, likeCount }: { item: FeedItem; onClose: () => void; onLike: () => void; liked: boolean; likeCount: number }) {
  const [comments, setComments] = useState(INIT_COMMENTS[item.id] ?? []);
  const [txt, setTxt] = useState("");
  const [saved, setSaved] = useState(item.saved);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const submit = () => {
    if (!txt.trim()) return;
    setComments(p => [...p, { id: Date.now(), user: currentUser.name.split(" ")[0], text: txt, time: "только что" }]);
    setTxt("");
  };

  return (
    <div className="pk-modal-bg animate-fade-in" onClick={onClose}>
      <div className="pk-card flex overflow-hidden animate-scale-in" style={{ maxWidth: 880, width: "95vw", maxHeight: "90vh", background: "var(--card)", borderRadius: "var(--radius-xl)" }} onClick={e => e.stopPropagation()}>
        <div className="flex-1 relative" style={{ minWidth: 0, background: "var(--bg)" }}>
          <div className={`h-full bg-gradient-to-br ${item.color} flex items-center justify-center`} style={{ minHeight: 420 }}>
            {item.type === "video" ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <Icon name="Play" size={28} style={{ color: "#fff" }} />
                </div>
                <span className="text-white/60 text-sm">{(item as { duration?: string }).duration}</span>
              </div>
            ) : <Icon name="Image" size={64} style={{ color: "rgba(255,255,255,0.12)" }} />}
          </div>
          <button onClick={onClose} className="absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", cursor: "pointer" }}>
            <Icon name="X" size={15} />
          </button>
        </div>
        <div className="flex flex-col" style={{ width: 340, flexShrink: 0, borderLeft: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
            <Avatar name={item.user.name} colorClass={item.user.avatarColor} size="md" online={item.user.online} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{item.user.name}</div>
              <div className="text-xs" style={{ color: "var(--text-3)" }}>{item.time} назад</div>
            </div>
            <button className="pk-btn pk-btn-ghost text-xs py-1.5 px-3">Подписаться</button>
          </div>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>{item.text}</p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {comments.length === 0 && (
              <div className="flex flex-col items-center py-8" style={{ color: "var(--text-4)" }}>
                <Icon name="MessageCircle" size={28} />
                <div className="text-xs mt-2">Нет комментариев</div>
              </div>
            )}
            {comments.map(c => (
              <div key={c.id} className="flex gap-2.5">
                <Avatar name={c.user} size="xs" colorClass="from-violet-500 to-pink-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{c.user}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-4)" }}>{c.time}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center gap-4 mb-3">
              <button onClick={onLike} className="flex items-center gap-1.5 text-sm transition-all" style={{ color: liked ? "#ec4899" : "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>
                <Icon name="Heart" size={18} /><span className="font-medium">{likeCount.toLocaleString()}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>
                <Icon name="MessageCircle" size={18} /><span>{comments.length}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>
                <Icon name="Share2" size={18} />
              </button>
              <button className="ml-auto" style={{ color: saved ? "var(--accent)" : "var(--text-3)", background: "none", border: "none", cursor: "pointer" }} onClick={() => setSaved(s => !s)}>
                <Icon name="Bookmark" size={18} />
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <Avatar name={currentUser.name} colorClass={currentUser.avatarColor} size="xs" />
              <input value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="Написать комментарий…" className="pk-input flex-1 text-xs" style={{ padding: "7px 12px" }} />
              <button onClick={submit} className="pk-icon-btn"
                style={txt.trim() ? { background: "var(--accent-grad)", borderColor: "transparent", color: "#fff" } : {}}>
                <Icon name="Send" size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveModal({ onClose }: { item: FeedItem; onClose: () => void }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="pk-modal-bg animate-fade-in" onClick={onClose}>
      <div className="pk-card p-5 animate-scale-in" style={{ width: 320 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span className="pk-title text-sm">Сохранить на доску</span>
          <button className="pk-icon-btn" onClick={onClose}><Icon name="X" size={14} /></button>
        </div>
        <div className="space-y-2 mb-4">
          {boards.map(b => (
            <button key={b.id} onClick={() => setSel(b.id)} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
              style={{ background: sel === b.id ? "rgba(123,77,255,0.12)" : "var(--surface)", border: `1px solid ${sel === b.id ? "rgba(123,77,255,0.35)" : "var(--border)"}` }}>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${b.color}`} />
              <div className="flex-1"><div className="text-sm font-medium" style={{ color: "var(--text)" }}>{b.name}</div><div className="text-xs" style={{ color: "var(--text-3)" }}>{b.count} элементов</div></div>
              {sel === b.id && <Icon name="Check" size={14} style={{ color: "#a78bfa" }} />}
            </button>
          ))}
        </div>
        <button className="pk-btn pk-btn-primary w-full" onClick={onClose} disabled={!sel}><Icon name="Bookmark" size={13} />Сохранить</button>
      </div>
    </div>
  );
}

function PinCard({ item, onOpen, onSave }: { item: FeedItem; onOpen: () => void; onSave: () => void }) {
  const [liked, setLiked] = useState(false);
  const [lc, setLc] = useState(item.likes);
  return (
    <div className="pk-pin" style={{ height: item.height }} onClick={onOpen}>
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
      {item.type === "video" && (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
          <Icon name="Play" size={9} />{(item as { duration?: string }).duration}
        </div>
      )}
      <div className="pk-pin-overlay">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Avatar name={item.user.name} colorClass={item.user.avatarColor} size="xs" />
            <span className="text-xs font-medium text-white">{item.user.username}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={e => { e.stopPropagation(); onSave(); }} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer" }}>
              <Icon name="Bookmark" size={12} style={{ color: "#fff" }} />
            </button>
            <button onClick={e => { e.stopPropagation(); setLiked(l => !l); setLc(c => liked ? c - 1 : c + 1); }} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: liked ? "rgba(236,72,153,0.7)" : "rgba(255,255,255,0.18)", border: "none", cursor: "pointer" }}>
              <Icon name="Heart" size={12} style={{ color: "#fff" }} />
            </button>
          </div>
        </div>
        <p className="text-xs text-white/90 font-medium">{item.text}</p>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-white/55">
          <span className="flex items-center gap-1"><Icon name="Heart" size={8} />{lc.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Icon name="MessageCircle" size={8} />{item.comments}</span>
        </div>
      </div>
    </div>
  );
}

export default function Feed() {
  const [openPost, setOpenPost] = useState<FeedItem | null>(null);
  const [saveItem, setSaveItem] = useState<FeedItem | null>(null);
  const [likes, setLikes] = useState<Record<number, { liked: boolean; count: number }>>(
    Object.fromEntries(feedItems.map(i => [i.id, { liked: false, count: i.likes }]))
  );
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");
  const [postText, setPostText] = useState("");
  const filtered = filter === "all" ? feedItems : feedItems.filter(i => i.type === filter);
  const toggleLike = (id: number) => setLikes(p => ({ ...p, [id]: { liked: !p[id].liked, count: p[id].liked ? p[id].count - 1 : p[id].count + 1 } }));

  return (
    <div className="flex gap-5 animate-fade-in">
      <div className="flex-1 min-w-0 space-y-4">
        {/* Stories */}
        <div className="pk-card p-4">
          <div className="flex items-center gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: "rgba(123,77,255,0.1)", border: "2px dashed rgba(123,77,255,0.4)" }}>
                <Icon name="Plus" size={20} style={{ color: "var(--accent)" }} />
              </div>
              <span className="text-[10px]" style={{ color: "var(--text-3)" }}>История</span>
            </div>
            {stories.map(s => (
              <div key={s.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
                <div className={`pk-story-ring ${s.viewed ? "viewed" : ""}`}>
                  <div style={{ padding: 2.5, background: "var(--bg)", borderRadius: "50%" }}>
                    <Avatar name={s.user.name} colorClass={s.user.avatarColor} size="md" />
                  </div>
                </div>
                <span className="text-[10px] truncate w-14 text-center" style={{ color: s.viewed ? "var(--text-4)" : "var(--text-3)" }}>
                  {s.user.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Create post */}
        <div className="pk-card p-4">
          <div className="flex gap-3 items-start">
            <Avatar name={currentUser.name} colorClass={currentUser.avatarColor} size="md" />
            <div className="flex-1">
              <textarea value={postText} onChange={e => setPostText(e.target.value)} placeholder="Поделитесь чем-то новым…" rows={2}
                className="pk-input resize-none" style={{ fontFamily: "Inter, sans-serif" }} />
              <div className="flex items-center gap-2 mt-2.5">
                {[{ icon: "Image", label: "Фото" }, { icon: "Video", label: "Видео" }, { icon: "Users", label: "Соавтор" }, { icon: "MapPin", label: "Место" }].map(a => (
                  <button key={a.icon} className="pk-btn pk-btn-ghost text-xs py-1.5 px-2.5">
                    <Icon name={a.icon} size={12} />{a.label}
                  </button>
                ))}
                <button className="pk-btn pk-btn-primary ml-auto text-xs px-4 py-1.5" disabled={!postText.trim()}>Опубликовать</button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5">
          {[["all","Все"],["photo","Фото"],["video","Видео"]].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k as "all"|"photo"|"video")} className={`pk-tab ${filter === k ? "active" : ""}`}>{l}</button>
          ))}
        </div>

        {/* Masonry */}
        <div className="columns-3 gap-3" style={{ columnGap: 12 }}>
          {filtered.map(item => (
            <PinCard key={item.id}
              item={{ ...item, likes: likes[item.id]?.count ?? item.likes }}
              onOpen={() => setOpenPost(item)}
              onSave={() => setSaveItem(item)} />
          ))}
        </div>
      </div>

      <RightSidebar />

      {openPost && (
        <PostModal item={openPost} onClose={() => setOpenPost(null)}
          onLike={() => toggleLike(openPost.id)}
          liked={likes[openPost.id]?.liked ?? false}
          likeCount={likes[openPost.id]?.count ?? openPost.likes} />
      )}
      {saveItem && <SaveModal item={saveItem} onClose={() => setSaveItem(null)} />}
    </div>
  );
}
