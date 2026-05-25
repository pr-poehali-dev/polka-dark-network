import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser } from "@/data/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "profile" | "security" | "privacy" | "notifications" | "appearance" | "language";

interface SettingsState {
  // Profile
  name: string;
  bio: string;
  username: string;
  avatarEmoji: string;
  // Security
  twofa: boolean;
  // Privacy
  profilePublic: boolean;
  showOnline: boolean;
  readReceipts: boolean;
  // Notifications
  emailLikes: boolean;
  emailComments: boolean;
  emailFriends: boolean;
  pushLikes: boolean;
  pushComments: boolean;
  pushFriends: boolean;
  soundEnabled: boolean;
  // Appearance
  accentColor: string;
  // Language
  language: string;
}

const LS_KEY = "pk_settings";

function load(): Partial<SettingsState> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); } catch { return {}; }
}

const DEFAULTS: SettingsState = {
  name: currentUser.name,
  bio: currentUser.bio,
  username: currentUser.username,
  avatarEmoji: "",
  twofa: false,
  profilePublic: true,
  showOnline: true,
  readReceipts: true,
  emailLikes: true,
  emailComments: false,
  emailFriends: true,
  pushLikes: true,
  pushComments: true,
  pushFriends: true,
  soundEnabled: true,
  accentColor: "#7B4DFF",
  language: "ru",
};

// ─── Animated Toggle ──────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className="relative rounded-full transition-all flex-shrink-0"
      style={{
        width: 42,
        height: 24,
        background: on ? "var(--accent-grad)" : "rgba(255,255,255,0.1)",
        border: `1px solid ${on ? "transparent" : "var(--border)"}`,
      }}
    >
      <div
        className="absolute top-1 rounded-full transition-all"
        style={{ width: 16, height: 16, background: "var(--text)", left: on ? "calc(100% - 18px)" : "4px", opacity: on ? 1 : 0.7 }}
      />
    </button>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-slide-up flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium"
      style={{ background: "var(--accent-grad)", color: "var(--text)", boxShadow: "var(--shadow-md)", zIndex: 200 }}
    >
      <Icon name="Check" size={15} /> {msg}
    </div>
  );
}

// ─── Row helpers ──────────────────────────────────────────────────────────────

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex-1">
        <div className="text-sm font-medium" style={{ color: "var(--text-2)" }}>{label}</div>
        {desc && <div className="pk-subtitle mt-0.5">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="pk-label mb-4 mt-1">{children}</div>;
}

// ─── Sections ─────────────────────────────────────────────────────────────────

const AVATAR_EMOJIS = ["😎", "🦊", "🐼", "🦁", "🦋", "🌸", "🔮", "🚀", "💎", "🎨"];

