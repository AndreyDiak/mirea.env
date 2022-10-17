type RootStackParamList = {
  Login: undefined;
  AuthInfo: undefined;
  AuthBio: { email: string; password: string };
  Main: undefined;
  Discipline: { discipline: {id: string, title: string }}
};

type TabStackParamList = {
  Profile: undefined,
  Disciplines: undefined
}

type AuthSteps = "auth" | "info" | "bio";
type Group = {
  id: string;
  name: string;
};
type Discipline = {
  id: string;
  title: string;
};

interface User {
  email: string;
  name: string;
  female: string;
  password: string;
  img: string;
  userId: string;
}

interface Student extends User {
  group: string
  type: 'student'
}

interface Teacher extends User {
  disciplines: Discipline[];
  type: 'teacher'
}

type SuperUser = Student | Teacher

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

type DisciplinesScreenNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Disciplines">,
  NativeStackNavigationProp<RootStackParamList>
>;