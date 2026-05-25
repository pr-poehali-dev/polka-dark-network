import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { bookmarks as initBookmarks, feedItems } from "@/data/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookmarkItem {
  id: number;
  post: (typeof feedItems)[0];
  collection: string;
  savedAt: string;
}

// ─── Static collections ───────────────────────────────────────────────────────

const BASE_COLLECTIONS = ["Все", "Вдохновение", "Арт", "Работа"];

// ─── New collection modal ─────────────────────────────────────────────────────

function NewCollectionModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  return (
    <div className="pk-modal-bg animate-fade-in" onClick={onClose}>
      <div
        className="animate-scale-in pk-card p-5 w-72"
        style={{ boxShadow: "var(--shadow-lg)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="pk-title">Новая коллекция</span>
          <button className="pk-icon-btn" onClick={onClose}><Icon name="X" size={14} /></button>
        </div>
        <input
          className="pk-input mb-4"
          placeholder="Название коллекции…"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <button
          className="pk-btn pk-btn-primary w-full"
          disabled={!name.trim()}
          onClick={() => { onCreate(name.trim()); onClose(); }}
        >
          <Icon name="Plus" size={13} /> Создать
        </button>
      </div>
    </div>
  );
}

// ─── Cover gradients for bookmark tiles ──────────────────────────────────────

const COVERS = [
  "linear-gradient(135deg,hsl(268,55%,13%),hsl(298,45%,9%))",
  "linear-gradient(135deg,hsl(340,55%,13%),hsl(22,45%,9%))",
  "linear-gradient(135deg,hsl(205,55%,13%),hsl(232,45%,9%))",
  "linear-gradient(135deg,hsl(142,55%,13%),hsl(168,45%,9%))",
  "linear-gradient(135deg,hsl(36,55%,13%),hsl(56,45%,9%))",
  "linear-gradient(135deg,hsl(192,55%,13%),hsl(212,45%,9%))",
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Bookmarks() {
  const [activeTab,     setActiveTab]     = useState("Все");
  const [bookmarks,     setBookmarks]     = useState<BookmarkItem[]>(initBookmarks);
  const [collections,   setCollections]   = useState<string[]>(BASE_COLLECTIONS);
  const [showNewColl,   setShowNewColl]   = useState(false);

  const collectionCounts = collections.reduce<Record<string, number>>((acc, c) => {
    acc[c] = c === "Все" ? bookmarks.length : bookmarks.filter(b => b.collection === c).length;
    return acc;
  }, {});

  const displayed =
    activeTab === "Все" ? bookmarks : bookmarks.filter(b => b.collection === activeTab);

  const removeBookmark = (id: number) => setBookmarks(prev => prev.filter(b => b.id !== id));

  const addCollection = (name: string) => {
    if (!collections.includes(name)) setCollections(prev => [...prev, name]);
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="pk-card p-4 flex items-center gap-3 flex-wrap">
        <div>
          <div className="pk-title">Закладки</div>
          <div className="pk-subtitle">{bookmarks.length} сохранённых публикаций</div>
        </div>
        <div className="flex gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {collections.map(c => (
            <button key={c} onClick={() => setActiveTab(c)} className={`pk-tab flex-shrink-0 ${activeTab === c ? "active" : ""}`}>
              {c}
              {collectionCounts[c] > 0 && (
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={activeTab === c
                    ? { background: "rgba(123,77,255,0.25)", color: "#c4b5fd" }
                    : { background: "rgba(255,255,255,0.06)", color: "var(--text-4)" }
                  }
                >
                  {collectionCounts[c]}
                </span>
              )}
            </button>
          ))}
        </div>
        <button className="pk-btn pk-btn-ghost text-xs" onClick={() => setShowNewColl(true)}>
          <Icon name="FolderPlus" size={12} /> Коллекция
        </button>
      </div>

      {/* Content + sidebar */}
      <div className="flex gap-4 items-start">
        {/* Cards grid */}
        <div className="flex-1 min-w-0">
          {displayed.length === 0 ? (
            /* Empty state */
            <div
              className="pk-card p-16 flex flex-col items-center gap-3 text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(123,77,255,0.1)" }}
              >
                <Icon name="Bookmark" size={28} style={{ color: "var(--accent)" }} />
              </div>
              <div className="pk-title">Ничего не сохранено</div>
              <div className="pk-subtitle" style={{ maxWidth: 240 }}>
                Сохраняйте публикации в эту коллекцию, нажимая на иконку закладки
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {displayed.map((b, i) => (
                <div
                  key={b.id}
                  className="pk-card overflow-hidden pk-card-hover group cursor-pointer"
                >
                  {/* Cover */}
                  <div
                    className="relative flex items-center justify-center"
                    style={{ height: 144, background: COVERS[i % COVERS.length] }}
                  >
                    <Icon name="Image" size={40} style={{ color: "rgba(255,255,255,0.08)" }} />
                    {/* Remove button */}
                    <button
                      className="absolute top-2 right-2 pk-icon-btn opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.55)", border: "none" }}
                      onClick={e => { e.stopPropagation(); removeBookmark(b.id); }}
                    >
                      <Icon name="X" size={13} style={{ color: "var(--text)" }} />
                    </button>
                    {/* Collection badge */}
                    <div
                      className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: "rgba(123,77,255,0.7)", color: "var(--text)", backdropFilter: "blur(6px)" }}
                    >
                      {b.collection}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar name={b.post.user.name} colorClass={b.post.user.avatarColor} size="xs" />
                      <span className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>{b.post.user.name}</span>
                    </div>
                    <p
                      className="text-sm leading-relaxed mb-3"
                      style={{ color: "var(--text-3)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                    >
                      {b.post.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="pk-icon-btn" style={{ width: 28, height: 28 }}>
                          <Icon name="Heart" size={13} />
                        </button>
                        <button className="pk-icon-btn" style={{ width: 28, height: 28 }}>
                          <Icon name="Share2" size={13} />
                        </button>
                      </div>
                      <span className="pk-subtitle">Сохранено {b.savedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: collections list */}
        <div className="pk-card p-4 flex-shrink-0" style={{ width: 200 }}>
          <div className="pk-label mb-3">Коллекции</div>
          <div className="space-y-1">
            {collections.map(c => (
              <button
                key={c}
                onClick={() => setActiveTab(c)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors text-sm"
                style={{
                  background: activeTab === c ? "rgba(123,77,255,0.1)" : "transparent",
                  color: activeTab === c ? "var(--text)" : "var(--text-3)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    name={c === "Все" ? "Layers" : "Folder"}
                    size={13}
                    style={{ color: activeTab === c ? "var(--accent)" : "var(--text-4)" }}
                  />
                  <span className="truncate">{c}</span>
                </div>
                <span
                  className="text-[10px] font-bold rounded-full px-1.5 py-0.5 flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-4)" }}
                >
                  {collectionCounts[c] ?? 0}
                </span>
              </button>
            ))}
            <button
              onClick={() => setShowNewColl(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors"
              style={{ color: "var(--accent)", background: "transparent" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(123,77,255,0.07)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Icon name="Plus" size={13} />
              Новая
            </button>
          </div>
        </div>
      </div>

      {showNewColl && (
        <NewCollectionModal onClose={() => setShowNewColl(false)} onCreate={addCollection} />
      )}
    </div>
  );
}