function ProfileSection({ s, set, onSave }: { s: SettingsState; set: (k: keyof SettingsState, v: unknown) => void; onSave: () => void }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  return (
    <div>
      <SectionTitle>Профиль</SectionTitle>
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="relative">
          {s.avatarEmoji ? (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: "var(--surface)", border: "2px solid var(--border-md)" }}>
              {s.avatarEmoji}
            </div>
          ) : (
            <Avatar name={s.name} colorClass={currentUser.avatarColor} size="xl" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-2)" }}>Аватар</div>
          <div className="flex gap-2">
            <button className="pk-btn pk-btn-ghost text-xs" onClick={() => setShowEmojiPicker(e => !e)}>
              <Icon name="Smile" size={12} /> Эмодзи
            </button>
            <button className="pk-btn pk-btn-ghost text-xs" onClick={() => set("avatarEmoji", "")}>
              <Icon name="RotateCcw" size={12} /> Сбросить
            </button>
          </div>
          {showEmojiPicker && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {AVATAR_EMOJIS.map(em => (
                <button
                  key={em}
                  className="text-xl w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                  style={{
                    background: s.avatarEmoji === em ? "rgba(123,77,255,0.2)" : "var(--surface)",
                    border: `1px solid ${s.avatarEmoji === em ? "var(--accent)" : "var(--border)"}`,
                  }}
                  onClick={() => { set("avatarEmoji", em); setShowEmojiPicker(false); }}
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Fields */}
      <div className="space-y-3 mb-5">
        <div>
          <div className="pk-label mb-1.5">Имя</div>
          <input className="pk-input" value={s.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div>
          <div className="pk-label mb-1.5">Username</div>
          <input className="pk-input" value={s.username} onChange={e => set("username", e.target.value)} />
        </div>
        <div>
          <div className="pk-label mb-1.5">О себе</div>
          <textarea className="pk-input resize-none" rows={3} value={s.bio} onChange={e => set("bio", e.target.value)} />
        </div>
      </div>
      <button className="pk-btn pk-btn-primary" onClick={onSave}>
        <Icon name="Check" size={13} /> Сохранить изменения
      </button>
    </div>
  );
}

const MOCK_SESSIONS = [
  { id: 1, device: "Chrome · MacBook Pro", location: "Москва, Россия", time: "Сейчас", current: true },
  { id: 2, device: "Safari · iPhone 15",   location: "Москва, Россия", time: "3 ч назад", current: false },
  { id: 3, device: "Firefox · Windows PC", location: "Санкт-Петербург", time: "вчера", current: false },
];

function SecuritySection({ s, set, onSave }: { s: SettingsState; set: (k: keyof SettingsState, v: unknown) => void; onSave: () => void }) {
  const [showPwdModal, setShowPwdModal] = useState(false);
  return (
    <div>
      <SectionTitle>Безопасность</SectionTitle>
      <SettingRow label="Двухфакторная аутентификация" desc="Дополнительный уровень защиты аккаунта">
        <Toggle on={s.twofa} onChange={() => { set("twofa", !s.twofa); onSave(); }} />
      </SettingRow>
      <div className="py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium" style={{ color: "var(--text-2)" }}>Пароль</div>
            <div className="pk-subtitle">Последнее изменение: 3 месяца назад</div>
          </div>
          <button className="pk-btn pk-btn-ghost text-xs" onClick={() => setShowPwdModal(true)}>
            <Icon name="Key" size={12} /> Изменить
          </button>
        </div>
      </div>
      {/* Sessions */}
      <div className="mt-4">
        <div className="pk-label mb-3">Активные сессии</div>
        <div className="space-y-2">
          {MOCK_SESSIONS.map(ses => (
            <div key={ses.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ses.current ? "rgba(123,77,255,0.12)" : "rgba(255,255,255,0.04)" }}>
                <Icon name="Monitor" size={16} style={{ color: ses.current ? "var(--accent)" : "var(--text-4)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: "var(--text-2)" }}>{ses.device}</div>
                <div className="pk-subtitle">{ses.location} · {ses.time}</div>
              </div>
              {ses.current ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(39,228,139,0.12)", color: "var(--online)", border: "1px solid rgba(39,228,139,0.2)" }}>Текущая</span>
              ) : (
                <button className="pk-btn text-xs" style={{ color: "var(--error)", border: "1px solid rgba(255,92,92,0.25)", background: "rgba(255,92,92,0.08)" }}>Завершить</button>
              )}
            </div>
          ))}
        </div>
      </div>
      {showPwdModal && (
        <div className="pk-modal-bg animate-fade-in" onClick={() => setShowPwdModal(false)}>
          <div className="animate-scale-in pk-card p-5 w-80" style={{ boxShadow: "var(--shadow-lg)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="pk-title">Изменить пароль</span>
              <button className="pk-icon-btn" onClick={() => setShowPwdModal(false)}><Icon name="X" size={14} /></button>
            </div>
            <div className="space-y-3 mb-4">
              <input className="pk-input" type="password" placeholder="Текущий пароль" />
              <input className="pk-input" type="password" placeholder="Новый пароль" />
              <input className="pk-input" type="password" placeholder="Повторите новый пароль" />
            </div>
            <button className="pk-btn pk-btn-primary w-full" onClick={() => { setShowPwdModal(false); onSave(); }}>
              <Icon name="Check" size={13} /> Изменить пароль
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PrivacySection({ s, set, onSave }: { s: SettingsState; set: (k: keyof SettingsState, v: unknown) => void; onSave: () => void }) {
  const go = (k: keyof SettingsState) => { set(k, !s[k]); onSave(); };
  return (
    <div>
      <SectionTitle>Конфиденциальность</SectionTitle>
      <SettingRow label="Публичный профиль" desc="Все пользователи могут видеть ваш профиль">
        <Toggle on={s.profilePublic} onChange={() => go("profilePublic")} />
      </SettingRow>
      <SettingRow label="Показывать онлайн" desc="Другие видят, когда вы в сети">
        <Toggle on={s.showOnline} onChange={() => go("showOnline")} />
      </SettingRow>
      <SettingRow label="Уведомления о прочтении" desc="Отправлять галочки о прочтении сообщений">
        <Toggle on={s.readReceipts} onChange={() => go("readReceipts")} />
      </SettingRow>
    </div>
  );
}

function NotificationsSection({ s, set, onSave }: { s: SettingsState; set: (k: keyof SettingsState, v: unknown) => void; onSave: () => void }) {
  const go = (k: keyof SettingsState) => { set(k, !s[k]); onSave(); };
  return (
    <div>
      <SectionTitle>Уведомления</SectionTitle>
      <div className="pk-label mb-3">Email уведомления</div>
      <SettingRow label="Лайки" desc="Когда кто-то лайкает ваши публикации">
        <Toggle on={s.emailLikes} onChange={() => go("emailLikes")} />
      </SettingRow>
      <SettingRow label="Комментарии" desc="Когда кто-то оставляет комментарий">
        <Toggle on={s.emailComments} onChange={() => go("emailComments")} />
      </SettingRow>
      <SettingRow label="Заявки в друзья" desc="Когда кто-то хочет добавить вас">
        <Toggle on={s.emailFriends} onChange={() => go("emailFriends")} />
      </SettingRow>
      <div className="pk-label mb-3 mt-5">Push уведомления</div>
      <SettingRow label="Лайки" desc="">
        <Toggle on={s.pushLikes} onChange={() => go("pushLikes")} />
      </SettingRow>
      <SettingRow label="Комментарии" desc="">
        <Toggle on={s.pushComments} onChange={() => go("pushComments")} />
      </SettingRow>
      <SettingRow label="Заявки в друзья" desc="">
        <Toggle on={s.pushFriends} onChange={() => go("pushFriends")} />
      </SettingRow>
      <div className="pk-label mb-3 mt-5">Звук</div>
      <SettingRow label="Звуковые уведомления" desc="Воспроизводить звук при уведомлениях">
        <Toggle on={s.soundEnabled} onChange={() => go("soundEnabled")} />
      </SettingRow>
    </div>
  );
}

const ACCENT_COLORS = [
  { label: "Фиолетовый", value: "#7B4DFF", grad: "linear-gradient(135deg,#7B4DFF,#E94FCB)" },
  { label: "Синий",      value: "#3b82f6", grad: "linear-gradient(135deg,#3b82f6,#06b6d4)" },
  { label: "Зелёный",    value: "#10b981", grad: "linear-gradient(135deg,#10b981,#06b6d4)" },
];

function AppearanceSection({ s, set, onSave }: { s: SettingsState; set: (k: keyof SettingsState, v: unknown) => void; onSave: () => void }) {
  return (
    <div>
      <SectionTitle>Внешний вид</SectionTitle>
      <SettingRow label="Тёмная тема" desc="Всегда включена в Polka">
        <Toggle on={true} onChange={() => {}} />
      </SettingRow>
      <div className="py-3.5">
        <div className="text-sm font-medium mb-3" style={{ color: "var(--text-2)" }}>Акцентный цвет</div>
        <div className="flex gap-3">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => { set("accentColor", c.value); onSave(); }}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="w-10 h-10 rounded-xl transition-transform"
                style={{
                  background: c.grad,
                  transform: s.accentColor === c.value ? "scale(1.15)" : "scale(1)",
                  boxShadow: s.accentColor === c.value ? "0 0 0 2px var(--card), 0 0 0 4px " + c.value : "none",
                }}
              />
              <span className="text-[10px]" style={{ color: s.accentColor === c.value ? "var(--text-2)" : "var(--text-4)" }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const LANGUAGES = [
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "en", label: "English",    flag: "🇺🇸" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "es", label: "Español",    flag: "🇪🇸" },
];

function LanguageSection({ s, set, onSave }: { s: SettingsState; set: (k: keyof SettingsState, v: unknown) => void; onSave: () => void }) {
  return (
    <div>
      <SectionTitle>Язык интерфейса</SectionTitle>
      <div className="space-y-2">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-left"
            style={{
              background: s.language === l.code ? "rgba(123,77,255,0.1)" : "var(--surface)",
              border: `1px solid ${s.language === l.code ? "var(--border-accent)" : "var(--border)"}`,
            }}
            onClick={() => { set("language", l.code); onSave(); }}
          >
            <span className="text-xl">{l.flag}</span>
            <span className="text-sm font-medium flex-1" style={{ color: s.language === l.code ? "var(--text)" : "var(--text-2)" }}>{l.label}</span>
            {s.language === l.code && <Icon name="Check" size={15} style={{ color: "var(--accent)" }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "profile",       label: "Профиль",          icon: "User"       },
  { id: "security",      label: "Безопасность",      icon: "Shield"     },
  { id: "privacy",       label: "Конфиденциальность", icon: "Lock"       },
  { id: "notifications", label: "Уведомления",       icon: "Bell"       },
  { id: "appearance",    label: "Внешний вид",       icon: "Palette"    },
  { id: "language",      label: "Язык",              icon: "Globe"      },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Settings() {
  const [active,  setActive]  = useState<Section>("profile");
  const [toast,   setToast]   = useState("");
  const [settings, setSettings] = useState<SettingsState>({ ...DEFAULTS, ...load() });

  const set = (k: keyof SettingsState, v: unknown) =>
    setSettings(prev => ({ ...prev, [k]: v }));

  const save = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(settings));
    setToast("Настройки сохранены");
  };

  const sectionProps = { s: settings, set, onSave: save };

  return (
    <div className="animate-fade-in flex gap-4" style={{ minHeight: 600 }}>
      {/* Left nav */}
      <div className="pk-card p-3 flex-shrink-0" style={{ width: 204 }}>
        <div className="pk-label mb-3">Настройки</div>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`pk-nav-item ${active === item.id ? "active" : ""}`}
            >
              <Icon name={item.icon} size={15} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="pk-card p-5 flex-1 min-w-0">
        {active === "profile"       && <ProfileSection       {...sectionProps} />}
        {active === "security"      && <SecuritySection      {...sectionProps} />}
        {active === "privacy"       && <PrivacySection       {...sectionProps} />}
        {active === "notifications" && <NotificationsSection {...sectionProps} />}
        {active === "appearance"    && <AppearanceSection    {...sectionProps} />}
        {active === "language"      && <LanguageSection      {...sectionProps} />}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
    </div>
  );
}
