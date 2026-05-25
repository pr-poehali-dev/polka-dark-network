import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { users } from "@/data/mockData";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VIDEOS = [
  { id: 1, title: "Городские пейзажи Москвы 2026",               author: "Мария Соколова",    authorIdx: 0, views: "124К",   duration: "12:34",   gradient: "linear-gradient(135deg,hsl(215,62%,12%),hsl(242,52%,8%))" },
  { id: 2, title: "Дизайн интерфейсов: тренды года",             author: "Алексей Громов",    authorIdx: 1, views: "87.5К",  duration: "28:15",   gradient: "linear-gradient(135deg,hsl(270,62%,12%),hsl(292,52%,8%))" },
  { id: 3, title: "Живопись акварелью: техники и приёмы",        author: "Анна Белова",       authorIdx: 2, views: "56.2К",  duration: "45:00",   gradient: "linear-gradient(135deg,hsl(342,62%,12%),hsl(362,52%,8%))" },
  { id: 4, title: "Разбор нового фреймворка — полный курс",      author: "Дмитрий Лазарев",   authorIdx: 3, views: "201К",   duration: "1:02:17", gradient: "linear-gradient(135deg,hsl(148,62%,12%),hsl(174,52%,8%))" },
  { id: 5, title: "Архитектура будущего: взгляд изнутри",        author: "Роман Власов",      authorIdx: 4, views: "38.9К",  duration: "19:22",   gradient: "linear-gradient(135deg,hsl(26,62%,12%),hsl(46,52%,8%))"  },
  { id: 6, title: "Цифровой маркетинг: кейсы 2026",             author: "Елена Кузьмина",    authorIdx: 5, views: "143К",   duration: "34:08",   gradient: "linear-gradient(135deg,hsl(312,62%,12%),hsl(332,52%,8%))" },
  { id: 7, title: "Типографика в вебе: практическое руководство",author: "Иван Петров",       authorIdx: 6, views: "72.1К",  duration: "22:45",   gradient: "linear-gradient(135deg,hsl(192,62%,12%),hsl(212,52%,8%))" },
  { id: 8, title: "Съёмка на телефон: профессиональные техники", author: "Ксения Орлова",     authorIdx: 0, views: "95.4К",  duration: "17:30",   gradient: "linear-gradient(135deg,hsl(58,62%,12%),hsl(82,52%,8%))"  },
];

const TABS = ["Популярное", "Подписки", "Мои видео", "Сохранённые"];

// ─── Video modal ──────────────────────────────────────────────────────────────

