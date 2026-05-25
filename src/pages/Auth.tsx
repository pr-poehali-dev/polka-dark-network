import { useEffect, useState } from "react";
import { useVkAuth } from "@/components/extensions/vk-auth/useVkAuth";
import { VkLoginButton } from "@/components/extensions/vk-auth/VkLoginButton";

const AUTH_URL = "https://functions.poehali.dev/9f86ad28-07a8-45c2-9c35-fbb7d9fdc277";

const apiUrls = {
  authUrl: `${AUTH_URL}?action=auth-url`,
  callback: `${AUTH_URL}?action=callback`,
  refresh: `${AUTH_URL}?action=refresh`,
  logout: `${AUTH_URL}?action=logout`,
};

interface AuthPageProps {
  onAuth: () => void;
}

export default function Auth({ onAuth }: AuthPageProps) {
  const auth = useVkAuth({ apiUrls });
  const [isCallback, setIsCallback] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) {
      setIsCallback(true);
      auth.handleCallback(params).then(success => {
        if (success) {
          window.history.replaceState({}, "", window.location.pathname);
          onAuth();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) onAuth();
  }, [auth.isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: "var(--bg-deep)" }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute" style={{ top: "10%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", filter: "blur(100px)" }} />
        <div className="absolute" style={{ bottom: "10%", right: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)", filter: "blur(100px)" }} />
      </div>

      <div className="relative animate-fade-in text-center" style={{ maxWidth: 400, width: "100%", padding: "0 24px" }}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img
            src="https://cdn.poehali.dev/files/388adf78-f436-4fcf-a8ff-46ee7844de64.svg"
            alt="Polka"
            className="w-12 h-12 object-contain"
            style={{ filter: "drop-shadow(0 0 12px rgba(139,92,246,0.6))" }}
          />
          <span className="font-black text-3xl tracking-tight" style={{ color: "var(--text-primary)" }}>Polka</span>
        </div>

        {/* Card */}
        <div className="card p-8" style={{ boxShadow: "var(--shadow-elevated)" }}>
          {isCallback && !auth.isAuthenticated ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--accent-gradient)" }}>
                <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <div className="font-semibold" style={{ color: "var(--text-primary)" }}>Выполняем вход…</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Подождите несколько секунд</div>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Добро пожаловать</h1>
              <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                Войдите, чтобы продолжить использование Polka
              </p>

              <VkLoginButton
                onClick={auth.login}
                isLoading={auth.isLoading}
                buttonText="Войти через ВКонтакте"
                className="w-full justify-center py-3 text-sm font-semibold rounded-xl"
              />

              {auth.error && (
                <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                  {auth.error}
                </div>
              )}

              <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Продолжая, вы соглашаетесь с условиями использования Polka
                </p>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
          ⚠️ Проверяйте авторизацию в отдельной вкладке, не в редакторе
        </p>
      </div>
    </div>
  );
}
