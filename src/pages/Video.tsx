import Icon from "@/components/ui/icon";

const videos = [
  { id: 1, title: "Городские пейзажи Москвы 2026", author: "Мария Соколова", views: "124К", duration: "12:34", color: "from-blue-900/70 to-indigo-900/50" },
  { id: 2, title: "Дизайн интерфейсов: тренды года", author: "Алексей Громов", views: "87.5К", duration: "28:15", color: "from-violet-900/70 to-purple-900/50" },
  { id: 3, title: "Живопись акварелью: техники", author: "Анна Белова", views: "56.2К", duration: "45:00", color: "from-pink-900/70 to-rose-900/50" },
  { id: 4, title: "Разбор нового фреймворка", author: "Дмитрий Лазарев", views: "201К", duration: "1:02:17", color: "from-emerald-900/70 to-teal-900/50" },
  { id: 5, title: "Архитектура будущего", author: "Роман Власов", views: "38.9К", duration: "19:22", color: "from-orange-900/70 to-amber-900/50" },
  { id: 6, title: "Цифровой маркетинг: кейсы 2026", author: "Елена Кузьмина", views: "143К", duration: "34:08", color: "from-fuchsia-900/70 to-pink-900/50" },
];

export default function Video() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4 flex items-center gap-4">
        <span className="section-title">Видео</span>
        <div className="flex gap-1">
          {["Популярное", "Подписки", "Мои видео", "Сохранённые"].map(t => (
            <button key={t} className="tab-item text-sm">{t}</button>
          ))}
        </div>
        <button className="btn-primary ml-auto text-sm flex items-center gap-1.5">
          <Icon name="Upload" size={13} />
          Загрузить
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {videos.map(v => (
          <div key={v.id} className="card overflow-hidden cursor-pointer group hover:border-violet-500/30 transition-all">
            <div className={`relative bg-gradient-to-br ${v.color}`} style={{ height: "180px" }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(124,92,252,0.8)", backdropFilter: "blur(8px)", boxShadow: "var(--accent-glow)" }}>
                  <Icon name="Play" size={24} style={{ color: "#fff" }} />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                <Icon name="Play" size={44} style={{ color: "rgba(255,255,255,0.15)" }} />
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-semibold"
                style={{ background: "rgba(0,0,0,0.7)", color: "#fff" }}>
                {v.duration}
              </div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-sm mb-1.5 line-clamp-2" style={{ color: "var(--text-primary)" }}>{v.title}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{v.author}</span>
                <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <Icon name="Eye" size={11} />{v.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
