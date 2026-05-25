import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { bookmarks } from "@/data/mockData";

const collections = ["Все", "Вдохновение", "Арт", "Работа", "Личное"];

export default function Bookmarks() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4 flex items-center gap-4">
        <span className="section-title">Закладки</span>
        <div className="flex gap-1">
          {collections.map(c => (
            <button key={c} className={`tab-item text-sm ${c === "Все" ? "active" : ""}`}>{c}</button>
          ))}
        </div>
        <button className="btn-ghost ml-auto text-sm flex items-center gap-1.5">
          <Icon name="FolderPlus" size={13} />
          Коллекция
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {bookmarks.map(b => (
          <div key={b.id} className="card overflow-hidden cursor-pointer group hover:border-violet-500/30 transition-all">
            <div className="h-36 bg-gradient-to-br from-violet-900/40 to-purple-900/20 flex items-center justify-center">
              <Icon name="Image" size={36} style={{ color: "rgba(255,255,255,0.15)" }} />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <Avatar name={b.post.user.name} colorClass={b.post.user.avatarColor} size="xs" />
                <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{b.post.user.name}</span>
              </div>
              <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--text-secondary)" }}>{b.post.text}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(124,92,252,0.15)", color: "#c4b5fd" }}>
                  {b.collection}
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Сохранено {b.savedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-16 flex flex-col items-center text-center opacity-40">
        <Icon name="Bookmark" size={40} style={{ color: "var(--text-muted)" }} />
        <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>Сохраняйте посты в закладки</div>
      </div>
    </div>
  );
}
