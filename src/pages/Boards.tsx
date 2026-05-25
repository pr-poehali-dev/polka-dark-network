import { useState } from "react";
import Icon from "@/components/ui/icon";
import { boards, feedItems } from "@/data/mockData";

type Board = { id: number; name: string; count: number; color: string; items: number[] };

// Accent colours for board previews (CSS-safe, no Tailwind)
const BOARD_CELL_SETS: string[][] = [
  ["#3b0a6e", "#6d1b7b", "#0f2040", "#1e3a6e"],
  ["#400a0a", "#6e1b2a", "#064e3b", "#065f46"],
  ["#1a1207", "#3d2a0d", "#0f172a", "#1e3a5f"],
  ["#3b0764", "#6d1b7b", "#1a0533", "#2d0a55"],
];

const GRADIENT_OPTIONS: string[] = [
  "linear-gradient(135deg,#7B4DFF,#E94FCB)",
  "linear-gradient(135deg,#E94FCB,#ff6b6b)",
  "linear-gradient(135deg,#3b82f6,#6366f1)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#f97316)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
];

const ITEM_COLORS = [
  "linear-gradient(135deg,#3b0a6e,#6d1b7b)",
  "linear-gradient(135deg,#0f2040,#1e3a6e)",
  "linear-gradient(135deg,#400a0a,#6e1b2a)",
  "linear-gradient(135deg,#064e3b,#065f46)",
  "linear-gradient(135deg,#1a1207,#3d2a0d)",
  "linear-gradient(135deg,#1a0533,#2d0a55)",
  "linear-gradient(135deg,#0f172a,#1e3a5f)",
  "linear-gradient(135deg,#3b0764,#6d1b7b)",
];

const ALTERNATIVES = [
  { id: 101, gradient: "linear-gradient(135deg,#3b0a6e,#6d1b7b)", text: "Похожая архитектура", icon: "Building2" },
  { id: 102, gradient: "linear-gradient(135deg,#1a0533,#2d0a55)", text: "В похожем стиле", icon: "Palette" },
  { id: 103, gradient: "linear-gradient(135deg,#1a1207,#3d2a0d)", text: "Близкая палитра", icon: "Droplets" },
  { id: 104, gradient: "linear-gradient(135deg,#064e3b,#065f46)", text: "Смежная тема", icon: "Layers" },
  { id: 105, gradient: "linear-gradient(135deg,#0f2040,#1e3a6e)", text: "Из той же серии", icon: "Copy" },
  { id: 106, gradient: "linear-gradient(135deg,#400a0a,#6e1b2a)", text: "Вдохновлено этим", icon: "Sparkles" },
];

// ─── Cutout Editor ────────────────────────────────────────────────────────────
const EMOJIS = ["🌸", "🌙", "⭐", "🦋", "🎨", "🌊", "🔮", "💎"];

