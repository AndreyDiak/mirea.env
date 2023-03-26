// пути до коллекций БД
export const enum DB_PATHS {
   CHATS = "chats", // чаты групп
   // COMMENTS = "comments", // комменты к материалам
   SOURCES = "sources", // прикрепленные файлы к материалам
   DISCIPLINES = "disciplines", // все доступные дисциплины
   GROUPS = "groups", // все группы
   INSTITUTES = "institutes", // все институты
   MATERIALS = "materials", // все материалы
   TIMETABLES = "timetable", // расписание для групп
   FAVORITES = "favorites", // избранное пользователей
   REVIEWS = "reviews", // отзывы
   USERS = "users", // все пользователи
}

export const enum AUTH_STEPS {
   AUTH = "auth",
   INFO = "info",
   BIO = "bio",
}

export const enum LFilter {
   INSTITUTES = "institutes",
   GROUPS = "groups",
   DISCIPLINES = "disciplines",
}

export const enum USER_TYPE {
   STUDENT = "student",
   TEACHER = "teacher",
   ADMIN = "admin",
}

export const enum APP_THEME {
   LIGHT = "light",
   DARK = "dark",
}

export const enum USER_THEME {
   BLUE = "blue",
   VIOLET = "violet",
   EMERALD = "emerald",
   ROSE = "rose",
}

export const enum ADMIN_MODE {
   TIMETABLE = "timetable",
   GROUP = "group",
   INSTITUTE = "institute",
   DISCIPLINE = "discipline",
}
