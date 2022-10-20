type Group = {
  id: string;
  name: string;
};

interface Discipline {
  id: string;
  title: string;
};

interface Material {
  title: string;
  text: string;
  source: string[];
}

interface NewDocument {
  name: string;
  uri: string;
  type: string | undefined
};
interface Notification {
  isChecked: boolean;
  text: string;
  title: string;
  userId: string;
  notificationId: string;
}
interface User {
  email: string;
  name: string;
  female: string;
  password: string;
  img: string;
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
  Discipline: { discipline: { id: string; title: string } };
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
