import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileNav from "@/components/layout/MobileNav";
import Auth from "@/pages/Auth";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import Chats from "@/pages/Chats";
import Friends from "@/pages/Friends";
import Communities from "@/pages/Communities";
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
  const [authed, setAuthed] = useState(false);
  const PageComponent = pages[activePage] || Feed;

  if (!authed) {
    return <Auth onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute" style={{ top: "-20%", left: "15%", width: "800px", height: "800px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", filter: "blur(120px)" }} />
        <div className="absolute" style={{ bottom: "-15%", right: "5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)", filter: "blur(120px)" }} />
      </div>

      {/* Desktop sidebar */}
      <Sidebar active={activePage} onNav={setActivePage} />

      {/* Topbar */}
      <Topbar onNav={setActivePage} />

      {/* Main content */}
      <main
        className="relative"
        style={{
          marginLeft: "var(--sidebar-w)",
          padding: `calc(var(--topbar-h) + 20px) 24px 32px 24px`,
          minHeight: "100vh",
          zIndex: 1,
        }}
      >
        <div key={activePage} className="animate-fade-in" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <PageComponent />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <MobileNav active={activePage} onNav={setActivePage} />
    </div>
  );
}
