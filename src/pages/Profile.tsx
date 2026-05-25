import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, posts, boards } from "@/data/mockData";

const tabs = ["Публикации", "Фото", "Видео", "Музыка", "Доски", "Закладки", "Истории"];

const postColors = ["from-violet-900/50 to-purple-900/30", "from-blue-900/50 to-cyan-900/30", "from-pink-900/50 to-rose-900/30", "from-emerald-900/50 to-teal-900/30", "from-orange-900/50 to-amber-900/30"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Публикации");

  return (
    <div className="animate-fade-in">
      {/* Cover */}
      <div
        className="relative rounded-2xl overflow-hidden mb-4"
        style={{ height: "220px", background: "linear-gradient(135deg, #1a0533 0%, #0d0d2b 50%, #07071a 100%)" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.3) 0%, rgba(168,85,247,0.15) 50%, transparent 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-96 h-96 rounded-full" style={{ background: "var(--accent-gradient)", filter: "blur(80px)" }} />
        </div>
        <button
          className="absolute top-4 right-4 btn-ghost text-xs flex items-center gap-1.5"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <Icon name="Camera" size={13} />
          Изменить обложку
        </button>
      </div>

      {/* Profile header */}
      <div className="card p-5 mb-4">
        <div className="flex items-end gap-5">
          <div className="-mt-16 relative">
            <div style={{ padding: "3px", background: "var(--accent-gradient)", borderRadius: "50%" }}>
              <div style={{ padding: "3px", background: "var(--bg-surface)", borderRadius: "50%" }}>
                <Avatar name={currentUser.name} size="xl" />
              </div>
            </div>
            <div className="online-dot absolute bottom-1 right-1" />
          </div>

          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{currentUser.name}</h1>
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--accent-gradient)" }}>
                <Icon name="Check" size={11} style={{ color: "#fff" }} />
              </div>
            </div>
            <div className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>{currentUser.username}</div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{currentUser.bio}</div>
          </div>

          <div className="flex gap-2 pb-1">
            <button className="btn-ghost flex items-center gap-1.5 text-sm">
              <Icon name="MessageCircle" size={14} />
              Написать
            </button>
            <button className="btn-primary flex items-center gap-1.5 text-sm">
              <Icon name="UserPlus" size={14} />
              Подписаться
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {[
            { label: "Публикации", val: currentUser.posts },
            { label: "Друзья", val: currentUser.friends },
            { label: "Подписчики", val: currentUser.followers },
            { label: "Подписки", val: currentUser.following },
          ].map(s => (
            <div key={s.label} className="cursor-pointer group">
              <span className="font-bold text-lg group-hover:text-violet-400 transition-colors" style={{ color: "var(--text-primary)" }}>{s.val}</span>
              <span className="text-sm ml-1.5" style={{ color: "var(--text-secondary)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="card px-4 py-2 mb-4 flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`tab-item flex-shrink-0 ${activeTab === t ? "active" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Публикации" && (
        <div className="columns-3 gap-4" style={{ columnGap: "16px" }}>
          {posts.map((p, i) => (
            <div key={p.id} className="break-inside-avoid mb-4 card overflow-hidden cursor-pointer group">
              <div
                className={`bg-gradient-to-br ${postColors[i % postColors.length]} flex items-center justify-center`}
                style={{ height: i % 3 === 0 ? "180px" : i % 3 === 1 ? "120px" : "150px" }}
              >
                <Icon name="Image" size={32} style={{ color: "rgba(255,255,255,0.15)" }} />
              </div>
              <div className="p-3">
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>{p.text}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1"><Icon name="Heart" size={11} />{p.likes}</span>
                  <span className="flex items-center gap-1"><Icon name="MessageCircle" size={11} />{p.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Доски" && (
        <div className="grid grid-cols-2 gap-4">
          {boards.map(b => (
            <div key={b.id} className="card overflow-hidden cursor-pointer group hover:border-violet-500/30 transition-all">
              <div className={`h-28 bg-gradient-to-br ${b.color} opacity-60 group-hover:opacity-80 transition-opacity flex items-center justify-center`}>
                <Icon name="LayoutGrid" size={32} style={{ color: "rgba(255,255,255,0.5)" }} />
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{b.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{b.count} элементов</div>
                </div>
                {b.shared && (
                  <div className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(124,92,252,0.15)", color: "#c4b5fd" }}>
                    <Icon name="Users" size={10} />
                    Общая
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab !== "Публикации" && activeTab !== "Доски") && (
        <div className="card p-16 flex flex-col items-center justify-center text-center">
          <Icon name="PackageOpen" size={40} style={{ color: "var(--text-muted)" }} />
          <div className="mt-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Раздел «{activeTab}» пока пуст</div>
          <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Добавьте первые материалы</div>
        </div>
      )}
    </div>
  );
}
