import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { communities, users, feedItems, tracks } from "@/data/mockData";

const tabs = ["Мои", "Рекомендации", "Поиск"];

// Full community page (shown in new tab simulation)
function CommunityPage({ community, onClose }: { community: typeof communities[0]; onClose: () => void }) {
  const [tab, setTab] = useState("Публикации");
  const [joined, setJoined] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [coverColor, setCoverColor] = useState(community.color);
  const [avatarEmoji, setAvatarEmoji] = useState("🌟");

  const pageTabs = ["Публикации", "Обсуждения", "Участники", "Медиа", "Мероприятия", "Ссылки", "Управление"];
  const coverColors = [
    "from-violet-600 to-pink-600",
    "from-blue-600 to-cyan-600",
    "from-pink-600 to-rose-600",
    "from-emerald-600 to-teal-600",
    "from-orange-600 to-amber-600",
    "from-fuchsia-600 to-purple-600",
  ];
  const avatarEmojis = ["🌟", "🔥", "💎", "🚀", "🎨", "🌊", "🎵", "🌸"];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in" style={{ background: "var(--bg-deep)" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3" style={{ background: "rgba(13,13,43,0.92)", borderBottom: "1px solid var(--border-subtle)", backdropFilter: "blur(24px)" }}>
        <button className="btn-icon" onClick={onClose}><Icon name="ArrowLeft" size={15} /></button>
        <div className="flex-1">
          <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{community.name}</div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{community.members} подписчиков</div>
        </div>
        {joined && (
          <button onClick={() => setEditMode(!editMode)} className="btn-ghost text-sm">
            <Icon name="Settings" size={13} />Управление
          </button>
        )}
        <button className="btn-icon"><Icon name="Share2" size={15} /></button>
        <button className="btn-icon"><Icon name="MoreHorizontal" size={15} /></button>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-8">
        {/* Cover */}
        <div className="relative rounded-2xl overflow-hidden mb-0" style={{ height: 260 }}>
          <div className={`absolute inset-0 bg-gradient-to-br ${coverColor}`} />
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.3)" }} />
          </div>

          {editMode && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <div className="card p-2 flex gap-1.5 flex-wrap" style={{ background: "rgba(10,10,30,0.85)", maxWidth: 200 }}>
                {coverColors.map(c => (
                  <button key={c} onClick={() => setCoverColor(c)}
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c}`}
                    style={{ border: `2px solid ${coverColor === c ? "#fff" : "transparent"}` }} />
                ))}
              </div>
            </div>
          )}

          <button className="absolute top-4 right-4 btn-ghost text-xs" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setEditMode(!editMode)}>
            <Icon name="Camera" size={12} />{editMode ? "Готово" : "Изменить шапку"}
          </button>
        </div>

        {/* Profile row */}
        <div className="card px-6 py-4 mb-4 -mt-px rounded-t-none" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <div className="flex items-end gap-4">
            <div className="-mt-12 relative flex-shrink-0">
              {editMode ? (
                <div>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl cursor-pointer"
                    style={{ background: `linear-gradient(135deg, var(--bg-card), var(--bg-surface))`, border: "3px solid var(--bg-deep)", boxShadow: "var(--shadow-card)" }}>
                    {avatarEmoji}
                  </div>
                  <div className="mt-2 flex gap-1 flex-wrap" style={{ maxWidth: 160 }}>
                    {avatarEmojis.map(e => (
                      <button key={e} onClick={() => setAvatarEmoji(e)}
                        className={`text-xl w-8 h-8 rounded-lg flex items-center justify-center`}
                        style={{ background: avatarEmoji === e ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)", border: `1px solid ${avatarEmoji === e ? "rgba(139,92,246,0.5)" : "transparent"}` }}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                  style={{ background: `linear-gradient(135deg, var(--bg-card), var(--bg-surface))`, border: "3px solid var(--bg-deep)", boxShadow: "var(--shadow-card)" }}>
                  {avatarEmoji}
                </div>
              )}
            </div>

            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{community.name}</h1>
                {community.verified && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--accent-gradient)" }}>
                    <Icon name="Check" size={10} style={{ color: "#fff" }} />
                  </div>
                )}
              </div>
              <div className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{community.category} · {community.members} подписчиков</div>
              {editMode ? (
                <textarea defaultValue="Официальное сообщество. Делимся вдохновением каждый день."
                  className="w-full resize-none text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }}
                  rows={2} />
              ) : (
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Официальное сообщество. Делимся вдохновением каждый день.</div>
              )}
            </div>

            <div className="flex gap-2 pb-1 flex-shrink-0">
              <button onClick={() => setJoined(!joined)} className={joined ? "btn-ghost text-sm" : "btn-primary text-sm"}>
                {joined ? "Вы подписаны" : "Подписаться"}
              </button>
              {joined && (
                <button className="btn-ghost text-sm"><Icon name="PenSquare" size={13} />Написать</button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            {[
              { label: "Подписчики", val: community.members },
              { label: "Публикации", val: "1.2К" },
              { label: "Онлайн", val: "842" },
            ].map(s => (
              <div key={s.label}>
                <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{s.val}</span>
                <span className="text-sm ml-1.5" style={{ color: "var(--text-secondary)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="card px-4 py-2 mb-4 flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {pageTabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`tab-item flex-shrink-0 ${tab === t ? "active" : ""}`}>{t}</button>
          ))}
        </div>

        {/* Content */}
        {tab === "Публикации" && (
          <div className="grid grid-cols-3 gap-3">
            {feedItems.slice(0, 9).map((item, i) => (
              <div key={item.id} className="card overflow-hidden cursor-pointer card-hover">
                <div className={`bg-gradient-to-br ${item.color} flex items-center justify-center`} style={{ height: [180, 140, 200, 160, 220, 150, 170, 190, 155][i] }}>
                  <Icon name={item.type === "video" ? "Play" : "Image"} size={32} style={{ color: "rgba(255,255,255,0.2)" }} />
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium line-clamp-2" style={{ color: "var(--text-primary)" }}>{item.text}</div>
                  <div className="flex gap-3 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1"><Icon name="Heart" size={10} />{item.likes}</span>
                    <span className="flex items-center gap-1"><Icon name="MessageCircle" size={10} />{item.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Участники" && (
          <div className="grid grid-cols-3 gap-3">
            {users.map(u => (
              <div key={u.id} className="card p-4 flex items-center gap-3">
                <Avatar name={u.name} colorClass={u.avatarColor} size="md" online={u.online} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{u.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{u.bio}</div>
                </div>
                <button className="btn-ghost text-xs py-1.5 px-2.5">Написать</button>
              </div>
            ))}
          </div>
        )}

        {tab === "Управление" && (
          <div className="card p-5 space-y-4">
            <div className="section-title mb-3">Управление сообществом</div>
            {[
              { icon: "Users", label: "Модераторы", desc: "Управление правами участников" },
              { icon: "Shield", label: "Правила", desc: "Настройка правил сообщества" },
              { icon: "Bell", label: "Уведомления", desc: "Настройка рассылки" },
              { icon: "BarChart3", label: "Статистика", desc: "Охват, активность, рост" },
              { icon: "Settings", label: "Настройки", desc: "Основная информация и видимость" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl glass-hover cursor-pointer" style={{ border: "1px solid var(--border-subtle)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)" }}>
                  <Icon name={item.icon} size={18} style={{ color: "var(--accent-1)" }} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.desc}</div>
                </div>
                <Icon name="ChevronRight" size={15} className="ml-auto" style={{ color: "var(--text-muted)" }} />
              </div>
            ))}
          </div>
        )}

        {(tab !== "Публикации" && tab !== "Участники" && tab !== "Управление") && (
          <div className="card p-12 flex flex-col items-center text-center">
            <Icon name="PackageOpen" size={36} style={{ color: "var(--text-muted)" }} />
            <div className="mt-2 font-semibold" style={{ color: "var(--text-secondary)" }}>Раздел «{tab}» пока пуст</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState("Рекомендации");
  const [joined, setJoined] = useState<Set<number>>(new Set([1, 3]));
  const [openCommunity, setOpenCommunity] = useState<typeof communities[0] | null>(null);

  const toggle = (id: number) => {
    setJoined(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4 flex items-center gap-4">
        <span className="section-title">Сообщества</span>
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`tab-item ${activeTab === t ? "active" : ""}`}>{t}</button>
          ))}
        </div>
        <button className="btn-primary ml-auto text-sm">
          <Icon name="Plus" size={13} />Создать
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {communities.map(c => (
          <div key={c.id} className="card overflow-hidden group card-hover">
            <div className={`h-28 bg-gradient-to-br ${c.color} flex items-center justify-center relative cursor-pointer`}
              onClick={() => setOpenCommunity(c)}>
              <Icon name="Globe" size={40} style={{ color: "rgba(255,255,255,0.2)" }} />
              {c.verified && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--accent-gradient)" }}>
                  <Icon name="Check" size={11} style={{ color: "#fff" }} />
                </div>
              )}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.3)" }}>
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  <Icon name="ExternalLink" size={13} />Открыть
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="font-bold text-sm mb-0.5 cursor-pointer hover:text-violet-300 transition-colors"
                style={{ color: "var(--text-primary)" }}
                onClick={() => setOpenCommunity(c)}>{c.name}</div>
              <div className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{c.category}</div>
              <div className="flex items-center gap-1 text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                <Icon name="Users" size={11} />{c.members} участников
              </div>
              <button onClick={() => toggle(c.id)}
                className={`w-full text-xs py-2 rounded-xl font-semibold transition-all ${joined.has(c.id) ? "btn-ghost" : "btn-primary"}`}>
                {joined.has(c.id) ? "Подписан" : "Подписаться"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {openCommunity && <CommunityPage community={openCommunity} onClose={() => setOpenCommunity(null)} />}
    </div>
  );
}
