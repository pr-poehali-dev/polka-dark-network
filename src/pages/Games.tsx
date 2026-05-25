import Icon from "@/components/ui/icon";
import { games } from "@/data/mockData";

const categories = ["Все", "Стратегия", "Логика", "Аркада", "Социальные", "Знания"];
const gameColors = [
  "from-violet-800/60 to-purple-900/40",
  "from-blue-800/60 to-cyan-900/40",
  "from-emerald-800/60 to-teal-900/40",
  "from-orange-800/60 to-amber-900/40",
  "from-pink-800/60 to-rose-900/40",
  "from-fuchsia-800/60 to-pink-900/40",
];
const gameIcons = ["Crown", "Anchor", "Type", "Users", "Puzzle", "Brain"];

export default function Games() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4 flex items-center gap-4">
        <span className="section-title">Игры</span>
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button key={c} className={`tab-item text-sm ${c === "Все" ? "active" : ""}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="section-title mb-4">Популярные</div>
        <div className="grid grid-cols-3 gap-4">
          {games.map((game, i) => (
            <div key={game.id} className="group cursor-pointer">
              <div className={`rounded-2xl bg-gradient-to-br ${gameColors[i % gameColors.length]} flex items-center justify-center mb-3 relative overflow-hidden transition-all group-hover:scale-105`}
                style={{ height: "140px" }}>
                <Icon name={gameIcons[i % gameIcons.length]} size={52} style={{ color: "rgba(255,255,255,0.2)" }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.35)" }}>
                  <button className="btn-primary text-sm px-5 py-2">Играть</button>
                </div>
              </div>
              <div className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-primary)" }}>{game.name}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{game.category}</span>
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={11} style={{ color: "#f59e0b" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{game.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                <Icon name="Users" size={10} />{game.players} играют
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="section-title mb-4">Рекомендовано для вас</div>
        <div className="grid grid-cols-2 gap-3">
          {[...games].reverse().map((game, i) => (
            <div key={game.id} className="flex items-center gap-3 p-3 rounded-xl glass-hover cursor-pointer"
              style={{ border: "1px solid var(--border-subtle)" }}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gameColors[(i + 3) % gameColors.length]} flex items-center justify-center flex-shrink-0`}>
                <Icon name={gameIcons[(i + 2) % gameIcons.length]} size={22} style={{ color: "rgba(255,255,255,0.6)" }} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{game.name}</div>
                <div className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                  <Icon name="Star" size={10} style={{ color: "#f59e0b" }} />{game.rating} · {game.players}
                </div>
              </div>
              <button className="btn-ghost text-xs py-1.5 px-3">Играть</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
