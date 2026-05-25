export const currentUser = {
  id: 1,
  name: "Алексей Смирнов",
  username: "@alex_s",
  avatar: "АС",
  avatarColor: "from-violet-500 to-pink-500",
  bio: "Дизайнер и путешественник. Люблю создавать красоту из деталей повседневности.",
  city: "Москва",
  friends: 342,
  followers: 1287,
  following: 256,
  posts: 142,
  online: true,
};

export const users = [
  { id: 2, name: "mia", username: "@mia", avatar: "MI", avatarColor: "from-pink-400 to-rose-500", bio: "Фотограф", friends: 312, online: true, mutual: 14 },
  { id: 3, name: "neo", username: "@neo", avatar: "NE", avatarColor: "from-blue-400 to-indigo-500", bio: "Dev", friends: 198, online: false, mutual: 8 },
  { id: 4, name: "sss", username: "@sss", avatar: "SS", avatarColor: "from-violet-400 to-purple-500", bio: "Artist", friends: 445, online: true, mutual: 22 },
  { id: 5, name: "anne", username: "@anne", avatar: "AN", avatarColor: "from-fuchsia-400 to-pink-500", bio: "Writer", friends: 187, online: true, mutual: 17 },
  { id: 6, name: "max", username: "@max", avatar: "MA", avatarColor: "from-cyan-400 to-blue-500", bio: "Designer", friends: 623, online: false, mutual: 31 },
  { id: 7, name: "kate", username: "@kate", avatar: "KA", avatarColor: "from-rose-400 to-pink-600", bio: "Blogger", friends: 156, online: true, mutual: 9 },
  { id: 8, name: "lya", username: "@lya", avatar: "LY", avatarColor: "from-amber-400 to-orange-500", bio: "Musician", friends: 234, online: false, mutual: 6 },
];

// Pinterest-style feed posts with varied heights
export const feedItems = [
  { id: 1, type: "photo", user: users[0], time: "2 ч", text: "Розовая архитектура в Марокко", color: "from-pink-900/80 via-rose-800/60 to-fuchsia-900/40", height: 280, likes: 841, comments: 34, saved: false },
  { id: 2, type: "photo", user: users[1], time: "3 ч", text: "Кинетическая типография", color: "from-violet-900/80 via-purple-800/60 to-indigo-900/40", height: 200, likes: 512, comments: 21, saved: false },
  { id: 3, type: "video", user: users[2], time: "5 ч", text: "Путешествие в розовый город", duration: "12:50", color: "from-rose-900/80 via-pink-800/60 to-red-900/40", height: 240, likes: 1203, comments: 87, saved: true },
  { id: 4, type: "photo", user: users[3], time: "6 ч", text: "Интерьеры в стиле wabi-sabi", color: "from-amber-900/70 via-orange-800/50 to-rose-900/40", height: 320, likes: 677, comments: 45, saved: false },
  { id: 5, type: "video", user: users[4], time: "8 ч", text: "Дизайн в деталях", duration: "7:21", color: "from-indigo-900/80 via-blue-800/60 to-violet-900/40", height: 180, likes: 394, comments: 18, saved: false },
  { id: 6, type: "photo", user: users[5], time: "1 д", text: "Минимализм в интерьере", color: "from-teal-900/70 via-emerald-800/50 to-cyan-900/40", height: 250, likes: 923, comments: 61, saved: true },
  { id: 7, type: "photo", user: users[6], time: "1 д", text: "Как поймать свет", color: "from-pink-900/80 via-fuchsia-800/60 to-purple-900/40", height: 200, likes: 488, comments: 29, saved: false },
  { id: 8, type: "video", user: users[0], time: "2 д", text: "Уличная фотография 2026", duration: "9:15", color: "from-slate-900/80 via-zinc-800/60 to-gray-900/40", height: 220, likes: 732, comments: 53, saved: false },
  { id: 9, type: "photo", user: users[1], time: "2 д", text: "Цветовые палитры весны", color: "from-violet-900/70 via-pink-800/50 to-rose-900/40", height: 300, likes: 1041, comments: 72, saved: true },
  { id: 10, type: "photo", user: users[2], time: "3 д", text: "Архитектура будущего", color: "from-blue-900/80 via-indigo-800/60 to-violet-900/40", height: 240, likes: 587, comments: 38, saved: false },
  { id: 11, type: "video", user: users[3], time: "3 д", text: "Природа без фильтров", duration: "5:48", color: "from-emerald-900/70 via-teal-800/50 to-green-900/40", height: 180, likes: 412, comments: 22, saved: false },
  { id: 12, type: "photo", user: users[4], time: "4 д", text: "Токийские улицы ночью", color: "from-purple-900/80 via-violet-800/60 to-indigo-900/40", height: 260, likes: 1560, comments: 94, saved: false },
];

