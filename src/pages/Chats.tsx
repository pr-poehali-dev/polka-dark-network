import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { chats, messages as initMessages, currentUser, stickers } from "@/data/mockData";

type Importance = "normal" | "important" | "urgent" | "silent" | "deadline";

interface Message {
  id: number;
  from: number;
  text: string;
  time: string;
  own: boolean;
  importance: Importance;
  saved: boolean;
  type?: "text" | "voice" | "video_circle" | "sticker" | "forwarded";
  duration?: string;
  reactions?: { emoji: string; count: number; own: boolean }[];
  replyTo?: number;
  deleted?: boolean;
  forwardedFrom?: string;
}

const REACTIONS = ["❤️", "😂", "😮", "😢", "😡", "👍", "🔥", "✨"];

const importanceConfig: Record<Importance, { label: string; color: string; icon: string; dot?: string }> = {
  normal: { label: "Обычное", color: "var(--text-secondary)", icon: "MessageCircle" },
  important: { label: "Важное", color: "#f59e0b", icon: "AlertCircle", dot: "#f59e0b" },
  urgent: { label: "Срочное", color: "#ef4444", icon: "Zap", dot: "#ef4444" },
  silent: { label: "Без звука", color: "var(--text-muted)", icon: "BellOff" },
  deadline: { label: "Ответить до…", color: "#8b5cf6", icon: "Clock", dot: "#8b5cf6" },
};

