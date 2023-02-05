// пути до коллекций БД
export const enum DBQueries {
   CHATS = "chats", // чаты групп
   COMMENTS = "comments", // комменты к материалам
   SOURCES = "sources", // прикрепленные файлы к материалам
   DISCIPLINES = "disciplines", // все доступные дисциплины
   GROUPS = "groups", // все группы
   INSTITUTES = "institutes", // все институты
   MATERIALS = "materials", // все материалы
   // NOTIFICATIONS = "notifications",  работать не будет(
   FAVORITES = "favorites", // избранное пользователей
   REVIEWS = "reviews", // отзывы
   USERS = "users", // все пользователи
}

export const enum LFilter { // LoginPopupFilters
   INSTITUTES = "institutes",
   GROUPS = "groups",
   DISCIPLINES = "disciplines",
}

export const enum UType {
   STUDENT = "student",
   TEACHER = "teacher",
   ADMIN = "admin",
}
