import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { communities, users, feedItems } from "@/data/mockData";

type Community = (typeof communities)[0];

const MAIN_TABS = ["Мои", "Рекомендации", "Поиск"];

const PAGE_TABS = [
  "Публикации",
  "Участники",
  "Обсуждения",
  "Медиа",
  "Управление",
];

// Cover gradient options — expressed as inline CSS strings to stay off Tailwind
const COVER_OPTIONS = [
  "linear-gradient(135deg,#7B4DFF,#E94FCB)",
  "linear-gradient(135deg,#3b82f6,#06b6d4)",
  "linear-gradient(135deg,#E94FCB,#f97316)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
];

// Map community.color (Tailwind class) → a CSS gradient string for display
function communityGradient(color: string): string {
  if (color.includes("violet")) return "linear-gradient(135deg,#7B4DFF,#9333ea)";
  if (color.includes("pink") || color.includes("rose")) return "linear-gradient(135deg,#E94FCB,#f43f5e)";
  if (color.includes("blue") || color.includes("cyan")) return "linear-gradient(135deg,#3b82f6,#06b6d4)";
  if (color.includes("emerald") || color.includes("teal")) return "linear-gradient(135deg,#10b981,#06b6d4)";
  return "linear-gradient(135deg,#7B4DFF,#E94FCB)";
}

const AVATAR_EMOJIS = ["🌟", "🔥", "💎", "🚀", "🎨", "🌊", "🎵", "🌸", "🦋", "🐬"];

const MANAGE_ITEMS = [
  { icon: "Shield", label: "Модераторы", desc: "Управление командой" },
  { icon: "FileText", label: "Правила", desc: "Правила сообщества" },
  { icon: "Bell", label: "Уведомления", desc: "Настройки уведомлений" },
  { icon: "BarChart2", label: "Статистика", desc: "Аналитика и данные" },
  { icon: "Settings", label: "Настройки", desc: "Основные параметры" },
  { icon: "PenSquare", label: "Публикации от имени сообщества", desc: "Управление публикациями" },
  { icon: "Lock", label: "Приватность", desc: "Доступ и видимость" },
];

const ITEM_HEIGHTS = [180, 140, 200, 160, 220, 150, 170, 190, 155];

// ─── Community Page (full overlay) ───────────────────────────────────────────

