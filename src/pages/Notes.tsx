import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Note      { id: number; title: string; text: string; date: string; gradient: string; }
interface Task      { id: number; text: string; done: boolean; deadline?: string; }
interface Reminder  { id: number; text: string; time: string; done: boolean; }
interface NoteLink  { id: number; title: string; url: string; icon: string; }
interface NoteFile  { id: number; name: string; size: string; date: string; type: "pdf" | "doc" | "img" | "zip" | "other"; }

// ─── Initial data ─────────────────────────────────────────────────────────────

const NOTE_GRADS = [
  "linear-gradient(135deg,hsl(268,55%,14%),hsl(298,45%,10%))",
  "linear-gradient(135deg,hsl(205,55%,14%),hsl(232,45%,10%))",
  "linear-gradient(135deg,hsl(340,55%,14%),hsl(22,45%,10%))",
  "linear-gradient(135deg,hsl(142,55%,14%),hsl(168,45%,10%))",
  "linear-gradient(135deg,hsl(36,55%,14%),hsl(56,45%,10%))",
];

const initNotes: Note[] = [
  { id: 1, title: "Идеи для проекта",     text: "Использовать новую палитру цветов. Добавить анимации переходов. Проработать мобильную версию.", date: "24 мая", gradient: NOTE_GRADS[0] },
  { id: 2, title: "Список покупок",       text: "Кофе, молоко, хлеб, фрукты. Не забыть зарядку для ноутбука.", date: "23 мая", gradient: NOTE_GRADS[1] },
  { id: 3, title: "Книги на лето",        text: "«Дизайн привычных вещей», «Атомные привычки», «Думай медленно».", date: "22 мая", gradient: NOTE_GRADS[2] },
  { id: 4, title: "Вдохновляющие цитаты", text: "«Простота — высшая форма сложности.» — Леонардо да Винчи.", date: "20 мая", gradient: NOTE_GRADS[3] },
  { id: 5, title: "Код для изучения",     text: "React Server Components, Suspense, Zustand, TanStack Query.", date: "19 мая", gradient: NOTE_GRADS[4] },
  { id: 6, title: "Путешествия 2026",     text: "Стамбул в апреле, Бали в июне, Токио в ноябре.", date: "15 мая", gradient: NOTE_GRADS[0] },
];

const initTasks: Task[] = [
  { id: 1, text: "Завершить редизайн главной страницы", done: false, deadline: "27 мая" },
  { id: 2, text: "Провести код-ревью с командой",       done: true,  deadline: "25 мая" },
  { id: 3, text: "Написать документацию к API",         done: false, deadline: "30 мая" },
  { id: 4, text: "Обновить зависимости проекта",        done: false },
  { id: 5, text: "Отправить отчёт руководителю",        done: true,  deadline: "24 мая" },
];

const initReminders: Reminder[] = [
  { id: 1, text: "Встреча с командой",   time: "Сегодня, 15:00",  done: false },
  { id: 2, text: "Оплатить подписку",    time: "Завтра, 10:00",   done: false },
  { id: 3, text: "Позвонить клиенту",    time: "28 мая, 14:30",   done: false },
  { id: 4, text: "Сдать отчёт",         time: "30 мая, 09:00",   done: false },
  { id: 5, text: "День рождения Алины",  time: "2 июня",          done: true  },
];

const initLinks: NoteLink[] = [
  { id: 1, title: "Figma — дизайн системы", url: "figma.com/file/...",    icon: "Figma"    },
  { id: 2, title: "GitHub репозиторий",      url: "github.com/user/...",  icon: "Github"   },
  { id: 3, title: "Notion — воркспейс",      url: "notion.so/user/...",   icon: "BookOpen" },
  { id: 4, title: "Дизайн-инспирация",       url: "dribbble.com",         icon: "Palette"  },
  { id: 5, title: "Документация React",      url: "react.dev",            icon: "FileCode" },
];

const FILE_ICONS:  Record<NoteFile["type"], string> = { pdf: "FileText", doc: "FileText", img: "Image", zip: "Archive", other: "File" };
const FILE_COLORS: Record<NoteFile["type"], string> = { pdf: "var(--error)", doc: "var(--accent)", img: "var(--online)", zip: "var(--warning)", other: "var(--text-3)" };

