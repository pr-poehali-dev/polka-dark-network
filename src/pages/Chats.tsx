import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { chats, messages, currentUser, stickers } from "@/data/mockData";

type Importance = "normal" | "important" | "urgent" | "silent" | "deadline";
type SaveAction = "task" | "reminder" | "note" | "event" | "pin";

interface Message {
  id: number;
  from: number;
  text: string;
  time: string;
  own: boolean;
  importance: string;
  saved: boolean;
  sticker?: string;
  deadline?: string;
}

const importanceConfig: Record<Importance, { label: string; color: string; icon: string; dot?: string }> = {
  normal: { label: "Обычное", color: "var(--text-secondary)", icon: "MessageCircle" },
  important: { label: "Важное", color: "#f59e0b", icon: "AlertCircle", dot: "#f59e0b" },
  urgent: { label: "Срочное", color: "#ef4444", icon: "Zap", dot: "#ef4444" },
  silent: { label: "Без звука", color: "var(--text-muted)", icon: "BellOff" },
  deadline: { label: "Ответить до…", color: "#8b5cf6", icon: "Clock", dot: "#8b5cf6" },
};

const saveActions: { id: SaveAction; label: string; icon: string; color: string }[] = [
  { id: "task", label: "Задача", icon: "CheckSquare", color: "#8b5cf6" },
  { id: "reminder", label: "Напоминание", icon: "Bell", color: "#ec4899" },
  { id: "note", label: "Заметка", icon: "StickyNote", color: "#f59e0b" },
  { id: "event", label: "Событие", icon: "Calendar", color: "#22c55e" },
  { id: "pin", label: "Закреп", icon: "Pin", color: "#06b6d4" },
];

// Sticker picker panel
function StickerPanel({ onPick }: { onPick: (emoji: string) => void }) {
  const [tab, setTab] = useState<"stickers" | "create">("stickers");
  const [combo1, setCombo1] = useState("🔥");
  const [combo2, setCombo2] = useState("✨");

  return (
    <div className="card animate-scale-in p-3" style={{ background: "#10102a", border: "1px solid var(--border-medium)", width: 300 }}>
      <div className="flex gap-1 mb-3">
        {[
          { key: "stickers", label: "Стикеры" },
          { key: "create", label: "Создать" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as "stickers" | "create")}
            className={`tab-item text-xs ${tab === t.key ? "active" : ""}`}>{t.label}</button>
        ))}
      </div>

      {tab === "stickers" && (
        <div className="grid grid-cols-6 gap-1">
          {stickers.map(s => (
            <button key={s.id} onClick={() => onPick(s.emoji)}
              className="sticker text-2xl flex items-center justify-center h-10 rounded-lg transition-all hover:bg-white/8">
              {s.emoji}
            </button>
          ))}
        </div>
      )}

      {tab === "create" && (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Объедините два эмодзи в один стикер</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl p-2 text-center text-3xl cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-subtle)" }}>
              {combo1}
            </div>
            <span style={{ color: "var(--text-muted)" }}>+</span>
            <div className="flex-1 rounded-xl p-2 text-center text-3xl cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-subtle)" }}>
              {combo2}
            </div>
            <span style={{ color: "var(--text-muted)" }}>=</span>
            <button onClick={() => onPick(combo1 + combo2)}
              className="flex-1 rounded-xl p-2 text-center text-2xl"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.35)" }}>
              {combo1 + combo2}
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {stickers.slice(0, 12).map(s => (
              <button key={s.id}
                className="text-xl flex items-center justify-center h-9 rounded-lg hover:bg-white/8 transition-all"
                onClick={() => { setCombo1(s.emoji); }}>
                {s.emoji}
              </button>
            ))}
          </div>
          <button className="btn-primary w-full justify-center text-sm" onClick={() => onPick(combo1 + combo2)}>
            <Icon name="Plus" size={13} />Добавить в мои стикеры
          </button>
        </div>
      )}
    </div>
  );
}