function CommunityPage({
  community,
  onClose,
}: {
  community: Community;
  onClose: () => void;
}) {
  const [tab, setTab] = useState("Публикации");
  const [joined, setJoined] = useState(true);
  const [editCover, setEditCover] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const [coverGrad, setCoverGrad] = useState(communityGradient(community.color));
  const [avatarEmoji, setAvatarEmoji] = useState("🌟");
  const [searchMember, setSearchMember] = useState("");

  const filteredMembers = users.filter((u) =>
    u.name.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto animate-fade-in"
      style={{ background: "var(--bg)" }}
    >
      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-5 py-3"
        style={{
          background: "rgba(7,11,31,0.88)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(20px)",
        }}
      >
        <button className="pk-icon-btn" onClick={onClose}>
          <Icon name="ArrowLeft" size={15} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>
            {community.name}
          </div>
          <div className="pk-subtitle">{community.members} подписчиков</div>
        </div>
        <button className="pk-icon-btn" title="Поделиться">
          <Icon name="Share2" size={15} />
        </button>
        <button className="pk-icon-btn" title="Ещё">
          <Icon name="MoreHorizontal" size={15} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-10">
        {/* Cover */}
        <div
          className="relative overflow-hidden"
          style={{ height: 260, background: coverGrad }}
        >
          {/* Glow blob */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: 0.15 }}
          >
            <div
              className="rounded-full"
              style={{ width: 320, height: 320, background: "#fff", filter: "blur(80px)" }}
            />
          </div>

          {/* Cover edit palette */}
          {editCover && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-2xl animate-scale-in"
              style={{ background: "rgba(7,11,31,0.85)", border: "1px solid var(--border-md)", backdropFilter: "blur(12px)" }}
            >
              {COVER_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => { setCoverGrad(g); setEditCover(false); }}
                  className="rounded-xl transition-all"
                  style={{
                    width: 32,
                    height: 32,
                    background: g,
                    border: `2px solid ${coverGrad === g ? "#fff" : "transparent"}`,
                    transform: coverGrad === g ? "scale(1.15)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          )}

          <button
            className="pk-btn pk-btn-ghost absolute top-4 right-4 text-xs"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setEditCover((e) => !e)}
          >
            <Icon name="Camera" size={12} />
            {editCover ? "Готово" : "Изменить"}
          </button>
        </div>

        {/* Info card — overlaps cover bottom */}
        <div
          className="pk-card px-6 py-5 mb-4"
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <div className="flex items-end gap-5">
            {/* Avatar */}
            <div style={{ marginTop: -52 }} className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl cursor-pointer select-none"
                style={{
                  background: "var(--card)",
                  border: "3px solid var(--bg)",
                  boxShadow: "var(--shadow-md)",
                }}
                onClick={() => setEditAvatar((e) => !e)}
              >
                {avatarEmoji}
              </div>
              {editAvatar && (
                <div
                  className="absolute top-full left-0 mt-2 flex flex-wrap gap-1 p-2 rounded-xl animate-scale-in z-10"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border-md)",
                    boxShadow: "var(--shadow-lg)",
                    width: 168,
                  }}
                >
                  {AVATAR_EMOJIS.map((em) => (
                    <button
                      key={em}
                      onClick={() => { setAvatarEmoji(em); setEditAvatar(false); }}
                      className="text-xl w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                      style={{
                        background: avatarEmoji === em ? "rgba(123,77,255,0.2)" : "var(--surface)",
                        border: `1px solid ${avatarEmoji === em ? "var(--accent)" : "transparent"}`,
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>
                  {community.name}
                </h1>
                {community.verified && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--accent-grad)" }}
                  >
                    <Icon name="Check" size={10} style={{ color: "#fff" }} />
                  </div>
                )}
              </div>
              <div className="pk-subtitle mb-2">
                {community.category} · {community.members} подписчиков
              </div>
              <div className="text-sm" style={{ color: "var(--text-2)" }}>
                Официальное сообщество. Делимся вдохновением каждый день.
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pb-1 flex-shrink-0">
              <button
                onClick={() => setJoined((j) => !j)}
                className={`pk-btn ${joined ? "pk-btn-ghost" : "pk-btn-primary"} text-sm`}
              >
                {joined ? (
                  <>
                    <Icon name="Check" size={13} /> Вы подписаны
                  </>
                ) : (
                  <>
                    <Icon name="Plus" size={13} /> Подписаться
                  </>
                )}
              </button>
              {joined && (
                <button className="pk-btn pk-btn-ghost text-sm">
                  <Icon name="PenSquare" size={13} /> Написать
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex gap-8 mt-4 pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {[
              { label: "Подписчики", val: community.members },
              { label: "Публикации", val: "1.2К" },
              { label: "Онлайн", val: "842" },
            ].map((s) => (
              <div key={s.label}>
                <span className="font-bold text-base" style={{ color: "var(--text)" }}>
                  {s.val}
                </span>
                <span className="text-sm ml-1.5 pk-subtitle">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Page tabs */}
        <div
          className="pk-card px-4 py-2.5 mb-4 flex gap-1 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {PAGE_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pk-tab flex-shrink-0 ${tab === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "Публикации" && (
          <div className="grid grid-cols-3 gap-3">
            {feedItems.slice(0, 9).map((item, i) => (
              <div key={item.id} className="pk-card overflow-hidden cursor-pointer pk-card-hover">
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: ITEM_HEIGHTS[i],
                    background: `linear-gradient(135deg,hsl(${(i * 40) % 360},60%,15%),hsl(${(i * 40 + 60) % 360},50%,10%))`,
                  }}
                >
                  <Icon
                    name={item.type === "video" ? "Play" : "Image"}
                    size={32}
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  />
                </div>
                <div className="p-3">
                  <div
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {item.text}
                  </div>
                  <div className="flex gap-3 text-xs" style={{ color: "var(--text-4)" }}>
                    <span className="flex items-center gap-1">
                      <Icon name="Heart" size={10} /> {item.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MessageCircle" size={10} /> {item.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Участники" && (
          <div className="space-y-4">
            <div className="pk-card p-3">
              <input
                className="pk-input"
                placeholder="Поиск участников…"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {filteredMembers.map((u) => (
                <div key={u.id} className="pk-card pk-card-hover p-4 flex flex-col items-center text-center">
                  <div className="relative mb-2">
                    <Avatar name={u.name} colorClass={u.avatarColor} size="lg" online={u.online} />
                  </div>
                  <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>
                    {u.name}
                  </div>
                  <div className="pk-subtitle mb-3">{u.bio}</div>
                  <button className="pk-btn pk-btn-ghost text-xs">
                    <Icon name="MessageCircle" size={12} /> Написать
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Обсуждения" && (
          <div className="space-y-3">
            {[
              { title: "Ваши любимые инструменты дизайна?", replies: 24, author: users[0] },
              { title: "Делитесь своими последними работами", replies: 41, author: users[1] },
              { title: "Рекомендации по курсам и книгам", replies: 17, author: users[2] },
              { title: "Как найти первых клиентов?", replies: 33, author: users[3] },
            ].map((d, i) => (
              <div key={i} className="pk-card pk-card-hover p-4 flex items-center gap-4 cursor-pointer">
                <Avatar name={d.author.name} colorClass={d.author.avatarColor} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>
                    {d.title}
                  </div>
                  <div className="pk-subtitle">
                    {d.author.name} · {d.replies} ответов
                  </div>
                </div>
                <Icon name="ChevronRight" size={16} style={{ color: "var(--text-4)" }} />
              </div>
            ))}
          </div>
        )}

        {tab === "Медиа" && (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  height: 110,
                  background: `linear-gradient(135deg,hsl(${(i * 30) % 360},60%,15%),hsl(${(i * 30 + 60) % 360},50%,10%))`,
                }}
              />
            ))}
          </div>
        )}

        {tab === "Управление" && (
          <div className="pk-card overflow-hidden">
            {MANAGE_ITEMS.map((item, i) => (
              <div key={item.label}>
                {i > 0 && <div style={{ height: 1, background: "var(--border)", marginLeft: 56 }} />}
                <button
                  className="flex items-center gap-4 w-full px-5 py-4 text-left transition-colors"
                  style={{ background: "transparent" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(123,77,255,0.1)" }}
                  >
                    <Icon name={item.icon} size={17} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      {item.label}
                    </div>
                    <div className="pk-subtitle">{item.desc}</div>
                  </div>
                  <Icon name="ChevronRight" size={15} style={{ color: "var(--text-4)" }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Community Card ───────────────────────────────────────────────────────────

function CommunityCard({
  community,
  onClick,
}: {
  community: Community;
  onClick: () => void;
}) {
  const [joined, setJoined] = useState(false);
  const grad = communityGradient(community.color);

  return (
    <div className="pk-card overflow-hidden pk-card-hover cursor-pointer" onClick={onClick}>
      {/* Cover */}
      <div
        className="relative flex items-end px-4 pb-4"
        style={{ height: 110, background: grad }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.35) 100%)" }}
        />
        {community.verified && (
          <div
            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-grad)" }}
          >
            <Icon name="Check" size={11} style={{ color: "#fff" }} />
          </div>
        )}
        <div
          className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: "rgba(7,11,31,0.6)", backdropFilter: "blur(8px)", border: "2px solid rgba(255,255,255,0.15)" }}
        >
          🌟
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-sm font-bold mb-0.5 truncate" style={{ color: "var(--text)" }}>
          {community.name}
        </div>
        <div className="pk-subtitle mb-1">
          {community.category} · {community.members}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {users.slice(0, 3).map((u) => (
              <Avatar key={u.id} name={u.name} colorClass={u.avatarColor} size="xs" />
            ))}
          </div>
          <span className="text-xs" style={{ color: "var(--text-4)" }}>
            +{community.members}
          </span>
        </div>
        <button
          className={`pk-btn mt-3 w-full text-xs ${joined ? "pk-btn-ghost" : "pk-btn-primary"}`}
          onClick={(e) => { e.stopPropagation(); setJoined((j) => !j); }}
        >
          {joined ? (
            <>
              <Icon name="Check" size={12} /> Подписан
            </>
          ) : (
            <>
              <Icon name="Plus" size={12} /> Подписаться
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const RECOMMENDED: Community[] = [
  ...communities,
  { id: 5, name: "Архитектура и пространство", members: "189К", category: "Архитектура", verified: true, color: "from-orange-500 to-amber-600" },
  { id: 6, name: "Музыкальная волна", members: "421К", category: "Музыка", verified: false, color: "from-fuchsia-500 to-purple-600" },
];

export default function Communities() {
  const [mainTab, setMainTab] = useState("Мои");
  const [search, setSearch] = useState("");
  const [openCommunity, setOpenCommunity] = useState<Community | null>(null);

  const displayList =
    mainTab === "Поиск"
      ? RECOMMENDED.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.category.toLowerCase().includes(search.toLowerCase())
        )
      : mainTab === "Рекомендации"
      ? RECOMMENDED
      : communities;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="pk-card p-4 flex items-center gap-3 flex-wrap">
        <div>
          <div className="pk-title">Сообщества</div>
          <div className="pk-subtitle">{communities.length} моих сообщества</div>
        </div>
        <div className="flex gap-1 ml-auto">
          {MAIN_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setMainTab(t)}
              className={`pk-tab ${mainTab === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="pk-btn pk-btn-primary text-sm">
          <Icon name="Plus" size={13} /> Создать
        </button>
      </div>

      {/* Search (Поиск tab) */}
      {mainTab === "Поиск" && (
        <div className="pk-card p-3">
          <div className="relative">
            <Icon
              name="Search"
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-4)" }}
            />
            <input
              className="pk-input"
              style={{ paddingLeft: 36 }}
              placeholder="Поиск сообществ…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {displayList.map((c) => (
          <CommunityCard key={c.id} community={c} onClick={() => setOpenCommunity(c)} />
        ))}
      </div>

      {/* Full community page overlay */}
      {openCommunity && (
        <CommunityPage community={openCommunity} onClose={() => setOpenCommunity(null)} />
      )}
    </div>
  );
}
