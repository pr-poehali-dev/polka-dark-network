import { useState } from "react";
import Icon from "@/components/ui/icon";

const notes = [
  { id: 1, title: "Идеи для проекта", text: "Переработать главную страницу, добавить анимации, новый шрифт...", updated: "сегодня", color: "from-violet-500/20 to-purple-600/10" },
  { id: 2, title: "Список задач", text: "✓ Встреча с командой\n✓ Обновить дизайн-систему\n• Подготовить презентацию", updated: "вчера", color: "from-blue-500/20 to-cyan-600/10" },
  { id: 3, title: "Книги на прочтение", text: "«Дизайн привычных вещей», «Атомные привычки», «Думай медленно»...", updated: "3 дня назад", color: "from-emerald-500/20 to-teal-600/10" },
];

const reminders = [
  { id: 1, text: "Позвонить Марии по проекту", time: "Сегодня, 18:00", done: false },
  { id: 2, text: "Сдать отчёт по кварталу", time: "Пт, 10:00", done: false },
  { id: 3, text: "Встреча с командой", time: "Ср, 14:30", done: true },
];

const links = [
  { id: 1, title: "Figma Design System", url: "figma.com", icon: "Link" },
  { id: 2, title: "GitHub репозиторий", url: "github.com", icon: "Github" },
  { id: 3, title: "Notion рабочее пространство", url: "notion.so", icon: "FileText" },
];

export default function Notes() {
  const [doneReminders, setDoneReminders] = useState<Set<number>>(new Set([3]));
  const tabs = ["Заметки", "Напоминания", "Файлы", "Ссылки"];
  const [activeTab, setActiveTab] = useState("Заметки");

  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4 flex items-center gap-4">
        <span className="section-title">Не потерять</span>
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`tab-item text-sm ${activeTab === t ? "active" : ""}`}>{t}</button>
          ))}
        </div>
        <button className="btn-primary ml-auto text-sm flex items-center gap-1.5">
          <Icon name="Plus" size={13} />
          Добавить
        </button>
      </div>

      {activeTab === "Заметки" && (
        <div className="grid grid-cols-3 gap-4">
          {notes.map(n => (
            <div key={n.id} className={`card p-4 cursor-pointer group hover:border-violet-500/30 transition-all bg-gradient-to-br ${n.color}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{n.title}</div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-muted)" }}>
                  <Icon name="MoreHorizontal" size={14} />
                </button>
              </div>
              <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{n.text}</p>
              <div className="mt-3 text-[10px]" style={{ color: "var(--text-muted)" }}>{n.updated}</div>
            </div>
          ))}
          <div className="card p-4 flex flex-col items-center justify-center cursor-pointer border-dashed glass-hover" style={{ minHeight: "130px" }}>
            <Icon name="Plus" size={24} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>Новая заметка</span>
          </div>
        </div>
      )}

      {activeTab === "Напоминания" && (
        <div className="card overflow-hidden">
          {reminders.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center gap-4 px-5 py-4 transition-all"
              style={{ borderBottom: i < reminders.length - 1 ? "1px solid var(--border-subtle)" : "none", opacity: doneReminders.has(r.id) ? 0.5 : 1 }}
            >
              <button
                onClick={() => setDoneReminders(prev => { const n = new Set(prev); if (n.has(r.id)) { n.delete(r.id); } else { n.add(r.id); } return n; })}
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{ border: doneReminders.has(r.id) ? "none" : "2px solid var(--border-medium)", background: doneReminders.has(r.id) ? "var(--accent-1)" : "transparent" }}
              >
                {doneReminders.has(r.id) && <Icon name="Check" size={11} style={{ color: "#fff" }} />}
              </button>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)", textDecoration: doneReminders.has(r.id) ? "line-through" : "none" }}>
                  {r.text}
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Icon name="Clock" size={11} />{r.time}
                </div>
              </div>
              <button style={{ color: "var(--text-muted)" }}><Icon name="MoreHorizontal" size={15} /></button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Ссылки" && (
        <div className="space-y-3">
          {links.map(l => (
            <div key={l.id} className="card p-4 flex items-center gap-4 cursor-pointer glass-hover">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,92,252,0.15)", border: "1px solid rgba(124,92,252,0.2)" }}>
                <Icon name={l.icon} size={18} style={{ color: "var(--accent-1)" }} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{l.title}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{l.url}</div>
              </div>
              <Icon name="ExternalLink" size={14} style={{ color: "var(--text-muted)" }} />
            </div>
          ))}
        </div>
      )}

      {activeTab === "Файлы" && (
        <div className="card p-16 flex flex-col items-center text-center">
          <Icon name="FolderOpen" size={40} style={{ color: "var(--text-muted)" }} />
          <div className="mt-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Файлы не загружены</div>
          <div className="text-sm mt-1 mb-4" style={{ color: "var(--text-muted)" }}>Загрузите документы, изображения и другие файлы</div>
          <button className="btn-primary flex items-center gap-1.5 text-sm">
            <Icon name="Upload" size={13} />
            Загрузить файл
          </button>
        </div>
      )}
    </div>
  );
}