function CutoutEditor({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"upload" | "edit" | "done">("upload");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in pk-card p-6 w-[520px]"
        style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="pk-title">Вырезать объект</div>
            <div className="pk-subtitle mt-0.5">
              {step === "upload" && "Загрузите изображение"}
              {step === "edit" && "Выделите объект"}
              {step === "done" && "Готово!"}
            </div>
          </div>
          <button className="pk-icon-btn" onClick={onClose}>
            <Icon name="X" size={14} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-5">
          {(["upload", "edit", "done"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background:
                    step === s
                      ? "var(--accent-grad)"
                      : (["upload", "edit", "done"].indexOf(step) > i)
                      ? "rgba(123,77,255,0.3)"
                      : "var(--surface)",
                  color:
                    step === s || (["upload", "edit", "done"].indexOf(step) > i)
                      ? "#fff"
                      : "var(--text-4)",
                  border: "1px solid var(--border)",
                }}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className="flex-1 h-px"
                  style={{
                    width: 40,
                    background:
                      (["upload", "edit", "done"].indexOf(step) > i)
                        ? "var(--accent)"
                        : "var(--border)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {step === "upload" && (
          <div>
            <div
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-14 mb-4 cursor-pointer transition-all"
              style={{
                borderColor: "rgba(123,77,255,0.4)",
                background: "rgba(123,77,255,0.05)",
              }}
              onClick={() => setStep("edit")}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "rgba(123,77,255,0.4)")
              }
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(123,77,255,0.12)" }}
              >
                <Icon name="Upload" size={26} style={{ color: "var(--accent)" }} />
              </div>
              <div className="font-semibold mb-1" style={{ color: "var(--text)" }}>
                Загрузите изображение
              </div>
              <div className="pk-subtitle">PNG, JPG до 20 МБ · нажмите или перетащите</div>
            </div>
          </div>
        )}

        {step === "edit" && (
          <div>
            <div
              className="rounded-2xl mb-4 relative flex items-center justify-center overflow-hidden"
              style={{ height: 260, background: "linear-gradient(135deg,#1a0533,#0a0a25)" }}
            >
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(135deg,rgba(233,79,203,0.25),rgba(123,77,255,0.25))" }}
              />
              <div className="relative text-center z-10">
                <div className="text-7xl mb-2">{selected ?? "🌸"}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Объект выделен
                </div>
              </div>
              {/* Dashed selection box */}
              <div
                className="absolute"
                style={{
                  inset: 24,
                  border: "2px dashed rgba(123,77,255,0.7)",
                  borderRadius: 12,
                }}
              >
                {(["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const).map(
                  (pos) => (
                    <div
                      key={pos}
                      className={`absolute ${pos} w-3 h-3 rounded-sm`}
                      style={{ background: "var(--accent-grad)", margin: -2 }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="mb-5">
              <div className="pk-label mb-2">Выберите объект для вырезки</div>
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map((em) => (
                  <button
                    key={em}
                    onClick={() => setSelected(em)}
                    className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background:
                        selected === em
                          ? "rgba(123,77,255,0.18)"
                          : "var(--surface)",
                      border: `1px solid ${selected === em ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="pk-btn pk-btn-ghost flex-1"
                onClick={() => setStep("upload")}
              >
                <Icon name="ArrowLeft" size={13} />
                Назад
              </button>
              <button
                className="pk-btn pk-btn-primary flex-1"
                onClick={() => setStep("done")}
              >
                <Icon name="Scissors" size={13} />
                Вырезать
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
              style={{ background: "rgba(123,77,255,0.12)", border: "1px solid rgba(123,77,255,0.3)" }}
            >
              {selected ?? "🌸"}
            </div>
            <div className="pk-title mb-2">Объект вырезан!</div>
            <div className="pk-subtitle mb-6 max-w-xs mx-auto">
              Объект сохранён на прозрачном фоне и готов к использованию
              в постах и историях
            </div>
            <div className="flex gap-2 justify-center">
              <button className="pk-btn pk-btn-ghost text-sm" onClick={onClose}>
                <Icon name="Download" size={13} />
                Скачать PNG
              </button>
              <button className="pk-btn pk-btn-primary text-sm" onClick={onClose}>
                <Icon name="Plus" size={13} />
                На доску
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── New Board Modal ──────────────────────────────────────────────────────────
function NewBoardModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, gradient: string) => void;
}) {
  const [name, setName] = useState("");
  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in pk-card p-5 w-80"
        style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="pk-title">Новая доска</span>
          <button className="pk-icon-btn" onClick={onClose}>
            <Icon name="X" size={14} />
          </button>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название доски…"
          className="pk-input mb-4"
          autoFocus
        />

        <div className="pk-label mb-2">Цвет обложки</div>
        <div className="flex gap-2 mb-5 flex-wrap">
          {GRADIENT_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => setGradient(g)}
              className="rounded-xl transition-all"
              style={{
                width: 38,
                height: 38,
                background: g,
                border: `2px solid ${gradient === g ? "var(--text)" : "transparent"}`,
                transform: gradient === g ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <button
          className="pk-btn pk-btn-primary w-full"
          onClick={() => {
            onCreate(name, gradient);
            onClose();
          }}
          disabled={!name.trim()}
        >
          <Icon name="Plus" size={13} />
          Создать доску
        </button>
      </div>
    </div>
  );
}

// ─── Board Card ───────────────────────────────────────────────────────────────
function BoardCard({
  board,
  cellColors,
  onClick,
}: {
  board: Board;
  cellColors: string[];
  onClick: () => void;
}) {
  return (
    <div
      className="pk-card pk-card-hover p-3 cursor-pointer"
      onClick={onClick}
    >
      {/* 2×2 preview */}
      <div
        className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden mb-3"
        style={{ height: 90 }}
      >
        {cellColors.map((c, i) => (
          <div key={i} style={{ background: c }} />
        ))}
      </div>
      <div className="font-semibold text-sm mb-0.5" style={{ color: "var(--text)" }}>
        {board.name}
      </div>
      <div className="pk-subtitle">{board.count} объектов</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Boards() {
  const [allBoards, setAllBoards] = useState<Board[]>(boards);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [showAlts, setShowAlts] = useState(false);
  const [showCutout, setShowCutout] = useState(false);
  const [showNewBoard, setShowNewBoard] = useState(false);

  const handleCreate = (name: string, gradient: string) => {
    if (!name.trim()) return;
    setAllBoards((prev) => [
      ...prev,
      { id: Date.now(), name, count: 0, color: gradient, items: [] },
    ]);
  };

  const boardItems = activeBoard
    ? feedItems.filter((_, i) => activeBoard.items.includes(i + 1) || i < 6)
    : [];

  return (
    <div className="animate-fade-in space-y-4">
      {/* Toolbar */}
      <div className="pk-card p-4 flex items-center gap-3">
        {activeBoard ? (
          <>
            <button
              className="pk-icon-btn"
              onClick={() => { setActiveBoard(null); setShowAlts(false); }}
            >
              <Icon name="ArrowLeft" size={15} />
            </button>
            <div className="flex-1">
              <div className="pk-title">{activeBoard.name}</div>
              <div className="pk-subtitle">{activeBoard.count} объектов</div>
            </div>
            <button
              className="pk-btn pk-btn-ghost text-xs"
              onClick={() => setShowCutout(true)}
            >
              <Icon name="Scissors" size={12} />
              Вырезать
            </button>
            <button
              className={`pk-btn text-xs ${showAlts ? "pk-btn-primary" : "pk-btn-ghost"}`}
              onClick={() => setShowAlts((s) => !s)}
            >
              <Icon name="Sparkles" size={12} />
              {showAlts ? "Скрыть ИИ" : "ИИ альтернативы"}
            </button>
          </>
        ) : (
          <>
            <div className="flex-1">
              <div className="pk-title">Мои доски</div>
              <div className="pk-subtitle">{allBoards.length} досок</div>
            </div>
            <button
              className="pk-btn pk-btn-primary text-sm"
              onClick={() => setShowNewBoard(true)}
            >
              <Icon name="Plus" size={14} />
              Создать
            </button>
          </>
        )}
      </div>

      {/* Board open view */}
      {activeBoard ? (
        <div className={`flex gap-4 ${showAlts ? "items-start" : ""}`}>
          {/* Masonry items */}
          <div className={`${showAlts ? "flex-1" : "w-full"}`}>
            <div className="columns-3 gap-3 space-y-0">
              {boardItems.map((item, i) => (
                <div
                  key={item.id}
                  className="pk-card-hover rounded-xl overflow-hidden cursor-pointer mb-3 break-inside-avoid group"
                  style={{
                    background: ITEM_COLORS[i % ITEM_COLORS.length],
                    height: 100 + (i % 3) * 60,
                  }}
                >
                  <div className="w-full h-full relative flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(to top,rgba(0,0,0,0.5),transparent)" }}>
                    <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}

              {/* Add item tile */}
              <div
                className="rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer mb-3 break-inside-avoid transition-all"
                style={{
                  height: 120,
                  borderColor: "rgba(123,77,255,0.35)",
                  background: "rgba(123,77,255,0.04)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "rgba(123,77,255,0.35)")
                }
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon name="Plus" size={24} style={{ color: "var(--accent)" }} />
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>
                    Добавить
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI alternatives panel */}
          {showAlts && (
            <div
              className="pk-card p-4 animate-slide-up"
              style={{ width: 260, flexShrink: 0 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--accent-grad)" }}
                >
                  <Icon name="Sparkles" size={14} style={{ color: "#fff" }} />
                </div>
                <div className="pk-title text-sm">ИИ подборка</div>
              </div>
              <div className="pk-subtitle mb-4">
                Похожие объекты на основе вашей доски
              </div>
              <div className="space-y-2">
                {ALTERNATIVES.map((alt) => (
                  <div
                    key={alt.id}
                    className="rounded-xl overflow-hidden cursor-pointer group pk-card-hover"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{ height: 70, background: alt.gradient }}
                    >
                      <Icon
                        name={alt.icon}
                        size={22}
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      />
                    </div>
                    <div
                      className="px-2 py-2 flex items-center justify-between"
                      style={{ background: "var(--card)" }}
                    >
                      <span className="text-xs font-medium" style={{ color: "var(--text-2)" }}>
                        {alt.text}
                      </span>
                      <button
                        className="pk-icon-btn"
                        style={{ width: 24, height: 24 }}
                      >
                        <Icon name="Plus" size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="pk-btn pk-btn-ghost w-full mt-3 text-xs">
                <Icon name="RefreshCw" size={11} />
                Обновить подборку
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Board grid */
        <div className="grid grid-cols-4 gap-4">
          {allBoards.map((b, i) => (
            <BoardCard
              key={b.id}
              board={b}
              cellColors={BOARD_CELL_SETS[i % BOARD_CELL_SETS.length]}
              onClick={() => setActiveBoard(b)}
            />
          ))}

          {/* New board tile */}
          <div
            className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
            style={{
              minHeight: 150,
              borderColor: "rgba(123,77,255,0.3)",
              background: "rgba(123,77,255,0.03)",
            }}
            onClick={() => setShowNewBoard(true)}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "rgba(123,77,255,0.3)")
            }
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(123,77,255,0.12)" }}
            >
              <Icon name="Plus" size={20} style={{ color: "var(--accent)" }} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--text-4)" }}>
              Новая доска
            </span>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCutout && <CutoutEditor onClose={() => setShowCutout(false)} />}
      {showNewBoard && (
        <NewBoardModal onClose={() => setShowNewBoard(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
