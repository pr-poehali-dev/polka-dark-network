import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import Chats from "@/pages/Chats";
import Friends from "@/pages/Friends";
import Communities from "@/pages/Communities";
import Stories from "@/pages/Stories";
import Photos from "@/pages/Photos";
import Music from "@/pages/Music";
import Video from "@/pages/Video";
import Games from "@/pages/Games";
import Boards from "@/pages/Boards";
import Bookmarks from "@/pages/Bookmarks";
import Notes from "@/pages/Notes";
import Settings from "@/pages/Settings";
import More from "@/pages/More";

const pages: Record<string, React.FC> = {
  feed: Feed,
  profile: Profile,
  chats: Chats,
  friends: Friends,
  communities: Communities,
  stories: Stories,
  photos: Photos,
  music: Music,
  video: Video,
  games: Games,
  boards: Boards,
  bookmarks: Bookmarks,
  notes: Notes,
  settings: Settings,
  more: More,
};

export default function App() {
  const [activePage, setActivePage] = useState("feed");
  const PageComponent = pages[activePage] || Feed;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute" style={{ top: "-20%", left: "15%", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,92,252,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute" style={{ bottom: "-15%", right: "8%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <Sidebar active={activePage} onNav={setActivePage} />
      <Topbar onNav={setActivePage} />

      <main
        className="relative"
        style={{
          marginLeft: "var(--sidebar-w)",
          paddingTop: "calc(var(--topbar-h) + 20px)",
          padding: `calc(var(--topbar-h) + 20px) 24px 32px 24px`,
          minHeight: "100vh",
          zIndex: 1,
        }}
      >
        <div key={activePage} className="animate-fade-in" style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <PageComponent />
        </div>
      </main>
    </div>
  );
}
