import Icon from "@/components/ui/icon";

const photoColors = [
  "from-violet-900/70 to-purple-800/50",
  "from-blue-900/70 to-cyan-800/50",
  "from-pink-900/70 to-rose-800/50",
  "from-emerald-900/70 to-teal-800/50",
  "from-orange-900/70 to-amber-800/50",
  "from-fuchsia-900/70 to-pink-800/50",
  "from-indigo-900/70 to-blue-800/50",
  "from-rose-900/70 to-red-800/50",
  "from-teal-900/70 to-emerald-800/50",
  "from-amber-900/70 to-yellow-800/50",
  "from-cyan-900/70 to-sky-800/50",
  "from-purple-900/70 to-violet-800/50",
];

const photoHeights = [200, 150, 250, 180, 140, 220, 160, 200, 130, 210, 170, 190];
const photoIcons = ["Camera", "Image", "Mountain", "Sun", "Flower", "Star", "Heart", "Leaf", "Moon", "Cloud", "Waves", "Tree"];

export default function Photos() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-4 flex items-center gap-4">
        <span className="section-title">Фотографии</span>
        <div className="flex gap-2 ml-auto">
          {["Все", "Мои", "Альбомы"].map(t => (
            <button key={t} className="tab-item text-sm">{t}</button>
          ))}
          <button className="btn-primary text-sm flex items-center gap-1.5">
            <Icon name="Upload" size={13} />
            Загрузить
          </button>
        </div>
      </div>

      <div className="columns-4 gap-3" style={{ columnGap: "12px" }}>
        {photoColors.map((c, i) => (
          <div key={i} className="break-inside-avoid mb-3 rounded-xl overflow-hidden cursor-pointer group relative"
            style={{ height: `${photoHeights[i]}px` }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${c}`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name={photoIcons[i]} size={36} style={{ color: "rgba(255,255,255,0.15)" }} />
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)" }}>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff" }}>
                  <Icon name="ZoomIn" size={15} />
                </button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff" }}>
                  <Icon name="Heart" size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