// Save message modal
function SaveMsgModal({ msg, onClose }: { msg: Message; onClose: () => void }) {
  const [selected, setSelected] = useState<SaveAction | null>(null);
  const [deadline, setDeadline] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-20" style={{ background: "rgba(0,0,0,0.65)" }} onClick={onClose}>
      <div className="animate-slide-up card p-5 w-96" style={{ background: "#10102a", boxShadow: "var(--shadow-elevated)" }} onClick={e => e.stopPropagation()}>
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
              <span className="text-[10px] font-medium" style={{ color: selected === a.id ? a.color : "var(--text-muted)" }}>{a.label}</span>
            </button>
          ))}
        </div>
        {selected === "reminder" && (
          <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none mb-3"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }} />
        )}
        <button className="btn-primary w-full justify-center" onClick={onClose} disabled={!selected}>
          <Icon name="Check" size={13} />Сохранить{selected ? ` как «${saveActions.find(a => a.id === selected)?.label}»` : ""}
        </button>
      </div>
    </div>
  );
}

export default function Chats() {
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [input, setInput] = useState("");
  const [msgList, setMsgList] = useState<Message[]>(messages);
  const [showStickers, setShowStickers] = useState(false);
  const [importance, setImportance] = useState<Importance>("normal");
  const [showImportance, setShowImportance] = useState(false);
  const [saveModal, setSaveModal] = useState<Message | null>(null);
  const [contextMenu, setContextMenu] = useState<{ msg: Message; x: number; y: number } | null>(null);

  const send = (text?: string) => {
    const t = text ?? input;
    if (!t.trim()) return;
    setMsgList(prev => [...prev, {
      id: prev.length + 1,
      from: currentUser.id,
      text: t,
      time: "сейчас",
      own: true,
      importance,
      saved: false,
    }]);
    setInput("");
    setImportance("normal");
    setShowStickers(false);
  };

  const sendSticker = (emoji: string) => send(emoji);

  const importanceBorderStyle = (imp: string) => {
    if (imp === "important") return { borderLeft: "2px solid #f59e0b" };
    if (imp === "urgent") return { borderLeft: "2px solid #ef4444" };
    if (imp === "silent") return { opacity: 0.65 };
    if (imp === "deadline") return { borderLeft: "2px solid #8b5cf6" };
    return {};
  };

  return (
    <div className="flex h-[calc(100vh-90px)] gap-0 animate-fade-in">
      {/* Chat list */}
      <div className="card rounded-r-none flex flex-col" style={{ width: 300, flexShrink: 0, borderRight: "1px solid var(--border-subtle)" }}>
        <div className="p-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="section-title mb-3">Сообщения</div>
          <div className="relative">
            <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input placeholder="Поиск…" className="w-full pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => {
            const imp = chat.importance as Importance;
            const cfg = importanceConfig[imp];
            return (
              <button key={chat.id} onClick={() => setActiveChat(chat)}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition-all text-left relative"
                style={{
                  background: activeChat.id === chat.id ? "rgba(139,92,246,0.1)" : "transparent",
                  borderLeft: `2px solid ${activeChat.id === chat.id ? "var(--accent-1)" : "transparent"}`,
                }}>
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
                      <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
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
      <div className="flex-1 card rounded-l-none flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <Avatar name={activeChat.user.name} colorClass={activeChat.user.avatarColor} size="md" online={activeChat.user.online} />
          <div>
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{activeChat.user.name}</div>
            <div className="text-xs" style={{ color: activeChat.user.online ? "#22c55e" : "var(--text-muted)" }}>
              {activeChat.user.online ? "онлайн" : "был недавно"}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {[{ icon: "Phone" }, { icon: "Video" }, { icon: "Search" }, { icon: "MoreVertical" }].map(a => (
              <button key={a.icon} className="btn-icon"><Icon name={a.icon} size={15} /></button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3" onClick={() => setContextMenu(null)}>
          {msgList.map(msg => (
            <div key={msg.id} className={`flex ${msg.own ? "justify-end" : "justify-start"} group`}>
              {!msg.own && <Avatar name={activeChat.user.name} colorClass={activeChat.user.avatarColor} size="xs" />}
              <div className="max-w-[65%] relative ml-2"
                style={{ ...importanceBorderStyle(msg.importance) }}
                onContextMenu={e => { e.preventDefault(); setContextMenu({ msg, x: e.clientX, y: e.clientY }); }}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm`}
                  style={msg.own ? {
                    background: "var(--accent-gradient)", color: "#fff",
                    borderBottomRightRadius: 6,
                  } : {
                    background: "rgba(255,255,255,0.07)", color: "var(--text-primary)",
                    border: "1px solid var(--border-subtle)", borderBottomLeftRadius: 6,
                  }}>
                  {msg.importance !== "normal" && (
                    <div className="flex items-center gap-1 mb-1 text-[10px]"
                      style={{ color: importanceConfig[msg.importance as Importance]?.dot ?? "inherit" }}>
                      <Icon name={importanceConfig[msg.importance as Importance]?.icon ?? "Circle"} size={10} />
                      {importanceConfig[msg.importance as Importance]?.label}
                    </div>
                  )}
                  <span>{msg.text}</span>
                  <div className={`text-[10px] mt-1 flex items-center gap-1 ${msg.own ? "justify-end" : ""}`}
                    style={{ color: msg.own ? "rgba(255,255,255,0.55)" : "var(--text-muted)" }}>
                    {msg.time}
                    {msg.own && <Icon name="Check" size={10} />}
                  </div>
                </div>

                {/* Quick actions on hover */}
                <div className={`absolute ${msg.own ? "left-0 -translate-x-full pr-2" : "right-0 translate-x-full pl-2"} top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                  <button onClick={() => setSaveModal(msg)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <Icon name="Pin" size={11} style={{ color: "#a78bfa" }} />
                  </button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-subtle)" }}>
                    <Icon name="Reply" size={11} style={{ color: "var(--text-secondary)" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Context menu */}
        {contextMenu && (
          <div className="fixed z-50 animate-scale-in rounded-xl overflow-hidden"
            style={{ left: contextMenu.x, top: contextMenu.y, background: "#10102a", border: "1px solid var(--border-medium)", boxShadow: "var(--shadow-elevated)", minWidth: 180 }}>
            {saveActions.map(a => (
              <button key={a.id} onClick={() => { setSaveModal(contextMenu.msg); setContextMenu(null); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/6 transition-colors text-left">
                <Icon name={a.icon} size={14} style={{ color: a.color }} />
                <span style={{ color: "var(--text-primary)" }}>Сохранить как «{a.label}»</span>
              </button>
            ))}
          </div>
        )}

        {/* Sticker picker */}
        {showStickers && (
          <div className="px-4 pb-2">
            <StickerPanel onPick={sendSticker} />
          </div>
        )}

        {/* Input area */}
        <div className="p-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {/* Importance selector */}
          {showImportance && (
            <div className="flex gap-2 mb-2 flex-wrap animate-fade-in">
              {(Object.keys(importanceConfig) as Importance[]).map(key => {
                const cfg = importanceConfig[key];
                return (
                  <button key={key} onClick={() => { setImportance(key); setShowImportance(false); }}
                    className="importance-btn flex items-center gap-1.5"
                    style={importance === key ? { background: cfg.dot ? `${cfg.dot}22` : "rgba(255,255,255,0.1)", borderColor: cfg.dot ?? "var(--border-accent)", color: cfg.dot ?? "var(--text-primary)" } : {}}>
                    <Icon name={cfg.icon} size={12} style={{ color: cfg.color }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex gap-1">
              <button className="btn-icon" onClick={() => { setShowStickers(!showStickers); setShowImportance(false); }}>
                <Icon name="Smile" size={15} style={{ color: showStickers ? "var(--accent-1)" : "var(--text-secondary)" }} />
              </button>
              <button className="btn-icon" onClick={() => { setShowImportance(!showImportance); setShowStickers(false); }}
                style={importance !== "normal" ? { borderColor: importanceConfig[importance].dot, background: `${importanceConfig[importance].dot}15` } : {}}>
                <Icon name={importanceConfig[importance].icon} size={15}
                  style={{ color: importance !== "normal" ? importanceConfig[importance].dot : "var(--text-secondary)" }} />
              </button>
              <button className="btn-icon"><Icon name="Paperclip" size={15} /></button>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Написать сообщение…" rows={1}
              className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif", maxHeight: 100 }} />
            <button onClick={() => send()} className="btn-icon"
              style={{ background: "var(--accent-gradient)", borderColor: "transparent", color: "#fff", width: 40, height: 40, borderRadius: "var(--radius-sm)" }}>
              <Icon name="Send" size={15} />
            </button>
          </div>
        </div>
      </div>

      {saveModal && <SaveMsgModal msg={saveModal} onClose={() => setSaveModal(null)} />}
    </div>
  );
}
