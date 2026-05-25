import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type MouseEvent,
} from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import {
  chats as initialChats,
  messages as seedMessages,
  stickers,
  currentUser,
  users,
} from "@/data/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type Importance = "normal" | "important" | "urgent" | "silent" | "deadline";
type MsgStatus = "sending" | "sent" | "delivered" | "read";
type MsgType = "text" | "voice" | "video_circle" | "sticker";

interface Reaction {
  emoji: string;
  count: number;
  own: boolean;
}

interface Message {
  id: number;
  from: number;
  text: string;
  time: string;
  own: boolean;
  importance: Importance;
  saved: boolean;
  type: MsgType;
  duration?: string;
  reactions?: Reaction[];
  replyToId?: number;
  status: MsgStatus;
  deleted?: boolean;
  sticker?: string;
}

interface Chat {
  id: number;
  user: (typeof users)[0];
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  importance: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const REACTIONS = ["❤️", "😂", "😮", "😢", "😡", "👍", "🔥", "✨"];

const IMPORTANCE_CONFIG: Record<
  Importance,
  { label: string; color: string; icon: string; dotColor?: string }
> = {
  normal: { label: "Обычное", color: "var(--text-3)", icon: "MessageCircle" },
  important: {
    label: "Важное",
    color: "var(--warning)",
    icon: "AlertCircle",
    dotColor: "var(--warning)",
  },
  urgent: {
    label: "Срочное",
    color: "var(--error)",
    icon: "Zap",
    dotColor: "var(--error)",
  },
  silent: { label: "Без звука", color: "var(--text-4)", icon: "BellOff" },
  deadline: {
    label: "Дедлайн",
    color: "var(--accent)",
    icon: "Clock",
    dotColor: "var(--accent)",
  },
};

const SAVE_TYPES = [
  { id: "task", icon: "CheckSquare", label: "Задача" },
  { id: "reminder", icon: "Bell", label: "Напоминание" },
  { id: "note", icon: "FileText", label: "Заметка" },
  { id: "event", icon: "Calendar", label: "Событие" },
  { id: "pin", icon: "Pin", label: "Закрепить" },
];

const WAVE_HEIGHTS = [30, 55, 80, 60, 40, 72, 55, 45, 68, 75, 50, 35, 62, 80, 45, 58, 72, 42, 64, 50];

function seedToMessages(raw: typeof seedMessages): Message[] {
  return raw.map((m, i) => ({
    ...m,
    type: "text" as MsgType,
    importance: m.importance as Importance,
    status: m.own
      ? i === raw.length - 1
        ? "delivered"
        : "read"
      : "read",
    reactions:
      m.id === 3
        ? [{ emoji: "❤️", count: 2, own: false }]
        : m.id === 5
        ? [
            { emoji: "🔥", count: 1, own: true },
            { emoji: "😂", count: 3, own: false },
          ]
        : undefined,
  }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Status icon for own messages
function MsgStatusIcon({ status }: { status: MsgStatus }) {
  if (status === "sending")
    return <Icon name="Clock" size={11} style={{ color: "rgba(255,255,255,0.5)" }} />;
  if (status === "sent")
    return <Icon name="Check" size={11} style={{ color: "rgba(255,255,255,0.6)" }} />;
  if (status === "delivered")
    return <Icon name="CheckCheck" size={11} style={{ color: "rgba(255,255,255,0.6)" }} />;
  return <Icon name="CheckCheck" size={11} style={{ color: "var(--accent)" }} />;
}

// Voice message bubble
function VoiceMessage({ duration, own, playing, onToggle }: {
  duration: string;
  own: boolean;
  playing: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-2xl cursor-pointer select-none"
      style={{
        background: own ? "rgba(255,255,255,0.12)" : "var(--surface)",
        border: own ? "none" : "1px solid var(--border)",
        minWidth: 200,
      }}
      onClick={onToggle}
    >
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: own ? "rgba(255,255,255,0.22)" : "var(--accent-grad)" }}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        <Icon name={playing ? "Pause" : "Play"} size={13} style={{ color: "#fff" }} />
      </button>
      <div className="flex items-end gap-px flex-1" style={{ height: 28 }}>
        {WAVE_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="pk-wave-bar"
            style={{
              height: `${h}%`,
              background:
                i < (playing ? 10 : 0)
                  ? own
                    ? "rgba(255,255,255,0.9)"
                    : "var(--accent)"
                  : own
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(255,255,255,0.2)",
              animationPlayState: playing ? "running" : "paused",
            }}
          />
        ))}
      </div>
      <span
        className="text-[11px] flex-shrink-0 font-medium"
        style={{ color: own ? "rgba(255,255,255,0.65)" : "var(--text-3)" }}
      >
        {duration}
      </span>
    </div>
  );
}

// Video circle message
function VideoCircle({ own }: { own: boolean }) {
  const [playing, setPlaying] = useState(false);
  const circumference = 2 * Math.PI * 94;
  return (
    <div className="relative inline-block" style={{ width: 200, height: 200 }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#1a0533,#2d1060)",
          border: `3px solid ${own ? "var(--accent)" : "var(--border-md)"}`,
        }}
      >
        <Icon name="Video" size={52} style={{ color: "rgba(255,255,255,0.12)" }} />
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center transition-opacity"
          style={{ background: "rgba(0,0,0,0.35)", opacity: playing ? 0 : 1 }}
        >
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-grad)", boxShadow: "0 0 20px rgba(123,77,255,0.45)" }}
            onClick={() => setPlaying((p) => !p)}
          >
            <Icon name={playing ? "Pause" : "Play"} size={22} style={{ color: "#fff" }} />
          </button>
        </div>
      </div>
      {/* SVG progress ring */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={200}
        height={200}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={100}
          cy={100}
          r={94}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={playing ? circumference * 0.4 : circumference}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.4s" }}
        />
      </svg>
    </div>
  );
}

