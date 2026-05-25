import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { chats, messages, currentUser } from "@/data/mockData";

export default function Chats() {
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [input, setInput] = useState("");
  const [msgList, setMsgList] = useState(messages);

  const send = () => {
    if (!input.trim()) return;
    setMsgList(prev => [...prev, { id: prev.length + 1, from: currentUser.id, text: input, time: "сейчас", own: true }]);
    setInput("");
  };

  return (
    <div className="flex gap-0 h-[calc(100vh-var(--topbar-h)-2rem)] animate-fade-in" style={{ maxHeight: "calc(100vh - 90px)" }}>
      {/* Chat list */}
      <div className="card rounded-r-none flex flex-col" style={{ width: "300px", flexShrink: 0, borderRight: "1px solid var(--border-subtle)" }}>
        <div className="p-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="section-title mb-3">Чаты</div>
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              placeholder="Поиск чатов…"
              className="w-full pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className="w-full flex items-center gap-3 px-4 py-3.5 transition-all text-left"
              style={{
                background: activeChat.id === chat.id ? "rgba(124,92,252,0.12)" : "transparent",
                borderLeft: activeChat.id === chat.id ? "2px solid var(--accent-1)" : "2px solid transparent",
              }}
            >
              <Avatar name={chat.user.name} colorClass={chat.user.avatarColor} size="md" online={chat.user.online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{chat.user.name}</span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{chat.lastMsg}</span>
                  {chat.unread > 0 && (
                    <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--accent-gradient)", color: "#fff" }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
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
              <button key={a.icon} className="w-9 h-9 rounded-xl flex items-center justify-center glass-hover transition-all"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                <Icon name={a.icon} size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {msgList.map(msg => (
            <div key={msg.id} className={`flex ${msg.own ? "justify-end" : "justify-start"}`}>
              {!msg.own && (
                <Avatar name={activeChat.user.name} colorClass={activeChat.user.avatarColor} size="sm" />
              )}
              <div
                className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm ${msg.own ? "ml-2" : "ml-2"}`}
                style={msg.own ? {
                  background: "var(--accent-gradient)",
                  color: "#fff",
                  borderBottomRightRadius: "6px",
                } : {
                  background: "rgba(255,255,255,0.07)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                  borderBottomLeftRadius: "6px",
                }}
              >
                {msg.text}
                <div className={`text-[10px] mt-1 ${msg.own ? "text-white/60" : ""}`} style={!msg.own ? { color: "var(--text-muted)" } : {}}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className="flex items-end gap-3">
            <div className="flex gap-1">
              {[{ icon: "Paperclip" }, { icon: "Image" }, { icon: "Smile" }].map(a => (
                <button key={a.icon} className="w-9 h-9 rounded-xl flex items-center justify-center glass-hover"
                  style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                  <Icon name={a.icon} size={15} />
                </button>
              ))}
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Написать сообщение…"
              rows={1}
              className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontFamily: "Golos Text, sans-serif",
                maxHeight: "100px",
              }}
            />
            <button onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: "var(--accent-gradient)", color: "#fff" }}>
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