export const posts = feedItems;

export const stories = [
  { id: 1, user: currentUser, viewed: false, own: true },
  { id: 2, user: users[0], viewed: false },
  { id: 3, user: users[1], viewed: true },
  { id: 4, user: users[2], viewed: false },
  { id: 5, user: users[3], viewed: false },
  { id: 6, user: users[4], viewed: true },
  { id: 7, user: users[5], viewed: false },
  { id: 8, user: users[6], viewed: true },
];

export const chats = [
  { id: 1, user: users[0], lastMsg: "Спасибо за фидбэк! Учту всё 🙌", time: "12:34", unread: 2, online: true, importance: "normal" },
  { id: 2, user: users[1], lastMsg: "Когда созвонимся по проекту?", time: "11:20", unread: 0, online: false, importance: "important" },
  { id: 3, user: users[2], lastMsg: "Посмотри последнюю версию", time: "вчера", unread: 5, online: true, importance: "urgent" },
  { id: 4, user: users[3], lastMsg: "Отличный трек получился!", time: "вчера", unread: 0, online: false, importance: "normal" },
  { id: 5, user: users[4], lastMsg: "Жду твоих комментариев", time: "пн", unread: 1, online: true, importance: "normal" },
  { id: 6, user: users[5], lastMsg: "До встречи в среду!", time: "вс", unread: 0, online: false, importance: "silent" },
];

export const messages = [
  { id: 1, from: 2, text: "Привет! Видела новые работы?", time: "12:10", own: false, importance: "normal", saved: false },
  { id: 2, from: 1, text: "Да, потрясающие! Особенно серия с архитектурой.", time: "12:12", own: true, importance: "normal", saved: false },
  { id: 3, from: 2, text: "Согласна! Хочу попробовать что-то похожее.", time: "12:15", own: false, importance: "normal", saved: false },
  { id: 4, from: 1, text: "Обязательно попробуй. Кстати, как прошёл показ?", time: "12:20", own: true, importance: "important", saved: true },
  { id: 5, from: 2, text: "Очень круто! Все остались довольны. Спасибо за фидбэк! Учту всё 🙌", time: "12:34", own: false, importance: "normal", saved: false },
];

export const stickers = [
  { id: 1, emoji: "🔥", label: "Огонь" },
  { id: 2, emoji: "✨", label: "Блеск" },
  { id: 3, emoji: "💜", label: "Сердце" },
  { id: 4, emoji: "🌸", label: "Сакура" },
  { id: 5, emoji: "🎨", label: "Арт" },
  { id: 6, emoji: "🚀", label: "Ракета" },
  { id: 7, emoji: "🌙", label: "Луна" },
  { id: 8, emoji: "⭐", label: "Звезда" },
  { id: 9, emoji: "🎵", label: "Нота" },
  { id: 10, emoji: "💎", label: "Алмаз" },
  { id: 11, emoji: "🌊", label: "Волна" },
  { id: 12, emoji: "🦋", label: "Бабочка" },
];