function VideoModal({ video, onClose }: { video: (typeof VIDEOS)[0]; onClose: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [liked,   setLiked]   = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, author: users[0], text: "Отличное видео! Очень познавательно.", time: "2 ч" },
    { id: 2, author: users[1], text: "Спасибо, давно искал подобный материал!", time: "5 ч" },
    { id: 3, author: users[2], text: "Можно ещё подробнее про этот момент?", time: "1 д" },
  ]);

  const submit = () => {
    const t = comment.trim();
    if (!t) return;
    setComments(prev => [...prev, { id: Date.now(), author: users[3], text: t, time: "только что" }]);
    setComment("");
  };

  return (
    <div
      className="pk-modal-bg animate-fade-in"
      style={{ background: "rgba(7,11,31,0.93)", backdropFilter: "blur(18px)" }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in pk-card overflow-hidden flex flex-col"
        style={{ width: 750, maxHeight: "88vh", boxShadow: "var(--shadow-lg)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Player */}
        <div
          className="relative flex items-center justify-center flex-shrink-0"
          style={{ height: 340, background: video.gradient }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Icon name="Play" size={76} style={{ color: "rgba(255,255,255,0.05)" }} />
          </div>
          <button
            className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ background: "var(--accent-grad)", boxShadow: "0 0 32px rgba(123,77,255,0.5)" }}
            onClick={() => setPlaying(p => !p)}
          >
            <Icon name={playing ? "Pause" : "Play"} size={26} style={{ color: "var(--text)" }} />
          </button>
          <div
            className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-bold"
            style={{ background: "rgba(0,0,0,0.72)", color: "var(--text)" }}
          >
            {video.duration}
          </div>
          {/* Progress bar (static demo) */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="h-full" style={{ width: playing ? "35%" : "0%", background: "var(--accent-grad)", transition: "width 1s linear" }} />
          </div>
          <button
            className="pk-icon-btn absolute top-3 right-3"
            style={{ background: "rgba(0,0,0,0.55)", border: "none" }}
            onClick={onClose}
          >
            <Icon name="X" size={14} style={{ color: "var(--text)" }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">
            <h2 className="text-base font-bold mb-3" style={{ color: "var(--text)" }}>{video.title}</h2>

            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                name={users[video.authorIdx % users.length].name}
                colorClass={users[video.authorIdx % users.length].avatarColor}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>{video.author}</div>
                <div className="pk-subtitle flex items-center gap-1">
                  <Icon name="Eye" size={11} /> {video.views} просмотров
                </div>
              </div>
              <button className="pk-btn pk-btn-primary text-xs">
                <Icon name="Plus" size={12} /> Подписаться
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 py-3" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
              <button
                className="pk-btn pk-btn-ghost text-xs"
                onClick={() => setLiked(l => !l)}
                style={{ color: liked ? "var(--error)" : "var(--text-3)" }}
              >
                <Icon name="Heart" size={14} style={{ color: liked ? "var(--error)" : "var(--text-3)" }} />
                {liked ? "Нравится" : "Лайк"}
              </button>
              <button className="pk-btn pk-btn-ghost text-xs">
                <Icon name="Share2" size={14} /> Поделиться
              </button>
              <button
                className="pk-btn pk-btn-ghost text-xs"
                onClick={() => setSaved(s => !s)}
                style={{ color: saved ? "var(--accent)" : "var(--text-3)" }}
              >
                <Icon name="Bookmark" size={14} style={{ color: saved ? "var(--accent)" : "var(--text-3)" }} />
                {saved ? "Сохранено" : "Сохранить"}
              </button>
              <button className="pk-btn pk-btn-ghost text-xs ml-auto">
                <Icon name="Download" size={14} /> Скачать
              </button>
            </div>

            {/* Description */}
            <div
              className="mt-3 mb-4 text-sm rounded-xl px-4 py-3"
              style={{ background: "var(--surface)", color: "var(--text-3)", border: "1px solid var(--border)" }}
            >
              Подробный разбор темы «{video.title}». В этом выпуске вы найдёте всё самое важное
              и актуальное. Подписывайтесь, чтобы не пропустить новые видео!
            </div>

            {/* Comments */}
            <div className="pk-label mb-3">Комментарии ({comments.length})</div>
            <div className="flex gap-2 mb-4">
              <Avatar name={users[0].name} colorClass={users[0].avatarColor} size="sm" />
              <div className="flex-1 flex gap-2">
                <input
                  className="pk-input flex-1"
                  placeholder="Написать комментарий…"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") submit(); }}
                />
                <button
                  className="pk-icon-btn"
                  onClick={submit}
                  style={comment.trim() ? { background: "var(--accent-grad)", border: "none", color: "var(--text)" } : {}}
                >
                  <Icon name="Send" size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={c.author.name} colorClass={c.author.avatarColor} size="sm" />
                  <div
                    className="flex-1 px-3 py-2 rounded-xl text-sm"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-xs" style={{ color: "var(--text-2)" }}>{c.author.name}</span>
                      <span className="pk-subtitle">{c.time}</span>
                    </div>
                    <span style={{ color: "var(--text-3)" }}>{c.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Video card ───────────────────────────────────────────────────────────────

function VideoCard({ video, onClick }: { video: (typeof VIDEOS)[0]; onClick: () => void }) {
  return (
    <div className="pk-card overflow-hidden pk-card-hover cursor-pointer" onClick={onClick}>
      <div className="relative group" style={{ height: 178, background: video.gradient }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Icon name="Play" size={52} style={{ color: "rgba(255,255,255,0.08)" }} />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(0,0,0,0.34)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-grad)", boxShadow: "0 0 24px rgba(123,77,255,0.45)" }}
          >
            <Icon name="Play" size={24} style={{ color: "var(--text)" }} />
          </div>
        </div>
        <div
          className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold"
          style={{ background: "rgba(0,0,0,0.72)", color: "var(--text)" }}
        >
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <div
          className="text-sm font-semibold mb-1.5"
          style={{
            color: "var(--text)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {video.title}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-3)" }}>{video.author}</span>
          <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-4)" }}>
            <Icon name="Eye" size={11} /> {video.views}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Video() {
  const [tab, setTab]         = useState("Популярное");
  const [active, setActive]   = useState<(typeof VIDEOS)[0] | null>(null);

  const displayed =
    tab === "Мои видео"    ? VIDEOS.slice(0, 4) :
    tab === "Сохранённые"  ? VIDEOS.slice(2, 6) :
    tab === "Подписки"     ? VIDEOS.slice(1, 7) :
    VIDEOS;

  return (
    <div className="animate-fade-in space-y-4">
      <div className="pk-card p-4 flex items-center gap-3 flex-wrap">
        <div>
          <div className="pk-title">Видео</div>
          <div className="pk-subtitle">{VIDEOS.length} видео в каталоге</div>
        </div>
        <div className="flex gap-1 flex-1 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pk-tab text-xs ${tab === t ? "active" : ""}`}>{t}</button>
          ))}
        </div>
        <button className="pk-btn pk-btn-primary text-sm">
          <Icon name="Upload" size={13} /> Загрузить
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {displayed.map(v => (
          <VideoCard key={v.id} video={v} onClick={() => setActive(v)} />
        ))}
      </div>

      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
    </div>
  );
}
