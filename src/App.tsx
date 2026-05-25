import { useState, useMemo } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileNav from "@/components/layout/MobileNav";
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
import { chats } from "@/data/mockData";

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
  const PageComponent = pages[activePage] || Feed;

  const totalUnread = useMemo(() => chats.reduce((s, c) => s + (c.unread || 0), 0), []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <Sidebar active={activePage} onNav={setActivePage} unreadChats={totalUnread} />

      {/* Topbar */}
      <Topbar onNav={setActivePage} />

      {/* Main */}
      <main
        style={{
          marginLeft: "var(--sidebar-w)",
          padding: `calc(var(--topbar-h) + 20px) 24px 32px 24px`,
          minHeight: "100vh",
        }}
      >
        <div key={activePage} className="animate-fade-in" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <PageComponent />
        </div>
      </main>

      {/* Mobile nav */}
      <MobileNav active={activePage} onNav={setActivePage} unreadChats={totalUnread} />
    </div>
  );
}
