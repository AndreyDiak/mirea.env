type RootStackParamList = {
  Login: undefined;
  AuthInfo: undefined;
  AuthBio: { email: string; password: string };
  User: undefined;
};

type AuthSteps = "auth" | "info" | "bio";
type Group = {
  id: string;
  name: string;
};
type Discipline = {
  id: string;
  title: string;
  teachers: [];
};

interface User {
  email: string;
  name: string;
  female: string;
  password: string;
  img: string;
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
