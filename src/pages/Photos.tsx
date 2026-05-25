import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Static data ──────────────────────────────────────────────────────────────

const PHOTOS = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  gradient: `linear-gradient(${108 + i * 17}deg,hsl(${(i * 29) % 360},62%,14%),hsl(${(i * 29 + 72) % 360},52%,9%))`,
  height: [210, 155, 270, 185, 135, 235, 160, 200, 130, 252, 178, 198, 143, 222, 168, 182][i],
  icon: ["Camera","Image","Mountain","Sun","Flower2","Star","Heart","Leaf","Moon","Cloud","Waves","Trees","Aperture","Compass","Sparkles","Eye"][i],
  mine: i % 3 !== 1,
}));

const ALBUMS = [
  { id: 1, name: "Путешествия",   count: 84, gradient: "linear-gradient(135deg,hsl(205,62%,13%),hsl(225,52%,9%))" },
  { id: 2, name: "Архитектура",   count: 52, gradient: "linear-gradient(135deg,hsl(278,62%,13%),hsl(308,52%,9%))" },
  { id: 3, name: "Природа",       count: 37, gradient: "linear-gradient(135deg,hsl(142,62%,13%),hsl(168,52%,9%))" },
  { id: 4, name: "Люди",          count: 61, gradient: "linear-gradient(135deg,hsl(348,62%,13%),hsl(22,52%,9%))"  },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photo,
  idx,
  total,
  onPrev,
  onNext,
  onClose,
}: {
  photo: (typeof PHOTOS)[0];
  idx: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const [liked, setLiked]   = useState(false);
  const [saved, setSaved]   = useState(false);

  return (
    <div
      className="pk-modal-bg animate-fade-in"
      style={{ background: "rgba(7,11,31,0.96)", backdropFilter: "blur(18px)" }}
      onClick={onClose}
    >
      <div
        className="relative animate-scale-in flex flex-col items-center"
        style={{ maxWidth: 740, width: "100%", padding: "0 56px" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="pk-icon-btn absolute top-0 right-0"
          style={{ background: "rgba(255,255,255,0.09)" }}
          onClick={onClose}
        >
          <Icon name="X" size={16} />
        </button>

        {/* Photo */}
        <div
          className="w-full rounded-2xl flex items-center justify-center overflow-hidden"
          style={{ height: 465, background: photo.gradient, boxShadow: "var(--shadow-lg)" }}
        >
          <Icon name={photo.icon} size={84} style={{ color: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Prev / Next */}
        <button
          className="pk-icon-btn absolute left-0 top-1/2 -translate-y-1/2"
          style={{ width: 42, height: 42, background: "rgba(255,255,255,0.09)" }}
          onClick={e => { e.stopPropagation(); onPrev(); }}
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
        <button
          className="pk-icon-btn absolute right-0 top-1/2 -translate-y-1/2"
          style={{ width: 42, height: 42, background: "rgba(255,255,255,0.09)" }}
          onClick={e => { e.stopPropagation(); onNext(); }}
        >
          <Icon name="ChevronRight" size={20} />
        </button>

        {/* Counter */}
        <div
          className="mt-3 px-3 py-1 rounded-full text-xs"
          style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-3)" }}
        >
          {idx + 1} / {total}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <button
            className="pk-btn pk-btn-ghost text-sm"
            onClick={() => setLiked(l => !l)}
            style={{ color: liked ? "var(--error)" : "var(--text-3)" }}
          >
            <Icon name="Heart" size={14} style={{ color: liked ? "var(--error)" : "var(--text-3)" }} />
            {liked ? "Нравится" : "Лайк"}
          </button>
          <button
            className="pk-btn pk-btn-ghost text-sm"
            onClick={() => setSaved(s => !s)}
            style={{ color: saved ? "var(--accent)" : "var(--text-3)" }}
          >
            <Icon name="Bookmark" size={14} style={{ color: saved ? "var(--accent)" : "var(--text-3)" }} />
            {saved ? "Сохранено" : "Сохранить"}
          </button>
          <button className="pk-btn pk-btn-ghost text-sm">
            <Icon name="Share2" size={14} /> Поделиться
          </button>
          <button className="pk-btn pk-btn-ghost text-sm">
            <Icon name="Download" size={14} /> Скачать
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Album Modal ───────────────────────────────────────────────────────

function CreateAlbumModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  return (
    <div className="pk-modal-bg animate-fade-in" onClick={onClose}>
      <div
        className="animate-scale-in pk-card p-5 w-80"
        style={{ boxShadow: "var(--shadow-lg)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="pk-title">Новый альбом</span>
          <button className="pk-icon-btn" onClick={onClose}><Icon name="X" size={14} /></button>
        </div>
        <input
          className="pk-input mb-4"
          placeholder="Название альбома…"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <button
          className="pk-btn pk-btn-primary w-full"
          disabled={!name.trim()}
          onClick={() => { onCreate(name.trim()); onClose(); }}
        >
          <Icon name="Plus" size={13} /> Создать
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Photos() {
  const [tab, setTab]               = useState("Все");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [albums, setAlbums]         = useState(ALBUMS);

  const display = tab === "Мои" ? PHOTOS.filter(p => p.mine) : PHOTOS;

  const openPhoto = (id: number) => {
    const idx = display.findIndex(p => p.id === id);
    if (idx >= 0) setLightboxIdx(idx);
  };

  const goPrev = () =>
    setLightboxIdx(i => i === null ? null : (i - 1 + display.length) % display.length);
  const goNext = () =>
    setLightboxIdx(i => i === null ? null : (i + 1) % display.length);

  return (
    <div className="animate-fade-in space-y-4">

      {/* ── Header ── */}
      <div className="pk-card p-4 flex items-center gap-3 flex-wrap">
        <div>
          <div className="pk-title">Фотографии</div>
          <div className="pk-subtitle">{PHOTOS.length} фотографий</div>
        </div>
        <div className="flex gap-1 ml-auto">
          {["Все", "Мои", "Альбомы"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pk-tab ${tab === t ? "active" : ""}`}>{t}</button>
          ))}
        </div>
        <button className="pk-btn pk-btn-primary text-sm">
          <Icon name="Upload" size={13} /> Загрузить
        </button>
      </div>

      {/* ── Albums tab ── */}
      {tab === "Альбомы" ? (
        <div className="grid grid-cols-4 gap-4">
          {albums.map(album => (
            <div key={album.id} className="pk-card overflow-hidden pk-card-hover cursor-pointer">
              <div
                className="relative flex items-center justify-center"
                style={{ height: 128, background: album.gradient }}
              >
                <Icon name="FolderOpen" size={38} style={{ color: "rgba(255,255,255,0.1)" }} />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{album.name}</div>
                <div className="pk-subtitle">{album.count} фото</div>
              </div>
            </div>
          ))}

          {/* New album tile */}
          <button
            className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
            style={{ minHeight: 178, borderColor: "rgba(123,77,255,0.28)", background: "rgba(123,77,255,0.03)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(123,77,255,0.28)")}
            onClick={() => setShowCreateAlbum(true)}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(123,77,255,0.12)" }}>
              <Icon name="Plus" size={20} style={{ color: "var(--accent)" }} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--text-4)" }}>Новый альбом</span>
          </button>
        </div>
      ) : (
        /* ── Masonry grid ── */
        <div className="columns-4" style={{ columnGap: 12 }}>
          {display.map(photo => (
            <div
              key={photo.id}
              className="pk-pin group"
              style={{ height: photo.height, background: photo.gradient, marginBottom: 12 }}
              onClick={() => openPhoto(photo.id)}
            >
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Icon name={photo.icon} size={38} style={{ color: "rgba(255,255,255,0.07)" }} />
              </div>
              {/* Hover overlay */}
              <div className="pk-pin-overlay">
                <div className="flex gap-2">
                  <button
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.18)" }}
                    onClick={e => { e.stopPropagation(); openPhoto(photo.id); }}
                  >
                    <Icon name="ZoomIn" size={15} />
                  </button>
                  <button
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.18)" }}
                    onClick={e => e.stopPropagation()}
                  >
                    <Icon name="Heart" size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <Lightbox
          photo={display[lightboxIdx]}
          idx={lightboxIdx}
          total={display.length}
          onPrev={goPrev}
          onNext={goNext}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      {/* ── Create album modal ── */}
      {showCreateAlbum && (
        <CreateAlbumModal
          onClose={() => setShowCreateAlbum(false)}
          onCreate={name => setAlbums(prev => [
            ...prev,
            { id: Date.now(), name, count: 0, gradient: "linear-gradient(135deg,hsl(260,62%,13%),hsl(290,52%,9%))" },
          ])}
        />
      )}
    </div>
  );
}