// ─── Context Menu ─────────────────────────────────────────────────────────────

function ContextMenu({
  x,
  y,
  msg,
  onClose,
  onReact,
  onReply,
  onForward,
  onCopy,
  onSave,
  onDelete,
}: {
  x: number;
  y: number;
  msg: Message;
  onClose: () => void;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onForward: () => void;
  onCopy: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Clamp to viewport
  const clampedX = Math.min(x, window.innerWidth - 210);
  const clampedY = Math.min(y, window.innerHeight - 380);

  return (
    <div
      ref={ref}
      className="pk-ctx animate-scale-in"
      style={{ left: clampedX, top: clampedY }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Emoji reactions row */}
      <div
        className="flex items-center gap-1 px-3 py-2"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {REACTIONS.map((em) => (
          <button
            key={em}
            className="text-xl w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:scale-125"
            style={{ background: "transparent" }}
            onClick={() => { onReact(em); onClose(); }}
          >
            {em}
          </button>
        ))}
      </div>
      {/* Actions */}
      <button className="pk-ctx-item w-full" onClick={() => { onReply(); onClose(); }}>
        <Icon name="CornerUpLeft" size={14} /> Ответить
      </button>
      <button className="pk-ctx-item w-full" onClick={() => { onForward(); onClose(); }}>
        <Icon name="Forward" size={14} /> Переслать
      </button>
      <button className="pk-ctx-item w-full" onClick={() => { onCopy(); onClose(); }}>
        <Icon name="Copy" size={14} /> Копировать
      </button>
      <button className="pk-ctx-item w-full" onClick={() => { onSave(); onClose(); }}>
        <Icon name="Bookmark" size={14} /> Не потерять
      </button>
      {msg.own && (
        <button className="pk-ctx-item w-full" onClick={() => { onClose(); }}>
          <Icon name="Pencil" size={14} /> Изменить
        </button>
      )}
      <div style={{ height: 1, background: "var(--border)", margin: "2px 0" }} />
      <button className="pk-ctx-item danger w-full" onClick={() => { onDelete(); onClose(); }}>
        <Icon name="Trash2" size={14} /> Удалить
      </button>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({
  isOwn,
  onDeleteOwn,
  onDeleteAll,
  onCancel,
}: {
  isOwn: boolean;
  onDeleteOwn: () => void;
  onDeleteAll: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="pk-modal-bg" onClick={onCancel}>
      <div
        className="animate-scale-in pk-card p-5 w-72"
        style={{ boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pk-title mb-1">Удалить сообщение?</div>
        <p className="pk-subtitle mb-4">Выберите, для кого удалить сообщение</p>
        <div className="flex flex-col gap-2">
          <button className="pk-btn pk-btn-ghost w-full" onClick={onDeleteOwn}>
            <Icon name="User" size={14} /> Удалить у меня
          </button>
          {isOwn && (
            <button
              className="pk-btn w-full"
              style={{ background: "var(--error)", color: "#fff" }}
              onClick={onDeleteAll}
            >
              <Icon name="Users" size={14} /> Удалить у всех
            </button>
          )}
          <button className="pk-btn pk-btn-ghost w-full" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Forward Modal ────────────────────────────────────────────────────────────

function ForwardModal({
  chats,
  onForward,
  onClose,
}: {
  chats: Chat[];
  onForward: (chatId: number) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [sent, setSent] = useState<number | null>(null);
  const filtered = chats.filter((c) =>
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="pk-modal-bg" onClick={onClose}>
      <div
        className="animate-scale-in pk-card w-80 overflow-hidden"
        style={{ boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-4 pt-4 pb-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="pk-title">Переслать</span>
          <button className="pk-icon-btn" onClick={onClose}>
            <Icon name="X" size={14} />
          </button>
        </div>
        <div className="px-3 py-2">
          <input
            className="pk-input"
            placeholder="Поиск контактов…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
          {filtered.map((c) => (
            <button
              key={c.id}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors"
              style={{
                background: sent === c.id ? "rgba(123,77,255,0.1)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (sent !== c.id)
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (sent !== c.id)
                  (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
              onClick={() => {
                setSent(c.id);
                onForward(c.id);
                setTimeout(onClose, 700);
              }}
            >
              <Avatar name={c.user.name} colorClass={c.user.avatarColor} size="sm" online={c.online} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                  {c.user.name}
                </div>
                <div className="pk-subtitle truncate">{c.lastMsg}</div>
              </div>
              {sent === c.id && (
                <Icon name="Check" size={16} style={{ color: "var(--accent)" }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Save Modal ───────────────────────────────────────────────────────────────

function SaveModal({ onClose }: { onClose: () => void }) {
  const [chosen, setChosen] = useState<string | null>(null);
  return (
    <div className="pk-modal-bg" onClick={onClose}>
      <div
        className="animate-scale-in pk-card p-5 w-72"
        style={{ boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="pk-title">Не потерять</span>
          <button className="pk-icon-btn" onClick={onClose}>
            <Icon name="X" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {SAVE_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setChosen(t.id)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all"
              style={{
                background:
                  chosen === t.id ? "rgba(123,77,255,0.15)" : "var(--surface)",
                border: `1px solid ${chosen === t.id ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              <Icon
                name={t.icon}
                size={20}
                style={{ color: chosen === t.id ? "var(--accent)" : "var(--text-3)" }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: chosen === t.id ? "var(--accent)" : "var(--text-4)" }}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
        <button
          className="pk-btn pk-btn-primary w-full"
          disabled={!chosen}
          onClick={onClose}
        >
          <Icon name="Bookmark" size={13} /> Сохранить
        </button>
      </div>
    </div>
  );
}

// ─── Sticker Panel ────────────────────────────────────────────────────────────

function StickerPanel({
  onSend,
  onClose,
}: {
  onSend: (emoji: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"stickers" | "create">("stickers");
  const [emoji1, setEmoji1] = useState("🔥");
  const [emoji2, setEmoji2] = useState("✨");

  return (
    <div
      className="animate-slide-up pk-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-lg)" }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center gap-1 px-3 pt-3 pb-2"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <button
          className={`pk-tab text-xs ${tab === "stickers" ? "active" : ""}`}
          onClick={() => setTab("stickers")}
        >
          Стикеры
        </button>
        <button
          className={`pk-tab text-xs ${tab === "create" ? "active" : ""}`}
          onClick={() => setTab("create")}
        >
          Создать
        </button>
        <button className="pk-icon-btn ml-auto" style={{ width: 28, height: 28 }} onClick={onClose}>
          <Icon name="X" size={13} />
        </button>
      </div>

      {tab === "stickers" && (
        <div className="grid grid-cols-6 gap-1 p-3">
          {stickers.map((s) => (
            <button
              key={s.id}
              className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-125"
              style={{ background: "transparent" }}
              onClick={() => { onSend(s.emoji); onClose(); }}
              title={s.label}
            >
              {s.emoji}
            </button>
          ))}
        </div>
      )}

      {tab === "create" && (
        <div className="p-4 flex flex-col items-center gap-3">
          <div className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
            Объедините два эмодзи
          </div>
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-4 gap-1">
              {stickers.slice(0, 8).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setEmoji1(s.emoji)}
                  className="text-xl w-9 h-9 flex items-center justify-center rounded-xl"
                  style={{
                    background: emoji1 === s.emoji ? "rgba(123,77,255,0.2)" : "var(--surface)",
                    border: `1px solid ${emoji1 === s.emoji ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {s.emoji}
                </button>
              ))}
            </div>
            <div
              className="text-3xl w-14 h-14 rounded-2xl flex items-center justify-center select-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {emoji1}{emoji2}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {stickers.slice(0, 8).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setEmoji2(s.emoji)}
                  className="text-xl w-9 h-9 flex items-center justify-center rounded-xl"
                  style={{
                    background: emoji2 === s.emoji ? "rgba(123,77,255,0.2)" : "var(--surface)",
                    border: `1px solid ${emoji2 === s.emoji ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {s.emoji}
                </button>
              ))}
            </div>
          </div>
          <button
            className="pk-btn pk-btn-primary text-sm"
            onClick={() => { onSend(emoji1 + emoji2); onClose(); }}
          >
            <Icon name="Send" size={13} /> Отправить стикер
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Importance Selector ──────────────────────────────────────────────────────

function ImportanceSelector({
  value,
  onChange,
  onClose,
}: {
  value: Importance;
  onChange: (v: Importance) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="animate-slide-up pk-card p-3"
      style={{ boxShadow: "var(--shadow-lg)" }}
    >
      <div
        className="flex items-center justify-between mb-2"
      >
        <span className="pk-label">Важность сообщения</span>
        <button className="pk-icon-btn" style={{ width: 26, height: 26 }} onClick={onClose}>
          <Icon name="X" size={12} />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {(Object.entries(IMPORTANCE_CONFIG) as [Importance, typeof IMPORTANCE_CONFIG[Importance]][]).map(
          ([key, cfg]) => (
            <button
              key={key}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: value === key ? "rgba(123,77,255,0.1)" : "transparent",
                color: value === key ? cfg.color : "var(--text-3)",
                border: `1px solid ${value === key ? "rgba(123,77,255,0.25)" : "transparent"}`,
              }}
              onClick={() => { onChange(key); onClose(); }}
            >
              <Icon name={cfg.icon} size={15} style={{ color: cfg.color }} />
              {cfg.label}
              {value === key && (
                <Icon name="Check" size={13} style={{ color: "var(--accent)", marginLeft: "auto" }} />
              )}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ─── Call Overlay ─────────────────────────────────────────────────────────────

function CallOverlay({
  type,
  user,
  onEnd,
}: {
  type: "audio" | "video";
  user: (typeof users)[0];
  onEnd: () => void;
}) {
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="pk-call animate-fade-in" style={{ flexDirection: "column", gap: 40 }}>
      {/* Blurred gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%,rgba(123,77,255,0.18) 0%,transparent 70%)",
        }}
      />

      {/* Video frame */}
      {type === "video" && !camOff ? (
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ width: 360, height: 240, background: "var(--surface)", border: "1px solid var(--border-md)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="Video" size={72} style={{ color: "rgba(255,255,255,0.06)" }} />
          </div>
          {/* Self view PiP */}
          <div
            className="absolute bottom-3 right-3 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ width: 90, height: 68, background: "rgba(123,77,255,0.2)", border: "2px solid rgba(123,77,255,0.4)" }}
          >
            <Avatar name={currentUser.name} colorClass={currentUser.avatarColor} size="sm" />
          </div>
        </div>
      ) : (
        <div
          className="relative"
          style={{ padding: 4, background: "var(--accent-grad)", borderRadius: "50%", display: "inline-block" }}
        >
          <div style={{ padding: 3, background: "var(--bg)", borderRadius: "50%" }}>
            <Avatar name={user.name} colorClass={user.avatarColor} size="xl" />
          </div>
        </div>
      )}

      {/* Name & timer */}
      <div className="text-center">
        <div
          className="text-2xl font-black mb-1"
          style={{ color: "var(--text)" }}
        >
          {user.name}
        </div>
        <div
          className="text-sm font-medium"
          style={{ color: "var(--online)" }}
        >
          {type === "audio" ? "Аудиозвонок" : "Видеозвонок"} · {fmt(duration)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{
              background: muted ? "rgba(255,92,92,0.18)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${muted ? "var(--error)" : "var(--border-md)"}`,
            }}
            onClick={() => setMuted((m) => !m)}
          >
            <Icon
              name={muted ? "MicOff" : "Mic"}
              size={22}
              style={{ color: muted ? "var(--error)" : "var(--text)" }}
            />
          </button>
          <span className="text-[10px]" style={{ color: "var(--text-4)" }}>
            {muted ? "Вкл. микр." : "Откл. микр."}
          </span>
        </div>

        {type === "video" && (
          <div className="flex flex-col items-center gap-1.5">
            <button
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
              style={{
                background: camOff ? "rgba(255,92,92,0.18)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${camOff ? "var(--error)" : "var(--border-md)"}`,
              }}
              onClick={() => setCamOff((c) => !c)}
            >
              <Icon
                name={camOff ? "VideoOff" : "Video"}
                size={22}
                style={{ color: camOff ? "var(--error)" : "var(--text)" }}
              />
            </button>
            <span className="text-[10px]" style={{ color: "var(--text-4)" }}>
              Камера
            </span>
          </div>
        )}

        {/* Hang up */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "var(--error)",
              boxShadow: "0 0 24px rgba(255,92,92,0.4)",
            }}
            onClick={onEnd}
          >
            <Icon name="PhoneOff" size={26} style={{ color: "#fff" }} />
          </button>
          <span className="text-[10px]" style={{ color: "var(--text-4)" }}>
            Завершить
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{
              background: speaker ? "rgba(123,77,255,0.18)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${speaker ? "var(--accent)" : "var(--border-md)"}`,
            }}
            onClick={() => setSpeaker((s) => !s)}
          >
            <Icon
              name={speaker ? "Volume2" : "VolumeX"}
              size={22}
              style={{ color: speaker ? "var(--accent)" : "var(--text)" }}
            />
          </button>
          <span className="text-[10px]" style={{ color: "var(--text-4)" }}>
            Динамик
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid var(--border-md)",
            }}
          >
            <Icon name="ScreenShare" size={22} style={{ color: "var(--text)" }} />
          </button>
          <span className="text-[10px]" style={{ color: "var(--text-4)" }}>
            Экран
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Incoming Call Card ────────────────────────────────────────────────────────

function IncomingCall({
  type,
  user,
  onAccept,
  onDecline,
}: {
  type: "audio" | "video";
  user: (typeof users)[0];
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className="pk-card flex items-center gap-3 px-4 py-3"
        style={{
          minWidth: 290,
          boxShadow: "var(--shadow-lg), 0 0 0 1px var(--border-accent)",
        }}
      >
        <Avatar name={user.name} colorClass={user.avatarColor} size="md" online />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {user.name}
          </div>
          <div className="flex items-center gap-1 pk-subtitle">
            <Icon name={type === "video" ? "Video" : "Phone"} size={11} />
            Входящий {type === "video" ? "видеозвонок" : "аудиозвонок"}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,92,92,0.15)", border: "1px solid rgba(255,92,92,0.3)" }}
            onClick={onDecline}
          >
            <Icon name="PhoneOff" size={15} style={{ color: "var(--error)" }} />
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(39,228,139,0.15)", border: "1px solid rgba(39,228,139,0.3)" }}
            onClick={onAccept}
          >
            <Icon name="Phone" size={15} style={{ color: "var(--online)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Chat Modal ────────────────────────────────────────────────────────

function CreateChatModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (chat: Chat) => void;
}) {
  const [tab, setTab] = useState<"personal" | "group" | "channel">("personal");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    const target = users.find((u) => u.id === selected[0]) ?? users[0];
    const newChat: Chat = {
      id: Date.now(),
      user: target,
      lastMsg:
        tab === "channel"
          ? `Канал создан`
          : tab === "group"
          ? `Беседа «${groupName || "Без названия"}» создана`
          : "Начните переписку",
      time: "сейчас",
      unread: 0,
      online: target.online,
      importance: "normal",
    };
    onCreate(newChat);
    onClose();
  };

  const canCreate =
    (tab === "personal" && selected.length === 1) ||
    (tab === "group" && selected.length >= 2 && groupName.trim()) ||
    (tab === "channel" && groupName.trim());

  const TAB_LABELS: Record<typeof tab, string> = {
    personal: "Личный чат",
    group: "Беседа",
    channel: "Канал",
  };

  return (
    <div className="pk-modal-bg" onClick={onClose}>
      <div
        className="animate-scale-in pk-card w-96 overflow-hidden"
        style={{ boxShadow: "var(--shadow-lg)", maxHeight: "80vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="pk-title">Новый чат</span>
          <button className="pk-icon-btn" onClick={onClose}>
            <Icon name="X" size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-3 pt-3 flex-shrink-0">
          {(["personal", "group", "channel"] as const).map((t) => (
            <button
              key={t}
              className={`pk-tab text-xs flex-1 justify-center ${tab === t ? "active" : ""}`}
              onClick={() => { setTab(t); setSelected([]); }}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="px-3 py-2 flex-shrink-0">
          <input
            className="pk-input"
            placeholder="Поиск пользователей…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Group/channel name */}
        {(tab === "group" || tab === "channel") && (
          <div className="px-3 pb-2 flex-shrink-0">
            <input
              className="pk-input"
              placeholder={tab === "group" ? "Название беседы…" : "Название канала…"}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        )}

        {/* Channel privacy */}
        {tab === "channel" && (
          <div
            className="mx-3 mb-2 px-3 py-2 rounded-xl flex items-center justify-between flex-shrink-0"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-2)" }}>
              <Icon name={isPrivate ? "Lock" : "Globe"} size={14} />
              {isPrivate ? "Приватный канал" : "Публичный канал"}
            </div>
            <button
              className="relative rounded-full transition-all"
              style={{ width: 38, height: 21, background: isPrivate ? "var(--accent-grad)" : "rgba(255,255,255,0.1)", flexShrink: 0 }}
              onClick={() => setIsPrivate((p) => !p)}
            >
              <div
                className="absolute top-0.5 rounded-full bg-white transition-all"
                style={{ width: 16, height: 16, left: isPrivate ? "calc(100% - 18px)" : "3px" }}
              />
            </button>
          </div>
        )}

        {/* User list */}
        <div className="overflow-y-auto flex-1">
          {filtered.map((u) => {
            const isSelected = selected.includes(u.id);
            return (
              <button
                key={u.id}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors"
                style={{ background: isSelected ? "rgba(123,77,255,0.08)" : "transparent" }}
                onClick={() =>
                  tab === "personal"
                    ? setSelected([u.id])
                    : toggleUser(u.id)
                }
              >
                <Avatar name={u.name} colorClass={u.avatarColor} size="sm" online={u.online} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    {u.name}
                  </div>
                  <div className="pk-subtitle truncate">{u.bio}</div>
                </div>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: isSelected ? "var(--accent-grad)" : "transparent",
                    border: `2px solid ${isSelected ? "var(--accent)" : "var(--border-md)"}`,
                  }}
                >
                  {isSelected && <Icon name="Check" size={11} style={{ color: "#fff" }} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Create button */}
        <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            className="pk-btn pk-btn-primary w-full"
            disabled={!canCreate}
            onClick={handleCreate}
          >
            <Icon name="Plus" size={14} />
            {TAB_LABELS[tab] === "Личный чат" ? "Начать чат" : `Создать ${TAB_LABELS[tab].toLowerCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Chats Component ─────────────────────────────────────────────────────

export default function Chats() {
  // ── State ──────────────────────────────────────────────────────
  const [chatList, setChatList] = useState<Chat[]>(
    initialChats.map((c) => ({ ...c, importance: c.importance as string }))
  );
  const [activeChatId, setActiveChatId] = useState<number>(initialChats[0].id);
  const [msgMap, setMsgMap] = useState<Record<number, Message[]>>(() => {
    const base = seedToMessages(seedMessages);
    return { [initialChats[0].id]: base };
  });
  const [searchChat, setSearchChat] = useState("");
  const [inputText, setInputText] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [importance, setImportance] = useState<Importance>("normal");
  const [showStickers, setShowStickers] = useState(false);
  const [showImportance, setShowImportance] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [playingVoice, setPlayingVoice] = useState<number | null>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; msg: Message } | null>(null);
  const [deleteModal, setDeleteModal] = useState<Message | null>(null);
  const [forwardModal, setForwardModal] = useState<Message | null>(null);
  const [saveModal, setSaveModal] = useState(false);
  const [callState, setCallState] = useState<{ type: "audio" | "video"; user: (typeof users)[0] } | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ type: "audio" | "video"; user: (typeof users)[0] } | null>(null);
  const [showCreateChat, setShowCreateChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeChat = chatList.find((c) => c.id === activeChatId)!;
  const messages = msgMap[activeChatId] ?? [];

  // ── Helpers ────────────────────────────────────────────────────

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Close context menu on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCtxMenu(null);
        setShowStickers(false);
        setShowImportance(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openChat = (chatId: number) => {
    setActiveChatId(chatId);
    setReplyTo(null);
    setShowStickers(false);
    setShowImportance(false);
    // Mark as read
    setChatList((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c))
    );
    // Seed messages if not present
    if (!msgMap[chatId]) {
      const seeded = seedToMessages(seedMessages).map((m) => ({
        ...m,
        id: m.id + chatId * 100,
      }));
      setMsgMap((prev) => ({ ...prev, [chatId]: seeded }));
    }
  };

  const pushMessage = (partial: Omit<Message, "id" | "time" | "status" | "own" | "from">) => {
    const newMsg: Message = {
      ...partial,
      id: Date.now(),
      from: currentUser.id,
      own: true,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
    };
    setMsgMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), newMsg],
    }));
    // Simulate delivery
    setTimeout(() => {
      setMsgMap((prev) => ({
        ...prev,
        [activeChatId]: (prev[activeChatId] ?? []).map((m) =>
          m.id === newMsg.id ? { ...m, status: "delivered" } : m
        ),
      }));
    }, 1200);
    setChatList((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, lastMsg: partial.text || (partial.type === "voice" ? "🎤 Голосовое" : "📹 Кружок"), time: newMsg.time }
          : c
      )
    );
    setReplyTo(null);
    setImportance("normal");
    setTimeout(scrollToBottom, 80);
  };

  const sendText = () => {
    const text = inputText.trim();
    if (!text) return;
    pushMessage({ text, type: "text", importance, saved: false, replyToId: replyTo?.id });
    setInputText("");
    textareaRef.current?.focus();
  };

  const sendSticker = (emoji: string) => {
    pushMessage({ text: emoji, type: "sticker", importance: "normal", saved: false, sticker: emoji });
  };

  const sendVoice = () => {
    pushMessage({
      text: "",
      type: "voice",
      importance: "normal",
      saved: false,
      duration: `0:${String(recSeconds).padStart(2, "0")}`,
    });
  };

  const sendVideoCircle = () => {
    pushMessage({ text: "", type: "video_circle", importance: "normal", saved: false });
  };

  const startRecording = () => {
    setRecording(true);
    setRecSeconds(0);
    recTimerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
  };

  const stopRecording = (send: boolean) => {
    setRecording(false);
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    if (send) sendVoice();
    setRecSeconds(0);
  };

  const addReaction = (msgId: number, emoji: string) => {
    setMsgMap((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] ?? []).map((m) => {
        if (m.id !== msgId) return m;
        const existing = m.reactions ?? [];
        const idx = existing.findIndex((r) => r.emoji === emoji);
        let updated: Reaction[];
        if (idx >= 0) {
          updated = existing.map((r, i) =>
            i === idx ? { ...r, count: r.own ? r.count - 1 : r.count + 1, own: !r.own } : r
          ).filter((r) => r.count > 0);
        } else {
          updated = [...existing, { emoji, count: 1, own: true }];
        }
        return { ...m, reactions: updated };
      }),
    }));
  };

  const deleteMessage = (msgId: number, _forAll: boolean) => {
    setMsgMap((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] ?? []).map((m) =>
        m.id === msgId ? { ...m, deleted: true, text: "" } : m
      ),
    }));
  };

  const filteredChats = chatList.filter((c) =>
    c.user.name.toLowerCase().includes(searchChat.toLowerCase())
  );

  const totalUnread = chatList.reduce((sum, c) => sum + c.unread, 0);

  const handleContextMenu = (e: MouseEvent, msg: Message) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, msg });
  };

  const importanceDotColor = (imp: string) => {
    if (imp === "important") return "var(--warning)";
    if (imp === "urgent") return "var(--error)";
    if (imp === "deadline") return "var(--accent)";
    return null;
  };

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div
      className="animate-fade-in flex overflow-hidden"
      style={{
        height: "calc(100vh - var(--topbar-h) - 24px)",
        background: "var(--bg)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
      }}
    >
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{
          width: 290,
          borderRight: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        {/* Panel header */}
        <div
          className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="relative flex-1">
            <Icon
              name="Search"
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-4)" }}
            />
            <input
              className="pk-input"
              style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, fontSize: 12 }}
              placeholder="Поиск…"
              value={searchChat}
              onChange={(e) => setSearchChat(e.target.value)}
            />
          </div>
          <button
            className="pk-icon-btn flex-shrink-0"
            title="Новый чат"
            onClick={() => setShowCreateChat(true)}
          >
            <Icon name="Plus" size={15} />
          </button>
          {totalUnread > 0 && (
            <span className="pk-badge" style={{ position: "static", marginLeft: -4 }}>
              {totalUnread}
            </span>
          )}
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const dotColor = importanceDotColor(chat.importance);
            return (
              <button
                key={chat.id}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-left transition-colors relative"
                style={{
                  background: isActive ? "rgba(123,77,255,0.1)" : "transparent",
                  borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
                onClick={() => openChat(chat.id)}
              >
                <Avatar
                  name={chat.user.name}
                  colorClass={chat.user.avatarColor}
                  size="md"
                  online={chat.online}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className="text-sm font-semibold truncate"
                      style={{ color: isActive ? "var(--text)" : "var(--text-2)" }}
                    >
                      {chat.user.name}
                    </span>
                    <span
                      className="text-[10px] flex-shrink-0 ml-1"
                      style={{ color: "var(--text-4)" }}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {dotColor && (
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: dotColor }}
                      />
                    )}
                    <span
                      className="text-xs truncate flex-1"
                      style={{ color: "var(--text-4)" }}
                    >
                      {chat.lastMsg}
                    </span>
                    {chat.unread > 0 && (
                      <span
                        className="flex-shrink-0 flex items-center justify-center text-[10px] font-bold rounded-full"
                        style={{
                          background: "var(--accent-grad)",
                          color: "#fff",
                          minWidth: 17,
                          height: 17,
                          padding: "0 4px",
                        }}
                      >
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CENTER PANEL ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeChat && (
          <>
            {/* Chat header */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}
            >
              <Avatar
                name={activeChat.user.name}
                colorClass={activeChat.user.avatarColor}
                size="sm"
                online={activeChat.online}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {activeChat.user.name}
                </div>
                <div className="pk-subtitle flex items-center gap-1">
                  {activeChat.online ? (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--online)" }} />
                      <span style={{ color: "var(--online)" }}>в сети</span>
                    </>
                  ) : (
                    "был(а) давно"
                  )}
                </div>
              </div>
              <button
                className="pk-icon-btn"
                title="Аудиозвонок"
                onClick={() => setCallState({ type: "audio", user: activeChat.user })}
              >
                <Icon name="Phone" size={15} />
              </button>
              <button
                className="pk-icon-btn"
                title="Видеозвонок"
                onClick={() => setCallState({ type: "video", user: activeChat.user })}
              >
                <Icon name="Video" size={15} />
              </button>
              <button className="pk-icon-btn" title="Поиск">
                <Icon name="Search" size={15} />
              </button>
              <button
                className="pk-icon-btn"
                title="Входящий (демо)"
                onClick={() =>
                  setIncomingCall({ type: "audio", user: users[1] })
                }
              >
                <Icon name="MoreHorizontal" size={15} />
              </button>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4"
              style={{ background: "var(--bg)" }}
            >
              {/* Date divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: "var(--text-4)", background: "var(--surface)" }}>
                  Сегодня
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              {messages.map((msg) => {
                if (msg.deleted) {
                  return (
                    <div
                      key={msg.id}
                      className={`flex mb-2 ${msg.own ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs italic"
                        style={{ background: "var(--surface)", color: "var(--text-4)", border: "1px solid var(--border)" }}
                      >
                        <Icon name="Trash2" size={11} />
                        Сообщение удалено
                      </div>
                    </div>
                  );
                }

                const replySource = msg.replyToId
                  ? messages.find((m) => m.id === msg.replyToId)
                  : null;

                return (
                  <div
                    key={msg.id}
                    className={`flex mb-1 ${msg.own ? "justify-end" : "justify-start"}`}
                    onContextMenu={(e) => handleContextMenu(e, msg)}
                  >
                    <div style={{ maxWidth: "70%" }}>
                      {/* Reply quote */}
                      {replySource && (
                        <div
                          className={`mb-1 px-2 py-1 rounded-xl text-xs border-l-2 ${msg.own ? "ml-auto" : ""}`}
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            borderLeftColor: "var(--accent)",
                            color: "var(--text-3)",
                            maxWidth: "100%",
                          }}
                        >
                          <div className="font-semibold mb-0.5" style={{ color: "var(--accent)" }}>
                            {replySource.own ? currentUser.name : activeChat.user.name}
                          </div>
                          <div className="truncate">{replySource.text}</div>
                        </div>
                      )}

                      {/* Bubble */}
                      {msg.type === "sticker" ? (
                        <div
                          className={`flex items-end gap-1.5 ${msg.own ? "flex-row-reverse" : ""}`}
                        >
                          <div className="text-5xl select-none">{msg.sticker ?? msg.text}</div>
                          <div
                            className="flex items-center gap-1 text-[10px] flex-shrink-0 mb-0.5"
                            style={{ color: "var(--text-4)" }}
                          >
                            {msg.time}
                            {msg.own && <MsgStatusIcon status={msg.status} />}
                          </div>
                        </div>
                      ) : msg.type === "voice" ? (
                        <div className={`flex items-end gap-1.5 ${msg.own ? "flex-row-reverse" : ""}`}>
                          <VoiceMessage
                            duration={msg.duration ?? "0:05"}
                            own={msg.own}
                            playing={playingVoice === msg.id}
                            onToggle={() =>
                              setPlayingVoice((p) => (p === msg.id ? null : msg.id))
                            }
                          />
                          <div
                            className="flex items-center gap-1 text-[10px] flex-shrink-0 mb-0.5"
                            style={{ color: "var(--text-4)" }}
                          >
                            {msg.time}
                            {msg.own && <MsgStatusIcon status={msg.status} />}
                          </div>
                        </div>
                      ) : msg.type === "video_circle" ? (
                        <div className={`flex items-end gap-1.5 ${msg.own ? "flex-row-reverse" : ""}`}>
                          <VideoCircle own={msg.own} />
                          <div
                            className="flex items-center gap-1 text-[10px] flex-shrink-0 mb-2"
                            style={{ color: "var(--text-4)" }}
                          >
                            {msg.time}
                            {msg.own && <MsgStatusIcon status={msg.status} />}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`px-3 py-2 text-sm leading-relaxed ${msg.own ? "pk-msg-own" : "pk-msg-other"}`}
                        >
                          {msg.text}
                          <div
                            className={`flex items-center gap-1 mt-0.5 text-[10px] ${msg.own ? "justify-end" : "justify-start"}`}
                            style={{ color: msg.own ? "rgba(255,255,255,0.55)" : "var(--text-4)" }}
                          >
                            {msg.own && IMPORTANCE_CONFIG[msg.importance].dotColor && (
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: IMPORTANCE_CONFIG[msg.importance].dotColor }}
                              />
                            )}
                            {msg.time}
                            {msg.own && <MsgStatusIcon status={msg.status} />}
                          </div>
                        </div>
                      )}

                      {/* Reactions */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div
                          className={`flex flex-wrap gap-1 mt-1 ${msg.own ? "justify-end" : "justify-start"}`}
                        >
                          {msg.reactions.map((r) => (
                            <button
                              key={r.emoji}
                              className={`pk-reaction ${r.own ? "own" : ""}`}
                              onClick={() => addReaction(msg.id, r.emoji)}
                            >
                              {r.emoji}
                              <span className="text-xs" style={{ color: r.own ? "var(--accent)" : "var(--text-3)" }}>
                                {r.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* ── INPUT AREA ──────────────────────────────────── */}
            <div
              className="flex-shrink-0"
              style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}
            >
              {/* Sticker panel */}
              {showStickers && (
                <div className="px-3 pt-2">
                  <StickerPanel onSend={sendSticker} onClose={() => setShowStickers(false)} />
                </div>
              )}

              {/* Importance selector */}
              {showImportance && (
                <div className="px-3 pt-2">
                  <ImportanceSelector
                    value={importance}
                    onChange={setImportance}
                    onClose={() => setShowImportance(false)}
                  />
                </div>
              )}

              {/* Reply bar */}
              {replyTo && !recording && (
                <div
                  className="flex items-center gap-2 px-4 py-2 border-l-2"
                  style={{ borderLeftColor: "var(--accent)", background: "rgba(123,77,255,0.06)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--accent)" }}>
                      {replyTo.own ? currentUser.name : activeChat.user.name}
                    </div>
                    <div className="text-xs truncate" style={{ color: "var(--text-3)" }}>
                      {replyTo.text}
                    </div>
                  </div>
                  <button
                    className="pk-icon-btn flex-shrink-0"
                    style={{ width: 26, height: 26 }}
                    onClick={() => setReplyTo(null)}
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              )}

              {/* Recording bar */}
              {recording ? (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 pk-record-pulse"
                    style={{ background: "var(--error)" }}
                  />
                  <div className="flex items-end gap-px flex-1" style={{ height: 28 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="pk-wave-bar" style={{ height: `${40 + i * 10}%` }} />
                    ))}
                  </div>
                  <span className="text-sm font-mono flex-shrink-0" style={{ color: "var(--error)" }}>
                    0:{String(recSeconds).padStart(2, "0")}
                  </span>
                  <button
                    className="pk-btn pk-btn-ghost text-xs flex-shrink-0"
                    onClick={() => stopRecording(false)}
                  >
                    <Icon name="X" size={12} /> Отмена
                  </button>
                  <button
                    className="pk-btn pk-btn-primary text-xs flex-shrink-0"
                    onClick={() => stopRecording(true)}
                  >
                    <Icon name="Send" size={12} /> Отправить
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-2 px-3 py-3">
                  {/* Sticker toggle */}
                  <button
                    className={`pk-icon-btn flex-shrink-0 ${showStickers ? "active" : ""}`}
                    onClick={() => { setShowStickers((s) => !s); setShowImportance(false); }}
                    title="Стикеры"
                  >
                    <Icon name="Smile" size={16} />
                  </button>

                  {/* Importance */}
                  <button
                    className={`pk-icon-btn flex-shrink-0 ${showImportance ? "active" : ""}`}
                    onClick={() => { setShowImportance((s) => !s); setShowStickers(false); }}
                    title="Важность"
                    style={
                      importance !== "normal"
                        ? { borderColor: IMPORTANCE_CONFIG[importance].dotColor ?? "var(--border)" }
                        : {}
                    }
                  >
                    <Icon
                      name={IMPORTANCE_CONFIG[importance].icon}
                      size={15}
                      style={{
                        color:
                          importance !== "normal"
                            ? IMPORTANCE_CONFIG[importance].color
                            : "var(--text-3)",
                      }}
                    />
                  </button>

                  {/* Attachment */}
                  <button className="pk-icon-btn flex-shrink-0" title="Вложение">
                    <Icon name="Paperclip" size={16} />
                  </button>

                  {/* Video circle */}
                  <button
                    className="pk-icon-btn flex-shrink-0"
                    title="Видеокружок"
                    onClick={sendVideoCircle}
                  >
                    <Icon name="CircleDot" size={16} />
                  </button>

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    className="pk-input flex-1 resize-none"
                    rows={1}
                    style={{
                      paddingTop: 8,
                      paddingBottom: 8,
                      lineHeight: "1.5",
                      maxHeight: 120,
                      overflowY: "auto",
                    }}
                    placeholder="Написать сообщение…"
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendText();
                      }
                    }}
                  />

                  {/* Mic / Send */}
                  {inputText.trim() ? (
                    <button
                      className="pk-icon-btn flex-shrink-0 active"
                      style={{ background: "var(--accent-grad)", border: "none", color: "#fff" }}
                      onClick={sendText}
                      title="Отправить"
                    >
                      <Icon name="Send" size={16} />
                    </button>
                  ) : (
                    <button
                      className="pk-icon-btn flex-shrink-0"
                      title="Запись голосового"
                      onMouseDown={startRecording}
                      onMouseUp={() => stopRecording(true)}
                      onMouseLeave={() => { if (recording) stopRecording(false); }}
                    >
                      <Icon name="Mic" size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── CONTEXT MENU ───────────────────────────────────────── */}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          msg={ctxMenu.msg}
          onClose={() => setCtxMenu(null)}
          onReact={(emoji) => addReaction(ctxMenu.msg.id, emoji)}
          onReply={() => setReplyTo(ctxMenu.msg)}
          onForward={() => setForwardModal(ctxMenu.msg)}
          onCopy={() => navigator.clipboard.writeText(ctxMenu.msg.text)}
          onSave={() => setSaveModal(true)}
          onDelete={() => setDeleteModal(ctxMenu.msg)}
        />
      )}

      {/* ── MODALS ─────────────────────────────────────────────── */}
      {deleteModal && (
        <DeleteModal
          isOwn={deleteModal.own}
          onDeleteOwn={() => { deleteMessage(deleteModal.id, false); setDeleteModal(null); }}
          onDeleteAll={() => { deleteMessage(deleteModal.id, true); setDeleteModal(null); }}
          onCancel={() => setDeleteModal(null)}
        />
      )}
      {forwardModal && (
        <ForwardModal
          chats={chatList}
          onForward={(_chatId) => {}}
          onClose={() => setForwardModal(null)}
        />
      )}
      {saveModal && <SaveModal onClose={() => setSaveModal(false)} />}
      {showCreateChat && (
        <CreateChatModal
          onClose={() => setShowCreateChat(false)}
          onCreate={(chat) => {
            setChatList((prev) => [chat, ...prev]);
            setActiveChatId(chat.id);
          }}
        />
      )}

      {/* ── CALL OVERLAY ───────────────────────────────────────── */}
      {callState && (
        <CallOverlay
          type={callState.type}
          user={callState.user}
          onEnd={() => setCallState(null)}
        />
      )}

      {/* ── INCOMING CALL ──────────────────────────────────────── */}
      {incomingCall && (
        <IncomingCall
          type={incomingCall.type}
          user={incomingCall.user}
          onAccept={() => {
            setCallState(incomingCall);
            setIncomingCall(null);
          }}
          onDecline={() => setIncomingCall(null)}
        />
      )}
    </div>
  );
}