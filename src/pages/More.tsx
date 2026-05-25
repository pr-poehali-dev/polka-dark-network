import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOOLS = [
  { icon: "BarChart3",  label: "Статистика",     desc: "Аналитика профиля и активность",   badge: ""      },
  { icon: "Megaphone",  label: "Реклама",         desc: "Продвижение публикаций",            badge: "NEW"   },
  { icon: "Code2",      label: "API",             desc: "Интеграции и разработчикам",        badge: ""      },
  { icon: "Download",   label: "Скачать данные",  desc: "Экспорт ваших данных",              badge: ""      },
];

const HELP_ITEMS = [
  { icon: "LifeBuoy",    label: "Центр помощи",         desc: "Ответы на частые вопросы"        },
  { icon: "MessageSquare",label: "Обратная связь",       desc: "Напишите нам напрямую"           },
  { icon: "ScrollText",  label: "Правила платформы",    desc: "Условия использования"           },
  { icon: "ShieldCheck", label: "Конфиденциальность",   desc: "Политика обработки данных"       },
];

// ─── Tool Modal ───────────────────────────────────────────────────────────────

function ToolModal({ tool, onClose }: { tool: (typeof TOOLS)[0]; onClose: () => void }) {
  return (
    <div className="pk-modal-bg animate-fade-in" onClick={onClose}>
      <div
        className="animate-scale-in pk-card p-6 w-80 text-center"
        style={{ boxShadow: "var(--shadow-lg)" }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--accent-grad)" }}
        >
          <Icon name={tool.icon} size={28} style={{ color: "var(--text)" }} />
        </div>
        <div className="pk-title mb-1">{tool.label}</div>
        <div className="pk-subtitle mb-5">{tool.desc}</div>
        <button className="pk-btn pk-btn-primary w-full" onClick={onClose}>
          <Icon name="ArrowRight" size={13} /> Перейти
        </button>
        <button className="pk-btn pk-btn-ghost w-full mt-2" onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function More() {
  const [activeTool, setActiveTool] = useState<(typeof TOOLS)[0] | null>(null);

  return (
    <div className="animate-fade-in space-y-4">

      {/* ── Tools ── */}
      <div className="pk-card p-5">
        <div className="pk-label mb-4">Инструменты</div>
        <div className="grid grid-cols-2 gap-3">
          {TOOLS.map(t => (
            <button
              key={t.label}
              className="pk-card pk-card-hover flex items-center gap-3 p-4 text-left cursor-pointer"
              onClick={() => setActiveTool(t)}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(123,77,255,0.12)" }}
              >
                <Icon name={t.icon} size={20} style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>{t.label}</span>
                  {t.badge && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "var(--accent-grad)", color: "var(--text)" }}
                    >
                      {t.badge}
                    </span>
                  )}
                </div>
                <div className="pk-subtitle truncate">{t.desc}</div>
              </div>
              <Icon name="ChevronRight" size={14} style={{ color: "var(--text-4)", flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Polka Pro ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Pro card */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden cursor-pointer group"
          style={{
            background: "linear-gradient(135deg,rgba(123,77,255,0.18) 0%,rgba(233,79,203,0.12) 100%)",
            border: "1px solid rgba(123,77,255,0.35)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(123,77,255,0.06)" }}
          />
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-grad)", boxShadow: "0 0 20px rgba(123,77,255,0.4)" }}
            >
              <Icon name="Crown" size={20} style={{ color: "var(--text)" }} />
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "var(--accent-grad)", color: "var(--text)" }}
            >
              PRO
            </span>
          </div>
          <div className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>Polka Pro</div>
          <div className="pk-subtitle mb-4">Расширенная аналитика, приоритетная поддержка и эксклюзивные возможности</div>
          <ul className="space-y-1.5 mb-4">
            {["Неограниченные альбомы", "Приоритет в поиске", "Эксклюзивные стикеры", "Без рекламы"].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-3)" }}>
                <Icon name="Check" size={12} style={{ color: "var(--accent)" }} /> {f}
              </li>
            ))}
          </ul>
          <button className="pk-btn pk-btn-primary w-full text-sm">
            <Icon name="Zap" size={13} /> Подключить · 299 ₽/мес
          </button>
        </div>

        {/* Creator card */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden cursor-pointer group"
          style={{
            background: "linear-gradient(135deg,rgba(233,79,203,0.15) 0%,rgba(255,184,77,0.1) 100%)",
            border: "1px solid rgba(233,79,203,0.3)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(233,79,203,0.05)" }}
          />
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,var(--pink),var(--warning))", boxShadow: "0 0 20px rgba(233,79,203,0.35)" }}
            >
              <Icon name="Sparkles" size={20} style={{ color: "var(--text)" }} />
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "linear-gradient(135deg,var(--pink),var(--warning))", color: "var(--text)" }}
            >
              CREATOR
            </span>
          </div>
          <div className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>Polka Creator</div>
          <div className="pk-subtitle mb-4">Монетизация, подписчики, мерч и инструменты для авторов</div>
          <ul className="space-y-1.5 mb-4">
            {["Донаты и подписки", "Продажа товаров", "Creator Analytics", "Партнёрская программа"].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-3)" }}>
                <Icon name="Check" size={12} style={{ color: "var(--pink)" }} /> {f}
              </li>
            ))}
          </ul>
          <button
            className="pk-btn w-full text-sm"
            style={{ background: "linear-gradient(135deg,var(--pink),var(--warning))", color: "var(--text)" }}
          >
            <Icon name="Sparkles" size={13} /> Стать автором
          </button>
        </div>
      </div>

      {/* ── Help ── */}
      <div className="pk-card overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <div className="pk-label">Помощь</div>
        </div>
        {HELP_ITEMS.map((item, i) => (
          <div key={item.label}>
            {i > 0 && <div className="pk-divider" style={{ marginLeft: 56 }} />}
            <button
              className="flex items-center gap-4 w-full px-5 py-3.5 text-left transition-colors group"
              style={{ background: "transparent" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <Icon name={item.icon} size={17} style={{ color: "var(--text-3)" }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: "var(--text-2)" }}>{item.label}</div>
                <div className="pk-subtitle">{item.desc}</div>
              </div>
              <Icon name="ChevronRight" size={14} style={{ color: "var(--text-4)" }} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div
        className="pk-card px-5 py-4 flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-3)" }}>Polka Social</div>
          <div className="pk-subtitle">Версия 2.6.0 · Сборка 2026.05</div>
        </div>
        <div className="flex items-center gap-3">
          {["Условия", "Конфиденциальность", "Лицензии"].map(link => (
            <button key={link} className="pk-subtitle hover:text-text-2 transition-colors text-xs">
              {link}
            </button>
          ))}
        </div>
      </div>

      {/* Tool modal */}
      {activeTool && <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />}
    </div>
  );
}