export const communities = [
  { id: 1, name: "Вдохновение каждый день", members: "537К", category: "Дизайн", verified: true, color: "from-violet-500 to-purple-600" },
  { id: 2, name: "Фотографы", members: "874К", category: "Фото", verified: false, color: "from-pink-500 to-rose-500" },
  { id: 3, name: "Дизайн среды", members: "324К", category: "IT", verified: true, color: "from-blue-500 to-cyan-500" },
  { id: 4, name: "Путешествия", members: "2.3МК", category: "Тревел", verified: false, color: "from-emerald-500 to-teal-500" },
];

export const tracks = [
  { id: 1, title: "Город за окном", artist: "Даниэль", duration: "3:24", playing: false },
  { id: 2, title: "Ночной ветер", artist: "Alina Sova", duration: "3:52", playing: true },
  { id: 3, title: "Мираж небо", artist: "Marc Kure", duration: "3:11", playing: false },
  { id: 4, title: "Вознесение", artist: "Cosmo", duration: "4:04", playing: false },
  { id: 5, title: "Дорогой мой", artist: "Nik Mouris", duration: "3:48", playing: false },
  { id: 6, title: "Вечерние огни", artist: "Дельфин + Саксон", duration: "5:25", playing: false },
];

export const boards = [
  { id: 1, name: "Розовая архитектура", count: 52, color: "from-pink-400/30 to-rose-500/20", items: [1, 3, 6] },
  { id: 2, name: "Интерьеры", count: 84, color: "from-violet-400/30 to-purple-500/20", items: [4, 7, 2] },
  { id: 3, name: "Типографика", count: 31, color: "from-blue-400/30 to-indigo-500/20", items: [2, 5, 8] },
  { id: 4, name: "Природа", count: 67, color: "from-emerald-400/30 to-teal-500/20", items: [9, 11, 6] },
];

export const bookmarks = [
  { id: 1, post: feedItems[0], collection: "Вдохновение", savedAt: "2 дня назад" },
  { id: 2, post: feedItems[2], collection: "Арт", savedAt: "неделю назад" },
  { id: 3, post: feedItems[5], collection: "Работа", savedAt: "2 недели назад" },
];

export const games = [
  { id: 1, name: "Cyber Drift 2099", category: "Гонки", players: "12.4К", rating: 4.8 },
  { id: 2, name: "Nebula Quest", category: "Приключения", players: "8.1К", rating: 4.7 },
  { id: 3, name: "Puzzle Bloom", category: "Логика", players: "21К", rating: 4.6 },
  { id: 4, name: "Arena of Titans", category: "Стратегия", players: "6.7К", rating: 4.5 },
];

export const notifications = [
  { id: 1, type: "like", user: users[0], text: "оценила вашу публикацию", time: "5 мин" },
  { id: 2, type: "comment", user: users[1], text: "прокомментировал: «Потрясающий кадр!»", time: "20 мин" },
  { id: 3, type: "friend", user: users[2], text: "хочет добавить вас в друзья", time: "1 ч" },
  { id: 4, type: "mention", user: users[3], text: "упомянул вас в записи", time: "3 ч" },
];

export const profileBlocks = [
  { id: "posts", label: "Посты", icon: "LayoutGrid", enabled: true },
  { id: "music", label: "Музыка", icon: "Music2", enabled: true },
  { id: "portfolio", label: "Портфолио", icon: "Briefcase", enabled: true },
  { id: "services", label: "Услуги", icon: "Star", enabled: false },
  { id: "reviews", label: "Отзывы", icon: "MessageSquare", enabled: false },
  { id: "links", label: "Ссылки", icon: "Link", enabled: true },
  { id: "products", label: "Товары", icon: "ShoppingBag", enabled: false },
  { id: "donations", label: "Донаты", icon: "Heart", enabled: false },
  { id: "playlists", label: "Плейлисты", icon: "ListMusic", enabled: true },
  { id: "projects", label: "Закреплённые", icon: "Pin", enabled: true },
];

export const profileVersions = [
  { id: "friends", label: "Для друзей" },
  { id: "clients", label: "Для клиентов" },
  { id: "employers", label: "Для работодателей" },
  { id: "followers", label: "Для подписчиков" },
  { id: "strangers", label: "Для незнакомых" },
];