// ── CALL OVERLAY ────────────────────────────────────────────────
function CallOverlay({ type, user, onEnd }: { type: "audio" | "video"; user: (typeof chats)[0]["user"]; onEnd: () => void }) {
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="call-overlay animate-fade-in">
      <div className="flex flex-col items-center gap-6 text-center">
        {type === "video" && !camOff ? (
          <div className="relative w-80 h-56 rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1a0533, #0d0d2b)" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-20"><Icon name="Video" size={80} /></div>
            </div>
            <div className="absolute bottom-3 right-3 w-20 h-16 rounded-xl overflow-hidden"
              style={{ background: "rgba(139,92,246,0.3)", border: "2px solid rgba(139,92,246,0.5)" }}>
              <div className="w-full h-full flex items-center justify-center">
                <Avatar name={currentUser.name} size="sm" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div style={{ padding: 4, background: "var(--accent-gradient)", borderRadius: "50%" }}>
              <Avatar name={user.name} colorClass={user.avatarColor} size="xl" />
            </div>
          </div>
        )}

        <div>
          <div className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>{user.name}</div>
          <div className="text-sm" style={{ color: type === "audio" ? "#22c55e" : "var(--text-secondary)" }}>
            {type === "audio" ? "Аудиозвонок" : "Видеозвонок"} · {fmt(duration)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setMuted(!muted)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{ background: muted ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)", border: `1px solid ${muted ? "rgba(239,68,68,0.4)" : "var(--border-subtle)"}` }}>
            <Icon name={muted ? "MicOff" : "Mic"} size={22} style={{ color: muted ? "#f87171" : "#fff" }} />
          </button>

          {type === "video" && (
            <button onClick={() => setCamOff(!camOff)}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
              style={{ background: camOff ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)", border: `1px solid ${camOff ? "rgba(239,68,68,0.4)" : "var(--border-subtle)"}` }}>
              <Icon name={camOff ? "VideoOff" : "Video"} size={22} style={{ color: camOff ? "#f87171" : "#fff" }} />
            </button>
          )}

          <button onClick={onEnd}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 0 20px rgba(239,68,68,0.4)" }}>
            <Icon name="PhoneOff" size={26} style={{ color: "#fff" }} />
          </button>

          <button className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid var(--border-subtle)" }}>
            <Icon name="Speaker" size={22} style={{ color: "#fff" }} />
          </button>

          <button className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid var(--border-subtle)" }}>
            <Icon name="ScreenShare" size={22} style={{ color: "#fff" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── INCOMING CALL ────────────────────────────────────────────────
function IncomingCall({ type, user, onAccept, onDecline }: { type: "audio" | "video"; user: (typeof chats)[0]["user"]; onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="card p-4 flex items-center gap-3" style={{ background: "#12122e", border: "1px solid var(--border-accent)", boxShadow: "var(--shadow-elevated)", minWidth: 280 }}>
        <div className="relative">
          <Avatar name={user.name} colorClass={user.avatarColor} size="md" online />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{user.name}</div>
          <div className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
            <Icon name={type === "video" ? "Video" : "Phone"} size={11} />
            {type === "video" ? "Видеозвонок" : "Аудиозвонок"}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onDecline} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.35)" }}>
            <Icon name="PhoneOff" size={15} style={{ color: "#f87171" }} />
          </button>
          <button onClick={onAccept} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.35)" }}>
            <Icon name="Phone" size={15} style={{ color: "#4ade80" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── VOICE MESSAGE ────────────────────────────────────────────────
function VoiceMessage({ duration, own }: { duration: string; own: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const bars = [30, 50, 80, 60, 40, 70, 55, 45, 65, 75, 50, 35, 60, 80, 45, 55, 70, 40, 60, 50];
  return (
    <div className="voice-msg-bar flex items-center gap-2"
      style={{ background: own ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)" }}
      onClick={() => setPlaying(!playing)}>
      <button className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: own ? "rgba(255,255,255,0.2)" : "rgba(139,92,246,0.3)" }}>
        <Icon name={playing ? "Pause" : "Play"} size={13} style={{ color: "#fff" }} />
      </button>
      <div className="flex items-end gap-0.5 h-6 flex-1">
        {bars.map((h, i) => (
          <div key={i} className="wave-bar flex-shrink-0"
            style={{ height: `${h}%`, background: i / bars.length < progress / 100 ? (own ? "#fff" : "var(--accent-1)") : "rgba(255,255,255,0.25)" }} />
        ))}
      </div>
      <span className="text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.6)" }}>{duration}</span>
    </div>
  );
}

// ── VIDEO CIRCLE (кружок) ────────────────────────────────────────
function VideoCircle({ own }: { own: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="video-circle relative" style={{ width: 200, height: 200, background: "linear-gradient(135deg, #1a0533, #0d0d2b)", border: own ? "3px solid rgba(139,92,246,0.5)" : "3px solid rgba(255,255,255,0.15)" }}
        onClick={() => setPlaying(!playing)}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-900/60 to-pink-900/40">
          <Icon name="Video" size={40} style={{ color: "rgba(255,255,255,0.2)" }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
            <Icon name={playing ? "Pause" : "Play"} size={24} style={{ color: "#fff" }} />
          </div>
        </div>
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="97" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="3" strokeDasharray={`${playing ? 200 : 0} 610`} strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

// ── STICKER PANEL ────────────────────────────────────────────────
function StickerPanel({ onPick }: { onPick: (emoji: string) => void }) {
  const [tab, setTab] = useState<"stickers" | "create">("stickers");
  const [c1, setC1] = useState("🔥");
  const [c2, setC2] = useState("✨");
  return (
    <div className="card p-3 animate-scale-in" style={{ background: "#12122e", border: "1px solid var(--border-medium)", width: 290 }}>
      <div className="flex gap-1 mb-2.5">
        {[{ key: "stickers", label: "Стикеры" }, { key: "create", label: "Создать" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as "stickers" | "create")} className={`tab-item text-xs ${tab === t.key ? "active" : ""}`}>{t.label}</button>
        ))}
      </div>
      {tab === "stickers" && (
        <div className="grid grid-cols-6 gap-1">
          {stickers.map(s => (
            <button key={s.id} onClick={() => onPick(s.emoji)}
              className="text-2xl h-10 rounded-lg flex items-center justify-center hover:bg-white/8 transition-all">{s.emoji}</button>
          ))}
        </div>
      )}
      {tab === "create" && (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Объедините два эмодзи</p>
          <div className="flex items-center gap-2">
            {[c1, c2].map((v, i) => (
              <button key={i} className="flex-1 rounded-xl p-2 text-center text-3xl"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-subtle)" }}
                onClick={() => i === 0 ? setC1(stickers[Math.floor(Math.random() * stickers.length)].emoji) : setC2(stickers[Math.floor(Math.random() * stickers.length)].emoji)}>
                {v}
              </button>
            ))}
            <span style={{ color: "var(--text-muted)" }}>=</span>
            <button className="flex-1 rounded-xl p-2 text-center text-2xl" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }} onClick={() => onPick(c1 + c2)}>{c1 + c2}</button>
          </div>
          <button className="btn-primary w-full justify-center text-xs" onClick={() => onPick(c1 + c2)}>Добавить стикер</button>
        </div>
      )}
    </div>
  );
}

// ── CONTEXT MENU ────────────────────────────────────────────────
function CtxMenu({ msg, pos, onClose, onReply, onForward, onDelete, onReact, onSave }: {
  msg: Message; pos: { x: number; y: number };
  onClose: () => void; onReply: () => void; onForward: () => void;
  onDelete: (forAll: boolean) => void; onReact: (emoji: string) => void; onSave: () => void;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const left = Math.min(pos.x, window.innerWidth - 220);
  const top = Math.min(pos.y, window.innerHeight - 320);

  return (
    <div className="fixed inset-0 z-80" style={{ zIndex: 80 }} onClick={onClose}>
      <div className="ctx-menu" style={{ left, top }} onClick={e => e.stopPropagation()}>
        {/* Emoji reactions */}
        <div className="flex items-center gap-1 px-3 py-2.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          {REACTIONS.map(r => (
            <button key={r} onClick={() => { onReact(r); onClose(); }}
              className="text-xl hover:scale-125 transition-transform p-1 rounded-lg hover:bg-white/8">{r}</button>
          ))}
        </div>

        {[
          { icon: "Reply", label: "Ответить", action: () => { onReply(); onClose(); } },
          { icon: "Forward", label: "Переслать", action: () => { onForward(); onClose(); } },
          { icon: "Copy", label: "Копировать", action: () => { navigator.clipboard.writeText(msg.text); onClose(); } },
          { icon: "Pin", label: "Не потерять", action: () => { onSave(); onClose(); } },
          { icon: "Pencil", label: "Редактировать", action: onClose },
        ].map(item => (
          <div key={item.label} className="ctx-item" onClick={item.action}>
            <Icon name={item.icon} size={14} style={{ color: "var(--accent-1)" }} />
            {item.label}
          </div>
        ))}

        <div className="ctx-item danger" onClick={() => setShowDeleteConfirm(true)}>
          <Icon name="Trash2" size={14} style={{ color: "#f87171" }} />
          Удалить
        </div>
      </div>

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-90 flex items-center justify-center" style={{ zIndex: 90 }} onClick={e => e.stopPropagation()}>
          <div className="card p-5 animate-scale-in" style={{ background: "#12122e", boxShadow: "var(--shadow-elevated)", width: 300 }}>
            <div className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>Удалить сообщение?</div>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Выберите вариант удаления</p>
            <div className="flex flex-col gap-2">
              <button className="btn-ghost justify-center" onClick={() => { onDelete(false); onClose(); }}>
                Удалить у меня
              </button>
              {msg.own && (
                <button className="text-sm py-2 px-4 rounded-xl justify-center"
                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", display: "flex", alignItems: "center" }}
                  onClick={() => { onDelete(true); onClose(); }}>
                  Удалить у всех
                </button>
              )}
              <button className="btn-ghost justify-center" onClick={onClose}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FORWARD MODAL ────────────────────────────────────────────────
function ForwardModal({ msg, onClose }: { msg: Message; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="card p-5 w-80 animate-scale-in" style={{ background: "#12122e", boxShadow: "var(--shadow-elevated)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <span className="section-title text-sm">Переслать сообщение</span>
          <button className="btn-icon" onClick={onClose}><Icon name="X" size={14} /></button>
        </div>
        <div className="relative mb-3">
          <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input placeholder="Поиск контакта…" className="w-full pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }} />
        </div>
        <div className="space-y-1">
          {chats.map(c => (
            <button key={c.id} className="w-full flex items-center gap-3 p-2.5 rounded-xl glass-hover"
              onClick={() => { alert(`Переслано к ${c.user.name}`); onClose(); }}>
              <Avatar name={c.user.name} colorClass={c.user.avatarColor} size="sm" online={c.user.online} />
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>{c.user.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SAVE MESSAGE MODAL ────────────────────────────────────────────
const saveActions = [
  { id: "task", label: "Задача", icon: "CheckSquare", color: "#8b5cf6" },
  { id: "reminder", label: "Напоминание", icon: "Bell", color: "#ec4899" },
  { id: "note", label: "Заметка", icon: "StickyNote", color: "#f59e0b" },
  { id: "event", label: "Событие", icon: "Calendar", color: "#22c55e" },
  { id: "pin", label: "Закреп", icon: "Pin", color: "#06b6d4" },
];
function SaveMsgModal({ msg, onClose }: { msg: Message; onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-20" style={{ background: "rgba(0,0,0,0.65)" }} onClick={onClose}>
      <div className="card p-5 w-96 animate-slide-up" style={{ background: "#12122e", boxShadow: "var(--shadow-elevated)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <span className="section-title text-sm">Не потерять</span>
          <button className="btn-icon" onClick={onClose}><Icon name="X" size={14} /></button>
        </div>
        <p className="text-xs mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>«{msg.text}»</p>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {saveActions.map(a => (
            <button key={a.id} onClick={() => setSelected(a.id)}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all"
              style={{ background: selected === a.id ? `${a.color}22` : "rgba(255,255,255,0.04)", border: `1px solid ${selected === a.id ? a.color + "55" : "var(--border-subtle)"}` }}>
              <Icon name={a.icon} size={18} style={{ color: selected === a.id ? a.color : "var(--text-secondary)" }} />
              <span className="text-[10px] font-medium text-center" style={{ color: selected === a.id ? a.color : "var(--text-muted)" }}>{a.label}</span>
            </button>
          ))}
        </div>
        <button className="btn-primary w-full justify-center" onClick={onClose} disabled={!selected}>Сохранить</button>
      </div>
    </div>
  );
}

// ── MAIN CHATS PAGE ────────────────────────────────────────────
export default function Chats() {
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [input, setInput] = useState("");
  const [msgList, setMsgList] = useState<Message[]>(initMessages.map(m => ({
    ...m, importance: (m.importance || "normal") as Importance, reactions: [],
  })));
  const [showStickers, setShowStickers] = useState(false);
  const [importance, setImportance] = useState<Importance>("normal");
  const [showImportance, setShowImportance] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{ msg: Message; x: number; y: number } | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [forwardMsg, setForwardMsg] = useState<Message | null>(null);
  const [saveModal, setSaveModal] = useState<Message | null>(null);
  const [call, setCall] = useState<{ type: "audio" | "video"; active: boolean } | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ type: "audio" | "video" } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatSearch, setChatSearch] = useState("");

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgList]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingInterval.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
  };
  const stopRecording = (send = true) => {
    if (recordingInterval.current) clearInterval(recordingInterval.current);
    setIsRecording(false);
    if (send && recordingTime > 0) {
      const dur = `0:${String(recordingTime).padStart(2, "0")}`;
      setMsgList(prev => [...prev, { id: Date.now(), from: currentUser.id, text: `[Голосовое сообщение ${dur}]`, time: "сейчас", own: true, importance: "normal", saved: false, type: "voice", duration: dur, reactions: [] }]);
    }
    setRecordingTime(0);
  };

  const sendVideoCircle = () => {
    setMsgList(prev => [...prev, { id: Date.now(), from: currentUser.id, text: "[Видеокружок]", time: "сейчас", own: true, importance: "normal", saved: false, type: "video_circle", reactions: [] }]);
  };

  const send = (text?: string) => {
    const t = text ?? input;
    if (!t.trim()) return;
    const newMsg: Message = {
      id: Date.now(), from: currentUser.id, text: t, time: "сейчас",
      own: true, importance, saved: false, reactions: [],
      replyTo: replyTo?.id,
    };
    setMsgList(prev => [...prev, newMsg]);
    setInput(""); setImportance("normal"); setShowStickers(false); setReplyTo(null);
  };

  const addReaction = (msgId: number, emoji: string) => {
    setMsgList(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing = (m.reactions ?? []).find(r => r.emoji === emoji);
      if (existing) {
        return { ...m, reactions: (m.reactions ?? []).map(r => r.emoji === emoji ? { ...r, count: r.own ? r.count - 1 : r.count + 1, own: !r.own } : r).filter(r => r.count > 0) };
      }
      return { ...m, reactions: [...(m.reactions ?? []), { emoji, count: 1, own: true }] };
    }));
  };

  const deleteMsg = (msgId: number, forAll: boolean) => {
    setMsgList(prev => prev.map(m => m.id === msgId ? { ...m, deleted: true, text: forAll ? "Сообщение удалено" : "Сообщение удалено у вас" } : m));
  };

  const getReplyMsg = (id?: number) => id ? msgList.find(m => m.id === id) : null;

  const importanceBorder = (imp: Importance) => {
    if (imp === "important") return { borderLeft: "2px solid #f59e0b" };
    if (imp === "urgent") return { borderLeft: "2px solid #ef4444" };
    return {};
  };

  const filteredChats = chatSearch ? chats.filter(c => c.user.name.toLowerCase().includes(chatSearch.toLowerCase())) : chats;

  return (
    <div className="flex h-[calc(100vh-90px)] gap-0 animate-fade-in" onClick={() => setCtxMenu(null)}>
      {/* Chat list */}
      <div className="flex flex-col flex-shrink-0 rounded-l-2xl overflow-hidden"
        style={{ width: 290, background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)" }}>
        <div className="p-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="section-title">Сообщения</span>
            <div className="flex gap-1">
              <button className="btn-icon w-7 h-7"><Icon name="PenSquare" size={13} /></button>
              <button className="btn-icon w-7 h-7"><Icon name="Filter" size={13} /></button>
            </div>
          </div>
          <div className="relative">
            <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input value={chatSearch} onChange={e => setChatSearch(e.target.value)} placeholder="Поиск…"
              className="w-full pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => {
            const imp = (chat.importance || "normal") as Importance;
            const cfg = importanceConfig[imp];
            return (
              <button key={chat.id} onClick={() => setActiveChat(chat)}
                className="w-full flex items-center gap-3 px-3.5 py-3 transition-all text-left"
                style={{ background: activeChat.id === chat.id ? "rgba(139,92,246,0.1)" : "transparent", borderLeft: `2px solid ${activeChat.id === chat.id ? "var(--accent-1)" : "transparent"}` }}>
                <Avatar name={chat.user.name} colorClass={chat.user.avatarColor} size="md" online={chat.user.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{chat.user.name}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {cfg.dot && <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />}
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{chat.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{chat.lastMsg}</span>
                    {chat.unread > 0 && (
                      <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "var(--accent-gradient)", color: "#fff" }}>{chat.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col rounded-r-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderLeft: "none" }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <Avatar name={activeChat.user.name} colorClass={activeChat.user.avatarColor} size="md" online={activeChat.user.online} />
          <div className="flex-1">
            <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{activeChat.user.name}</div>
            <div className="text-xs" style={{ color: activeChat.user.online ? "#22c55e" : "var(--text-muted)" }}>
              {activeChat.user.online ? "онлайн" : "был недавно"}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Simulate incoming call button */}
            <button className="btn-icon" title="Аудиозвонок"
              onClick={() => { setIncomingCall(null); setCall({ type: "audio", active: true }); }}>
              <Icon name="Phone" size={15} />
            </button>
            <button className="btn-icon" title="Видеозвонок"
              onClick={() => { setIncomingCall(null); setCall({ type: "video", active: true }); }}>
              <Icon name="Video" size={15} />
            </button>
            <button className="btn-icon" onClick={() => setSearchOpen(!searchOpen)}><Icon name="Search" size={15} /></button>
            <button className="btn-icon"><Icon name="MoreVertical" size={15} /></button>
          </div>
        </div>

        {/* Search in chat */}
        {searchOpen && (
          <div className="px-4 py-2 animate-fade-in" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="relative">
              <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input placeholder="Поиск по сообщениям…" className="w-full pl-8 pr-3 py-1.5 rounded-xl text-sm outline-none"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }} />
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {msgList.map(msg => {
            const replyMsg = getReplyMsg(msg.replyTo);
            const isDeleted = msg.deleted;
            return (
              <div key={msg.id} className={`flex ${msg.own ? "justify-end" : "justify-start"} group`}>
                {!msg.own && (
                  <div className="mr-2 flex-shrink-0 self-end">
                    <Avatar name={activeChat.user.name} colorClass={activeChat.user.avatarColor} size="xs" />
                  </div>
                )}

                <div className="max-w-[65%]" onContextMenu={e => { e.preventDefault(); if (!isDeleted) setCtxMenu({ msg, x: e.clientX, y: e.clientY }); }}>
                  {/* Reply preview */}
                  {replyMsg && (
                    <div className={`text-xs px-3 py-1.5 rounded-xl mb-1 ${msg.own ? "ml-auto" : ""}`}
                      style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)", maxWidth: "100%", borderLeft: "2px solid var(--accent-1)" }}>
                      <span className="font-semibold" style={{ color: "#d8b4fe" }}>
                        {replyMsg.own ? currentUser.name : activeChat.user.name}
                      </span>
                      <div className="truncate" style={{ color: "var(--text-secondary)" }}>{replyMsg.text}</div>
                    </div>
                  )}

                  {/* Message bubble */}
                  {msg.type === "voice" ? (
                    <div style={{ ...importanceBorder(msg.importance) }}>
                      <VoiceMessage duration={msg.duration ?? "0:05"} own={msg.own} />
                    </div>
                  ) : msg.type === "video_circle" ? (
                    <VideoCircle own={msg.own} />
                  ) : (
                    <div className="px-3.5 py-2.5 rounded-2xl text-sm"
                      style={{
                        ...importanceBorder(msg.importance),
                        ...(msg.own ? { background: "var(--accent-gradient)", color: "#fff", borderBottomRightRadius: 6 }
                          : { background: "rgba(255,255,255,0.07)", color: isDeleted ? "var(--text-muted)" : "var(--text-primary)", border: "1px solid var(--border-subtle)", borderBottomLeftRadius: 6 }),
                        ...(isDeleted ? { fontStyle: "italic", opacity: 0.6 } : {})
                      }}>
                      {msg.importance !== "normal" && !isDeleted && (
                        <div className="flex items-center gap-1 mb-1 text-[10px]" style={{ color: importanceConfig[msg.importance]?.dot ?? "inherit" }}>
                          <Icon name={importanceConfig[msg.importance]?.icon ?? "Circle"} size={10} />
                          {importanceConfig[msg.importance]?.label}
                        </div>
                      )}
                      {msg.forwardedFrom && (
                        <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: msg.own ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}>
                          <Icon name="CornerUpRight" size={9} />Переслано от {msg.forwardedFrom}
                        </div>
                      )}
                      <span>{msg.text}</span>
                      <div className={`text-[10px] mt-1 flex items-center gap-1 ${msg.own ? "justify-end" : ""}`}
                        style={{ color: msg.own ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}>
                        {msg.time}
                        {msg.own && <Icon name="CheckCheck" size={10} style={{ color: "rgba(255,255,255,0.5)" }} />}
                      </div>
                    </div>
                  )}

                  {/* Reactions */}
                  {(msg.reactions ?? []).length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${msg.own ? "justify-end" : "justify-start"}`}>
                      {(msg.reactions ?? []).map(r => (
                        <button key={r.emoji} onClick={() => addReaction(msg.id, r.emoji)}
                          className={`reaction-pill ${r.own ? "own" : ""}`}>
                          {r.emoji}<span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick reply on hover */}
                {!isDeleted && (
                  <div className={`self-end mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.own ? "mr-2 order-first" : "ml-2"}`}>
                    <button onClick={() => setReplyTo(msg)}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-subtle)" }}>
                      <Icon name="Reply" size={11} style={{ color: "var(--text-secondary)" }} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply preview bar */}
        {replyTo && (
          <div className="px-4 py-2 flex items-center gap-3 animate-fade-in" style={{ borderTop: "1px solid var(--border-subtle)", background: "rgba(139,92,246,0.07)" }}>
            <div className="flex-1 min-w-0" style={{ borderLeft: "2px solid var(--accent-1)", paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: "#d8b4fe" }}>
                {replyTo.own ? currentUser.name : activeChat.user.name}
              </div>
              <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{replyTo.text}</div>
            </div>
            <button className="btn-icon w-6 h-6" onClick={() => setReplyTo(null)}><Icon name="X" size={12} /></button>
          </div>
        )}

        {/* Recording bar */}
        {isRecording && (
          <div className="px-4 py-2 flex items-center gap-3 animate-fade-in" style={{ borderTop: "1px solid var(--border-subtle)", background: "rgba(239,68,68,0.07)" }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 recording-btn" />
            <div className="flex items-end gap-0.5 h-4">
              {[...Array(5)].map((_, i) => <div key={i} className="wave-bar" style={{ height: "100%" }} />)}
            </div>
            <span className="text-sm flex-1 font-semibold" style={{ color: "#f87171" }}>
              0:{String(recordingTime).padStart(2, "0")}
            </span>
            <button className="btn-ghost text-xs text-red-400 border-red-500/30" onClick={() => stopRecording(false)}>Отмена</button>
            <button className="btn-primary text-xs px-3 py-1.5" onClick={() => stopRecording(true)}>Отправить</button>
          </div>
        )}

        {/* Sticker picker */}
        {showStickers && (
          <div className="px-4 pb-2 animate-fade-in">
            <StickerPanel onPick={emoji => { send(emoji); setShowStickers(false); }} />
          </div>
        )}

        {/* Importance selector */}
        {showImportance && (
          <div className="px-4 pb-2 flex gap-2 flex-wrap animate-fade-in">
            {(Object.keys(importanceConfig) as Importance[]).map(key => {
              const cfg = importanceConfig[key];
              return (
                <button key={key} onClick={() => { setImportance(key); setShowImportance(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all"
                  style={importance === key
                    ? { background: `${cfg.dot ?? "rgba(139,92,246,0.2)"}22`, borderColor: cfg.dot ?? "var(--accent-1)", color: cfg.dot ?? "#d8b4fe" }
                    : { background: "transparent", borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                  <Icon name={cfg.icon} size={12} style={{ color: cfg.color }} />{cfg.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Input */}
        <div className="p-3.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className="flex items-end gap-2">
            <div className="flex gap-1">
              <button className="btn-icon" onClick={() => { setShowStickers(!showStickers); setShowImportance(false); }}
                style={showStickers ? { borderColor: "var(--accent-1)", color: "var(--accent-1)" } : {}}>
                <Icon name="Smile" size={15} />
              </button>
              <button className="btn-icon" onClick={() => { setShowImportance(!showImportance); setShowStickers(false); }}
                style={importance !== "normal" ? { borderColor: importanceConfig[importance].dot, color: importanceConfig[importance].dot } : {}}>
                <Icon name={importanceConfig[importance].icon} size={15} />
              </button>
              <button className="btn-icon"><Icon name="Paperclip" size={15} /></button>
              <button className="btn-icon" onClick={sendVideoCircle} title="Видеокружок">
                <Icon name="Circle" size={15} />
              </button>
            </div>

            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Написать сообщение…" rows={1}
              className="flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif", maxHeight: 100 }} />

            {input.trim() ? (
              <button onClick={() => send()} className="btn-icon"
                style={{ background: "var(--accent-gradient)", borderColor: "transparent", color: "#fff", width: 38, height: 38, borderRadius: "var(--radius-sm)" }}>
                <Icon name="Send" size={15} />
              </button>
            ) : (
              <button
                className={`btn-icon ${isRecording ? "recording-btn" : ""}`}
                style={isRecording ? { background: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.5)", color: "#f87171" } : {}}
                onMouseDown={startRecording}
                onMouseUp={() => stopRecording(true)}
                onMouseLeave={() => isRecording && stopRecording(false)}
                title="Удерживайте для записи">
                <Icon name="Mic" size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Call overlay */}
      {call?.active && (
        <CallOverlay type={call.type} user={activeChat.user} onEnd={() => setCall(null)} />
      )}

      {/* Incoming call */}
      {incomingCall && !call?.active && (
        <IncomingCall type={incomingCall.type} user={activeChat.user}
          onAccept={() => { setCall({ type: incomingCall.type, active: true }); setIncomingCall(null); }}
          onDecline={() => setIncomingCall(null)} />
      )}

      {/* Simulate incoming call button (demo) */}
      <button
        className="fixed bottom-24 right-6 btn-ghost text-xs"
        style={{ zIndex: 30 }}
        onClick={() => setIncomingCall({ type: "video" })}>
        Входящий звонок
      </button>

      {/* Context menu */}
      {ctxMenu && (
        <CtxMenu msg={ctxMenu.msg} pos={{ x: ctxMenu.x, y: ctxMenu.y }}
          onClose={() => setCtxMenu(null)}
          onReply={() => setReplyTo(ctxMenu.msg)}
          onForward={() => setForwardMsg(ctxMenu.msg)}
          onDelete={(forAll) => deleteMsg(ctxMenu.msg.id, forAll)}
          onReact={(emoji) => addReaction(ctxMenu.msg.id, emoji)}
          onSave={() => setSaveModal(ctxMenu.msg)} />
      )}

      {forwardMsg && <ForwardModal msg={forwardMsg} onClose={() => setForwardMsg(null)} />}
      {saveModal && <SaveMsgModal msg={saveModal} onClose={() => setSaveModal(null)} />}
    </div>
  );
}
