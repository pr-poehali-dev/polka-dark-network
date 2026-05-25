export const currentUser = {
  id: 1,
  name: "Алексей Громов",
  username: "@alexgromov",
  avatar: "АГ",
  avatarColor: "from-violet-500 to-purple-600",
  bio: "Дизайнер интерфейсов · Москва",
  friends: 284,
  followers: 1420,
  following: 312,
  posts: 97,
  online: true,
};

export const users = [
  { id: 2, name: "Мария Соколова", username: "@msokolova", avatar: "МС", avatarColor: "from-pink-500 to-rose-500", bio: "Фотограф", friends: 312, online: true, mutual: 14 },
  { id: 3, name: "Дмитрий Лазарев", username: "@dlazarev", avatar: "ДЛ", avatarColor: "from-blue-500 to-cyan-500", bio: "Разработчик", friends: 198, online: false, mutual: 8 },
  { id: 4, name: "Анна Белова", username: "@abelova", avatar: "АБ", avatarColor: "from-emerald-500 to-teal-500", bio: "Художник", friends: 445, online: true, mutual: 22 },
  { id: 5, name: "Игорь Петров", username: "@ipetrov", avatar: "ИП", avatarColor: "from-orange-500 to-amber-500", bio: "Музыкант", friends: 87, online: false, mutual: 5 },
  { id: 6, name: "Елена Кузьмина", username: "@ekuzmina", avatar: "ЕК", avatarColor: "from-fuchsia-500 to-pink-500", bio: "Маркетолог", friends: 623, online: true, mutual: 31 },
  { id: 7, name: "Роман Власов", username: "@rvlasov", avatar: "РВ", avatarColor: "from-violet-600 to-indigo-600", bio: "Архитектор", friends: 156, online: false, mutual: 9 },
];

export const posts = [
  {
    id: 1, user: users[0], time: "2 ч назад",
    text: "Закончила новый проект — серия портретов в студии. Три месяца работы, и наконец всё готово 🎞",
    image: "photo",
    likes: 284, comments: 41, reposts: 12,
    liked: false, height: "tall",
  },
  {
    id: 2, user: users[1], time: "4 ч назад",
    text: "Выкатили новую версию приложения. Рефакторинг занял три недели, но результат стоит того. Производительность выросла в 2.4 раза.",
    image: null,
    likes: 156, comments: 29, reposts: 8,
    liked: true, height: "normal",
  },
  {
    id: 3, user: users[2], time: "6 ч назад",
    text: "Новые иллюстрации для книги. Акварель + digital — смешанная техника.",
    image: "art",
    likes: 519, comments: 73, reposts: 44,
    liked: false, height: "tall",
  },
  {
    id: 4, user: users[3], time: "вчера",
    text: "Записали новый трек. Слушайте — в музыке!",
    image: null,
    likes: 92, comments: 18, reposts: 6,
    liked: false, height: "short",
  },
  {
    id: 5, user: users[4], time: "вчера",
    text: "Отчёт по летнему сезону: охват вырос на 340%, конверсия х2.1. Делюсь кейсом в блоге.",
    image: "chart",
    likes: 201, comments: 34, reposts: 19,
    liked: true, height: "normal",
  },
  {
    id: 6, user: users[5], time: "2 дня назад",
    text: "Проект жилого квартала в Казани прошёл согласование. Стройка начнётся в сентябре.",
    image: "arch",
    likes: 388, comments: 52, reposts: 27,
    liked: false, height: "tall",
  },
];

export const stories = [
  { id: 1, user: currentUser, viewed: false, own: true },
  { id: 2, user: users[0], viewed: false },
  { id: 3, user: users[1], viewed: true },
  { id: 4, user: users[2], viewed: false },
  { id: 5, user: users[3], viewed: true },
  { id: 6, user: users[4], viewed: false },
  { id: 7, user: users[5], viewed: true },
];

export const chats = [
  { id: 1, user: users[0], lastMsg: "Спасибо за фидбэк! Учту всё 🙌", time: "12:34", unread: 2, online: true },
  { id: 2, user: users[1], lastMsg: "Когда созвонимся по проекту?", time: "11:20", unread: 0, online: false },
  { id: 3, user: users[2], lastMsg: "Посмотри последнюю версию", time: "вчера", unread: 5, online: true },
  { id: 4, user: users[3], lastMsg: "Отличный трек получился!", time: "вчера", unread: 0, online: false },
  { id: 5, user: users[4], lastMsg: "Жду твоих комментариев", time: "пн", unread: 1, online: true },
  { id: 6, user: users[5], lastMsg: "До встречи в среду!", time: "вс", unread: 0, online: false },
];

