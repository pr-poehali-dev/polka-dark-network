import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, feedItems, boards, tracks, profileBlocks, profileVersions } from "@/data/mockData";

const TABS = ["Публикации", "Музыка", "Портфолио", "Доски", "Истории", "Закладки"];

const storyBg = [
  "from-pink-900/80 to-rose-900/60",
  "from-violet-900/80 to-purple-900/60",
  "from-blue-900/80 to-indigo-900/60",
  "from-emerald-900/80 to-teal-900/60",
];

// Story viewer overlay
function StoryViewer({ onClose }: { onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const total = 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.92)" }} onClick={onClose}>
      <div className="relative animate-scale-in" style={{ width: 380, height: 680 }} onClick={e => e.stopPropagation()}>
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full" style={{ background: i < idx ? "#fff" : i === idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }}>
              {i === idx && <div className="h-full rounded-full" style={{ background: "#fff", animation: "storyProgress 5s linear forwards" }} />}
            </div>
          ))}
        </div>
        <style>{`@keyframes storyProgress { from { width: 0% } to { width: 100% } }`}</style>

        {/* Story content */}
        <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${storyBg[idx]} flex flex-col overflow-hidden`}>
          <div className="flex items-center gap-2.5 p-4 pt-8">
            <Avatar name={currentUser.name} colorClass={currentUser.avatarColor} size="sm" />
            <span className="text-sm font-semibold text-white">{currentUser.name}</span>
            <span className="text-xs text-white/60 ml-auto">3 ч назад</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Icon name="Image" size={64} style={{ color: "rgba(255,255,255,0.15)" }} />
          </div>
        </div>

        {/* Controls */}
        <button onClick={() => setIdx(Math.max(0, idx - 1))}
          className="absolute left-0 top-0 bottom-0 w-1/3" />
        <button onClick={() => idx < total - 1 ? setIdx(idx + 1) : onClose()}
          className="absolute right-0 top-0 bottom-0 w-1/3" />
        <button onClick={onClose} className="absolute top-4 right-4 btn-icon z-20" style={{ background: "rgba(0,0,0,0.5)" }}>
          <Icon name="X" size={15} style={{ color: "#fff" }} />
        </button>
      </div>
    </div>
  );
}

// Block editor modal
function BlockEditor({ blocks, setBlocks, onClose }: { blocks: typeof profileBlocks; setBlocks: (b: typeof profileBlocks) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.75)" }} onClick={onClose}>
      <div className="animate-scale-in card p-5 w-96 max-h-[80vh] overflow-y-auto" style={{ background: "#10102a", boxShadow: "var(--shadow-elevated)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span className="section-title">Блоки профиля</span>
          <button className="btn-icon" onClick={onClose}><Icon name="X" size={15} /></button>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>Включайте и отключайте блоки на своей странице</p>
        <div className="space-y-2">
          {blocks.map(b => (
            <div key={b.id} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-2.5">
                <Icon name={b.icon} size={15} style={{ color: b.enabled ? "var(--accent-1)" : "var(--text-muted)" }} />
                <span className="text-sm font-medium" style={{ color: b.enabled ? "var(--text-primary)" : "var(--text-secondary)" }}>{b.label}</span>
              </div>
              <button onClick={() => setBlocks(blocks.map(x => x.id === b.id ? { ...x, enabled: !x.enabled } : x))}
                className="relative w-10 h-5 rounded-full transition-all"
                style={{ background: b.enabled ? "var(--accent-gradient)" : "rgba(255,255,255,0.12)" }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                  style={{ background: "#fff", left: b.enabled ? "calc(100% - 18px)" : "2px" }} />
              </button>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full justify-center mt-4" onClick={onClose}>Сохранить</button>
      </div>
    </div>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Публикации");
  const [activeVersion, setActiveVersion] = useState("friends");
  const [storyViewer, setStoryViewer] = useState(false);
  const [blockEditor, setBlockEditor] = useState(false);
  const [blocks, setBlocks] = useState(profileBlocks);
  const [addStory, setAddStory] = useState(false);

  const postColors = ["from-pink-900/60 to-rose-800/40", "from-violet-900/60 to-purple-800/40", "from-blue-900/60 to-indigo-800/40", "from-emerald-900/60 to-teal-800/40", "from-amber-900/60 to-orange-800/40"];

  return (
    <div className="animate-fade-in">
      {/* Cover */}
      <div className="relative rounded-2xl overflow-hidden mb-4" style={{ height: "220px", background: "linear-gradient(135deg, #1a0533 0%, #0d0d2b 50%, #07071a 100%)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(236,72,153,0.15) 60%, transparent 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-96 h-96 rounded-full" style={{ background: "var(--accent-gradient)", filter: "blur(100px)" }} />
        </div>
        <button className="absolute top-4 right-4 btn-ghost text-xs" style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.15)" }}>
          <Icon name="Camera" size={12} />Обложка
        </button>
      </div>

      {/* Profile card */}
      <div className="card p-5 mb-4">
        <div className="flex items-end gap-5">
          <div className="-mt-16 relative flex-shrink-0">
            <div style={{ padding: "3px", background: "var(--accent-gradient)", borderRadius: "50%" }}>
              <div style={{ padding: "3px", background: "var(--bg-surface)", borderRadius: "50%" }}>
                <Avatar name={currentUser.name} size="xl" />
              </div>
            </div>
            <div className="online-dot" style={{ width: 12, height: 12, border: "2px solid var(--bg-surface)" }} />
          </div>

          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{currentUser.name}</h1>
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--accent-gradient)" }}>
                <Icon name="Check" size={10} style={{ color: "#fff" }} />
              </div>
            </div>
            <div className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>{currentUser.username} · {currentUser.city}</div>
            <div className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{currentUser.bio}</div>
          </div>

          <div className="flex flex-col gap-2 pb-1">
            <div className="flex gap-2">
              <button className="btn-ghost text-sm"><Icon name="MessageCircle" size={14} />Написать</button>
              <button className="btn-primary text-sm"><Icon name="UserPlus" size={14} />Подписаться</button>
            </div>
            <button onClick={() => setBlockEditor(true)} className="btn-ghost text-xs justify-center">
              <Icon name="LayoutGrid" size={12} />Настроить блоки
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {[
            { label: "Публикации", val: currentUser.posts },
            { label: "Друзья", val: currentUser.friends },
            { label: "Подписчики", val: `${currentUser.followers.toLocaleString()}` },
            { label: "Подписки", val: currentUser.following },
          ].map(s => (
            <div key={s.label} className="cursor-pointer group">
              <span className="font-bold text-lg group-hover:text-violet-300 transition-colors" style={{ color: "var(--text-primary)" }}>{s.val}</span>
              <span className="text-sm ml-1.5" style={{ color: "var(--text-secondary)" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Profile versions */}
        <div className="flex items-center gap-2 mt-4 pt-4 flex-wrap" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Версия профиля:</span>
          {profileVersions.map(v => (
            <button key={v.id} onClick={() => setActiveVersion(v.id)}
              className={`version-badge ${activeVersion === v.id ? "active" : ""}`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stories row (профиль) */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="section-title text-sm">Истории</span>
          <button className="btn-ghost text-xs"><Icon name="Plus" size={12} />Добавить</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {/* Add story */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group" onClick={() => setAddStory(true)}>
            <div className="w-16 h-24 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: "rgba(139,92,246,0.12)", border: "2px dashed rgba(139,92,246,0.4)" }}>
              <Icon name="Plus" size={22} style={{ color: "var(--accent-1)" }} />
            </div>
            <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Новая</span>
          </div>
          {[
            { label: "Вчера", color: storyBg[0] },
            { label: "3 дня", color: storyBg[1] },
            { label: "Неделя", color: storyBg[2] },
            { label: "Архив", color: storyBg[3] },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group" onClick={() => setStoryViewer(true)}>
              <div className={`w-16 h-24 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center relative overflow-hidden transition-all group-hover:scale-105`}>
                <Icon name="Image" size={24} style={{ color: "rgba(255,255,255,0.3)" }} />
                <div className="absolute inset-0 flex items-end p-2">
                  <span className="text-[9px] text-white/70 font-medium">{s.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="card px-4 py-2 mb-4 flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`tab-item flex-shrink-0 ${activeTab === t ? "active" : ""}`}>{t}</button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Публикации" && (
        <div className="columns-3 gap-3" style={{ columnGap: "12px" }}>
          {feedItems.slice(0, 9).map((item, i) => (
            <div key={item.id} className="pin-item rounded-xl overflow-hidden cursor-pointer card-hover"
              style={{ height: [200, 150, 250, 180, 220, 160, 210, 170, 190][i], borderRadius: "var(--radius-lg)" }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
              {item.type === "video" && (
                <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                  style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
                  <Icon name="Play" size={9} />{(item as { duration?: string }).duration}
                </div>
              )}
              <div className="pin-overlay">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70 flex items-center gap-1"><Icon name="Heart" size={10} />{item.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Доски" && (
        <div className="grid grid-cols-4 gap-3">
          {boards.map(b => (
            <div key={b.id} className="card overflow-hidden cursor-pointer card-hover">
              <div className={`h-24 bg-gradient-to-br ${b.color} flex items-center justify-center relative`} style={{ opacity: 0.8 }}>
                <Icon name="LayoutGrid" size={28} style={{ color: "rgba(255,255,255,0.3)" }} />
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{b.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{b.count} изображений</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Музыка" && (
        <div className="card overflow-hidden">
          {tracks.map((t, i) => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 glass-hover cursor-pointer"
              style={{ borderBottom: i < tracks.length - 1 ? "1px solid var(--border-subtle)" : "none", borderLeft: t.playing ? "2px solid var(--accent-1)" : "2px solid transparent" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: t.playing ? "var(--accent-gradient)" : "rgba(255,255,255,0.06)" }}>
                <Icon name={t.playing ? "Pause" : "Play"} size={13} style={{ color: t.playing ? "#fff" : "var(--text-secondary)" }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: t.playing ? "#d8b4fe" : "var(--text-primary)" }}>{t.title}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{t.artist}</div>
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t.duration}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Истории" && (
        <div className="grid grid-cols-4 gap-4">
          {storyBg.map((c, i) => (
            <div key={i} className={`rounded-2xl bg-gradient-to-br ${c} cursor-pointer card-hover relative overflow-hidden`}
              style={{ height: 240 }} onClick={() => setStoryViewer(true)}>
              <div className="absolute inset-0 flex items-end p-4">
                <div>
                  <Avatar name={currentUser.name} colorClass={currentUser.avatarColor} size="sm" />
                  <div className="text-xs text-white font-semibold mt-1.5">{currentUser.name.split(" ")[0]}</div>
                  <div className="text-[10px] text-white/60">{i + 1} дн. назад</div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                  <Icon name="Play" size={20} style={{ color: "#fff" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Портфолио" && (
        <div className="grid grid-cols-3 gap-4">
          {feedItems.slice(0, 6).map((item, i) => (
            <div key={item.id} className="card overflow-hidden cursor-pointer card-hover">
              <div className={`h-44 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <Icon name={item.type === "video" ? "Play" : "Image"} size={36} style={{ color: "rgba(255,255,255,0.2)" }} />
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.text}</div>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1"><Icon name="Heart" size={11} />{item.likes}</span>
                  <span className="flex items-center gap-1"><Icon name="MessageCircle" size={11} />{item.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === "Закладки") && (
        <div className="card p-12 flex flex-col items-center text-center">
          <Icon name="Bookmark" size={40} style={{ color: "var(--text-muted)" }} />
          <div className="mt-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Закладок пока нет</div>
          <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Сохраняйте посты, чтобы вернуться к ним позже</div>
        </div>
      )}

      {storyViewer && <StoryViewer onClose={() => setStoryViewer(false)} />}
      {blockEditor && <BlockEditor blocks={blocks} setBlocks={setBlocks} onClose={() => setBlockEditor(false)} />}
    </div>
  );
}
