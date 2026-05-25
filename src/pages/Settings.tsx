import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser } from "@/data/mockData";

const sections = [
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "security", label: "Безопасность", icon: "Shield" },
  { id: "privacy", label: "Конфиденциальность", icon: "Lock" },
  { id: "notifications", label: "Уведомления", icon: "Bell" },
  { id: "appearance", label: "Внешний вид", icon: "Palette" },
  { id: "language", label: "Язык", icon: "Globe" },
];

const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className="relative w-11 h-6 rounded-full transition-all"
    style={{ background: on ? "var(--accent-gradient)" : "rgba(255,255,255,0.12)" }}
  >
    <div className="absolute top-1 w-4 h-4 rounded-full transition-all"
      style={{ background: "#fff", left: on ? "calc(100% - 20px)" : "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
  </button>
);

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [toggles, setToggles] = useState({ twoFA: false, pubProfile: true, showOnline: true, emailNotif: true, pushNotif: false, darkMode: true });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="animate-fade-in flex gap-4">
      {/* Left menu */}
      <div className="card p-3 flex flex-col gap-0.5" style={{ width: "200px", flexShrink: 0 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`nav-item w-full text-left ${activeSection === s.id ? "active" : ""}`}>
            <Icon name={s.icon} size={15} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        {activeSection === "profile" && (
          <>
            <div className="card p-5">
              <div className="section-title mb-5">Профиль</div>
              <div className="flex items-center gap-4 mb-6">
                <Avatar name={currentUser.name} size="xl" ring />
                <div>
                  <button className="btn-primary text-sm mb-2 flex items-center gap-1.5">
                    <Icon name="Camera" size={13} />
                    Изменить фото
                  </button>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>JPG, PNG, GIF · до 5 МБ</div>
                </div>
              </div>
              {[
                { label: "Имя", value: currentUser.name.split(" ")[0], placeholder: "Имя" },
                { label: "Фамилия", value: currentUser.name.split(" ")[1], placeholder: "Фамилия" },
                { label: "Никнейм", value: currentUser.username, placeholder: "@username" },
                { label: "О себе", value: currentUser.bio, placeholder: "Расскажите о себе…" },
              ].map(f => (
                <div key={f.label} className="mb-4">
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>{f.label}</label>
                  <input defaultValue={f.value} placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }} />
                </div>
              ))}
              <button className="btn-primary text-sm px-6">Сохранить</button>
            </div>
          </>
        )}

        {activeSection === "security" && (
          <div className="card p-5">
            <div className="section-title mb-5">Безопасность</div>
            <div className="space-y-4">
              {[
                { label: "Двухфакторная аутентификация", desc: "Дополнительный уровень защиты", key: "twoFA" },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{s.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.desc}</div>
                  </div>
                  <Toggle on={toggles[s.key as keyof typeof toggles]} onChange={() => toggle(s.key as keyof typeof toggles)} />
                </div>
              ))}
              <div className="mt-4">
                <button className="btn-ghost text-sm flex items-center gap-1.5 w-full justify-center">
                  <Icon name="Key" size={14} />
                  Изменить пароль
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "privacy" && (
          <div className="card p-5">
            <div className="section-title mb-5">Конфиденциальность</div>
            <div className="space-y-3">
              {[
                { label: "Публичный профиль", desc: "Все пользователи видят ваш профиль", key: "pubProfile" },
                { label: "Показывать онлайн-статус", desc: "Другие видят, когда вы онлайн", key: "showOnline" },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{s.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.desc}</div>
                  </div>
                  <Toggle on={toggles[s.key as keyof typeof toggles]} onChange={() => toggle(s.key as keyof typeof toggles)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="card p-5">
            <div className="section-title mb-5">Уведомления</div>
            <div className="space-y-3">
              {[
                { label: "Email-уведомления", desc: "Получать уведомления на почту", key: "emailNotif" },
                { label: "Push-уведомления", desc: "Уведомления в браузере", key: "pushNotif" },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{s.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.desc}</div>
                  </div>
                  <Toggle on={toggles[s.key as keyof typeof toggles]} onChange={() => toggle(s.key as keyof typeof toggles)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeSection === "appearance" || activeSection === "language") && (
          <div className="card p-5">
            <div className="section-title mb-5">{sections.find(s => s.id === activeSection)?.label}</div>
            <div className="flex flex-col items-center py-8" style={{ color: "var(--text-muted)" }}>
              <Icon name="Settings" size={36} />
              <div className="mt-2 text-sm">Настройки в разработке</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
