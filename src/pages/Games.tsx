import { useState } from "react";
import Icon from "@/components/ui/icon";
import { games } from "@/data/mockData";

const CATEGORIES = ["Все", "Гонки", "Приключения", "Логика", "Стратегия", "Аркада", "Головоломки"];

// Gradient covers — pure CSS, no images
const COVER_GRADIENTS = [
  "linear-gradient(135deg,#1a0533 0%,#3b0a6e 50%,#6d1b7b 100%)",
  "linear-gradient(135deg,#0a1628 0%,#1e3a6e 50%,#3b82f6 100%)",
  "linear-gradient(135deg,#064e3b 0%,#065f46 50%,#10b981 100%)",
  "linear-gradient(135deg,#1a1207 0%,#3d2a0d 50%,#f59e0b 100%)",
  "linear-gradient(135deg,#400a0a 0%,#6e1b2a 50%,#ef4444 100%)",
  "linear-gradient(135deg,#0f172a 0%,#312e81 50%,#6366f1 100%)",
  "linear-gradient(135deg,#1a0533 0%,#6d1b7b 50%,#ec4899 100%)",
  "linear-gradient(135deg,#07180e 0%,#065f46 50%,#06b6d4 100%)",
];

const GAME_ICONS = ["Crown", "Compass", "Puzzle", "Shield", "Zap", "Brain", "Target", "Gamepad2"];

// Extended games list (mock, since mockData only has 4)
const EXTRA_GAMES = [
  { id: 5, name: "Shadow Realm", category: "Аркада", players: "4.2К", rating: 4.4 },
  { id: 6, name: "Mind Maze", category: "Головоломки", players: "9.3К", rating: 4.6 },
  { id: 7, name: "Speed Force", category: "Гонки", players: "7.8К", rating: 4.3 },
  { id: 8, name: "Lost Worlds", category: "Приключения", players: "5.5К", rating: 4.5 },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Icon
          key={s}
          name="Star"
          size={10}
          style={{
            color: s <= Math.round(value) ? "#f59e0b" : "var(--text-4)",
            fill: s <= Math.round(value) ? "#f59e0b" : "none",
          }}
        />
      ))}
      <span className="text-xs ml-1" style={{ color: "var(--text-3)" }}>
        {value}
      </span>
    </div>
  );
}

