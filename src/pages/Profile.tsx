import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import {
  currentUser,
  feedItems,
  boards,
  tracks,
  profileBlocks,
  profileVersions,
  stories,
} from "@/data/mockData";

const TABS = ["Публикации", "Фото", "Музыка", "Доски", "Истории", "Портфолио"];

const COVER_GRADIENTS = [
  "linear-gradient(135deg,#1a0533 0%,#0d0d2b 50%,#07071a 100%)",
  "linear-gradient(135deg,#0a1628 0%,#0d2040 50%,#071628 100%)",
  "linear-gradient(135deg,#1a0820 0%,#2d0d3a 50%,#0d071a 100%)",
  "linear-gradient(135deg,#07180e 0%,#0d2818 50%,#071a0d 100%)",
  "linear-gradient(135deg,#1a1207 0%,#2d2005 50%,#1a1407 100%)",
];

const COVER_OVERLAYS = [
  "linear-gradient(135deg,rgba(123,77,255,0.35) 0%,rgba(233,79,203,0.2) 60%,transparent 100%)",
  "linear-gradient(135deg,rgba(59,130,246,0.35) 0%,rgba(99,102,241,0.2) 60%,transparent 100%)",
  "linear-gradient(135deg,rgba(236,72,153,0.35) 0%,rgba(168,85,247,0.2) 60%,transparent 100%)",
  "linear-gradient(135deg,rgba(16,185,129,0.35) 0%,rgba(6,182,212,0.2) 60%,transparent 100%)",
  "linear-gradient(135deg,rgba(245,158,11,0.35) 0%,rgba(249,115,22,0.2) 60%,transparent 100%)",
];

