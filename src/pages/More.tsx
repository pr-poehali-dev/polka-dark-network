import Icon from "@/components/ui/icon";

const tools = [
  { icon: "BarChart3", label: "Статистика", desc: "Аналитика профиля и активность" },
  { icon: "Megaphone", label: "Реклама", desc: "Продвижение публикаций" },
  { icon: "Code2", label: "API", desc: "Доступ к API Polka" },
  { icon: "Download", label: "Скачать данные", desc: "Экспорт вашего контента" },
];

const help = [
  { icon: "HelpCircle", label: "Центр помощи", desc: "Ответы на популярные вопросы" },
  { icon: "MessageSquare", label: "Обратная связь", desc: "Сообщить о проблеме" },
  { icon: "FileText", label: "Правила", desc: "Пользовательское соглашение" },
  { icon: "Shield", label: "Политика конфиденциальности", desc: "Как мы используем ваши данные" },
];

const recommended = [
  { icon: "Zap", label: "Polka Pro", desc: "Расширенные возможности", accent: true },
  { icon: "Star", label: "Polka Creator", desc: "Инструменты для авторов", accent: false },
];

export default function More() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4">
        <span className="section-title">Ещё</span>
      </div>

      <div className="card p-5">
        <div className="section-title mb-4 flex items-center gap-2">
          <Icon name="Wrench" size={15} style={{ color: "var(--accent-1)" }} />
          Инструменты
        </div>
        <div className="grid grid-cols-2 gap-3">
          {tools.map(t => (
            <div key={t.label} className="flex items-center gap-3 p-4 rounded-2xl glass-hover cursor-pointer"
              style={{ border: "1px solid var(--border-subtle)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,92,252,0.15)" }}>
                <Icon name={t.icon} size={18} style={{ color: "var(--accent-1)" }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{t.label}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="section-title mb-4 flex items-center gap-2">
          <Icon name="Sparkles" size={15} style={{ color: "var(--accent-1)" }} />
          Рекомендации
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recommended.map(r => (
            <div key={r.label} className="relative overflow-hidden flex items-center gap-3 p-4 rounded-2xl cursor-pointer"
              style={{ border: `1px solid ${r.accent ? "rgba(124,92,252,0.35)" : "var(--border-subtle)"}`, background: r.accent ? "rgba(124,92,252,0.08)" : "var(--bg-card)" }}>
              {r.accent && <div className="absolute inset-0 opacity-5" style={{ background: "var(--accent-gradient)" }} />}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: r.accent ? "var(--accent-gradient)" : "rgba(255,255,255,0.07)" }}>
                <Icon name={r.icon} size={18} style={{ color: r.accent ? "#fff" : "var(--text-secondary)" }} />
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: r.accent ? "#c4b5fd" : "var(--text-primary)" }}>{r.label}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="section-title mb-4 flex items-center gap-2">
          <Icon name="HelpCircle" size={15} style={{ color: "var(--accent-1)" }} />
          Помощь
        </div>
        <div className="space-y-2">
          {help.map(h => (
            <div key={h.label} className="flex items-center gap-3 p-3 rounded-xl glass-hover cursor-pointer"
              style={{ border: "1px solid var(--border-subtle)" }}>
              <Icon name={h.icon} size={16} style={{ color: "var(--text-secondary)" }} />
              <div className="flex-1">
                <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{h.label}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{h.desc}</div>
              </div>
              <Icon name="ChevronRight" size={14} style={{ color: "var(--text-muted)" }} />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-4">
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>Polka v2.0.1 · © 2026</div>
      </div>
    </div>
  );
}