const initFiles: NoteFile[] = [
  { id: 1, name: "Техническое задание.pdf",    size: "2.4 МБ",  date: "24 мая", type: "pdf"   },
  { id: 2, name: "Макет главной страницы.fig", size: "8.1 МБ",  date: "23 мая", type: "other" },
  { id: 3, name: "Фото для портфолио.zip",     size: "124 МБ",  date: "22 мая", type: "zip"   },
  { id: 4, name: "Отчёт за квартал.docx",      size: "560 КБ",  date: "20 мая", type: "doc"   },
  { id: 5, name: "Аватар профиля.png",          size: "340 КБ",  date: "18 мая", type: "img"   },
  { id: 6, name: "Контракт с клиентом.pdf",    size: "1.1 МБ",  date: "15 мая", type: "pdf"   },
];

// ─── Create modal ─────────────────────────────────────────────────────────────

function CreateModal({ tab, onClose, onAdd }: {
  tab: string;
  onClose: () => void;
  onAdd: (val: string, extra?: string) => void;
}) {
  const [val,   setVal]   = useState("");
  const [extra, setExtra] = useState("");

  const labels: Record<string, [string, string, string]> = {
    "Заметки":      ["заметку",        "Заголовок заметки",     "Текст заметки…"],
    "Задачи":       ["задачу",         "Описание задачи",       "Дедлайн (напр. 30 мая)"],
    "Напоминания":  ["напоминание",    "Текст напоминания",     "Время (напр. Завтра, 10:00)"],
    "Ссылки":       ["ссылку",         "Название ссылки",       "URL адрес"],
    "Файлы":        ["файл",           "Имя файла",             "Размер (напр. 1.2 МБ)"],
  };
  const [noun, p1, p2] = labels[tab] ?? ["элемент", "Значение", "Дополнительно"];

  return (
    <div className="pk-modal-bg animate-fade-in" onClick={onClose}>
      <div
        className="animate-scale-in pk-card p-5 w-80"
        style={{ boxShadow: "var(--shadow-lg)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="pk-title">Добавить {noun}</span>
          <button className="pk-icon-btn" onClick={onClose}><Icon name="X" size={14} /></button>
        </div>
        <input className="pk-input mb-3" placeholder={p1} value={val} onChange={e => setVal(e.target.value)} autoFocus />
        <input className="pk-input mb-4" placeholder={p2} value={extra} onChange={e => setExtra(e.target.value)} />
        <button
          className="pk-btn pk-btn-primary w-full"
          disabled={!val.trim()}
          onClick={() => { onAdd(val.trim(), extra.trim() || undefined); onClose(); }}
        >
          <Icon name="Plus" size={13} /> Добавить
        </button>
      </div>
    </div>
  );
}

// ─── Panel: Notes ─────────────────────────────────────────────────────────────

function NotesPanel({ notes, onAdd, onDelete }: {
  notes: Note[];
  onAdd: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="pk-label">{notes.length} заметок</span>
        <button className="pk-btn pk-btn-ghost text-xs" onClick={onAdd}><Icon name="Plus" size={12} /> Заметка</button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {notes.map(n => (
          <div key={n.id} className="pk-card overflow-hidden pk-card-hover group cursor-pointer">
            <div className="h-2.5 w-full" style={{ background: n.gradient }} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="text-sm font-semibold leading-snug" style={{ color: "var(--text)" }}>{n.title}</div>
                <button
                  className="pk-icon-btn opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  style={{ width: 26, height: 26 }}
                  onClick={e => { e.stopPropagation(); onDelete(n.id); }}
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: "var(--text-3)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {n.text}
              </p>
              <div className="pk-label">{n.date}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Panel: Tasks ─────────────────────────────────────────────────────────────

function TasksPanel({ tasks, onToggle, onAdd, onDelete }: {
  tasks: Task[];
  onToggle: (id: number) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="pk-label">{tasks.filter(t => !t.done).length} активных · {tasks.filter(t => t.done).length} выполнено</span>
        <button className="pk-btn pk-btn-ghost text-xs" onClick={onAdd}><Icon name="Plus" size={12} /> Задача</button>
      </div>
      <div className="space-y-2">
        {tasks.map(t => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl group transition-colors"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", opacity: t.done ? 0.55 : 1 }}
          >
            <button
              onClick={() => onToggle(t.id)}
              className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: t.done ? "var(--accent-grad)" : "transparent", border: `2px solid ${t.done ? "var(--accent)" : "var(--border-md)"}` }}
            >
              {t.done && <Icon name="Check" size={11} style={{ color: "var(--text)" }} />}
            </button>
            <span className="flex-1 text-sm" style={{ color: "var(--text-2)", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
            {t.deadline && !t.done && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                style={{ background: "rgba(255,184,77,0.12)", color: "var(--warning)", border: "1px solid rgba(255,184,77,0.25)" }}
              >
                {t.deadline}
              </span>
            )}
            <button
              className="pk-icon-btn opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ width: 26, height: 26 }}
              onClick={() => onDelete(t.id)}
            >
              <Icon name="Trash2" size={12} style={{ color: "var(--error)" }} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Panel: Reminders ─────────────────────────────────────────────────────────

function RemindersPanel({ reminders, onToggle, onAdd, onDelete }: {
  reminders: Reminder[];
  onToggle: (id: number) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="pk-label">{reminders.filter(r => !r.done).length} предстоящих</span>
        <button className="pk-btn pk-btn-ghost text-xs" onClick={onAdd}><Icon name="Plus" size={12} /> Напоминание</button>
      </div>
      <div className="space-y-2">
        {reminders.map(r => (
          <div
            key={r.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl group"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", opacity: r.done ? 0.5 : 1 }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: r.done ? "rgba(255,255,255,0.05)" : "rgba(123,77,255,0.12)" }}
            >
              <Icon name="Bell" size={16} style={{ color: r.done ? "var(--text-4)" : "var(--accent)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: "var(--text-2)", textDecoration: r.done ? "line-through" : "none" }}>{r.text}</div>
              <div className="text-xs flex items-center gap-1" style={{ color: r.done ? "var(--text-4)" : "var(--online)" }}>
                <Icon name="Clock" size={10} /> {r.time}
              </div>
            </div>
            <button
              className="pk-btn text-xs flex-shrink-0"
              style={{
                background: r.done ? "rgba(255,255,255,0.04)" : "rgba(39,228,139,0.1)",
                color: r.done ? "var(--text-4)" : "var(--online)",
                border: `1px solid ${r.done ? "var(--border)" : "rgba(39,228,139,0.25)"}`,
              }}
              onClick={() => onToggle(r.id)}
            >
              {r.done ? "Выполнено" : "Отметить"}
            </button>
            <button
              className="pk-icon-btn opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ width: 26, height: 26 }}
              onClick={() => onDelete(r.id)}
            >
              <Icon name="Trash2" size={12} style={{ color: "var(--error)" }} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Panel: Links ─────────────────────────────────────────────────────────────

function LinksPanel({ links, onAdd, onDelete }: {
  links: NoteLink[];
  onAdd: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="pk-label">{links.length} ссылок</span>
        <button className="pk-btn pk-btn-ghost text-xs" onClick={onAdd}><Icon name="Plus" size={12} /> Ссылка</button>
      </div>
      <div className="space-y-2">
        {links.map(l => (
          <div
            key={l.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl group"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(123,77,255,0.1)" }}>
              <Icon name={l.icon} size={16} style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: "var(--text-2)" }}>{l.title}</div>
              <div className="pk-subtitle truncate">{l.url}</div>
            </div>
            <a
              href={`https://${l.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pk-btn pk-btn-ghost text-xs"
              onClick={e => e.stopPropagation()}
            >
              <Icon name="ExternalLink" size={12} /> Открыть
            </a>
            <button
              className="pk-icon-btn opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ width: 26, height: 26 }}
              onClick={() => onDelete(l.id)}
            >
              <Icon name="Trash2" size={12} style={{ color: "var(--error)" }} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Panel: Files ─────────────────────────────────────────────────────────────

function FilesPanel({ files, onAdd, onDelete }: {
  files: NoteFile[];
  onAdd: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="pk-label">{files.length} файлов</span>
        <button className="pk-btn pk-btn-ghost text-xs" onClick={onAdd}><Icon name="Upload" size={12} /> Загрузить</button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {files.map(f => (
          <div key={f.id} className="pk-card p-4 pk-card-hover group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${FILE_COLORS[f.type]}18` }}>
                <Icon name={FILE_ICONS[f.type]} size={22} style={{ color: FILE_COLORS[f.type] }} />
              </div>
              <button
                className="pk-icon-btn opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ width: 26, height: 26 }}
                onClick={e => { e.stopPropagation(); onDelete(f.id); }}
              >
                <Icon name="Trash2" size={12} style={{ color: "var(--error)" }} />
              </button>
            </div>
            <div className="text-sm font-medium leading-snug mb-1" style={{ color: "var(--text-2)", wordBreak: "break-all" }}>{f.name}</div>
            <div className="flex items-center justify-between">
              <span className="pk-label">{f.size}</span>
              <span className="pk-subtitle">{f.date}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const TABS = ["Заметки", "Задачи", "Напоминания", "Ссылки", "Файлы"];

export default function Notes() {
  const [tab,       setTab]       = useState("Заметки");
  const [showModal, setShowModal] = useState(false);
  const [notes,     setNotes]     = useState<Note[]>(initNotes);
  const [tasks,     setTasks]     = useState<Task[]>(initTasks);
  const [reminders, setReminders] = useState<Reminder[]>(initReminders);
  const [links,     setLinks]     = useState<NoteLink[]>(initLinks);
  const [files,     setFiles]     = useState<NoteFile[]>(initFiles);

  const handleAdd = (val: string, extra?: string) => {
    const id = Date.now();
    if (tab === "Заметки")     setNotes(p => [...p,     { id, title: val, text: extra ?? "", date: "сейчас", gradient: NOTE_GRADS[id % NOTE_GRADS.length] }]);
    if (tab === "Задачи")      setTasks(p => [...p,     { id, text: val, done: false, deadline: extra }]);
    if (tab === "Напоминания") setReminders(p => [...p, { id, text: val, time: extra ?? "—", done: false }]);
    if (tab === "Ссылки")      setLinks(p => [...p,     { id, title: val, url: extra ?? "#", icon: "Link" }]);
    if (tab === "Файлы")       setFiles(p => [...p,     { id, name: val, size: extra ?? "—", date: "сейчас", type: "other" }]);
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="pk-card p-4 flex items-center gap-3 flex-wrap">
        <div>
          <div className="pk-title">Не потерять</div>
          <div className="pk-subtitle">Заметки, задачи, напоминания</div>
        </div>
        <div className="flex gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pk-tab flex-shrink-0 ${tab === t ? "active" : ""}`}>{t}</button>
          ))}
        </div>
        <button className="pk-btn pk-btn-primary text-sm" onClick={() => setShowModal(true)}>
          <Icon name="Plus" size={13} /> Добавить
        </button>
      </div>

      {/* Content */}
      <div className="pk-card p-4">
        {tab === "Заметки"     && <NotesPanel     notes={notes}         onAdd={() => setShowModal(true)} onDelete={id => setNotes(p => p.filter(n => n.id !== id))} />}
        {tab === "Задачи"      && <TasksPanel      tasks={tasks}         onAdd={() => setShowModal(true)} onDelete={id => setTasks(p => p.filter(t => t.id !== id))} onToggle={id => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t))} />}
        {tab === "Напоминания" && <RemindersPanel  reminders={reminders} onAdd={() => setShowModal(true)} onDelete={id => setReminders(p => p.filter(r => r.id !== id))} onToggle={id => setReminders(p => p.map(r => r.id === id ? { ...r, done: !r.done } : r))} />}
        {tab === "Ссылки"      && <LinksPanel      links={links}         onAdd={() => setShowModal(true)} onDelete={id => setLinks(p => p.filter(l => l.id !== id))} />}
        {tab === "Файлы"       && <FilesPanel      files={files}         onAdd={() => setShowModal(true)} onDelete={id => setFiles(p => p.filter(f => f.id !== id))} />}
      </div>

      {showModal && <CreateModal tab={tab} onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}
