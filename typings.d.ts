import { UType } from "./typings/enums";

type AppTheme = "blue" | "violet" | "emerald" | "rose";

type UserType = "student" | "teacher" | "admin";

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface Group {
  id: string;
  name: string;
  instituteId: string;
  disciplines: string[];
}

interface Chat {
  disciplineId: string;
  groupId: string;
  id: string;
}

type ChatPreview = Pick<Chat, "groupId" | "id"> & {
  groupName: string;
};

interface Discipline {
  id: string;
  name: string;
  instituteId: string; //5oo7uKcPGrJGEhuF9yqa
}

interface Institute {
  id: string;
  name: string;
  shortName: string;
}

interface Material {
  id: string;
  disciplineId: string;
  timestamp: Timestamp;
  title: string;
  text: string;
  likes: number;
  ownerId: string;
  // comments: DBComment[];
  // documents: Source[];
}

interface DBMessage {
  text: string;
  timestamp: Timestamp;
  displayName: string;
  email: string;
  type: string;
  photoUrl: string;
  id: string;
  replyingMessage: string | null;
}

interface DBComment {
  email: string;
  text: string;
  materialId: string;
  timestamp: Timestamp;
  id: string;
}

interface Source {
  title: string;
  document: string;
  materialId: string;
  id: string;
}

interface NewDocument {
  name: string;
  uri: string;
  type: string | undefined;
}
interface Notification {
  isChecked: boolean;
  text: string;
  title: string;
  userId: string;
  notificationId: string;
}

interface Favorite {
  id: string;
  materialId: string;
  userId: string;
}

interface Favorites {
  disciplineName: string;
  material: Material;
}

interface Institute {
  name: string;
  shortName: string;
  instituteId: string;
}

interface User {
  email: string;
  name: string;
  female: string;
  password: string;
  img: string;
  theme: AppTheme;
  userId: string;
}

interface Student extends User {
  groupId: string;
  instituteId: string;
  type: UType.STUDENT;
}

interface Teacher extends User {
  disciplines: string[]; // ids of linked disciplines
  institutes: string[]; // ids of linked institutes
  type: UType.TEACHER;
}

type SuperUser = Student | Teacher;

type RootStackParamList = {
  Login: undefined;
  AuthInfo: undefined;
  AuthBio: undefined;
  Main: undefined;
  Discipline: {
    discipline: Discipline;
  };
  Chats: {
    discipline: Discipline;
  };
  Comments: {
    material: Material;
  };
  Chats: {
    discipline: Discipline;
  };
  Chat: {
    groupName: string;
    chatId: string;
  };
};

type TabStackParamList = {
  Profile: undefined;
  Disciplines: undefined;
  Timetable: undefined;
  Favorites: undefined;
};

type AuthSteps = "auth" | "info" | "bio";

type LoginScreenNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Login">,
  NativeStackNavigationProp<RootStackParamList>
>;

type AuthInfoScreenNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "AuthInfo">,
  NativeStackNavigationProp<RootStackParamList>
>;

type AuthBioScreenNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "AuthBio">,
  NativeStackNavigationProp<RootStackParamList>
>;

type DisciplineScreenNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Discipline">,
  NativeStackNavigationProp<RootStackParamList>
>;

type ProfileScreenNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Profile">,
  NativeStackNavigationProp<RootStackParamList>
>;

type ChatsScreenNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Chats">,
  NativeStackNavigationProp<RootStackParamList>
>;

type ChatScreenNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Chat">,
  NativeStackNavigationProp<RootStackParamList>
>;

type CommentsScreenNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Comments">,
  NativeStackNavigationProp<RootStackParamList>
>;
