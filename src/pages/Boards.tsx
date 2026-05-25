import Icon from "@/components/ui/icon";
import { boards } from "@/data/mockData";

const sharedBoards = [
  { id: 5, name: "Общий проект команды", count: 89, color: "from-violet-500 to-indigo-600", shared: true, members: 5 },
  { id: 6, name: "Вдохновение 2026", count: 134, color: "from-pink-500 to-fuchsia-600", shared: true, members: 12 },
];

export default function Boards() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4 flex items-center justify-between">
        <span className="section-title">Доски</span>
        <button className="btn-primary text-sm flex items-center gap-1.5">
          <Icon name="Plus" size={13} />
          Новая доска
        </button>
      </div>

      {/* Recent */}
      <div className="card p-5">
        <div className="section-title mb-4 flex items-center gap-2">
          <Icon name="Clock" size={15} style={{ color: "var(--accent-1)" }} />
          Недавние
        </div>
        <div className="grid grid-cols-4 gap-4">
          {boards.map(b => (
            <div key={b.id} className="cursor-pointer group">
              <div className={`rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-2.5 relative overflow-hidden transition-all group-hover:scale-105`}
                style={{ height: "110px" }}>
                <Icon name="LayoutGrid" size={36} style={{ color: "rgba(255,255,255,0.25)" }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.3)" }}>
                  <Icon name="ExternalLink" size={20} style={{ color: "#fff" }} />
                </div>
              </div>
              <div className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-primary)" }}>{b.name}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{b.count} карточек</span>
                {b.shared && (
                  <div className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(124,92,252,0.15)", color: "#c4b5fd" }}>
                    <Icon name="Users" size={9} />
                    Общая
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared */}
      <div className="card p-5">
        <div className="section-title mb-4 flex items-center gap-2">
          <Icon name="Users" size={15} style={{ color: "var(--accent-1)" }} />
          Общие доски
        </div>
        <div className="grid grid-cols-2 gap-4">
          {sharedBoards.map(b => (
            <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer glass-hover"
              style={{ border: "1px solid var(--border-subtle)" }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center flex-shrink-0`}>
                <Icon name="Users" size={24} style={{ color: "rgba(255,255,255,0.7)" }} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{b.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{b.count} карточек · {b.members} участников</div>
              </div>
              <button className="btn-ghost text-xs py-1.5 px-3">Открыть</button>
            </div>
          ))}
        </div>
      </div>

      {/* Empty folder */}
      <div className="card p-5">
        <div className="section-title mb-4 flex items-center gap-2">
          <Icon name="Folder" size={15} style={{ color: "var(--accent-1)" }} />
          Архив
        </div>
        <div className="flex flex-col items-center py-8" style={{ color: "var(--text-muted)" }}>
          <Icon name="FolderOpen" size={40} />
          <div className="mt-2 text-sm">Архив пуст</div>
        </div>
      </div>
    </div>
  );
}
