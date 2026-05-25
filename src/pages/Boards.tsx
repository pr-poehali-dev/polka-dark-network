import { useState } from "react";
import Icon from "@/components/ui/icon";
import { boards, feedItems } from "@/data/mockData";

type Board = { id: number; name: string; count: number; color: string; items: number[] };

const ALTERNATIVES = [
  { id: 101, color: "from-pink-900/70 to-rose-800/50", text: "Похожая архитектура" },
  { id: 102, color: "from-violet-900/70 to-purple-800/50", text: "В похожем стиле" },
  { id: 103, color: "from-amber-900/70 to-orange-800/50", text: "Близкая палитра" },
  { id: 104, color: "from-teal-900/70 to-cyan-800/50", text: "Смежная тема" },
  { id: 105, color: "from-indigo-900/70 to-blue-800/50", text: "Из той же серии" },
  { id: 106, color: "from-fuchsia-900/70 to-pink-800/50", text: "Вдохновлено этим" },
];

// Cutout editor modal
function CutoutEditor({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"upload" | "edit" | "done">("upload");
  const [selectedObj, setSelectedObj] = useState<string | null>(null);

  const objects = ["🌸", "🌙", "⭐", "🦋", "🎨", "🌊", "🔮", "💎"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.85)" }} onClick={onClose}>
      <div className="animate-scale-in card p-6 w-[520px]" style={{ background: "#0e0e28", boxShadow: "var(--shadow-elevated)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <span className="section-title">Вырезать объект</span>
          <button className="btn-icon" onClick={onClose}><Icon name="X" size={15} /></button>
        </div>

        {step === "upload" && (
          <div>
            <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-12 mb-4 cursor-pointer hover:border-violet-500 transition-colors"
              style={{ borderColor: "rgba(139,92,246,0.35)", background: "rgba(139,92,246,0.05)" }}
              onClick={() => setStep("edit")}>
              <Icon name="Upload" size={36} style={{ color: "var(--accent-1)" }} />
              <div className="mt-3 font-semibold" style={{ color: "var(--text-primary)" }}>Загрузите изображение</div>
              <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>PNG, JPG до 20 МБ</div>
            </div>
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              Или нажмите, чтобы выбрать файл
            </p>
          </div>
        )}

        {step === "edit" && (
          <div>
            <div className="rounded-2xl mb-4 relative flex items-center justify-center"
              style={{ height: 280, background: "linear-gradient(135deg, #1a0533, #0a0a25)" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 to-violet-900/40 rounded-2xl" />
              <div className="relative text-center">
                <div className="text-6xl mb-2">{selectedObj ?? "🌸"}</div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Объект выделен</p>
              </div>
              {/* Selection handles */}
              <div className="absolute inset-4 rounded-xl" style={{ border: "2px dashed rgba(139,92,246,0.7)" }}>
                {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(pos => (
                  <div key={pos} className={`absolute ${pos} w-3 h-3 rounded-sm -translate-x-0.5 -translate-y-0.5`}
                    style={{ background: "var(--accent-gradient)" }} />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>Выберите объект для вырезки:</p>
              <div className="flex gap-2 flex-wrap">
                {objects.map(obj => (
                  <button key={obj} onClick={() => setSelectedObj(obj)}
                    className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: selectedObj === obj ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${selectedObj === obj ? "rgba(139,92,246,0.5)" : "var(--border-subtle)"}` }}>
                    {obj}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn-ghost flex-1 justify-center text-sm" onClick={() => setStep("upload")}>
                <Icon name="ArrowLeft" size={13} />Назад
              </button>
              <button className="btn-primary flex-1 justify-center text-sm" onClick={() => setStep("done")}>
                <Icon name="Scissors" size={13} />Вырезать
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{selectedObj ?? "🌸"}</div>
            <div className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>Объект вырезан!</div>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Объект сохранён на прозрачном фоне и готов к использованию в постах и историях
            </p>
            <div className="flex gap-2 justify-center">
              <button className="btn-ghost text-sm" onClick={onClose}><Icon name="Download" size={13} />Скачать PNG</button>
              <button className="btn-primary text-sm" onClick={onClose}><Icon name="Plus" size={13} />Добавить на доску</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// New board modal
function NewBoardModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("from-violet-500/30 to-pink-500/20");
  const colors = [
    "from-violet-500/30 to-pink-500/20",
    "from-pink-500/30 to-rose-500/20",
    "from-blue-500/30 to-cyan-500/20",
    "from-emerald-500/30 to-teal-500/20",
    "from-amber-500/30 to-orange-500/20",
    "from-fuchsia-500/30 to-purple-500/20",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.75)" }} onClick={onClose}>
      <div className="animate-scale-in card p-5 w-80" style={{ background: "#10102a", boxShadow: "var(--shadow-elevated)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span className="section-title">Новая доска</span>
          <button className="btn-icon" onClick={onClose}><Icon name="X" size={14} /></button>
        </div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Название доски…"
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none mb-4"
          style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "Golos Text, sans-serif" }} />
        <p className="text-xs mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>Цвет обложки</p>
        <div className="flex gap-2 mb-4">
          {colors.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c} transition-all`}
              style={{ border: `2px solid ${color === c ? "white" : "transparent"}`, transform: color === c ? "scale(1.15)" : "scale(1)" }} />
          ))}
        </div>
        <button className="btn-primary w-full justify-center" onClick={() => { onCreate(name); onClose(); }} disabled={!name.trim()}>
          <Icon name="Plus" size={13} />Создать доску
        </button>
      </div>
    </div>
  );
}

export default function Boards() {
  const [allBoards, setAllBoards] = useState<Board[]>(boards);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [showAlts, setShowAlts] = useState(false);
  const [showCutout, setShowCutout] = useState(false);
  const [showNewBoard, setShowNewBoard] = useState(false);

  const handleCreate = (name: string) => {
    if (!name.trim()) return;
    setAllBoards(prev => [...prev, {
      id: Date.now(), name, count: 0,
      color: "from-violet-500/30 to-pink-500/20", items: [],
    }]);
  };

  const boardItems = activeBoard
    ? feedItems.filter((_, i) => activeBoard.items.includes(i + 1) || i < 6)
    : [];

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="card p-4 flex items-center gap-4">
        {activeBoard ? (
          <>
            <button className="btn-icon" onClick={() => setActiveBoard(null)}><Icon name="ArrowLeft" size={15} /></button>
            <span className="section-title">{activeBoard.name}</span>
            <span className="text-sm ml-1" style={{ color: "var(--text-secondary)" }}>{activeBoard.count} изображений</span>
          </>
        ) : (
          <span className="section-title">Мои доски</span>
        )}
        <div className="flex gap-2 ml-auto">
          <button className="btn-ghost text-sm" onClick={() => setShowCutout(true)}>
            <Icon name="Scissors" size={13} />Вырезать объект
          </button>
          <button className="btn-primary text-sm" onClick={() => setShowNewBoard(true)}>
            <Icon name="Plus" size={13} />Создать доску
          </button>
        </div>
      </div>

      {!activeBoard ? (
        <>
          {/* Board grid */}
          <div className="grid grid-cols-4 gap-4">
            {allBoards.map(b => (
              <div key={b.id} className="card overflow-hidden cursor-pointer card-hover" onClick={() => setActiveBoard(b)}>
                <div className={`h-28 bg-gradient-to-br ${b.color} flex items-center justify-center relative`}>
                  {/* Mini-grid preview */}
                  <div className="grid grid-cols-2 gap-0.5 w-16 h-16 rounded-xl overflow-hidden">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`bg-gradient-to-br ${feedItems[(b.id + i) % feedItems.length]?.color ?? "from-violet-900/40 to-purple-900/20"}`} />
                    ))}
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{b.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{b.count} изображений</div>
                </div>
              </div>
            ))}

            {/* Create new */}
            <button onClick={() => setShowNewBoard(true)}
              className="card flex flex-col items-center justify-center cursor-pointer glass-hover"
              style={{ minHeight: 160, border: "2px dashed rgba(139,92,246,0.3)" }}>
              <Icon name="Plus" size={28} style={{ color: "var(--accent-1)" }} />
              <span className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Создать доску</span>
            </button>
          </div>

          {/* Recent boards */}
          <div className="card p-5">
            <div className="section-title mb-4">Недавние доски</div>
            <div className="grid grid-cols-3 gap-4">
              {allBoards.slice(0, 3).map(b => (
                <div key={b.id} className="rounded-2xl overflow-hidden cursor-pointer card-hover" onClick={() => setActiveBoard(b)}>
                  <div className={`bg-gradient-to-br ${b.color} grid grid-cols-3 gap-0.5`} style={{ height: 100 }}>
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`bg-gradient-to-br ${feedItems[(b.id * 2 + i) % feedItems.length]?.color ?? "from-pink-900/40 to-rose-900/20"}`} />
                    ))}
                  </div>
                  <div className="p-2.5" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-subtle)" }}>
                    <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{b.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{b.count} изображений</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Board content + alternatives */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="columns-3 gap-3" style={{ columnGap: "12px" }}>
                {boardItems.map((item, i) => (
                  <div key={item.id} className="pin-item rounded-xl overflow-hidden cursor-pointer" style={{ height: [200, 150, 250, 180, 220, 160][i % 6], borderRadius: "var(--radius-lg)" }}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                    <div className="pin-overlay">
                      <p className="text-xs text-white/90 font-medium">{item.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-white/60 flex items-center gap-1"><Icon name="Heart" size={9} />{item.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar — alternatives */}
            <div className="w-60 flex-shrink-0 space-y-3">
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>На основе доски</span>
                  <button onClick={() => setShowAlts(!showAlts)} className="btn-icon">
                    <Icon name="Sparkles" size={14} style={{ color: "var(--accent-1)" }} />
                  </button>
                </div>
                <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                  ИИ предложит похожий контент на основе вашей коллекции
                </p>
                <button className="btn-primary w-full justify-center text-sm" onClick={() => setShowAlts(true)}>
                  <Icon name="Sparkles" size={12} />Предложить альтернативы
                </button>
              </div>

              {showAlts && (
                <div className="card p-4 animate-fade-in">
                  <div className="section-title text-sm mb-3 flex items-center gap-2">
                    <Icon name="Sparkles" size={14} style={{ color: "var(--accent-2)" }} />
                    Рекомендации
                  </div>
                  <div className="space-y-2">
                    {ALTERNATIVES.map(alt => (
                      <div key={alt.id} className="rounded-xl overflow-hidden cursor-pointer card-hover">
                        <div className={`h-20 bg-gradient-to-br ${alt.color} flex items-end p-2`}>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] text-white/80 font-medium">{alt.text}</span>
                            <button className="w-6 h-6 rounded-lg flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.2)" }}>
                              <Icon name="Plus" size={11} style={{ color: "#fff" }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {showCutout && <CutoutEditor onClose={() => setShowCutout(false)} />}
      {showNewBoard && <NewBoardModal onClose={() => setShowNewBoard(false)} onCreate={handleCreate} />}
    </div>
  );
}
