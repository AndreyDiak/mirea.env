type AppTheme = "blue" | "violet" | "emerald" | "rose";

type UserType = 'student' | 'teacher' | 'admin';

interface Group {
  groupId: string;
  name: string;
}

interface Discipline {
  id: string;
  name: string;
}

interface Material {
  title: string;
  text: string;
  materialId: string;
  likes: number;
  comments: Comment[];
  owner: string;
  documents: Document[];
}

interface Message {
  message: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  displayName: string;
  email: string;
  type: string;
  photoUrl: string;
  messageId: string;
  replyingMessage: string | null;
}

interface Comment {
  email: string;
  text: string;
  materialId: string;
  commentId: string;
}

interface Document {
  title: string;
  document: string;
  documentId: string;
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

interface Favorites {
  disciplineTitle: string;
  material: Material
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
  group: string;
  type: "student";
}

interface Teacher extends User {
  disciplines: Discipline[];
  type: "teacher";
}

type SuperUser = Student | Teacher;

type RootStackParamList = {
  Login: undefined;
  AuthInfo: undefined;
  AuthBio: { email: string; password: string };
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
    discipline: Discipline;
    groupId: string;
    chatId: string;
  };
};

type TabStackParamList = {
  Profile: undefined;
  Disciplines: undefined;
  Timetable: undefined;
  Notifications: undefined;
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
