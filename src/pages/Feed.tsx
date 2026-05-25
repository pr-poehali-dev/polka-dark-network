import { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/Avatar";
import { currentUser, stories, posts } from "@/data/mockData";
import RightSidebar from "@/components/layout/RightSidebar";

const postColors: Record<string, string> = {
  photo: "from-blue-900/40 via-violet-900/30 to-transparent",
  art: "from-pink-900/40 via-rose-900/30 to-transparent",
  chart: "from-emerald-900/40 via-teal-900/30 to-transparent",
  arch: "from-orange-900/40 via-amber-900/30 to-transparent",
};

const postIcons: Record<string, string> = {
  photo: "Camera",
  art: "Brush",
  chart: "BarChart3",
  arch: "Building2",
};

export default function Feed() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set(posts.filter(p => p.liked).map(p => p.id)));
  const [postText, setPostText] = useState("");

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
  };

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0 space-y-4 animate-fade-in">
        {/* Stories */}
        <div className="card p-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {/* Add story */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: "rgba(124,92,252,0.15)", border: "2px dashed rgba(124,92,252,0.4)" }}
              >
                <Icon name="Plus" size={20} style={{ color: "var(--accent-1)" }} />
              </div>
              <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Добавить</span>
            </div>

            {stories.map(s => (
              <div key={s.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
                <div className={`p-[2.5px] rounded-full transition-all group-hover:scale-105 ${s.viewed ? "" : ""}`}
                  style={{ background: s.viewed ? "rgba(255,255,255,0.1)" : "var(--accent-gradient)" }}>
                  <div style={{ padding: "2px", background: "var(--bg-deep)", borderRadius: "50%" }}>
                    <Avatar name={s.user.name} colorClass={s.user.avatarColor} size="md" />
                  </div>
                </div>
                <span className="text-[10px] truncate w-14 text-center" style={{ color: s.viewed ? "var(--text-muted)" : "var(--text-secondary)" }}>
                  {s.user.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Create post */}
        <div className="card p-4">
          <div className="flex gap-3 items-start">
            <Avatar name={currentUser.name} size="md" />
            <div className="flex-1">
              <textarea
                value={postText}
                onChange={e => setPostText(e.target.value)}
                placeholder="Что у вас нового?"
                rows={2}
                className="w-full resize-none rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontFamily: "Golos Text, sans-serif",
                }}
                onFocus={e => { e.target.style.borderColor = "var(--border-accent)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border-subtle)"; }}
              />
              <div className="flex items-center gap-2 mt-2">
                {[
                  { icon: "Image", label: "Фото" },
                  { icon: "Video", label: "Видео" },
                  { icon: "Smile", label: "Эмодзи" },
                  { icon: "MapPin", label: "Место" },
                ].map(a => (
                  <button key={a.icon} className="flex items-center gap-1.5 btn-ghost text-xs py-1.5 px-2.5">
                    <Icon name={a.icon} size={13} />
                    {a.label}
                  </button>
                ))}
                <button className="btn-primary ml-auto text-xs px-4 py-1.5" disabled={!postText.trim()}>
                  Опубликовать
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts — masonry */}
        <div className="columns-2 gap-4 space-y-0" style={{ columnGap: "16px" }}>
          {posts.map(post => (
            <div
              key={post.id}
              className="break-inside-avoid mb-4 card overflow-hidden group cursor-pointer"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {/* Image placeholder */}
              {post.image && (
                <div
                  className={`relative bg-gradient-to-br ${postColors[post.image]} flex items-center justify-center`}
                  style={{ height: post.height === "tall" ? "200px" : post.height === "short" ? "100px" : "150px" }}
                >
                  <Icon name={postIcons[post.image]} size={36} style={{ color: "rgba(255,255,255,0.2)" }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.3)" }}>
                    <Icon name="ZoomIn" size={24} style={{ color: "rgba(255,255,255,0.8)" }} />
                  </div>
                </div>
              )}

              <div className="p-3.5">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Avatar name={post.user.name} colorClass={post.user.avatarColor} size="sm" online={post.user.online} />
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{post.user.name}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{post.time}</div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{post.text}</p>

                <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1.5 text-xs transition-all hover:scale-105"
                    style={{ color: likedPosts.has(post.id) ? "#c084fc" : "var(--text-muted)" }}
                  >
                    <Icon name={likedPosts.has(post.id) ? "Heart" : "Heart"} size={13} />
                    {post.likes + (likedPosts.has(post.id) && !post.liked ? 1 : likedPosts.has(post.id) && post.liked ? 0 : post.liked ? -1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Icon name="MessageCircle" size={13} />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
                    <Icon name="Share2" size={13} />
                  </button>
                  <button className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Icon name="Bookmark" size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}