// ─── Popular Game Card ────────────────────────────────────────────────────────
function PopularCard({
  game,
  idx,
  onPlay,
}: {
  game: { id: number; name: string; category: string; players: string; rating: number };
  idx: number;
  onPlay: () => void;
}) {
  return (
    <div className="pk-card-hover rounded-xl overflow-hidden cursor-pointer group">
      {/* Cover */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: 150, background: COVER_GRADIENTS[idx % COVER_GRADIENTS.length] }}
      >
        {/* Glow blob */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 120,
            height: 120,
            background: "rgba(255,255,255,0.08)",
            filter: "blur(30px)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        <Icon
          name={GAME_ICONS[idx % GAME_ICONS.length]}
          size={48}
          style={{ color: "rgba(255,255,255,0.18)", position: "relative", zIndex: 1 }}
        />
        {/* Hover play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <button
            className="pk-btn pk-btn-primary text-sm"
            onClick={(e) => { e.stopPropagation(); onPlay(); }}
          >
            <Icon name="Play" size={14} />
            Играть
          </button>
        </div>
        {/* Category badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{
            background: "rgba(0,0,0,0.5)",
            color: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(4px)",
          }}
        >
          {game.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-3" style={{ background: "var(--card)" }}>
        <div className="font-semibold text-sm mb-1" style={{ color: "var(--text)" }}>
          {game.name}
        </div>
        <StarRating value={game.rating} />
        <div
          className="flex items-center gap-1 mt-1.5 text-xs"
          style={{ color: "var(--text-4)" }}
        >
          <Icon name="Users" size={10} />
          {game.players} играют
        </div>
      </div>
    </div>
  );
}

// ─── Recommended Row Card ─────────────────────────────────────────────────────
function RecommendCard({
  game,
  idx,
  onPlay,
}: {
  game: { id: number; name: string; category: string; players: string; rating: number };
  idx: number;
  onPlay: () => void;
}) {
  return (
    <div
      className="pk-card-hover flex items-center gap-3 p-3 rounded-xl cursor-pointer"
      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div
        className="rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          width: 52,
          height: 52,
          background: COVER_GRADIENTS[(idx + 4) % COVER_GRADIENTS.length],
        }}
      >
        <Icon
          name={GAME_ICONS[(idx + 3) % GAME_ICONS.length]}
          size={22}
          style={{ color: "rgba(255,255,255,0.5)" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
          {game.name}
        </div>
        <div className="pk-subtitle">{game.category}</div>
        <StarRating value={game.rating} />
      </div>
      <button
        className="pk-btn pk-btn-ghost text-xs flex-shrink-0"
        onClick={(e) => { e.stopPropagation(); onPlay(); }}
      >
        <Icon name="Play" size={12} />
        Играть
      </button>
    </div>
  );
}

// ─── Play Modal ───────────────────────────────────────────────────────────────
function PlayModal({
  game,
  onClose,
}: {
  game: { name: string; category: string; rating: number; players: string };
  idx: number;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)" }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in pk-card p-0 overflow-hidden w-80"
        style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div
          className="flex items-center justify-center relative"
          style={{ height: 160, background: COVER_GRADIENTS[0] }}
        >
          <Icon name="Gamepad2" size={52} style={{ color: "rgba(255,255,255,0.15)" }} />
          <button
            className="pk-icon-btn absolute top-3 right-3"
            style={{ background: "rgba(0,0,0,0.5)", border: "none" }}
            onClick={onClose}
          >
            <Icon name="X" size={13} style={{ color: "#fff" }} />
          </button>
        </div>
        {/* Details */}
        <div className="p-5">
          <div className="pk-title mb-1">{game.name}</div>
          <div className="pk-subtitle mb-3">{game.category}</div>
          <div className="flex items-center gap-4 mb-4">
            <StarRating value={game.rating} />
            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-4)" }}>
              <Icon name="Users" size={10} />
              {game.players}
            </div>
          </div>
          <div
            className="rounded-xl p-3 mb-4 text-xs leading-relaxed"
            style={{ background: "var(--surface)", color: "var(--text-3)" }}
          >
            Захватывающая игра в жанре {game.category.toLowerCase()}. Соревнуйтесь
            с другими игроками и достигайте новых рекордов!
          </div>
          <button className="pk-btn pk-btn-primary w-full">
            <Icon name="Play" size={14} />
            Начать игру
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Games() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [playingGame, setPlayingGame] = useState<typeof allGames[0] | null>(null);
  const [playingIdx, setPlayingIdx] = useState(0);

  const allGames = [...games, ...EXTRA_GAMES];

  const popularGames =
    activeCategory === "Все"
      ? allGames
      : allGames.filter((g) => g.category === activeCategory);

  const recommendedGames = [...allGames]
    .reverse()
    .filter((g) =>
      activeCategory === "Все" ? true : g.category === activeCategory
    );

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header + category pills */}
      <div className="pk-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="pk-title">Игры</div>
            <div className="pk-subtitle">{allGames.length} игр в каталоге</div>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-grad)" }}
          >
            <Icon name="Gamepad2" size={18} style={{ color: "#fff" }} />
          </div>
        </div>
        {/* Scrollable category pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="pk-tab flex-shrink-0"
              style={
                activeCategory === cat
                  ? {
                      background: "var(--accent-grad)",
                      color: "#fff",
                      border: "1px solid transparent",
                    }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Popular games — 2-col grid */}
      <div className="pk-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="pk-title">Популярные</div>
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-4)" }}>
            <Icon name="TrendingUp" size={13} />
            Топ сейчас
          </div>
        </div>
        {popularGames.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {popularGames.map((game, i) => (
              <PopularCard
                key={game.id}
                game={game}
                idx={i}
                onPlay={() => { setPlayingGame(game); setPlayingIdx(i); }}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center gap-3 text-center">
            <Icon name="Gamepad2" size={36} style={{ color: "var(--text-4)" }} />
            <div className="pk-subtitle">Игры в этой категории не найдены</div>
          </div>
        )}
      </div>

      {/* Recommended — 2 per row list */}
      <div className="pk-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="pk-title">Рекомендовано</div>
          <button className="pk-btn pk-btn-ghost text-xs">
            <Icon name="Sparkles" size={11} />
            ИИ подбор
          </button>
        </div>
        {recommendedGames.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {recommendedGames.map((game, i) => (
              <RecommendCard
                key={game.id}
                game={game}
                idx={i}
                onPlay={() => { setPlayingGame(game); setPlayingIdx(i); }}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <Icon name="Search" size={28} style={{ color: "var(--text-4)" }} />
            <div className="pk-subtitle">Ничего не найдено</div>
          </div>
        )}
      </div>

      {/* Play modal */}
      {playingGame && (
        <PlayModal
          game={playingGame}
          idx={playingIdx}
          onClose={() => setPlayingGame(null)}
        />
      )}
    </div>
  );
}