// ─── Story Viewer ───────────────────────────────────────────────────────────
function StoryViewer({
  initialIdx,
  onClose,
}: {
  initialIdx: number;
  onClose: () => void;
}) {
  const [storyIdx, setStoryIdx] = useState(initialIdx);
  const [segIdx, setSegIdx] = useState(0);
  const total = 4;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (segIdx < total - 1) setSegIdx((s) => s + 1);
      else onClose();
    }, 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [segIdx]);

  const storyColors = [
    "linear-gradient(135deg,#3b0764,#6d1b7b)",
    "linear-gradient(135deg,#1e1b4b,#312e81)",
    "linear-gradient(135deg,#0f172a,#1e3a5f)",
    "linear-gradient(135deg,#064e3b,#065f46)",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pk-modal-bg"
      style={{ background: "rgba(0,0,0,0.93)" }}
      onClick={onClose}
    >
      <div
        className="relative animate-scale-in rounded-2xl overflow-hidden"
        style={{ width: 380, height: 680 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: 2, background: "rgba(255,255,255,0.25)" }}
            >
              {i < segIdx && (
                <div className="h-full w-full rounded-full" style={{ background: "#fff" }} />
              )}
              {i === segIdx && (
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "#fff",
                    animation: "storyProgress 5s linear forwards",
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <style>{`@keyframes storyProgress{from{width:0}to{width:100%}}`}</style>

        {/* Content */}
        <div
          className="w-full h-full flex flex-col"
          style={{ background: storyColors[segIdx % storyColors.length] }}
        >
          <div className="flex items-center gap-2.5 p-4 pt-9 z-10">
            <Avatar
              name={stories[storyIdx]?.user?.name ?? currentUser.name}
              colorClass={currentUser.avatarColor}
              size="sm"
            />
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {stories[storyIdx]?.user?.name ?? currentUser.name}
            </span>
            <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              3 ч назад
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Icon name="Image" size={64} style={{ color: "rgba(255,255,255,0.1)" }} />
          </div>
          <div className="p-5 pb-8">
            <div
              className="rounded-2xl px-4 py-3 text-sm font-medium"
              style={{ background: "rgba(0,0,0,0.4)", color: "var(--text)" }}
            >
              История {segIdx + 1} из {total}
            </div>
          </div>
        </div>

        {/* Nav zones */}
        <button
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
          onClick={() => setSegIdx((s) => Math.max(0, s - 1))}
        />
        <button
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
          onClick={() => (segIdx < total - 1 ? setSegIdx((s) => s + 1) : onClose())}
        />
        <button
          className="pk-icon-btn absolute top-4 right-4 z-30"
          style={{ background: "rgba(0,0,0,0.55)", border: "none" }}
          onClick={onClose}
        >
          <Icon name="X" size={14} style={{ color: "var(--text)" }} />
        </button>
      </div>
    </div>
  );
}

// ─── Block Editor Modal ─────────────────────────────────────────────────────
function BlockEditorModal({
  blocks,
  setBlocks,
  onClose,
}: {
  blocks: typeof profileBlocks;
  setBlocks: (b: typeof profileBlocks) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in pk-card p-5 w-96 max-h-[82vh] overflow-y-auto"
        style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="pk-title">Блоки профиля</span>
          <button className="pk-icon-btn" onClick={onClose}>
            <Icon name="X" size={14} />
          </button>
        </div>
        <p className="pk-subtitle mb-4">Включайте и отключайте разделы страницы</p>
        <div className="space-y-2">
          {blocks.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  name={b.icon}
                  size={15}
                  style={{ color: b.enabled ? "var(--accent)" : "var(--text-4)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: b.enabled ? "var(--text)" : "var(--text-3)" }}
                >
                  {b.label}
                </span>
              </div>
              <button
                onClick={() =>
                  setBlocks(
                    blocks.map((x) => (x.id === b.id ? { ...x, enabled: !x.enabled } : x))
                  )
                }
                className="relative rounded-full transition-all flex-shrink-0"
                style={{
                  width: 40,
                  height: 22,
                  background: b.enabled
                    ? "var(--accent-grad)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="absolute top-1 rounded-full transition-all"
                  style={{
                    width: 14,
                    height: 14,
                    background: "#fff",
                    left: b.enabled ? "calc(100% - 18px)" : "4px",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
        <button className="pk-btn pk-btn-primary w-full mt-4" onClick={onClose}>
          Сохранить
        </button>
      </div>
    </div>
  );
}

// ─── Edit Profile Modal ─────────────────────────────────────────────────────
const EMOJI_OPTIONS = ["😎", "🦊", "🐼", "🦁", "🐯", "🦋", "🌸", "🔮"];

function EditProfileModal({
  name,
  bio,
  username,
  emoji,
  coverIdx,
  onSave,
  onClose,
}: {
  name: string;
  bio: string;
  username: string;
  emoji: string;
  coverIdx: number;
  onSave: (d: { name: string; bio: string; username: string; emoji: string; coverIdx: number }) => void;
  onClose: () => void;
}) {
  const [localName, setLocalName] = useState(name);
  const [localBio, setLocalBio] = useState(bio);
  const [localUsername, setLocalUsername] = useState(username);
  const [localEmoji, setLocalEmoji] = useState(emoji);
  const [localCover, setLocalCover] = useState(coverIdx);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in pk-card p-5 w-[440px] max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="pk-title">Редактировать профиль</span>
          <button className="pk-icon-btn" onClick={onClose}>
            <Icon name="X" size={14} />
          </button>
        </div>

        {/* Cover picker */}
        <div className="mb-4">
          <div className="pk-label mb-2">Обложка</div>
          <div className="flex gap-2">
            {COVER_GRADIENTS.map((g, i) => (
              <button
                key={i}
                onClick={() => setLocalCover(i)}
                className="rounded-xl transition-all flex-1"
                style={{
                  height: 40,
                  background: g,
                  border: `2px solid ${localCover === i ? "var(--accent)" : "transparent"}`,
                  transform: localCover === i ? "scale(1.08)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Avatar emoji */}
        <div className="mb-4">
          <div className="pk-label mb-2">Эмодзи аватара</div>
          <div className="flex gap-2 flex-wrap">
            {EMOJI_OPTIONS.map((em) => (
              <button
                key={em}
                onClick={() => setLocalEmoji(em)}
                className="text-xl w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background:
                    localEmoji === em
                      ? "rgba(123,77,255,0.2)"
                      : "var(--surface)",
                  border: `1px solid ${localEmoji === em ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="pk-label mb-1.5">Имя</div>
            <input
              className="pk-input"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <div className="pk-label mb-1.5">Username</div>
            <input
              className="pk-input"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              placeholder="@username"
            />
          </div>
          <div>
            <div className="pk-label mb-1.5">О себе</div>
            <textarea
              className="pk-input resize-none"
              rows={3}
              value={localBio}
              onChange={(e) => setLocalBio(e.target.value)}
              placeholder="Расскажите о себе"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="pk-btn pk-btn-ghost flex-1" onClick={onClose}>
            Отмена
          </button>
          <button
            className="pk-btn pk-btn-primary flex-1"
            onClick={() =>
              onSave({
                name: localName,
                bio: localBio,
                username: localUsername,
                emoji: localEmoji,
                coverIdx: localCover,
              })
            }
          >
            <Icon name="Check" size={13} />
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function PostsGrid() {
  const colors = [
    "linear-gradient(135deg,#3b0a6e,#6d1b7b)",
    "linear-gradient(135deg,#0f2040,#1e3a6e)",
    "linear-gradient(135deg,#400a0a,#6e1b2a)",
    "linear-gradient(135deg,#064e3b,#065f46)",
    "linear-gradient(135deg,#1a1207,#3d2a0d)",
    "linear-gradient(135deg,#1a0533,#2d0a55)",
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {feedItems.slice(0, 9).map((item, i) => (
        <div
          key={item.id}
          className="rounded-xl overflow-hidden cursor-pointer group relative"
          style={{ height: 120, background: colors[i % colors.length] }}
        >
          <div className="absolute inset-0 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "linear-gradient(to top,rgba(0,0,0,0.6),transparent)" }}>
            <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
              <Icon name="Heart" size={11} />
              {item.likes}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MusicTab() {
  const [playing, setPlaying] = useState<number | null>(2);
  return (
    <div className="space-y-1">
      {tracks.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
          style={{
            background: playing === t.id ? "rgba(123,77,255,0.1)" : "transparent",
            border: `1px solid ${playing === t.id ? "rgba(123,77,255,0.25)" : "transparent"}`,
          }}
          onClick={() => setPlaying(t.id)}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--accent-grad)" }}
          >
            <Icon name={playing === t.id ? "Pause" : "Play"} size={16} style={{ color: "#fff" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
              {t.title}
            </div>
            <div className="text-xs" style={{ color: "var(--text-3)" }}>
              {t.artist}
            </div>
          </div>
          <span className="text-xs flex-shrink-0" style={{ color: "var(--text-4)" }}>
            {t.duration}
          </span>
        </div>
      ))}
    </div>
  );
}

function BoardsTab() {
  const cellColors = [
    ["#3b0a6e","#6d1b7b","#0f2040","#1e3a6e"],
    ["#400a0a","#6e1b2a","#064e3b","#065f46"],
    ["#1a0533","#2d0a55","#1a1207","#3d2a0d"],
    ["#0f172a","#1e3a5f","#3b0764","#6d1b7b"],
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {boards.map((b, i) => (
        <div key={b.id} className="pk-card pk-card-hover p-3 cursor-pointer">
          <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden mb-3" style={{ height: 80 }}>
            {cellColors[i % cellColors.length].map((c, ci) => (
              <div key={ci} style={{ background: c }} />
            ))}
          </div>
          <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{b.name}</div>
          <div className="pk-subtitle">{b.count} объектов</div>
        </div>
      ))}
    </div>
  );
}

function PortfolioTab() {
  const colors = [
    "linear-gradient(135deg,#1a0533,#2d0a55)",
    "linear-gradient(135deg,#0f2040,#1e3a6e)",
    "linear-gradient(135deg,#064e3b,#065f46)",
    "linear-gradient(135deg,#3b0a6e,#6d1b7b)",
    "linear-gradient(135deg,#400a0a,#6e1b2a)",
    "linear-gradient(135deg,#1a1207,#3d2a0d)",
  ];
  const items = ["Айдентика бренда", "UI Kit 2025", "Мобильное приложение", "Лендинг страница", "Иллюстрации", "Фотопроект"];
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((name, i) => (
        <div key={i} className="pk-card-hover rounded-xl overflow-hidden cursor-pointer group">
          <div className="flex items-center justify-center relative" style={{ height: 130, background: colors[i % colors.length] }}>
            <Icon name="Briefcase" size={36} style={{ color: "rgba(255,255,255,0.12)" }} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.3)" }}>
              <button className="pk-btn pk-btn-primary text-xs py-1.5 px-3">Смотреть</button>
            </div>
          </div>
          <div className="p-3" style={{ background: "var(--card)" }}>
            <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{name}</div>
            <div className="pk-subtitle mt-0.5">Дизайн</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StoriesTab({ onOpen }: { onOpen: (idx: number) => void }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {stories.map((s, i) => (
        <div
          key={s.id}
          className="cursor-pointer group"
          onClick={() => onOpen(i)}
        >
          <div
            className="pk-story-ring mb-2 block"
            style={{ width: "100%", borderRadius: 16 }}
          >
            <div
              className="rounded-xl overflow-hidden relative flex items-end"
              style={{
                height: 180,
                background: `linear-gradient(135deg,hsl(${(i * 47) % 360},60%,15%),hsl(${(i * 47 + 60) % 360},50%,10%))`,
                padding: 2,
              }}
            >
              <div className="absolute top-2 left-2">
                <Avatar name={s.user.name} size="xs" />
              </div>
              <div
                className="w-full px-2 pb-2 pt-6 text-xs font-semibold truncate"
                style={{
                  background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)",
                  color: "var(--text)",
                }}
              >
                {s.user.name}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function Profile() {
  const [activeTab, setActiveTab] = useState("Публикации");
  const [activeVersion, setActiveVersion] = useState("friends");
  const [storyViewerIdx, setStoryViewerIdx] = useState<number | null>(null);
  const [blockEditor, setBlockEditor] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [blocks, setBlocks] = useState(profileBlocks);

  // Persisted profile data
  const [profileName, setProfileName] = useState(
    () => localStorage.getItem("pk_profile_name") ?? currentUser.name
  );
  const [profileBio, setProfileBio] = useState(
    () => localStorage.getItem("pk_profile_bio") ?? currentUser.bio
  );
  const [profileUsername, setProfileUsername] = useState(
    () => localStorage.getItem("pk_profile_username") ?? currentUser.username
  );
  const [profileEmoji, setProfileEmoji] = useState(
    () => localStorage.getItem("pk_profile_emoji") ?? ""
  );
  const [coverIdx, setCoverIdx] = useState(
    () => Number(localStorage.getItem("pk_profile_cover") ?? 0)
  );

  const handleSave = (d: {
    name: string;
    bio: string;
    username: string;
    emoji: string;
    coverIdx: number;
  }) => {
    setProfileName(d.name);
    setProfileBio(d.bio);
    setProfileUsername(d.username);
    setProfileEmoji(d.emoji);
    setCoverIdx(d.coverIdx);
    localStorage.setItem("pk_profile_name", d.name);
    localStorage.setItem("pk_profile_bio", d.bio);
    localStorage.setItem("pk_profile_username", d.username);
    localStorage.setItem("pk_profile_emoji", d.emoji);
    localStorage.setItem("pk_profile_cover", String(d.coverIdx));
    setEditModal(false);
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Cover */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 220, background: COVER_GRADIENTS[coverIdx] }}
      >
        <div
          className="absolute inset-0"
          style={{ background: COVER_OVERLAYS[coverIdx] }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none"
        >
          <div
            className="rounded-full"
            style={{
              width: 320,
              height: 320,
              background: "var(--accent-grad)",
              filter: "blur(90px)",
            }}
          />
        </div>
        <button
          className="pk-btn pk-btn-ghost absolute top-4 right-4 text-xs"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setEditModal(true)}
        >
          <Icon name="Camera" size={12} />
          Обложка
        </button>
      </div>

      {/* Profile header card */}
      <div className="pk-card p-5">
        {/* Avatar row */}
        <div className="flex items-end gap-5">
          <div style={{ marginTop: -64 }} className="relative flex-shrink-0">
            <div
              style={{
                padding: 3,
                background: "var(--accent-grad)",
                borderRadius: "50%",
              }}
            >
              <div
                style={{
                  padding: 3,
                  background: "var(--card)",
                  borderRadius: "50%",
                }}
              >
                {profileEmoji ? (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                    style={{ background: "var(--surface)" }}
                  >
                    {profileEmoji}
                  </div>
                ) : (
                  <Avatar
                    name={profileName}
                    colorClass={currentUser.avatarColor}
                    size="2xl"
                  />
                )}
              </div>
            </div>
            <div
              className="pk-online absolute"
              style={{ bottom: 4, right: 4, width: 13, height: 13, border: "2px solid var(--card)" }}
            />
          </div>

          <div className="flex-1 pb-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h1
                className="text-xl font-black"
                style={{ color: "var(--text)" }}
              >
                {profileName}
              </h1>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent-grad)" }}
              >
                <Icon name="Check" size={10} style={{ color: "#fff" }} />
              </div>
            </div>
            <div className="text-sm mb-1" style={{ color: "var(--text-3)" }}>
              {profileUsername} · {currentUser.city}
            </div>
            <div
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              {profileBio}
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-1 flex-shrink-0">
            <div className="flex gap-2">
              <button className="pk-btn pk-btn-ghost text-xs">
                <Icon name="MessageCircle" size={13} />
                Написать
              </button>
              <button className="pk-btn pk-btn-primary text-xs">
                <Icon name="UserPlus" size={13} />
                Подписаться
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="pk-btn pk-btn-ghost text-xs flex-1 justify-center"
                onClick={() => setEditModal(true)}
              >
                <Icon name="Pencil" size={12} />
                Редактировать
              </button>
              <button
                className="pk-btn pk-btn-ghost text-xs flex-1 justify-center"
                onClick={() => setBlockEditor(true)}
              >
                <Icon name="LayoutGrid" size={12} />
                Блоки
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className="flex gap-6 mt-4 pt-4 flex-wrap"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {[
            { label: "Публикации", val: currentUser.posts },
            { label: "Друзья", val: currentUser.friends },
            { label: "Подписчики", val: currentUser.followers.toLocaleString() },
            { label: "Подписки", val: currentUser.following },
          ].map((s) => (
            <div key={s.label} className="cursor-pointer group">
              <div
                className="font-bold text-lg transition-colors group-hover:text-purple-300"
                style={{ color: "var(--text)" }}
              >
                {s.val}
              </div>
              <div className="pk-subtitle">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile versions */}
      <div className="pk-card p-4">
        <div className="pk-label mb-3">Версия профиля</div>
        <div className="flex gap-2 flex-wrap">
          {profileVersions.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVersion(v.id)}
              className="pk-btn text-xs"
              style={{
                background:
                  activeVersion === v.id
                    ? "var(--accent-grad)"
                    : "var(--surface)",
                color: activeVersion === v.id ? "#fff" : "var(--text-3)",
                border: `1px solid ${activeVersion === v.id ? "transparent" : "var(--border)"}`,
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div
          className="mt-3 px-3 py-2 rounded-xl text-xs"
          style={{ background: "rgba(123,77,255,0.08)", color: "var(--text-3)", border: "1px solid rgba(123,77,255,0.15)" }}
        >
          <span style={{ color: "var(--accent)" }}>
            {profileVersions.find((v) => v.id === activeVersion)?.label}
          </span>{" "}
          — настройте что видят эти люди на вашей странице
        </div>
      </div>

      {/* Tabs */}
      <div className="pk-card px-4 py-3">
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pk-tab flex-shrink-0 ${activeTab === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="pk-card p-4">
        {activeTab === "Публикации" && <PostsGrid />}
        {activeTab === "Музыка" && <MusicTab />}
        {activeTab === "Доски" && <BoardsTab />}
        {activeTab === "Портфолио" && <PortfolioTab />}
        {activeTab === "Истории" && (
          <StoriesTab onOpen={(idx) => setStoryViewerIdx(idx)} />
        )}
        {activeTab === "Фото" && (
          <div className="grid grid-cols-3 gap-2">
            {feedItems.filter((f) => f.type === "photo").map((item, i) => {
              const colors = [
                "linear-gradient(135deg,#3b0a6e,#6d1b7b)",
                "linear-gradient(135deg,#0f2040,#1e3a6e)",
                "linear-gradient(135deg,#400a0a,#6e1b2a)",
                "linear-gradient(135deg,#064e3b,#065f46)",
                "linear-gradient(135deg,#1a1207,#3d2a0d)",
                "linear-gradient(135deg,#1a0533,#2d0a55)",
              ];
              return (
                <div
                  key={item.id}
                  className="rounded-xl cursor-pointer"
                  style={{ height: 110, background: colors[i % colors.length] }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Active blocks */}
      {blocks.filter((b) => b.enabled).length > 0 && (
        <div className="pk-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="pk-title">Мои блоки</span>
            <button
              className="pk-btn pk-btn-ghost text-xs"
              onClick={() => setBlockEditor(true)}
            >
              <Icon name="Settings" size={12} />
              Настроить
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {blocks
              .filter((b) => b.enabled)
              .map((b) => (
                <div
                  key={b.id}
                  className="pk-card-hover flex items-center gap-3 p-3 rounded-xl"
                  style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(123,77,255,0.12)" }}
                  >
                    <Icon name={b.icon} size={16} style={{ color: "var(--accent)" }} />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-2)" }}
                  >
                    {b.label}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {storyViewerIdx !== null && (
        <StoryViewer
          initialIdx={storyViewerIdx}
          onClose={() => setStoryViewerIdx(null)}
        />
      )}
      {blockEditor && (
        <BlockEditorModal
          blocks={blocks}
          setBlocks={setBlocks}
          onClose={() => setBlockEditor(false)}
        />
      )}
      {editModal && (
        <EditProfileModal
          name={profileName}
          bio={profileBio}
          username={profileUsername}
          emoji={profileEmoji}
          coverIdx={coverIdx}
          onSave={handleSave}
          onClose={() => setEditModal(false)}
        />
      )}
    </div>
  );
}