export const messages = [
  { id: 1, from: 2, text: "Привет! Видел новые работы?", time: "12:10", own: false },
  { id: 2, from: 1, text: "Да, потрясающие! Особенно серия с архитектурой.", time: "12:12", own: true },
  { id: 3, from: 2, text: "Согласна! Хочу попробовать что-то похожее.", time: "12:15", own: false },
  { id: 4, from: 1, text: "Обязательно попробуй. Кстати, как прошёл показ?", time: "12:20", own: true },
  { id: 5, from: 2, text: "Очень круто! Все остались довольны. Спасибо за фидбэк! Учту всё 🙌", time: "12:34", own: false },
];

export const communities = [
  { id: 1, name: "Дизайн & UX", members: "48.2К", category: "Дизайн", verified: true, color: "from-violet-500 to-purple-600" },
  { id: 2, name: "Фотографы России", members: "124К", category: "Фото", verified: false, color: "from-blue-500 to-cyan-500" },
  { id: 3, name: "Dev Community", members: "87.5К", category: "IT", verified: true, color: "from-emerald-500 to-teal-500" },
  { id: 4, name: "Современное искусство", members: "31.8К", category: "Арт", verified: false, color: "from-pink-500 to-rose-500" },
  { id: 5, name: "Музыканты", members: "62.1К", category: "Музыка", verified: true, color: "from-orange-500 to-amber-500" },
  { id: 6, name: "Архитектура и урбанистика", members: "19.3К", category: "Архитектура", verified: false, color: "from-fuchsia-500 to-pink-500" },
];

export const tracks = [
  { id: 1, title: "Midnight Drive", artist: "Neon Pulse", duration: "3:42", playing: false },
  { id: 2, title: "Светлые дни", artist: "Иван Гречко", duration: "4:15", playing: true },
  { id: 3, title: "Abstract Feelings", artist: "Vibe Collective", duration: "5:01", playing: false },
  { id: 4, title: "Тихий океан", artist: "Алёна Синяя", duration: "3:28", playing: false },
  { id: 5, title: "City Lights", artist: "Urban Flow", duration: "4:53", playing: false },
  { id: 6, title: "Дом", artist: "Горизонт", duration: "3:17", playing: false },
  { id: 7, title: "Deep Space", artist: "Cosmo Audio", duration: "6:22", playing: false },
];

export const games = [
  { id: 1, name: "Шахматы", category: "Стратегия", players: "12.4К", rating: 4.8 },
  { id: 2, name: "Морской бой", category: "Аркада", players: "8.1К", rating: 4.5 },
  { id: 3, name: "Слова", category: "Логика", players: "21К", rating: 4.9 },
  { id: 4, name: "Мафия", category: "Социальные", players: "6.7К", rating: 4.6 },
  { id: 5, name: "Пазл", category: "Логика", players: "3.2К", rating: 4.3 },
  { id: 6, name: "Квиз", category: "Знания", players: "15.8К", rating: 4.7 },
];

export const bookmarks = [
  { id: 1, post: posts[0], collection: "Вдохновение", savedAt: "2 дня назад" },
  { id: 2, post: posts[2], collection: "Арт", savedAt: "неделю назад" },
  { id: 3, post: posts[4], collection: "Работа", savedAt: "2 недели назад" },
];

export const boards = [
  { id: 1, name: "Мои проекты", count: 24, color: "from-violet-500 to-purple-600", shared: false },
  { id: 2, name: "Вдохновение", count: 67, color: "from-pink-500 to-rose-500", shared: false },
  { id: 3, name: "UI References", count: 41, color: "from-blue-500 to-cyan-500", shared: true },
  { id: 4, name: "Книги", count: 12, color: "from-emerald-500 to-teal-500", shared: false },
];

export const notifications = [
  { id: 1, type: "like", user: users[0], text: "оценила вашу публикацию", time: "5 мин" },
  { id: 2, type: "comment", user: users[1], text: "прокомментировал: «Отличная работа!»", time: "20 мин" },
  { id: 3, type: "friend", user: users[2], text: "хочет добавить вас в друзья", time: "1 ч" },
  { id: 4, type: "mention", user: users[3], text: "упомянул вас в записи", time: "3 ч" },
];
